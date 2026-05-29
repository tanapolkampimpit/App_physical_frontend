import os
import cv2
from ultralytics import YOLO

base_dir = os.path.dirname(__file__)
model1_path = os.path.join(base_dir, "..", "Model", "best.pt")
model2_path = os.path.join(base_dir, "..", "Model", "model2", "best2.pt")
image_path = os.path.join(base_dir, "..", "src", "assets", "arm_circles.png")

print(f"Loading image from {image_path}...")
img = cv2.imread(image_path)

if img is None:
    print("Failed to load image!")
else:
    # Test Model 1
    print("\n" + "="*40)
    print(f"Testing Model 1: {model1_path}")
    if os.path.exists(model1_path):
        model1 = YOLO(model1_path)
        res1 = model1(img, conf=0.1)
        res1_img = res1[0].plot()
        cv2.imwrite(os.path.join(base_dir, "test_output_best.jpg"), res1_img)
        print("Saved result to test_output_best.jpg")
    else:
        print("File not found!")

    # Test Model 2
    print("\n" + "="*40)
    print(f"Testing Model 2: {model2_path}")
    if os.path.exists(model2_path):
        model2 = YOLO(model2_path)
        res2 = model2(img, conf=0.1)
        res2_img = res2[0].plot()
        cv2.imwrite(os.path.join(base_dir, "test_output_best2.jpg"), res2_img)
        print("Saved result to test_output_best2.jpg")
    else:
        print("File not found!")
