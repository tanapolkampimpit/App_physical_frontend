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
      return { feedback: 'Initializing...', accuracy: 0, activeArm: 'none' };
    }

    const avgScore =
      keypoints.reduce((sum, kp) => sum + (kp.score || 0), 0) / keypoints.length;
    const accuracy = Math.round(avgScore * 100);

    // Backend Custom Model: 0=left_shoulder 1=right_shoulder 2=left_elbow 3=right_elbow 4=left_wrist 5=right_wrist
    const leftShoulder = keypoints[0];
    const rightShoulder = keypoints[1];
    const leftElbow = keypoints[2];
    const rightElbow = keypoints[3];
    const leftWrist = keypoints[4];
    const rightWrist = keypoints[5];

    const leftScore = avgArmScore(keypoints, [0, 2, 4]);
    const rightScore = avgArmScore(keypoints, [1, 3, 5]);
    const THRESHOLD = 0.45;

    const leftActive = leftScore >= THRESHOLD;
    const rightActive = rightScore >= THRESHOLD;

    let activeArm = 'none';
    if (leftActive && rightActive) activeArm = 'both';
    else if (leftActive) activeArm = 'left';
    else if (rightActive) activeArm = 'right';

    let feedback;

    if (!leftActive && !rightActive) {
      feedback = 'Move into frame...';
    } else {
      const leftArmRaised = leftWrist?.y < leftShoulder?.y - 0.1;
      const rightArmRaised = rightWrist?.y < rightShoulder?.y - 0.1;

      const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

      if (leftElbowAngle > 120 && rightElbowAngle > 120) {
        feedback = 'Perfect arm extension!';
      } else if (leftArmRaised && rightArmRaised) {
        feedback = 'Great form! Keep it up!';
      } else if (leftArmRaised || rightArmRaised) {
        feedback = 'Raise both arms higher!';
      } else {
        feedback = 'Raise your arms!';
      }
    }

    return { feedback, accuracy, activeArm };
  }, [keypoints]);
};
