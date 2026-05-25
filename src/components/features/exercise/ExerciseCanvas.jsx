import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import { loadYolov8Model, detectPose } from '../../../lib/yolov8';
import { Video, Sparkles } from 'lucide-react';
import { SKELETON_CONNECTIONS } from './exerciseData';

// ค่าความหน่วงสำหรับ Exponential Moving Average (EMA) เพื่อเพิ่มความเสถียร (0.0 = นิ่งสุด/หน่วงสุด, 1.0 = ตามมือถือ/สั่นสุด)
const EMA_ALPHA = 0.18;

// YOLO 12-kpt: shoulder(0/1) - elbow(2/3) - wrist(4/5)
const ARM_JOINTS = {
  left: [0, 2, 4],
  right: [1, 3, 5],
};

const calcAngle = (a, b, c) => {
  if (!a || !b || !c) return null;
  const ba = { x: a.x - b.x, y: a.y - b.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };
  const dot = ba.x * bc.x + ba.y * bc.y;
  const mag = Math.sqrt(ba.x ** 2 + ba.y ** 2) * Math.sqrt(bc.x ** 2 + bc.y ** 2);
  if (mag === 0) return null;
  return Math.round(Math.acos(Math.min(1, Math.max(-1, dot / mag))) * (180 / Math.PI));
};

const jointColor = (score) => {
  if (score >= 0.7) return '#10b981';
  if (score >= 0.4) return '#f59e0b';
  return '#ef4444';
};

const lineColor = (sScore, eScore) => {
  const avg = (sScore + eScore) / 2;
  if (avg >= 0.6) return 'rgba(16,185,129,0.75)';
  if (avg >= 0.35) return 'rgba(245,158,11,0.75)';
  return 'rgba(239,68,68,0.6)';
};

const drawKeypoints = (ctx, keypoints, scaleX, scaleY, isDangerous) => {
  if (!keypoints || keypoints.length === 0) return;

  const elbowAngles = {
    left: calcAngle(keypoints[ARM_JOINTS.left[0]], keypoints[ARM_JOINTS.left[1]], keypoints[ARM_JOINTS.left[2]]),
    right: calcAngle(keypoints[ARM_JOINTS.right[0]], keypoints[ARM_JOINTS.right[1]], keypoints[ARM_JOINTS.right[2]]),
  };

  // 1. วาดเส้นร่างกระดูก (Skeleton Connections) ให้มีความพรีเมียม นีออนเรืองแสงสองชั้น
  SKELETON_CONNECTIONS.forEach(([start, end]) => {
    const s = keypoints[start];
    const e = keypoints[end];
    if (!s || !e) return;
    const sScore = s.score ?? 0;
    const eScore = e.score ?? 0;
    if (sScore < 0.2 || eScore < 0.2) return;

    const sx = s.x * scaleX;
    const sy = s.y * scaleY;
    const ex = e.x * scaleX;
    const ey = e.y * scaleY;

    // ดึงเฉดสีพื้นฐานตามความมั่นใจของการตรวจจับ หรือบังคับแดงถ้าอันตราย
    const colorBase = isDangerous ? 'rgba(239,68,68,0.95)' : lineColor(sScore, eScore);

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // ชั้นที่ 1: เส้นเรืองแสงหนาฟุ้งอยู่ด้านหลัง (Neon Glow Effect)
    ctx.strokeStyle = colorBase;
    ctx.lineWidth = 8;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // ชั้นที่ 2: เส้นกระดูกหลักตัวจริง (Core Line) ที่คมชัด
    ctx.strokeStyle = colorBase.replace(/0\.\d+\)/, '0.9)'); // ปรับความสว่างให้เข้มข้นขึ้น
    ctx.lineWidth = 3.5;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // ชั้นที่ 3: เส้นแกนกลางเลเซอร์สีขาวสว่างคมชัด (Laser Core) เพิ่มมิติแบบ Futuristic AR
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    ctx.restore();
  });

  // 2. วาดข้อต่อ (Keypoints) สไตล์วงแหวนเรืองแสงที่เต้นตามความถี่ชีพจร (Pulse Effect)
  const time = Date.now();
  keypoints.forEach((point) => {
    const score = point.score ?? 0;
    if (score < 0.01) return; // ลดยอดชั่วคราวเพื่อเทสต์

    const px = point.x * scaleX;
    const py = point.y * scaleY;
    const baseColor = isDangerous ? '#ef4444' : jointColor(score);

    ctx.save();

    // เอฟเฟกต์วงแหวนนอกกะพริบขยายขนาดตามจังหวะเวลา (Pulse Scale 0.85 - 1.2)
    const pulse = 1.0 + 0.18 * Math.sin(time / 180);
    const outerRadius = 8.5 * pulse;

    // วงแหวนสีชั้นนอก (Glow ring)
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(px, py, outerRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // จุดแกนกลางสีขาวนวลคมกริบ (White inner core)
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, 2 * Math.PI);
    ctx.fill();

    // ขอบความกว้างสำหรับข้อต่อเพื่อความพรีเมียม
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(px, py, 4.5, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.restore();
  });

  // 3. แสดงค่าวัดองศาข้อศอกสไตล์ HUD Blueprint (Sci-Fi AR Text Callout)
  [['left', ARM_JOINTS.left[1]], ['right', ARM_JOINTS.right[1]]].forEach(([side, elbowIdx]) => {
    const kp = keypoints[elbowIdx];
    const angle = elbowAngles[side];
    if (!kp || (kp.score ?? 0) < 0.4 || angle === null) return;

    const x = kp.x * scaleX;
    const y = kp.y * scaleY;
    const label = ` ${angle}° `;
    
    ctx.save();
    
    ctx.font = 'bold 12px Inter, system-ui, -apple-system, sans-serif';
    const textMetrics = ctx.measureText(label);
    const boxW = textMetrics.width + 12;
    const boxH = 22;
    
    // ยื่นหน้าต่างออกด้านข้างเพื่อไม่ให้ทับกับสเกเลตันหลัก
    const offsetX = side === 'left' ? -boxW - 24 : 24;
    const offsetY = -28;
    
    const bx = x + offsetX;
    const by = y + offsetY;

    // เส้นชี้โยงข้อศอกไปกล่อง HUD
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(bx + (side === 'left' ? boxW : 0), by + boxH / 2);
    ctx.stroke();

    // วาดกล่อง HUD (Sleek dark background with border colored by confidence)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; // Slate 900
    ctx.strokeStyle = jointColor(kp.score);
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

    // พิมพ์ข้อความค่าน้ำหนักองศา
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, bx + 6, by + 15);
    
    ctx.restore();
  });
};

