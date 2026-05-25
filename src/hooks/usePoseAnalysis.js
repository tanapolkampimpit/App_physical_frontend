import { useMemo } from 'react';

const calculateAngle = (a, b, c) => {
  if (!a || !b || !c) return 0;
  const ba = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  const bc = Math.sqrt((c.x - b.x) ** 2 + (c.y - b.y) ** 2);
  const ac = Math.sqrt((a.x - c.x) ** 2 + (a.y - c.y) ** 2);

  const cosine = (ba * ba + bc * bc - ac * ac) / (2 * ba * bc);
  const angle = Math.acos(Math.min(1, Math.max(-1, cosine)));
  return angle * (180 / Math.PI);
};

const avgArmScore = (keypoints, indices) =>
  indices.reduce((sum, i) => sum + (keypoints[i]?.score || 0), 0) / indices.length;

export const usePoseAnalysis = (keypoints) => {
  return useMemo(() => {
    if (!keypoints || keypoints.length < 12) {
      return { feedback: 'กำลังเริ่มระบบ...', accuracy: 0, activeArm: 'none', isDangerous: false };
    }

    const avgScore = keypoints.reduce((sum, kp) => sum + (kp.score || 0), 0) / keypoints.length;
    const accuracy = Math.round(avgScore * 100);

    // YOLO 12-kpt: 0=left_shoulder 1=right_shoulder 2=left_elbow 3=right_elbow 4=left_wrist 5=right_wrist
    const leftShoulder = keypoints[0];
    const rightShoulder = keypoints[1];
    const leftElbow = keypoints[2];
    const rightElbow = keypoints[3];
    const leftWrist = keypoints[4];
    const rightWrist = keypoints[5];

    const leftScore = avgArmScore(keypoints, [0, 2, 4]);
    const rightScore = avgArmScore(keypoints, [1, 3, 5]);
    const THRESHOLD = 0.3; // Lowered for debugging YOLO scores which are forced to 1.0 mostly

    const leftActive = leftScore >= THRESHOLD;
    const rightActive = rightScore >= THRESHOLD;

    let activeArm = 'none';
    if (leftActive && rightActive) activeArm = 'both';
    else if (leftActive) activeArm = 'left';
    else if (rightActive) activeArm = 'right';

    let feedback;
    let isDangerous = false;

    if (!leftActive && !rightActive) {
      feedback = 'ขยับเข้ามาในกล้อง...';
    } else {
      const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

      const currentAngle = Math.round(Math.max(leftElbowAngle || 0, rightElbowAngle || 0));

      // Check dangerous angles (e.g., hyper-extension or raising too high)
      // Let's say if it goes beyond 160 degrees for someone with limitations, it's dangerous
      if (currentAngle > 160) {
        isDangerous = true;
        feedback = 'อันตราย! กรุณาลดระดับแขนลงเพื่อป้องกันการบาดเจ็บ';
      } else if (currentAngle > 120) {
        feedback = 'ดีมาก! ยืดสุดแขนเลย';
      } else if (currentAngle > 80) {
        feedback = 'เยี่ยมมาก! ทำต่อไป';
      } else {
        feedback = 'ยกแขนขึ้นอีกนิดนึงครับ';
      }
    }

    return { feedback, accuracy, activeArm, isDangerous };
  }, [keypoints]);
};
