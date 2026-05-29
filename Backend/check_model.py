import os
from ultralytics import YOLO

model_path = os.path.join(os.path.dirname(__file__), "..", "Model", "model2", "best2.pt")
print(f"Loading {model_path}...")
model = YOLO(model_path)

print("Keypoint shape:", model.model.kpt_shape)
