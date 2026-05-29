export const POSE_CONFIGS = {
  1: {
    id: 1,
    name: 'หมุนแขนระดับไหล่',
    joint: 'shoulder',
    landmarksLeft: [23, 11, 13],  // Hip-Shoulder-Elbow
    landmarksRight: [24, 12, 14],
    peakAngle: 90,
    type: 'GREATER_THAN',
    targetReps: 10,
    feedbacks: {
      initial: 'กางแขนยกขึ้นด้านข้างให้เสมอกับระดับไหล่',
      goingUp: 'ยกแขนขึ้นอีกเล็กน้อยให้ขนานกับพื้น',
      peak: 'ค้างไว้สักครู่ แล้วนำแขนลงช้าๆ',
      success: 'ดีมาก! กลับสู่ท่าเตรียมพร้อม'
    }
  },
  2: {
    id: 2,
    name: 'ยกแขนเหนือศีรษะ',
    joint: 'shoulder',
    landmarksLeft: [23, 11, 13],  // Hip-Shoulder-Elbow
    landmarksRight: [24, 12, 14],
    peakAngle: 150,
    type: 'GREATER_THAN',
    targetReps: 10,
    feedbacks: {
      initial: 'ยกแขนขึ้นตรงๆ ไปเหนือศีรษะ',
      goingUp: 'ยกแขนขึ้นอีกให้สุดแนวใบหู',
      peak: 'ดีมาก เกร็งค้างไว้ แล้วลดแขนลงช้าๆ',
      success: 'เก่งมาก! กลับสู่ท่าเหยียดตรงเริ่มต้น'
    }
  },
  3: {
    id: 3,
    name: 'เหยียดข้อเข่าขณะนั่ง',
    joint: 'knee',
    landmarksLeft: [23, 25, 27],  // Hip-Knee-Ankle
    landmarksRight: [24, 26, 28],
    peakAngle: 170,
    type: 'GREATER_THAN',
    targetReps: 10,
    feedbacks: {
      initial: 'เตะขาเหยียดข้อเข่าไปข้างหน้าให้ตรงที่สุด',
      goingUp: 'เตะขาขึ้นสูงอีกนิดให้เข่าตรงระนาบแนวราบ',
      peak: 'ดีมาก เกร็งค้างกระดกข้อเท้าไว้ครู่หนึ่ง แล้วผ่อนลง',
      success: 'ยอดเยี่ยม! งอเข่ากลับสู่ท่าเตรียม'
    }
  },
  4: {
    id: 4,
    name: 'นอนงอข้อเข่า',
    joint: 'knee',
    landmarksLeft: [23, 25, 27],  // Hip-Knee-Ankle
    landmarksRight: [24, 26, 28],
    peakAngle: 60,
    type: 'LESS_THAN',
    targetReps: 10,
    feedbacks: {
      initial: 'นอนหงายแล้วงอเข่าลากส้นเท้าเข้าหาก้น',
      goingUp: 'งอเข่าพับส้นเท้าเข้าใกล้ลำตัวเพิ่มอีกนิด',
      peak: 'เกร็งค้างไว้ แล้วค่อยๆ เหยียดขากลับไป',
      success: 'ดีมาก! เหยียดขาราบกับเตียงเริ่มต้น'
    }
  },
  5: {
    id: 5,
    name: 'กางสะโพก',
    joint: 'hip',
    landmarksLeft: [11, 23, 25],  // Shoulder-Hip-Knee
    landmarksRight: [12, 24, 26],
    peakAngle: 45,
    type: 'DEVIATION',
    targetReps: 10,
    feedbacks: {
      initial: 'ยืนตรงแล้วค่อยๆ กางขาออกด้านข้างลำตัว',
      goingUp: 'กางขาออกด้านข้างอีกนิด โดยพยายามไม่เอียงตัว',
      peak: 'ค้างไว้ 1-2 วินาที แล้วหุบขากลับช้าๆ',
      success: 'เยี่ยม! ขากลับมาชิดในท่าเตรียม'
    }
  },
  6: {
    id: 6,
    name: 'ดึงยางยืดบริหารกล้ามเนื้อ',
    joint: 'elbow',
    landmarksLeft: [11, 13, 15],  // Shoulder-Elbow-Wrist
    landmarksRight: [12, 14, 16],
    peakAngle: 60,
    type: 'LESS_THAN',
    targetReps: 10,
    feedbacks: {
      initial: 'งอศอกออกแรงดึงยางยืดเข้าหาลำตัว',
      goingUp: 'ดึงยางเข้าหาตัวอีกนิด ออกแรงเกร็งสะบักหลัง',
      peak: 'เกร็งกล้ามเนื้อค้างไว้ครู่หนึ่ง แล้วค่อยผ่อนศอก',
      success: 'ดีมาก! เหยียดแขนกลับสู่จุดเริ่มต้นช้าๆ'
    }
  },
  7: {
    id: 7,
    name: 'ลุก-นั่งจากเก้าอี้',
    joint: 'knee',
    landmarksLeft: [23, 25, 27],  // Hip-Knee-Ankle
    landmarksRight: [24, 26, 28],
    peakAngle: 170,
    type: 'DUAL_PHASE',
    targetReps: 10,
    feedbacks: {
      initial: 'เตรียมพร้อมโดยการนั่งตัวตรงบนเก้าอี้',
      sitting: 'กำลังย่อตัวลงนั่ง... นั่งตัวลงแตะพื้นเก้าอี้เบาๆ',
      standing: 'กำลังลุกขึ้นยืน... ดันส้นเท้ายืนตัวตรงขึ้นให้สุด',
      peak: 'ยืนตรงสำเร็จ! ค้างไว้แป๊บนึง ก่อนนั่งลงช้าๆ',
      success: 'เก่งมาก! นั่งลงกลับเก้าอี้พร้อมทำรอบถัดไป'
    }
  },
  101: {
    id: 101,
    name: 'Passive Shoulder Flexion',
    joint: 'shoulder',
    landmarksLeft: [23, 11, 13],  
    landmarksRight: [24, 12, 14],
    peakAngle: 150,
    type: 'GREATER_THAN',
    targetReps: 10,
    feedbacks: {
      initial: 'ยกแขนผู้ป่วยขึ้นตรงๆ ไปด้านหน้าและเหนือศีรษะ',
      goingUp: 'ยกแขนขึ้นอีกนิดให้สุดช่วงการเคลื่อนไหว',
      peak: 'ดีมาก ประคองค้างไว้ แล้วค่อยๆ ลดแขนลง',
      success: 'เก่งมาก! กลับสู่ท่าพัก'
    }
  },
  102: {
    id: 102,
    name: 'Passive Elbow Extension',
    joint: 'elbow',
    landmarksLeft: [11, 13, 15],  
    landmarksRight: [12, 14, 16],
    peakAngle: 160,
    type: 'GREATER_THAN',
    targetReps: 10,
    feedbacks: {
      initial: 'ประคองแขนผู้ป่วยและค่อยๆ เหยียดข้อศอกออก',
      goingUp: 'เหยียดข้อศอกออกอีกนิดให้ตรงที่สุดเท่าที่ทำได้',
      peak: 'ค้างไว้สักครู่ เพื่อยืดกล้ามเนื้อที่เกร็ง',
      success: 'เยี่ยม! งอศอกกลับช้าๆ'
    }
  },
  103: {
    id: 103,
    name: 'Passive Hip & Knee Flexion',
    joint: 'knee',
    landmarksLeft: [23, 25, 27],  
    landmarksRight: [24, 26, 28],
    peakAngle: 70,
    type: 'LESS_THAN',
    targetReps: 10,
    feedbacks: {
      initial: 'ดันเข่าและสะโพกผู้ป่วยให้งอเข้าหาลำตัว',
      goingUp: 'ดันเข่าเข้าหาลำตัวอีกนิด',
      peak: 'ประคองค้างไว้ แล้วค่อยๆ เหยียดขากลับ',
      success: 'ดีมาก! เหยียดขาตรงกลับสู่ท่าพัก'
    }
  },
  104: {
    id: 104,
    name: 'Passive Ankle Dorsiflexion',
    joint: 'knee',
    landmarksLeft: [25, 27, 31],
    landmarksRight: [26, 28, 32],
    peakAngle: 100,
    type: 'LESS_THAN',
    targetReps: 10,
    feedbacks: {
      initial: 'ดันฝ่าเท้าผู้ป่วยให้กระดกขึ้น (สามารถดูจากองศาเข่าประกอบได้)',
      goingUp: 'ดันฝ่าเท้ากระดกขึ้นอีกนิด',
      peak: 'ค้างไว้เพื่อยืดเอ็นร้อยหวาย',
      success: 'ยอดเยี่ยม! ปล่อยข้อเท้ากลับสู่ท่าพัก'
    }
  }
};

