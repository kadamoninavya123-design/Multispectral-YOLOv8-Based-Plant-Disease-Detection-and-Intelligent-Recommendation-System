import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

# ── Logging ──────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)

# ── Flask App ────────────────────────────────────────────────────────────
app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/api/*": {"origins": "*"}})

# ── Initialize Services ─────────────────────────────────────────────────
from services import supabase_service, groq_service, yolo_service

supabase_service.init_supabase()
groq_service.init_groq()
yolo_service.load_model(Config.MODEL_PATH)

# ── Register Blueprints ─────────────────────────────────────────────────
from routes.auth_routes import auth_bp
from routes.prediction_routes import predict_bp
from routes.history_routes import history_bp

app.register_blueprint(auth_bp)
app.register_blueprint(predict_bp)
app.register_blueprint(history_bp)


# ── Health Check ─────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": yolo_service._model is not None,
        "groq_available": groq_service._client is not None,
    }), 200


# ── Error Handlers ───────────────────────────────────────────────────────
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 16 MB"}), 413


@app.errorhandler(500)
def server_error(e):
    logger.error(f"Internal server error: {e}")
    return jsonify({"error": "Internal server error"}), 500


# ── Run ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(Config.ANNOTATED_FOLDER, exist_ok=True)
    app.run(host="0.0.0.0", port=5000, debug=Config.DEBUG, use_reloader=False)
