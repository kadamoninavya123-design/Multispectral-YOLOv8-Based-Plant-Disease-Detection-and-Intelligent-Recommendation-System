import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration loaded from environment variables."""

    # Supabase
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

    # Groq
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

    # YOLOv8 model path
    MODEL_PATH = os.getenv("MODEL_PATH", "model/best.pt")

    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    # Upload
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    ANNOTATED_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "annotated")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "bmp"}
