const API_ENDPOINT = 'http://localhost:8000/inference/pose';

// โหลดโมเดลจำลองเพื่อไม่ให้ฝั่ง Frontend พัง
export async function loadYolov8Model() {
  console.log('Using Backend API for YOLOv8 inference.');
  return { isRemote: true, endpoint: API_ENDPOINT };
}

export async function detectPose(session, video) {
  if (!video || video.readyState !== 4) return [];

  // สร้าง Canvas ย่อขนาดรูปรักษาสัดส่วนเดิม เพื่อไม่ให้ Coordinate ผิดเพี้ยน
  const MAX_SIZE = 640;
  const vW = video.videoWidth;
  const vH = video.videoHeight;
  const scale = Math.min(MAX_SIZE / vW, MAX_SIZE / vH);
  
  const canvas = document.createElement('canvas');
  canvas.width = vW * scale;
  canvas.height = vH * scale;
  const ctx = canvas.getContext('2d');

  // วาดภาพลง Canvas (ไม่ต้องทำ Padding เพราะ Ultralytics Backend จัดการให้)
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // แปลงเป็น Base64
  const base64Data = canvas.toDataURL('image/jpeg', 0.7);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: base64Data })
    });

    if (!response.ok) {
      console.error('Inference API Error:', response.statusText);
      return [];
    }

    const data = await response.json();
    const poses = data.poses || [];
    
    // แปลง Coordinates กลับเป็นสเกลของวิดีโอต้นฉบับ
    poses.forEach(pose => {
      if (pose.keypoints) {
        pose.keypoints.forEach(kp => {
          kp.x = kp.x / scale;
          kp.y = kp.y / scale;
        });
      }
    });

    return poses;
  } catch (error) {
    console.error('Fetch Inference Error:', error);
    return [];
  }
}
