import { BackendPoseCamera } from '../components/features/BackendPoseCamera';

export const PoseTest = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Backend Pose Model Test</h1>
        <BackendPoseCamera />
        <p className="text-slate-400 text-center text-sm mt-6">
          ระบบนี้จะตรวจจับท่าทาง (Pose) โดยส่งภาพไปประมวลผลที่ Python Backend (FastAPI + YOLOv8)<br/>
          (โปรดจำไว้ว่าต้องเปิดรัน Backend ด้วย `uvicorn main:app --reload` ที่โฟลเดอร์ Backend)
        </p>
      </div>
    </div>
  );
};
