import { useRef, useEffect, useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BackendPoseCamera = ({ className }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const animationRef = useRef(null);

  const drawKeypoints = useCallback((ctx, keypoints) => {
    keypoints.forEach(kp => {
      // Only draw confident keypoints (score > 0.5)
      // If score is 0, it means YOLO didn't see it
      if (kp.score > 0.5 && kp.x > 0 && kp.y > 0) {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#10B981'; // Emerald 500
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }, []);

  const drawSkeleton = useCallback((ctx, keypoints) => {
    const kpMap = {};
    keypoints.forEach(kp => {
      kpMap[kp.name] = kp;
    });

    const connections = [
      ['Left Shoulder', 'Right Shoulder'],
      ['Left Shoulder', 'Left Elbow'],
      ['Left Elbow', 'Left Wrist'],
      ['Right Shoulder', 'Right Elbow'],
      ['Right Elbow', 'Right Wrist'],
      ['Left Shoulder', 'Left Hip'],
      ['Right Shoulder', 'Right Hip'],
      ['Left Hip', 'Right Hip'],
      ['Left Hip', 'Left Knee'],
      ['Left Knee', 'Left Ankle'],
      ['Right Hip', 'Right Knee'],
      ['Right Knee', 'Right Ankle']
    ];

    ctx.strokeStyle = '#3B82F6'; // Blue 500
    ctx.lineWidth = 4;

    connections.forEach(([p1, p2]) => {
      const point1 = kpMap[p1];
      const point2 = kpMap[p2];

      if (point1 && point2 && point1.score > 0.5 && point2.score > 0.5 && point1.x > 0 && point2.x > 0) {
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.stroke();
      }
    });
  }, []);

  const drawOverlay = useCallback((persons) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    persons.forEach(person => {
      drawSkeleton(ctx, person);
      drawKeypoints(ctx, person);
    });
  }, [drawKeypoints, drawSkeleton]);

  const sendFrameLoop = useCallback(function loop() {
    if (!videoRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const video = videoRef.current;

    // Create an offscreen canvas to extract the image
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = video.videoWidth;
    offscreenCanvas.height = video.videoHeight;
    const ctx = offscreenCanvas.getContext('2d');

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    // Convert to base64 JPEG (0.6 quality for faster transmission)
    const base64Img = offscreenCanvas.toDataURL('image/jpeg', 0.6);

    // Send to WebSocket
    wsRef.current.send(base64Img);

    // Run roughly at 15-30 FPS (using requestAnimationFrame but throttling could be added if needed)
    // We send the next frame immediately, but waiting for a response first might be better for slow networks.
    // For simplicity, we just send as fast as requestAnimationFrame allows.
    animationRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    let stream = null;

    const initCameraAndWS = async () => {
      try {
        // 1. Setup WebCam
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            connectWebSocket();
          };
        }
      } catch (err) {
        console.error('Error initializing camera:', err);
        setError('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง');
      }
    };

    const connectWebSocket = () => {
      // Connect to Python Backend WebSocket
      wsRef.current = new WebSocket(`ws://${window.location.hostname}:8000/ws/pose`);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        // Start sending frames
        sendFrameLoop();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            setError(data.error);
            return;
          }
          if (data.persons) {
            drawOverlay(data.persons);
          }
        } catch (e) {
          console.error("Error parsing websocket message", e);
        }
      };

      wsRef.current.onerror = (err) => {
        console.error('WebSocket Error:', err);
        setIsConnected(false);
        setError('ไม่สามารถเชื่อมต่อกับ Python Backend ได้ (ตรวจสอบว่าเปิดเซิร์ฟเวอร์ด้วย uvicorn หรือยัง)');
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
      };
    };

    initCameraAndWS();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [drawOverlay, sendFrameLoop]);

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-slate-900 aspect-video shadow-lg", className)}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-red-400 p-6 text-center backdrop-blur-sm">
          <AlertCircle size={48} className="mb-4" />
          <p className="font-medium text-lg">{error}</p>
        </div>
      )}

      {!error && !isConnected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white font-medium">กำลังเชื่อมต่อกับ Python Backend...</p>
        </div>
      )}

      {isConnected && !error && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs flex items-center backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          Backend Connected
        </div>
      )}
    </div>
  );
};
