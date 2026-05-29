export const mockPrograms = [
  { id: 1, title: 'Seated Knee Extensions' },
  { id: 2, title: 'Arm Circles' },
  { id: 3, title: 'Walking Balance' },
  { id: 4, title: 'Hip Flexor Stretch' },
  { id: 5, title: 'Resistance Band Rows' },
  { id: 6, title: 'Single Leg Stand' },
];

export const exerciseInstructions = {
  1: {
    description: 'Improves quadriceps strength and knee joint stability. Crucial for walking and standing up safely.',
    category: 'Lower Body',
    difficulty: 'Easy',
    duration: '15m',
    reps: '10-15 ครั้ง / ข้าง',
    steps: [
      'นั่งตัวตรงบนเก้าอี้ เท้าวางราบกับพื้น',
      'ค่อยๆ ยกขาข้างหนึ่งขึ้นจนเหยียดตรง ค้างไว้ 2-3 วินาที',
      'ลดขาลงช้าๆ กลับสู่ท่าเริ่มต้น',
      'ทำซ้ำข้างละ 10-15 ครั้ง สลับข้าง',
    ],
    tips: [
      'หลังต้องตรงตลอดเวลา ไม่แอ่นหรืองอ',
      'ยกขาช้าๆ อย่าสะบัด',
      'หากรู้สึกเจ็บข้อเข่า หยุดทันที',
    ],
  },
  2: {
    description: 'Enhances shoulder range of motion and reduces stiffness. Helps with reaching overhead.',
    category: 'Upper Body',
    difficulty: 'Easy',
    duration: '10m',
    reps: '10 รอบ / ทิศทาง',
    steps: [
      'ยืนหรือนั่งตัวตรง ยืดหลังให้ตรง',
      'ยกแขนทั้งสองข้างขึ้นข้างลำตัวระดับไหล่',
      'หมุนแขนเป็นวงกลมช้าๆ ทิศหน้า 10 รอบ',
      'หยุดพัก จากนั้นหมุนกลับทิศหลัง 10 รอบ',
      'เริ่มจากวงเล็ก ค่อยๆ ขยายวงให้ใหญ่ขึ้น',
    ],
    tips: [
      'หายใจสม่ำเสมอ อย่ากลั้นหายใจ',
      'ไหล่ไม่ควรยักขึ้นระหว่างทำ',
      'หากมีอาการปวดไหล่ ลดขนาดวงลง',
    ],
  },
  3: {
    description: 'Improves gait stability and coordination. Reduces the risk of falls in daily life.',
    category: 'Balance',
    difficulty: 'Medium',
    duration: '20m',
    reps: '5-10 เมตร / รอบ',
    steps: [
      'ยืนตรง มือจับราวหรือผนังเพื่อความปลอดภัย',
      'เดินช้าๆ วางส้นเท้าก่อน แล้วค่อยกลิ้งไปปลายเท้า',
      'มองตรงไปข้างหน้า ไม่มองพื้น',
      'เดินเป็นเส้นตรง 5-10 เมตร จากนั้นหันกลับ',
      'ค่อยๆ ลดการจับราวเมื่อทรงตัวได้ดีขึ้น',
    ],
    tips: [
      'ทำในพื้นที่ปลอดโล่ง ไม่มีสิ่งกีดขวาง',
      'สวมรองเท้าที่มีพื้นกันลื่น',
      'มีคนดูแลอยู่ใกล้ๆ ครั้งแรก',
    ],
  },
  4: {
    description: 'Stretches the front of the hip and thigh. Reduces stiffness from sitting or post-surgery.',
    category: 'Lower Body',
    difficulty: 'Easy',
    duration: '12m',
    reps: 'ค้าง 20-30 วินาที / ข้าง',
    steps: [
      'ยืนตรง มือจับเก้าอี้หรือผนังเพื่อพยุง',
      'ก้าวขาข้างหนึ่งไปข้างหลัง ให่หัวเข่าแตะพื้นเบาๆ',
      'เอียงลำตัวไปข้างหน้าเล็กน้อย ค้างไว้ 20-30 วินาที',
      'รู้สึกถึงการยืดที่ต้นขาด้านหน้า',
      'ค่อยๆ กลับท่า สลับข้าง',
    ],
    tips: [
      'ไม่บังคับให้ยืดเกินกว่าที่รู้สึกสบาย',
      'หลังต้องตรง ไม่งอหลัง',
      'หากเจ็บข้อเข่าที่แตะพื้น รองด้วยผ้าพับ',
    ],
  },
  5: {
    description: 'Strengthens upper back and shoulder muscles using elastic resistance. Improves posture.',
    category: 'Upper Body',
    difficulty: 'Hard',
    duration: '18m',
    reps: '10-12 ครั้ง / เซต',
    steps: [
      'นั่งหรือยืน จับยางยืดด้วยมือทั้งสอง',
      'เหยียดแขนออกไปข้างหน้าระดับไหล่',
      'ดึงยางยืดเข้าหาลำตัว งอข้อศอกและดึงไหล่เข้าหากัน',
      'ค้างไว้ 1-2 วินาที แล้วค่อยๆ คืนท่าเดิม',
      'ทำ 10-12 ครั้ง พัก 30 วินาที แล้วทำเซตต่อไป',
    ],
    tips: [
      'ไหล่ไม่ยักขึ้น กดไหล่ลงตลอด',
      'หายใจออกขณะดึง Hายใจเข้าขณะคืน',
      'เลือกแรงต้านยางที่พอดี ไม่หนักเกินไป',
    ],
  },
  6: {
    description: 'Improves ankle stability and standing balance. Promotes lower body muscular control.',
    category: 'Balance',
    difficulty: 'Medium',
    duration: '15m',
    reps: 'ค้าง 10-30 วินาที / ข้าง',
    steps: [
      'ยืนตรงใกล้เก้าอี้หรือผนัง มือแตะเบาๆ เพื่อพยุง',
      'ค่อยๆ ยกขาข้างหนึ่งขึ้น งอเข่าเล็กน้อย',
      'ทรงตัวบนขาข้างเดียว ค้างไว้ 10-30 วินาที',
      'วางเท้าลงช้าๆ พัก แล้วสลับข้าง',
      'เมื่อดีขึ้น ลองลดการพยุงจากมือ',
    ],
    tips: [
      'มองจุดคงที่ข้างหน้าช่วยทรงตัว',
      'อย่าล็อคข้อเข่าที่ยืน ให้งอเล็กน้อย',
      'เริ่มจาก 10 วินาที ค่อยๆ เพิ่มเวลา',
    ],
  },
};

