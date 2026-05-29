/**
 * Calculates the angle (in degrees) at joint B, between points A and C.
 * Uses 2D coordinates (x, y) for biomechanical analysis.
 * 
 * @param {Object} a Point A with {x, y}
 * @param {Object} b Point B (pivot/joint) with {x, y}
 * @param {Object} c Point C with {x, y}
 * @returns {number} Angle in degrees [0, 180]
 */
export function calculateAngle(a, b, c) {
  if (!a || !b || !c) return 0;

  // Vector BA
  const baX = a.x - b.x;
  const baY = a.y - b.y;

  // Vector BC
  const bcX = c.x - b.x;
  const bcY = c.y - b.y;

  // Calculate angle using atan2
  const angleA = Math.atan2(baY, baX);
  const angleC = Math.atan2(bcY, bcX);

  let diff = angleC - angleA;
  let angleDeg = Math.abs((diff * 180.0) / Math.PI);

  // Normalize angle to be [0, 180]
  if (angleDeg > 180.0) {
    angleDeg = 360.0 - angleDeg;
  }

  return Math.round(angleDeg);
}

/**
 * Helper to retrieve landmarks by index and calculate their joint angle.
 * 
 * @param {Array} landmarks Array of landmarks
 * @param {number} idxA Index of point A
 * @param {number} idxB Index of joint B (pivot)
 * @param {number} idxC Index of point C
 * @returns {number} Joint angle in degrees
 */
export function getJointAngle(landmarks, idxA, idxB, idxC) {
  if (!landmarks || !landmarks[idxA] || !landmarks[idxB] || !landmarks[idxC]) {
    return 0;
  }
  return calculateAngle(landmarks[idxA], landmarks[idxB], landmarks[idxC]);
}
