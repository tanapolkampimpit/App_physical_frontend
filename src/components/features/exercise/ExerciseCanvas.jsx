import { useEffect, useRef, useState } from 'react';
import { Video } from 'lucide-react';
import { initializePose } from '@/lib/mediapipePose';
import { createLandmarkFilters } from '@/lib/oneEuroFilter';
import { POSE_CONFIGS } from '@/lib/repCounterFSM';
import { calculateAngle } from '@/lib/angleCalculation';
import { SKELETON_CONNECTIONS } from './exerciseData';

const Camera = window.Camera;

const jointColor = (score) => {
  if (score >= 0.75) return '#10b981'; // Stable Green
  if (score >= 0.5) return '#f59e0b';  // Jittery/Low confidence Orange
  return '#ef4444';                    // Unstable Red
};

const lineColor = (sScore, eScore) => {
  const avg = (sScore + eScore) / 2;
  if (avg >= 0.7) return 'rgba(16, 185, 129, 0.75)';
  if (avg >= 0.5) return 'rgba(245, 158, 11, 0.75)';
  return 'rgba(239, 68, 68, 0.6)';
};

const drawKeypoints = (ctx, keypoints, scaleX, scaleY, isDangerous, exerciseId) => {
  if (!keypoints || keypoints.length === 0) return;

  // 1. Draw Skeleton Connections with Neon Glow
  SKELETON_CONNECTIONS.forEach(([start, end]) => {
    const s = keypoints[start];
    const e = keypoints[end];
    if (!s || !e) return;
    
    // MediaPipe uses .visibility (or .score in some systems, we default to .visibility)
    const sScore = s.visibility ?? 1.0;
    const eScore = e.visibility ?? 1.0;
    if (sScore < 0.45 || eScore < 0.45) return;

    const sx = s.x * scaleX;
    const sy = s.y * scaleY;
    const ex = e.x * scaleX;
    const ey = e.y * scaleY;

    const colorBase = isDangerous ? 'rgba(239, 68, 68, 0.95)' : lineColor(sScore, eScore);

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Layer 1: Thick glowing background line (Neon Glow)
    ctx.strokeStyle = colorBase;
    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Layer 2: Main core line
    ctx.strokeStyle = colorBase.replace(/0\.\d+\)/, '0.9)');
    ctx.lineWidth = 3.5;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Layer 3: Laser core white highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    ctx.restore();
  });

  // 2. Draw Keypoints with Pulse Effect
  const time = Date.now();
  keypoints.forEach((point) => {
    const score = point.visibility ?? 1.0;
    if (score < 0.45) return;

    const px = point.x * scaleX;
    const py = point.y * scaleY;
    const baseColor = isDangerous ? '#ef4444' : jointColor(score);

    ctx.save();

    // Outer glow ring pulsating over time
    const pulse = 1.0 + 0.18 * Math.sin(time / 180);
    const outerRadius = 8.5 * pulse;

    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(px, py, outerRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Inner white core
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, 2 * Math.PI);
    ctx.fill();

    // Joint outline
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.restore();
  });

  // 3. Draw HUD Angle callout overlay for the specific active joint
  const config = POSE_CONFIGS[exerciseId];
  if (config) {
    const jointsToDraw = [
      { side: 'left', indices: config.landmarksLeft },
      { side: 'right', indices: config.landmarksRight }
    ];

    jointsToDraw.forEach(({ side, indices }) => {
      const [idxA, idxB, idxC] = indices;
      const kpA = keypoints[idxA];
      const kpB = keypoints[idxB]; // Joint pivot
      const kpC = keypoints[idxC];

      if (!kpA || !kpB || !kpC) return;

      const scoreA = kpA.visibility ?? 1.0;
      const scoreB = kpB.visibility ?? 1.0;
      const scoreC = kpC.visibility ?? 1.0;
      const jointVisibility = Math.min(scoreA, scoreB, scoreC);

      // Only display if key joints are visible
      if (jointVisibility < 0.45) return;

      let rawAngle = calculateAngle(kpA, kpB, kpC);
      let angle = rawAngle;
      if (config.type === 'DEVIATION') {
        angle = 180 - rawAngle; // e.g., hip abduction
      }

      const x = kpB.x * scaleX;
      const y = kpB.y * scaleY;
      const label = ` ${Math.round(angle)}° `;

      ctx.save();
      ctx.font = 'bold 12px Inter, system-ui, -apple-system, sans-serif';
      const textMetrics = ctx.measureText(label);
      const boxW = textMetrics.width + 12;
      const boxH = 22;

      // Position callout offset based on side
      const offsetX = side === 'left' ? -boxW - 24 : 24;
      const offsetY = -28;

      const bx = x + offsetX;
      const by = y + offsetY;

      // Sci-fi connecting line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(bx + (side === 'left' ? boxW : 0), by + boxH / 2);
      ctx.stroke();

      // HUD box panel
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = jointColor(jointVisibility);
      ctx.lineWidth = 1.5;
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 8;

      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(bx, by, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.rect(bx, by, boxW, boxH);
        ctx.fill();
        ctx.stroke();
      }
      
      ctx.shadowBlur = 0;

      // Text value
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, bx + 6, by + 15);

      ctx.restore();
    });
  }
};