export const mockKeypoints = [
  { x: 0.5, y: 0.15 },
  { x: 0.48, y: 0.12 },
  { x: 0.52, y: 0.12 },
  { x: 0.45, y: 0.11 },
  { x: 0.55, y: 0.11 },
  { x: 0.4, y: 0.3 },
  { x: 0.6, y: 0.3 },
  { x: 0.35, y: 0.5 },
  { x: 0.65, y: 0.5 },
  { x: 0.3, y: 0.7 },
  { x: 0.7, y: 0.7 },
  { x: 0.4, y: 0.6 },
  { x: 0.6, y: 0.6 },
  { x: 0.38, y: 0.8 },
  { x: 0.62, y: 0.8 },
  { x: 0.36, y: 1.0 },
  { x: 0.64, y: 1.0 },
];

// Custom Backend 12-keypoint skeleton connections
// 0:left_shoulder 1:right_shoulder 2:left_elbow 3:right_elbow
// 4:left_wrist 5:right_wrist 6:left_hip 7:right_hip
// 8:left_knee 9:right_knee 10:left_ankle 11:right_ankle
export const SKELETON_CONNECTIONS = [
  // ลำตัว
  [0, 1], [0, 6], [1, 7], [6, 7],
  // แขนซ้าย: shoulder -> elbow -> wrist
  [0, 2], [2, 4],
  // แขนขวา
  [1, 3], [3, 5],
  // ขาซ้าย: hip -> knee -> ankle
  [6, 8], [8, 10],
  // ขาขวา
  [7, 9], [9, 11],
];

export const ARM_JOINTS = {
  left: [0, 2, 4],
  right: [1, 3, 5],
};

// Backend Model: index คู่ = ซ้าย, index คี่ = ขวา
const LEFT_INDICES = new Set([0, 2, 4, 6, 8, 10]);
const RIGHT_INDICES = new Set([1, 3, 5, 7, 9, 11]);

export const getKeypointColor = (index) => {
  if (LEFT_INDICES.has(index)) return '#10b981';
  if (RIGHT_INDICES.has(index)) return '#06b6d4';
  return '#ffffff';
};