export const ExerciseCanvas = ({ onKeypoints, onCameraReady, isDangerous }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const segmenterRef = useRef(null);
  const keyPointsRef = useRef([]);
  const animationRef = useRef(null);
  const drawAnimRef = useRef(null);
  const processingRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState('Loading models...');
  const [initError, setInitError] = useState('');

  // จัดการฟิลเตอร์ฉากหลังเสมือนจริง
  const [backgroundMode, setBackgroundMode] = useState('none'); // 'none', 'blur'
  const backgroundModeRef = useRef('none');
  const segmentationRef = useRef(null);
  const maskImageDataRef = useRef(null);


  // ซิงค์สเตตของ backgroundMode กับ Ref เพื่อเลี่ยงการปิดกั้นลูปกล้อง
  useEffect(() => {
    backgroundModeRef.current = backgroundMode;
  }, [backgroundMode]);

  // Initialize detector and camera
  useEffect(() => {
    let videoElem = null;

    const initialize = async () => {
      if (cameraReady) return; // ถ้ากล้องพร้อมแล้ว แสดงว่าโมเดลโหลดเสร็จแล้ว ไม่ต้องทำซ้ำ
      
      try {
        setDetectionStatus('Loading AI models...');

        // พยายามโหลด WebGL ก่อน ถ้าไม่ได้ให้ Fallback
        try {
          await tf.setBackend('webgl');
        } catch (backendError) {
          console.warn('WebGL backend failed, using fallback.', backendError);
        }
        await tf.ready();

        // 1. โหลดโมเดลวิเคราะห์ท่วงท่ากระดูก (YOLOv8 ONNX)
        const detector = await loadYolov8Model();
        detectorRef.current = detector;

        // 2. โหลดโมเดลจำแนกส่วนบุคคล (MediaPipe Selfie Segmentation)
        const segmenter = await bodySegmentation.createSegmenter(
          bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation,
          {
            runtime: 'tfjs',
            modelType: 'general',
          }
        );
        segmenterRef.current = segmenter;

        setDetectionStatus('Initializing Camera [v3]...');

        // ดึงสตรีมวิดีโอจากกล้องเว็บแคม
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoElem = videoRef.current;
          videoElem.srcObject = stream;
          videoElem.play().catch(e => console.warn("play error", e));
          setCameraReady(true);
          onCameraReady?.(true);
        }
      } catch (error) {
        console.error('Initialize error:', error);
        setInitError(error.message || String(error));
        setDetectionStatus('Error: ' + error.message);
        setCameraReady(false);
        onCameraReady?.(false);
      }
    };

    initialize();

    return () => {
      if (videoElem?.srcObject) {
        videoElem.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (drawAnimRef.current) cancelAnimationFrame(drawAnimRef.current);
    };
  }, [cameraReady, onKeypoints, onCameraReady]);

  // Pose detection loop
  useEffect(() => {
    console.log("Pose detection useEffect triggered! cameraReady:", cameraReady, "video:", !!videoRef.current, "detector:", !!detectorRef.current, "canvas:", !!canvasRef.current);
    if (!cameraReady || !videoRef.current || !detectorRef.current || !canvasRef.current) {
      console.log("Returning early from Pose detection useEffect");
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const detect = async () => {
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        setDetectionStatus(`Waiting for video... State: ${video.readyState}`);
        animationRef.current = requestAnimationFrame(detect);
        return;
      }

      if (!processingRef.current) {
        processingRef.current = true;

        try {
          setDetectionStatus('Running ONNX inference...');
          // 1. ตรวจจับท่วงท่าร่างกาย (Pose Tracking via YOLOv8 ONNX)
          const poses = await detectPose(detectorRef.current, video);
          setDetectionStatus('ONNX inference done.');
          
          if (poses && poses.length > 0 && poses[0]?.keypoints) {
            const rawKeypoints = poses[0].keypoints;

            // ใช้ค่าเฉลี่ยคลื่นเคลื่อนที่ (Exponential Moving Average - EMA) ช่วยลดอาการสั่นและกระตุกของเส้นกระดูก
            if (keyPointsRef.current && keyPointsRef.current.length === rawKeypoints.length) {
              const smoothedKeypoints = rawKeypoints.map((kp, idx) => {
                const prev = keyPointsRef.current[idx];
                // ดึงพิกัดเฉลี่ยเฉพาะถ้าคีย์พอยต์ก่อนหน้านี้มีข้อมูล
                if (prev && kp.score > 0.1) {
                  return {
                    ...kp,
                    x: prev.x + EMA_ALPHA * (kp.x - prev.x),
                    y: prev.y + EMA_ALPHA * (kp.y - prev.y),
                    // ปรับค่า score ให้อ่านต่อกันเรียบเนียนยิ่งขึ้น
                    score: prev.score + EMA_ALPHA * (kp.score - prev.score),
                  };
                }
                return kp;
              });
              keyPointsRef.current = smoothedKeypoints;
              
              // Throttle การส่งข้อมูลกลับไปที่หน้าหลัก (10 FPS) เพื่อลดภาระ React Re-render
              const now = performance.now();
              if (now - lastUpdateTimeRef.current > 100) {
                onKeypoints?.(smoothedKeypoints);
                lastUpdateTimeRef.current = now;
              }
            } else {
              keyPointsRef.current = rawKeypoints;
              const now = performance.now();
              if (now - lastUpdateTimeRef.current > 100) {
                onKeypoints?.(rawKeypoints);
                lastUpdateTimeRef.current = now;
              }
            }
            setDetectionStatus('');
          } else {
            setDetectionStatus('No pose detected');
          }

          // 2. ตรวจจับแยกส่วนบุคคล (Body Segmentation) เมื่อเปิดใช้งานตัวเลือกเบลอหรือฉากหลังจำลอง
          const currentMode = backgroundModeRef.current;
          if (segmenterRef.current && (currentMode === 'blur')) {
            const segmentation = await segmenterRef.current.segmentPeople(video);
            if (segmentation && segmentation.length > 0) {
              segmentationRef.current = segmentation;
              maskImageDataRef.current = null;
            }
          } else {
            segmentationRef.current = null;
            maskImageDataRef.current = null;
          }

        } catch (err) {
          console.error('Detection error:', err);
          setDetectionStatus('Detection error: ' + err.message);
        }

        processingRef.current = false;
      }

      animationRef.current = requestAnimationFrame(detect);
    };

    const draw = () => {
      const ctx = canvas.getContext('2d');
      if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
        const mode = backgroundModeRef.current;
        const width = canvas.width;
        const height = canvas.height;

        if (mode === 'blur' && segmentationRef.current && segmenterRef.current) {
          // โหมด A: เบลอฉากหลังโดยใช้ GPU-Accelerated drawBokehEffect ของโมเดลตรงๆ
          try {
            bodySegmentation.drawBokehEffect(
              canvas,
              video,
              segmentationRef.current,
              12,    // backgroundBlurAmount (ความเบลอ 1-20)
              3,     // edgeBlurAmount (ความกว้างขอบฟุ้ง 0-20)
              false  // flipHorizontal
            );
          } catch (err) {
            console.error('Error drawing bokeh:', err);
            ctx.drawImage(video, 0, 0, width, height);
          }
        } else {
          // โหมด C: แสดงวิดีโอปกติไร้การตกแต่งพื้นหลัง
          ctx.drawImage(video, 0, 0, width, height);
        }

        // วาดทับโครงร่างเส้นกระดูกข้อต่อเรืองแสง HUD ในเฟรมล่าสุด
        if (keyPointsRef.current.length > 0) {
          const scaleX = width / (video.videoWidth || width);
          const scaleY = height / (video.videoHeight || height);
          drawKeypoints(ctx, keyPointsRef.current, scaleX, scaleY, isDangerous);
        }
      }
      drawAnimRef.current = requestAnimationFrame(draw);
    };

    detect();
    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [cameraReady, onKeypoints, isDangerous]);

  const handleVideoMetadata = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  };

  return (
    <>
      {/* แสดงวิดีโออยู่หลังสุดเสมอ */}
      <video
        ref={videoRef}
        onLoadedMetadata={handleVideoMetadata}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Canvas สำหรับวาดเส้นกระดูกซ้อนทับวิดีโอ */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-10" />

      {/* แผงควบคุมฟิลเตอร์ฉากหลัง ลอยเหนือภาพกล้องแนว Glassmorphism */}
      {cameraReady && (
        <div className="absolute top-6 right-6 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-2xl text-white select-none transition-all duration-300 hover:border-white/20">
          <button
            onClick={() => setBackgroundMode('none')}
            title="Original Camera"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              backgroundMode === 'none'
                ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20'
                : 'hover:bg-white/5 text-slate-300'
            }`}
          >
            <Video size={14} />
            <span>กล้องปกติ</span>
          </button>
          
          <button
            onClick={() => setBackgroundMode('blur')}
            title="Background Blur"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              backgroundMode === 'blur'
                ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20'
                : 'hover:bg-white/5 text-slate-300'
            }`}
          >
            <Sparkles size={14} />
            <span>เบลอพื้นหลัง</span>
          </button>
        </div>
      )}

      {detectionStatus && cameraReady && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
          {detectionStatus}
        </div>
      )}

      {!cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/90 p-6 text-center">
          <div className="max-w-md p-6 rounded-3xl bg-slate-900/95 border border-white/10 backdrop-blur-lg shadow-2xl text-white">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-500 animate-pulse">
              <Video size={24} />
            </div>
            <p className="text-rose-400 font-bold text-lg mb-2">กล้องหรือระบบ AI ขัดข้อง</p>
            
            {/* คำอธิบายแบบเจาะลึกตามประเภทของ Error */}
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
              ) : initError.includes('fetch') || initError.includes('solutionPath') || initError.includes('SelfieSegmentation') ? (
                <span>
                  <strong>โหลดโมเดลจำแนกตัวบุคคล (AI) ไม่สำเร็จ:</strong><br />
                  ระบบไม่สามารถดาวน์โหลดส่วนประกอบสำหรับเบลอพื้นหลังจาก CDN ได้เนื่องจากสัญญาณเน็ตขัดข้อง หรือ URL ถูกปิดกั้น <br />
                  <span className="text-slate-400 text-xs mt-2 block">กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตครับ</span>
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
