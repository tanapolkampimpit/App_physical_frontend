import os
import cv2
import numpy as np
import base64
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI()

# No CORSMiddleware needed because WebSockets handle connections differently
# and Starlette's CORSMiddleware can incorrectly block WebSocket handshakes.

# Load the YOLO model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "Model", "model2", "best2.pt")
print(f"Loading model from {MODEL_PATH}...")
try:
    model = YOLO(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# KP_NAMES from user requirements
KP_NAMES = [
    "Left Shoulder", "Right Shoulder",
    "Left Elbow", "Right Elbow",
    "Left Wrist", "Right Wrist",
    "Left Hip", "Right Hip",
    "Left Knee", "Right Knee",
    "Left Ankle", "Right Ankle"
]

# COCO Keypoint Index Mapping (YOLOv8 pose default)
# Index 0-4 are Nose, Eyes, Ears
COCO_MAPPING = {
    "Left Shoulder": 5, "Right Shoulder": 6,
    "Left Elbow": 7, "Right Elbow": 8,
    "Left Wrist": 9, "Right Wrist": 10,
    "Left Hip": 11, "Right Hip": 12,
    "Left Knee": 13, "Right Knee": 14,
    "Left Ankle": 15, "Right Ankle": 16
}

@app.websocket("/ws/pose")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected to WebSocket")
    
    if model is None:
        await websocket.send_json({"error": "Model not loaded on server."})
        await websocket.close()
        return

    try:
        while True:
            # Receive base64 image from React
            data = await websocket.receive_text()
            
            # The data usually looks like "data:image/jpeg;base64,/9j/4AAQ..."
            if "," in data:
                header, base64_str = data.split(",", 1)
            else:
                base64_str = data

            # Decode base64 to numpy array
            img_data = base64.b64decode(base64_str)
            np_arr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                await websocket.send_json({"error": "Failed to decode image"})
                continue

            # Run YOLOv8 pose inference
            results = model.predict(frame, conf=0.25, verbose=False)

            response_data = []

            for r in results:
                if r.keypoints is not None and len(r.keypoints) > 0:
                    xy = r.keypoints.xy.cpu().numpy()
                    conf = r.keypoints.conf.cpu().numpy() if r.keypoints.conf is not None else None
                    
                    # เช็คจำนวน Keypoint ของโมเดล
                    num_kpts = xy.shape[1]

                    for p_idx in range(len(xy)):
                        person_keypoints = []
                        
                        # Use COCO mapping if the model has at least 17 keypoints
                        if num_kpts >= 17:
                            for kp_name in KP_NAMES:
                                coco_idx = COCO_MAPPING[kp_name]
                                x, y = xy[p_idx][coco_idx]
                                score = conf[p_idx][coco_idx] if conf is not None else 1.0
                                
                                person_keypoints.append({
                                    "name": kp_name,
                                    "x": float(x),
                                    "y": float(y),
                                    "score": float(score)
                                })
                        else:
                            # Fallback if model exactly has 12 keypoints
                            for i in range(min(num_kpts, len(KP_NAMES))):
                                kp_name = KP_NAMES[i]
                                x, y = xy[p_idx][i]
                                score = conf[p_idx][i] if conf is not None else 1.0
                                person_keypoints.append({
                                    "name": kp_name,
                                    "x": float(x),
                                    "y": float(y),
                                    "score": float(score)
                                })
                        
                        response_data.append(person_keypoints)
            
            # Send results back to React
            await websocket.send_json({"persons": response_data})

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error in websocket loop: {e}")
        try:
            await websocket.close()
        except:
            pass

@app.get("/")
def read_root():
    return {"message": "Pose Estimation Backend is running!"}
