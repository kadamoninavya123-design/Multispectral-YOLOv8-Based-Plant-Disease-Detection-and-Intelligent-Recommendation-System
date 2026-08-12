import logging
from supabase import create_client, Client, ClientOptions
from config import Config

logger = logging.getLogger(__name__)

_supabase: Client = None


def init_supabase():
    """Initialize Supabase client."""
    global _supabase
    if Config.SUPABASE_URL and Config.SUPABASE_KEY:
        _supabase = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
        logger.info("Supabase client initialized")
    else:
        logger.error("Supabase credentials missing!")


def get_client() -> Client:
    return _supabase


def get_auth_client(token: str) -> Client:
    """Create a temporary client authenticated as the user."""
    opts = ClientOptions(headers={"Authorization": f"Bearer {token}"})
    return create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY, options=opts)


# ── Authentication ──────────────────────────────────────────────────────

def sign_up(email: str, password: str):
    """Register a new user via Supabase Auth."""
    try:
        result = _supabase.auth.sign_up({"email": email, "password": password})
        if result.user:
            return {"user_id": result.user.id, "email": result.user.email}, None
        return None, "Registration failed"
    except Exception as e:
        logger.error(f"Sign-up error: {e}")
        return None, str(e)


def sign_in(email: str, password: str):
    """Login user and return session tokens."""
    try:
        result = _supabase.auth.sign_in_with_password({"email": email, "password": password})
        if result.session:
            return {
                "access_token": result.session.access_token,
                "refresh_token": result.session.refresh_token,
                "user": {
                    "id": result.user.id,
                    "email": result.user.email,
                },
            }, None
        return None, "Invalid credentials"
    except Exception as e:
        logger.error(f"Sign-in error: {e}")
        return None, str(e)


def get_user(access_token: str):
    """Get user from access token."""
    try:
        result = _supabase.auth.get_user(access_token)
        if result.user:
            return {"id": result.user.id, "email": result.user.email}, None
        return None, "Invalid token"
    except Exception as e:
        logger.error(f"Get user error: {e}")
        return None, str(e)


# ── Database Operations ─────────────────────────────────────────────────

def save_prediction(user_id: str, image_url: str, disease_name: str, confidence: float, bbox_data: list, token: str = None):
    """Save a prediction record and return its id."""
    try:
        client = get_auth_client(token) if token else _supabase
        result = client.table("predictions").insert({
            "user_id": user_id,
            "image_url": image_url,
            "disease_name": disease_name,
            "confidence": confidence,
            "bbox_data": bbox_data,
        }).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error(f"Save prediction error: {e}")
        return None


def save_recommendation(prediction_id: str, recommendation_text: str, token: str = None):
    """Save a recommendation linked to a prediction."""
    try:
        client = get_auth_client(token) if token else _supabase
        result = client.table("recommendations").insert({
            "prediction_id": prediction_id,
            "recommendation_text": recommendation_text,
        }).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error(f"Save recommendation error: {e}")
        return None


def get_history(user_id: str, token: str = None):
    """Get all predictions for a user, newest first."""
    try:
        client = get_auth_client(token) if token else _supabase
        result = (
            client.table("predictions")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        logger.error(f"Get history error: {e}")
        return []


def get_prediction_detail(prediction_id: str, user_id: str, token: str = None):
    """Get a single prediction with its recommendation."""
    try:
        client = get_auth_client(token) if token else _supabase
        pred = (
            client.table("predictions")
            .select("*")
            .eq("id", prediction_id)
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        rec = (
            client.table("recommendations")
            .select("*")
            .eq("prediction_id", prediction_id)
            .execute()
        )
        data = pred.data
        if data:
            data["recommendation"] = rec.data[0] if rec.data else None
        return data
    except Exception as e:
        logger.error(f"Get prediction detail error: {e}")
        return None


def delete_prediction(prediction_id: str, user_id: str, token: str = None):
    """Delete a prediction and its linked recommendation."""
    try:
        client = get_auth_client(token) if token else _supabase
        # Delete recommendation first (FK dependency)
        client.table("recommendations").delete().eq("prediction_id", prediction_id).execute()
        result = (
            client.table("predictions")
            .delete()
            .eq("id", prediction_id)
            .eq("user_id", user_id)
            .execute()
        )
        return len(result.data) > 0 if result.data else False
    except Exception as e:
        logger.error(f"Delete prediction error: {e}")
        return False
