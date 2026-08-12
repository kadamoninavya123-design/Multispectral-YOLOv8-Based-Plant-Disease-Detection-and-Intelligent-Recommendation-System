import os
import uuid
import json
from flask import Blueprint, request, jsonify, send_file
from middleware import require_auth
from services import yolo_service, groq_service, supabase_service
from config import Config

predict_bp = Blueprint("predict", __name__, url_prefix="/api")

ALLOWED_EXTENSIONS = Config.ALLOWED_EXTENSIONS


def _allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@predict_bp.route("/predict", methods=["POST"])
@require_auth
def predict():
    """
    Upload an image, run YOLOv8 inference, call Groq for suggestions,
    and optionally save results to database.
    """
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    if file.filename == "" or not _allowed_file(file.filename):
        return jsonify({"error": "Invalid file. Allowed: png, jpg, jpeg, webp, bmp"}), 400

    # Save uploaded file
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    ext = file.filename.rsplit(".", 1)[1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    upload_path = os.path.join(Config.UPLOAD_FOLDER, filename)
    file.save(upload_path)

    try:
        # Run YOLOv8 inference
        detections = yolo_service.predict(upload_path)

        # Annotate image
        annotated_path = yolo_service.annotate_image(
            upload_path, detections, Config.ANNOTATED_FOLDER
        )
        annotated_filename = os.path.basename(annotated_path)

        # Get primary detection (highest confidence)
        primary = max(detections, key=lambda d: d["confidence"]) if detections else None

        # Get mitigation suggestions from Groq
        mitigation = None
        if primary and primary["class_name"].lower() not in ("healthy", "cassava_healthy", "corn_healthy"):
            mitigation = groq_service.get_mitigation(primary["class_name"])

        response = {
            "detections": detections,
            "primary_detection": primary,
            "mitigation": mitigation,
            "annotated_image": f"/api/images/annotated/{annotated_filename}",
            "original_image": f"/api/images/uploads/{filename}",
        }

        return jsonify(response), 200

    except Exception as e:
        import traceback
        return jsonify({"error": f"Prediction failed: {str(e)}", "trace": traceback.format_exc()}), 500


@predict_bp.route("/predict/save", methods=["POST"])
@require_auth
def save_prediction():
    """Save prediction results to database."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body required"}), 400

    user_id = request.user["id"]
    disease_name = data.get("disease_name", "Unknown")
    confidence = data.get("confidence", 0)
    image_url = data.get("image_url", "")
    bbox_data = data.get("bbox_data", [])
    mitigation = data.get("mitigation", {})

    # Save prediction
    prediction = supabase_service.save_prediction(
        user_id=user_id,
        image_url=image_url,
        disease_name=disease_name,
        confidence=confidence,
        bbox_data=bbox_data,
        token=request.token,
    )

    if not prediction:
        return jsonify({"error": "Failed to save prediction"}), 500

    # Save recommendation
    if mitigation:
        recommendation_text = json.dumps(mitigation)
        supabase_service.save_recommendation(
            prediction_id=prediction["id"],
            recommendation_text=recommendation_text,
            token=request.token,
        )

    return jsonify({"message": "Saved successfully", "prediction_id": prediction["id"]}), 201


@predict_bp.route("/images/annotated/<filename>", methods=["GET"])
def serve_annotated(filename):
    """Serve annotated images."""
    path = os.path.join(Config.ANNOTATED_FOLDER, filename)
    if os.path.exists(path):
        return send_file(path, mimetype="image/jpeg")
    return jsonify({"error": "Image not found"}), 404


@predict_bp.route("/images/uploads/<filename>", methods=["GET"])
def serve_upload(filename):
    """Serve uploaded images."""
    path = os.path.join(Config.UPLOAD_FOLDER, filename)
    if os.path.exists(path):
        return send_file(path, mimetype="image/jpeg")
    return jsonify({"error": "Image not found"}), 404