export const ExerciseCanvas = ({ onKeypoints, onCameraReady, isDangerous, exerciseId }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  const filterSetRef = useRef(null);
  const keyPointsRef = useRef([]);
  const drawAnimRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState('กำลังเริ่มโมเดล AI...');
  const [initError, setInitError] = useState('');

  const onCameraReadyRef = useRef(onCameraReady);
  const onKeypointsRef = useRef(onKeypoints);

  useEffect(() => {
    onCameraReadyRef.current = onCameraReady;
  }, [onCameraReady]);

  useEffect(() => {
    onKeypointsRef.current = onKeypoints;
  }, [onKeypoints]);

  useEffect(() => {
    let active = true;

    // Create adaptive filter set for 33 landmarks
    filterSetRef.current = createLandmarkFilters(33);

    const onResults = (results) => {
      if (!active) return;

      if (results && results.poseLandmarks) {
        // Smooth landmarks to eliminate jitter
        const smoothed = filterSetRef.current.filter(results.poseLandmarks);
        keyPointsRef.current = smoothed;

        // Propagate smoothed points
        onKeypointsRef.current?.(smoothed);
        setDetectionStatus('');
      } else {
        setDetectionStatus('กำลังสแกนหาตัวตนผู้ใช้ในตำแหน่งที่ระบุ...');
      }
    };

    const initialize = async () => {
      try {
        setDetectionStatus('กำลังดาวน์โหลดโมเดลวิเคราะห์พฤติกรรมท่าทาง...');

        // Initialize MediaPipe Pose engine
        const pose = initializePose(onResults);
        poseRef.current = pose;

        // Open user webcam
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (!active) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            if (!active) return;
            videoRef.current.play().catch(e => console.warn('Play error:', e));

            // Start camera utils pipeline
            const camera = new Camera(videoRef.current, {
              onFrame: async () => {
                if (videoRef.current && poseRef.current) {
                  try {
                    await poseRef.current.send({ image: videoRef.current });
                  } catch (err) {
                    console.error('MediaPipe frame processing failed:', err);
                  }
                }
              },
              width: 1280,
              height: 720
            });
            cameraRef.current = camera;
            camera.start();

            setCameraReady(true);
            onCameraReadyRef.current?.(true);
          };
        }
      } catch (err) {
        console.error('MediaPipe Init Error:', err);
        if (active) {
          setInitError(err.message || String(err));
          setDetectionStatus('ระบบเปิดกล้องล้มเหลว');
          setCameraReady(false);
          onCameraReadyRef.current?.(false);
        }
      }
    };

    initialize();

    // Canvas rendering loop
    const draw = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas?.getContext('2d');

      if (ctx && canvas && video && video.readyState === video.HAVE_ENOUGH_DATA) {
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }

        // Draw camera frame directly to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Draw skeleton overlays
        if (keyPointsRef.current && keyPointsRef.current.length > 0) {
          const scaleX = canvas.width;
          const scaleY = canvas.height;
          drawKeypoints(ctx, keyPointsRef.current, scaleX, scaleY, isDangerous, exerciseId);
        }
      }

      drawAnimRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      active = false;
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (cameraRef.current) {
        try {
          cameraRef.current.stop();
        } catch (e) {
          console.warn('Camera stop error:', e);
        }
      }
      if (poseRef.current) {
        try {
          poseRef.current.close();
        } catch (e) {
          console.warn('Pose close error:', e);
        }
      }
      if (drawAnimRef.current) {
        cancelAnimationFrame(drawAnimRef.current);
      }
    };
  }, [isDangerous, exerciseId]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <canvas
        id="mediapipe-canvas"
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-10"
      />
      {detectionStatus && cameraReady && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm font-sans">
          {detectionStatus}
        </div>
      )}
      {!cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/90 p-6 text-center font-sans">
          <div className="max-w-md p-6 rounded-3xl bg-slate-900/95 border border-white/10 backdrop-blur-lg shadow-2xl text-white">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-500 animate-pulse">
              <Video size={24} />
            </div>
            <p className="text-rose-400 font-bold text-lg mb-2">กล้องหรือระบบ AI ขัดข้อง</p>
            <p className="text-white/80 text-sm mb-4 leading-relaxed">
              {initError.includes('undefined') || !navigator.mediaDevices ? (
                <span>
                  <strong>ตรวจพบการเชื่อมต่อแบบไม่ปลอดภัย (Insecure Context):</strong><br />
                  เบราว์เซอร์บล็อกการเข้าถึงกล้องเนื่องจากคุณเปิดเว็บผ่าน IP Address หรือ HTTP ปกติ <br />
                  <span className="text-blue-400 mt-2 block font-semibold">กรุณาเข้าใช้งานผ่าน http://localhost:3000 หรือใช้โปรโตคอล HTTPS เพื่อความปลอดภัยครับ</span>
                </span>
              ) : initError.includes('NotAllowedError') || initError.includes('Permission') || initError.includes('denied') ? (
                <span>
                  <strong>การเข้าถึงกล้องถูกปฏิเสธ:</strong><br />
                  กรุณากดอนุญาตสิทธิ์การเข้าใช้งานกล้อง (Camera Permission) ในแถบที่อยู่เว็บ (Address Bar) ของเบราว์เซอร์ แล้วทำการรีเฟรชหน้าใหม่อีกครั้ง
                </span>
              ) : (
                <span>
                  เกิดข้อผิดพลาดในการตั้งค่าระบบกล้องหรือวิเคราะห์ท่าทาง AI <br />
                  <span className="text-slate-400 text-xs mt-2 block">รายละเอียด: {initError || 'กรุณาอนุญาตสิทธิ์เข้าใช้กล้องในเบราว์เซอร์'}</span>
                </span>
              )}
            </p>
            {initError && (
              <div className="text-left text-white/40 text-xs font-mono bg-black/40 p-3 rounded-xl border border-white/5 break-all max-h-32 overflow-y-auto">
                <span className="text-rose-500/80 font-bold">Error Details:</span><br />
                {initError}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
