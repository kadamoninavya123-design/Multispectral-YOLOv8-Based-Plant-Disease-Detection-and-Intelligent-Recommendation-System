from flask import Blueprint, request, jsonify
from services import supabase_service

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body required"}), 400

    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    result, error = supabase_service.sign_up(email, password)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Registration successful", "user": result}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login user and return tokens."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body required"}), 400

    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    result, error = supabase_service.sign_in(email, password)
    if error:
        return jsonify({"error": error}), 401
    return jsonify(result), 200


@auth_bp.route("/me", methods=["GET"])
def me():
    """Get current user profile from token."""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing Authorization header"}), 401

    token = auth_header.replace("Bearer ", "")
    user, error = supabase_service.get_user(token)
    if error:
        return jsonify({"error": error}), 401
    return jsonify({"user": user}), 200
