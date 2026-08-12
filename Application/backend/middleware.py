import functools
import logging
from flask import request, jsonify
from services import supabase_service

logger = logging.getLogger(__name__)


def require_auth(f):
    """Decorator that verifies the Supabase access token from Authorization header."""

    @functools.wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.replace("Bearer ", "")
        user, error = supabase_service.get_user(token)
        if error:
            return jsonify({"error": "Invalid or expired token", "details": error}), 401

        # Attach user info and token to request context
        request.user = user
        request.token = token
        return f(*args, **kwargs)

    return decorated
