import { useState, useEffect } from 'react';

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
  const [feedback, setFeedback] = useState('Initializing...');
  const [accuracy, setAccuracy] = useState(0);
  const [activeArm, setActiveArm] = useState('none');

  useEffect(() => {
    if (!keypoints || keypoints.length < 17) {
      setFeedback('Initializing...');
      setActiveArm('none');
      return;
    }

    const avgScore =
      keypoints.reduce((sum, kp) => sum + (kp.score || 0), 0) / keypoints.length;
    setAccuracy(Math.round(avgScore * 100));

    // MoveNet COCO: 5=left_shoulder 6=right_shoulder 7=left_elbow 8=right_elbow 9=left_wrist 10=right_wrist
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    const leftElbow = keypoints[7];
    const rightElbow = keypoints[8];
    const leftWrist = keypoints[9];
    const rightWrist = keypoints[10];

    const leftScore = avgArmScore(keypoints, [5, 7, 9]);
    const rightScore = avgArmScore(keypoints, [6, 8, 10]);
    const THRESHOLD = 0.45;

    const leftActive = leftScore >= THRESHOLD;
    const rightActive = rightScore >= THRESHOLD;

    if (leftActive && rightActive) setActiveArm('both');
    else if (leftActive) setActiveArm('left');
    else if (rightActive) setActiveArm('right');
    else setActiveArm('none');

    if (!leftActive && !rightActive) {
      setFeedback('Move into frame...');
      return;
    }

    const leftArmRaised = leftWrist?.y < leftShoulder?.y - 0.1;
    const rightArmRaised = rightWrist?.y < rightShoulder?.y - 0.1;

    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

    if (leftElbowAngle > 120 && rightElbowAngle > 120) {
      setFeedback('Perfect arm extension!');
    } else if (leftArmRaised && rightArmRaised) {
      setFeedback('Great form! Keep it up!');
    } else if (leftArmRaised || rightArmRaised) {
      setFeedback('Raise both arms higher!');
    } else {
      setFeedback('Raise your arms!');
    }
  }, [keypoints]);

  return { feedback, accuracy, activeArm };
};
