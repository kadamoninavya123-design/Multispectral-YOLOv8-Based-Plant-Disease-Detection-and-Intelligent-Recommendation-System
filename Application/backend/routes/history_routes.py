from flask import Blueprint, request, jsonify
from middleware import require_auth
from services import supabase_service

history_bp = Blueprint("history", __name__, url_prefix="/api/history")


@history_bp.route("", methods=["GET"])
@require_auth
def get_history():
    """Get all saved predictions for the logged-in user."""
    user_id = request.user["id"]
    history = supabase_service.get_history(user_id, token=request.token)
    return jsonify({"history": history}), 200


@history_bp.route("/<prediction_id>", methods=["GET"])
@require_auth
def get_prediction_detail(prediction_id):
    """Get details of a specific prediction."""
    user_id = request.user["id"]
    detail = supabase_service.get_prediction_detail(prediction_id, user_id, token=request.token)
    if not detail:
        return jsonify({"error": "Prediction not found"}), 404
    return jsonify(detail), 200


@history_bp.route("/<prediction_id>", methods=["DELETE"])
@require_auth
def delete_prediction(prediction_id):
    """Delete a specific prediction."""
    user_id = request.user["id"]
    success = supabase_service.delete_prediction(prediction_id, user_id, token=request.token)
    if not success:
        return jsonify({"error": "Failed to delete or prediction not found"}), 404
    return jsonify({"message": "Deleted successfully"}), 200