export class RepCounterFSM {
  constructor(exerciseId) {
    this.config = POSE_CONFIGS[exerciseId] || POSE_CONFIGS[1];
    this.state = 'DOWN';
    this.repCount = 0;
    this.targetReps = this.config.targetReps;
    this.hasCapturedThisRep = false;
    this.shouldCapture = false;
    this.lastFeedback = this.config.feedbacks.initial;
  }

  update(rawAngle) {
    this.shouldCapture = false; // Reset flash flag for this frame

    let currentAngle = rawAngle;
    const { type, peakAngle, feedbacks } = this.config;

    if (type === 'DEVIATION') {
      currentAngle = 180 - rawAngle; // Difference from standing straight
    }

    if (type === 'DUAL_PHASE') {
      return this._updateDualPhase(currentAngle, feedbacks);
    }

    // Standard 2-State FSM (DOWN <-> PEAK)
    let isAtPeak = false;
    let isReturned = false;

    if (type === 'LESS_THAN') {
      isAtPeak = currentAngle <= peakAngle;
      // Hysteresis threshold to return to starting posture
      isReturned = currentAngle >= (peakAngle + 15);
    } else if (type === 'GREATER_THAN' || type === 'DEVIATION') {
      isAtPeak = currentAngle >= peakAngle;
      // Hysteresis threshold to return to starting posture
      isReturned = currentAngle <= Math.max(0, peakAngle - 15);
    }

    if (this.state === 'DOWN') {
      if (isAtPeak) {
        this.state = 'PEAK';
        this.lastFeedback = feedbacks.peak;
        if (!this.hasCapturedThisRep) {
          this.shouldCapture = true;
          this.hasCapturedThisRep = true;
        }
      } else {
        // Dynamic guide based on progress percentage
        let progressPct = 0;
        if (type === 'LESS_THAN') {
          // starts at ~180 (straight), goes down to peakAngle
          progressPct = (180 - currentAngle) / (180 - peakAngle);
        } else {
          // starts at ~0 (or close), goes up to peakAngle
          progressPct = currentAngle / peakAngle;
        }

        if (progressPct > 0.6) {
          this.lastFeedback = feedbacks.goingUp;
        } else {
          this.lastFeedback = feedbacks.initial;
        }
      }
    } else if (this.state === 'PEAK') {
      if (isReturned) {
        this.state = 'DOWN';
        this.repCount += 1;
        this.hasCapturedThisRep = false;
        this.lastFeedback = feedbacks.success;
      } else {
        this.lastFeedback = feedbacks.peak;
      }
    }

    return {
      repCount: this.repCount,
      state: this.state,
      feedback: this.lastFeedback,
      shouldCapture: this.shouldCapture,
      currentAngle: Math.round(currentAngle)
    };
  }

