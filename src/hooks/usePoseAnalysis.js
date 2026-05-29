import { useMemo, useState } from 'react';
import { POSE_CONFIGS, RepCounterFSM } from '../lib/repCounterFSM';
import { getJointAngle } from '../lib/angleCalculation';

/**
 * Biomechanical Pose Analysis Hook.
 * Automatically tracks exercise state, counts reps, and computes joint angles.
 * 
 * @param {Array} landmarks MediaPipe 33 normalized landmarks
 * @param {number} exerciseId Active exercise ID
 * @returns {Object} Analysis results
 */
export const usePoseAnalysis = (landmarks, exerciseId) => {
  const activeExerciseId = Number(exerciseId) || 1;
  const [fsm, setFsm] = useState(() => new RepCounterFSM(activeExerciseId));

  if (fsm.config.id !== activeExerciseId) {
    setFsm(new RepCounterFSM(activeExerciseId));
  }

  return useMemo(() => {
    const currentFsm = fsm.config.id === activeExerciseId ? fsm : new RepCounterFSM(activeExerciseId);

    // Default return state when pose is loading or undetected
    if (!landmarks || landmarks.length < 33) {
      return {
        feedback: 'ขยับร่างกายให้หันเข้าหากล้องตรงๆ...',
        currentAngle: 0,
        repCount: currentFsm.repCount,
        targetReps: currentFsm.targetReps,
        fsmState: currentFsm.state,
        shouldCapture: false,
        activeSide: 'none',
        isDangerous: false
      };
    }

    const config = POSE_CONFIGS[activeExerciseId];

    // Determine the more visible/facing side of the body (left vs right)
    const leftVisibilitySum = 
      (landmarks[config.landmarksLeft[0]]?.visibility ?? 0) +
      (landmarks[config.landmarksLeft[1]]?.visibility ?? 0) +
      (landmarks[config.landmarksLeft[2]]?.visibility ?? 0);

    const rightVisibilitySum = 
      (landmarks[config.landmarksRight[0]]?.visibility ?? 0) +
      (landmarks[config.landmarksRight[1]]?.visibility ?? 0) +
      (landmarks[config.landmarksRight[2]]?.visibility ?? 0);

    const activeSide = leftVisibilitySum >= rightVisibilitySum ? 'left' : 'right';
    const activeIndices = activeSide === 'left' ? config.landmarksLeft : config.landmarksRight;

    // Calculate angle at the joint pivot using One-Euro filtered coordinates
    const rawAngle = getJointAngle(landmarks, activeIndices[0], activeIndices[1], activeIndices[2]);

    // Feed angle into finite state machine (FSM)
    const fsmResult = currentFsm.update(rawAngle);

    // Evaluate biomechanical safety boundaries
    let isDangerous = false;
    let finalFeedback = fsmResult.feedback;

    // Safety checks for joints
    if (config.joint === 'shoulder' && fsmResult.currentAngle > 175) {
      isDangerous = true;
      finalFeedback = 'แจ้งเตือน: ยกแขนสูงเกินไป อาจเกิดการบาดเจ็บข้อต่อ!';
    } else if (config.joint === 'knee' && rawAngle > 182) {
      isDangerous = true;
      finalFeedback = 'แจ้งเตือน: ข้อเข่าแอ่นตึงเกินไป กรุณางอพักข้อเล็กน้อย!';
    }

    return {
      feedback: finalFeedback,
      currentAngle: fsmResult.currentAngle,
      repCount: fsmResult.repCount,
      targetReps: currentFsm.targetReps,
      fsmState: fsmResult.state,
      shouldCapture: fsmResult.shouldCapture,
      activeSide,
      isDangerous
    };
  }, [landmarks, activeExerciseId, fsm]);
};
