import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { SKELETON_CONNECTIONS } from './exerciseData';

// MoveNet: shoulder(5/6) - elbow(7/8) - wrist(9/10)
const ARM_JOINTS = {
  left: [5, 7, 9],
  right: [6, 8, 10],
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

const drawKeypoints = (ctx, keypoints, scaleX, scaleY) => {
  if (!keypoints || keypoints.length === 0) return;

  const elbowAngles = {
    left: calcAngle(keypoints[ARM_JOINTS.left[0]], keypoints[ARM_JOINTS.left[1]], keypoints[ARM_JOINTS.left[2]]),
    right: calcAngle(keypoints[ARM_JOINTS.right[0]], keypoints[ARM_JOINTS.right[1]], keypoints[ARM_JOINTS.right[2]]),
  };

  // วาด skeleton lines
  SKELETON_CONNECTIONS.forEach(([start, end]) => {
    const s = keypoints[start];
    const e = keypoints[end];
    if (!s || !e) return;
    const sScore = s.score ?? 0;
    const eScore = e.score ?? 0;
    if (sScore < 0.2 || eScore < 0.2) return;

    ctx.strokeStyle = lineColor(sScore, eScore);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(s.x * scaleX, s.y * scaleY);
    ctx.lineTo(e.x * scaleX, e.y * scaleY);
    ctx.stroke();
  });

  // วาด keypoints (สีตาม confidence)
  keypoints.forEach((point) => {
    const score = point.score ?? 0;
    if (score < 0.2) return;

    ctx.fillStyle = jointColor(score);
    ctx.beginPath();
    ctx.arc(point.x * scaleX, point.y * scaleY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // แสดงมุมข้อศอก
  [['left', ARM_JOINTS.left[1]], ['right', ARM_JOINTS.right[1]]].forEach(([side, elbowIdx]) => {
    const kp = keypoints[elbowIdx];
    const angle = elbowAngles[side];
    if (!kp || (kp.score ?? 0) < 0.4 || angle === null) return;

    const x = kp.x * scaleX;
    const y = kp.y * scaleY;
    const label = `${angle}°`;
    ctx.font = 'bold 13px sans-serif';
    const w = ctx.measureText(label).width + 10;
    const bx = x + 12;
    const by = y - 22;

    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.roundRect(bx, by, w, 20, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, bx + 5, by + 14);
  });
};

export const ExerciseCanvas = ({ onKeypoints, onCameraReady }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const keyPointsRef = useRef([]);
  const animationRef = useRef(null);
  const drawAnimRef = useRef(null);
  const processingRef = useRef(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState('Loading model...');

  // Initialize detector and camera
  useEffect(() => {
    const initialize = async () => {
      try {
        setDetectionStatus('Loading model...');

        // บังคับ WebGL ก่อน tf.ready() เพื่อหลีกเลี่ยง WebGPU บน Windows
        await tf.setBackend('webgl');
        await tf.ready();

        // MoveNet ทำงานได้กับร่างกายบางส่วน ไม่ต้องเห็นเต็มตัว
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          }
        );
        detectorRef.current = detector;
        setDetectionStatus('Camera starting...');

        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
          onCameraReady?.(true);
        }
      } catch (error) {
        console.error('Initialize error:', error);
        setDetectionStatus('Error: ' + error.message);
        setCameraReady(false);
        onCameraReady?.(false);
      }
    };

    initialize();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (drawAnimRef.current) cancelAnimationFrame(drawAnimRef.current);
    };
  }, [onKeypoints, onCameraReady]);

  // Pose detection loop
  useEffect(() => {
    if (!cameraReady || !videoRef.current || !detectorRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const detect = async () => {
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationRef.current = requestAnimationFrame(detect);
        return;
      }

      if (!processingRef.current) {
        processingRef.current = true;

        try {
          const poses = await detectorRef.current.estimatePoses(video, { flipHorizontal: false });
          if (poses && poses[0]?.keypoints) {
            keyPointsRef.current = poses[0].keypoints;
            onKeypoints?.(poses[0].keypoints);
            setDetectionStatus('');
          } else {
            setDetectionStatus('No pose detected');
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
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (keyPointsRef.current.length > 0) {
          const scaleX = canvas.width / (video.videoWidth || canvas.width);
          const scaleY = canvas.height / (video.videoHeight || canvas.height);
          drawKeypoints(ctx, keyPointsRef.current, scaleX, scaleY);
        }
      }
      drawAnimRef.current = requestAnimationFrame(draw);
    };

    detect();
    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [cameraReady, onKeypoints]);

  const handleVideoMetadata = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        onLoadedMetadata={handleVideoMetadata}
        autoPlay
        playsInline
        muted
        className="hidden"
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-5" />

      {detectionStatus && cameraReady && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
          {detectionStatus}
        </div>
      )}

      {!cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80">
          <div className="text-center">
            <p className="text-white text-lg mb-4">Camera permission required</p>
            <p className="text-white/60 text-sm">
              Please allow access to your camera to continue
            </p>
          </div>
        </div>
      )}
    </>
  );
};
