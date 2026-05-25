// Stub สำหรับ @mediapipe/selfie_segmentation เพื่อแก้ไขปัญหามัดรวม (Bundling) ของ Vite
// เนื่องจากโมเดลของ MediaPipe มีการเข้ารหัสและระบบ Export ที่ Vite/Rolldown ตรวจสอบไม่พบในตอนคอมไพล์
// เราจึงเลี่ยงด้วยการใช้ Factory Constructor เพื่อดีเลย์การเรียกไปยัง window.SelfieSegmentation ในตอนรันไทม์จริง

let globalSelfieInstance = null;

export const SelfieSegmentation = class {
  constructor(config) {
    if (typeof window !== 'undefined' && window.SelfieSegmentation) {
      if (!globalSelfieInstance) {
        globalSelfieInstance = new window.SelfieSegmentation(config);
      }
      this.realInstance = globalSelfieInstance;
    } else {
      console.warn('SelfieSegmentation global not found, using stub class.');
    }
  }

  setOptions(options) {
    if (this.realInstance) {
      this.realInstance.setOptions(options);
    } else {
      console.warn('Stub SelfieSegmentation.setOptions called with:', options);
    }
  }

  onResults(callback) {
    if (this.realInstance) {
      this.realInstance.onResults(callback);
    } else {
      console.warn('Stub SelfieSegmentation.onResults called.', callback);
    }
  }

  async send(image) {
    if (this.realInstance) {
      return this.realInstance.send(image);
    } else {
      console.warn('Stub SelfieSegmentation.send called.', image);
    }
  }

  async close() {
    console.log('SelfieSegmentation.close() bypassed to keep WASM instance warm.');
    return Promise.resolve();
  }
};

export default { SelfieSegmentation };
