import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { speakThai } from '../../../utils/speak';
import { exerciseInstructions } from './exerciseData';

// SVG motion arrows for each exercise
const MotionArrowOverlay = ({ exerciseId }) => {
  switch (Number(exerciseId)) {
    case 1: // Shoulder Rotation
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#39FF14" />
            </marker>
          </defs>
          {/* Circular arrows around shoulders */}
          <path d="M 120,150 A 40,40 0 1,1 150,120" fill="none" stroke="#39FF14" strokeWidth="4" strokeDasharray="5,5" markerEnd="url(#arrow)" />
          <path d="M 280,150 A 40,40 0 1,0 250,120" fill="none" stroke="#39FF14" strokeWidth="4" strokeDasharray="5,5" markerEnd="url(#arrow)" />
        </svg>
      );
    case 2: // Overhead Raise
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#39FF14" />
            </marker>
          </defs>
          {/* Straight arrows pointing up from shoulder to overhead */}
          <line x1="120" y1="180" x2="120" y2="60" stroke="#39FF14" strokeWidth="5" markerEnd="url(#arrow)" />
          <line x1="280" y1="180" x2="280" y2="60" stroke="#39FF14" strokeWidth="5" markerEnd="url(#arrow)" />
        </svg>
      );
    case 3: // Seated Knee Extension
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#39FF14" />
            </marker>
          </defs>
          {/* Forward curved arrow showing leg extension */}
          <path d="M 180,240 Q 240,240 280,200" fill="none" stroke="#39FF14" strokeWidth="5" markerEnd="url(#arrow)" />
        </svg>
      );
    case 4: // Lying Knee Flexion
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#39FF14" />
            </marker>
          </defs>
          {/* Folded leg backward curved arrow */}
          <path d="M 280,250 Q 220,200 170,240" fill="none" stroke="#39FF14" strokeWidth="5" markerEnd="url(#arrow)" />
        </svg>
      );
    case 5: // Hip Abduction
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#39FF14" />
            </marker>
          </defs>
          {/* Outward side leg raise arrow */}
          <path d="M 200,280 Q 260,270 290,240" fill="none" stroke="#39FF14" strokeWidth="5" markerEnd="url(#arrow)" />
        </svg>
      );
    case 6: // Band Pull
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#39FF14" />
            </marker>
          </defs>
          {/* Pull back horizontal arrows */}
          <line x1="100" y1="180" x2="160" y2="180" stroke="#39FF14" strokeWidth="5" markerEnd="url(#arrow)" />
          <line x1="300" y1="180" x2="240" y2="180" stroke="#39FF14" strokeWidth="5" markerEnd="url(#arrow)" />
        </svg>
      );
    case 7: // Sit to Stand
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#39FF14" />
            </marker>
          </defs>
          {/* Up and down straight arrows */}
          <path d="M 200,160 L 200,260" stroke="#39FF14" strokeWidth="4" strokeDasharray="4,4" />
          <line x1="200" y1="200" x2="200" y2="140" stroke="#39FF14" strokeWidth="5" markerEnd="url(#arrow)" />
          <line x1="200" y1="220" x2="200" y2="280" stroke="#39FF14" strokeWidth="5" markerEnd="url(#arrow)" />
        </svg>
      );
    default:
      return null;
  }
};

export const ExerciseDemoOverlay = ({ exercise, exerciseImage, peakAngle, targetReps, onComplete }) => {
  const [countdown, setCountdown] = useState(5);
  const info = exerciseInstructions[exercise.id];

  useEffect(() => {
    // Speak Thai exercise instructions on load
    if (exercise) {
      const targetText = exercise.id === 5 
        ? `เป้าหมายองศากางสะโพก สี่สิบห้า องศา` 
        : exercise.id === 7
        ? `ลุกขึ้นยืนตรง และ นั่งลงกลับเก้าอี้`
        : `เป้าหมายมุมข้อต่อคือ ${peakAngle} องศา`;

      const speechText = `เตรียมพร้อมออกกำลังกายท่า ${exercise.title}. ${info?.description || ''}. ${targetText}. จำนวน ${targetReps} ครั้ง. กรุณาหันหน้าเข้าหากล้องใน 5 วินาทีครับ`;
      speakThai(speechText);
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exercise, peakAngle, targetReps, onComplete, info]);

  // Circular progress calculations
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (countdown / 5) * circumference;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6 font-sans">
      <div className="w-full max-w-lg rounded-3xl p-6 bg-slate-900/90 border border-white/10 shadow-2xl flex flex-col items-center text-center">
        
        {/* Header Title */}
        <h2 className="text-white text-2xl font-black mb-1">{exercise.title}</h2>
        <span className="text-slate-400 text-sm font-semibold tracking-wide uppercase mb-6">{exercise.titleEn}</span>

        {/* Demo Image and Arrow Overlay */}
        <div className="relative w-72 h-72 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center mb-6">
          <img 
            src={exerciseImage} 
            alt={exercise.title} 
            className="w-full h-full object-contain opacity-90"
          />
          {/* Action guidance arrow overlay */}
          <MotionArrowOverlay exerciseId={exercise.id} />
        </div>

        {/* Targets & Goals */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="block text-slate-400 text-xs font-semibold mb-1">เป้าหมายมุม</span>
            <span className="text-lime-400 font-extrabold text-xl">
              {exercise.id === 5 ? 'กางสะโพก 45°' : `${peakAngle}°`}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <span className="block text-slate-400 text-xs font-semibold mb-1">จำนวนเป้าหมาย</span>
            <span className="text-lime-400 font-extrabold text-xl">{targetReps} ครั้ง</span>
          </div>
        </div>

        {/* Circular Countdown Panel */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            <motion.circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-lime-500"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </svg>
          <span className="absolute text-white font-black text-3xl">{countdown}</span>
        </div>

        <p className="text-slate-300 font-medium text-sm animate-pulse">
          กรุณาหันหน้าตรงให้อยู่ในกรอบกล้องและยืนเตรียมพร้อม...
        </p>
      </div>
    </div>
  );
};
