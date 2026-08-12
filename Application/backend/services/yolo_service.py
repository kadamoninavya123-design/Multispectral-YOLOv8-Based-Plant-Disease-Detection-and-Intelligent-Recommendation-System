import os
import yaml
import logging
from PIL import Image, ImageDraw, ImageFont
import uuid

logger = logging.getLogger(__name__)

# Global model reference
_model = None
_class_names = []


def _load_class_names():
    """Load 57 class names from data.yaml."""
    global _class_names
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    app_dir = os.path.dirname(backend_dir)  # Application directory
    yaml_path = os.path.join(
        app_dir, "plant disease dataset", "dataset_small", "data.yaml"
    )
    try:
        with open(yaml_path, "r") as f:
            data = yaml.safe_load(f)
            _class_names = data.get("names", [])
            logger.info(f"Loaded {len(_class_names)} class names from data.yaml")
    except FileNotFoundError:
        logger.warning(f"data.yaml not found at {yaml_path}, using empty class list")
        _class_names = []


def load_model(model_path: str):
    """Load YOLOv8 model at startup. Call once."""
    global _model
    _load_class_names()

    if not os.path.exists(model_path):
        logger.warning(
            f"Model file not found at '{model_path}'. "
            "Running in MOCK mode — predictions will be simulated."
        )
        _model = None
        return

    try:
        from ultralytics import YOLO
        _model = YOLO(model_path)
        logger.info(f"YOLOv8 model loaded from {model_path}")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        _model = None


def predict(image_path: str, conf_threshold: float = 0.25):
    """
    Run inference on a single image.
    Returns list of dicts: {class_name, confidence, bbox: [x1,y1,x2,y2]}
    """
    if _model is None:
        return _mock_predict(image_path)

    results = _model(image_path, conf=conf_threshold, verbose=False)
    detections = []

    for result in results:
        boxes = result.boxes
        if boxes is None:
            continue
        for box in boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            class_name = _class_names[cls_id] if cls_id < len(_class_names) else f"Class_{cls_id}"
            detections.append({
                "class_name": class_name,
                "confidence": round(conf, 4),
                "bbox": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)],
            })

    return detections


def annotate_image(image_path: str, detections: list, output_dir: str) -> str:
    """
    Draw bounding boxes and labels on the image.
    Returns the path to the annotated image.
    """
    img = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(img)

    # Try to use a nicer font, fall back to default
    try:
        font = ImageFont.truetype("arial.ttf", 18)
    except (OSError, IOError):
        font = ImageFont.load_default()

    colors = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
        "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
    ]

    for i, det in enumerate(detections):
        x1, y1, x2, y2 = det["bbox"]
        color = colors[i % len(colors)]
        label = f'{det["class_name"]} {det["confidence"]:.0%}'

        # Draw box
        draw.rectangle([x1, y1, x2, y2], outline=color, width=3)

        # Draw label background
        text_bbox = draw.textbbox((x1, y1 - 25), label, font=font)
        draw.rectangle(text_bbox, fill=color)
        draw.text((x1, y1 - 25), label, fill="white", font=font)

    os.makedirs(output_dir, exist_ok=True)
    filename = f"annotated_{uuid.uuid4().hex[:8]}.jpg"
    output_path = os.path.join(output_dir, filename)
    img.save(output_path, quality=92)
    return output_path


def _mock_predict(image_path: str):
    """Return simulated predictions when no model is loaded."""
    import random

    if not _class_names:
        mock_classes = ["Tomato___Early_blight_leaf", "Corn_Rust", "Potato___Phytopthora_infestans_leaf"]
    else:
        mock_classes = _class_names

    img = Image.open(image_path)
    w, h = img.size

    num = random.randint(1, 3)
    detections = []
    for _ in range(num):
        cls = random.choice(mock_classes)
        x1 = random.uniform(0, w * 0.5)
        y1 = random.uniform(0, h * 0.5)
        x2 = x1 + random.uniform(w * 0.15, w * 0.4)
        y2 = y1 + random.uniform(h * 0.15, h * 0.4)
        detections.append({
            "class_name": cls,
            "confidence": round(random.uniform(0.65, 0.98), 4),
            "bbox": [round(x1, 1), round(y1, 1), round(min(x2, w), 1), round(min(y2, h), 1)],
        })
    return detections
