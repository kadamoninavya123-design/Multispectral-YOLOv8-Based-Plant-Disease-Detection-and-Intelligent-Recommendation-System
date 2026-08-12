import os
from config import Config
from services import yolo_service, groq_service

def test():
    image_path = os.path.join(Config.UPLOAD_FOLDER, "test_dummy.jpg")
    # create a dummy image
    from PIL import Image
    img = Image.new('RGB', (640, 640), color = 'red')
    img.save(image_path)
    
    print("Loading model...")
    yolo_service.load_model(Config.MODEL_PATH)
    
    print("Init groq...")
    groq_service.init_groq()
    
    print("Running predict...")
    try:
        detections = yolo_service.predict(image_path)
        print("Detections length:", len(detections))
        if detections:
            primary = max(detections, key=lambda d: d["confidence"])
            print("Primary:", primary)
            if primary["class_name"].lower() not in ("healthy", "cassava_healthy", "corn_healthy"):
               print("Calling Groq...")
               res = groq_service.get_mitigation(primary["class_name"])
               print("Groq answer:", res)
        
        print("Annotating image...")
        annot_path = yolo_service.annotate_image(image_path, detections, Config.ANNOTATED_FOLDER)
        print("Annotated image saved at:", annot_path)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