  _updateDualPhase(angle, feedbacks) {
    // Knee Angle: Sit to Stand (DUAL_PHASE)
    // DOWN: Init or sitting down
    // BOTTOM: Sitting fully down (< 100 degrees)
    // PEAK: Stood up fully (> 170 degrees)

    if (this.state === 'DOWN') {
      if (angle < 100) {
        this.state = 'BOTTOM';
        this.lastFeedback = feedbacks.sitting;
      } else {
        this.lastFeedback = feedbacks.initial;
      }
    } else if (this.state === 'BOTTOM') {
      if (angle > 170) {
        this.state = 'PEAK';
        this.repCount += 1;
        this.shouldCapture = true;
        this.lastFeedback = feedbacks.peak;
      } else if (angle > 125) {
        this.lastFeedback = feedbacks.standing;
      } else {
        this.lastFeedback = feedbacks.sitting;
      }
    } else if (this.state === 'PEAK') {
      if (angle < 130) {
        this.state = 'DOWN';
        this.hasCapturedThisRep = false;
        this.lastFeedback = feedbacks.success;
      } else {
        this.lastFeedback = feedbacks.peak;
      }
    }

    return {
      repCount: this.repCount,
      state: this.state,
      feedback: this.lastFeedback,
      shouldCapture: this.shouldCapture,
      currentAngle: Math.round(angle)
    };
  }

  reset() {
    this.state = 'DOWN';
    this.repCount = 0;
    this.hasCapturedThisRep = false;
    this.shouldCapture = false;
    this.lastFeedback = this.config.feedbacks.initial;
  }
}
