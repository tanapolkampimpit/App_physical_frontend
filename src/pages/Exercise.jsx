import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CircleHelp, TriangleAlert } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockPrograms, exerciseInstructions } from '../components/features/exercise/exerciseData';
import { ExerciseCanvas } from '../components/features/exercise/ExerciseCanvas';
import { ExerciseTopBar } from '../components/features/exercise/ExerciseTopBar';
import { ExerciseMetricsPanel } from '../components/features/exercise/ExerciseMetricsPanel';
import { ExerciseFeedbackBar } from '../components/features/exercise/ExerciseFeedbackBar';
import { usePoseAnalysis } from '../hooks/usePoseAnalysis';
import { useSettings } from '../contexts/SettingsContext';
import { speakThai, cancelSpeech } from '../utils/speak';
import { ExerciseDemoOverlay } from '../components/features/exercise/ExerciseDemoOverlay';
import { POSE_CONFIGS } from '../lib/repCounterFSM';

// Import exercise images
import shoulderRotationImg from '../assets/shoulder_rotation.png';
import overheadRaiseImg from '../assets/overhead_raise.png';
import seatedKneeExtImg from '../assets/seated_knee_ext.png';
import lyingKneeFlexImg from '../assets/lying_knee_flex.png';
import hipAbductionImg from '../assets/hip_abduction.png';
import bandPullImg from '../assets/band_pull.png';
import sitToStandImg from '../assets/sit_to_stand.png';

const EXERCISE_IMAGES = {
  1: shoulderRotationImg,
  2: overheadRaiseImg,
  3: seatedKneeExtImg,
  4: lyingKneeFlexImg,
  5: hipAbductionImg,
  6: bandPullImg,
  7: sitToStandImg
};

/* ── Instruction overlay ─────────────────────────── */
const InstructionOverlay = ({ info, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-md font-sans"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-t-[28px] p-6 max-h-[75vh] overflow-y-auto bg-[#0f0f0f]/95 border border-white/10"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-black text-xl tracking-tight">วิธีทำท่า</h2>
          <button
            onClick={onClose}
            className="bg-white/10 p-2 rounded-full text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <ol className="space-y-3 mb-5">
          {info.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center mt-0.5"
                style={{ background: 'rgba(57,255,20,0.18)', color: '#39FF14' }}
              >
                {i + 1}
              </span>
              <p className="text-white/80 text-sm leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl p-4 bg-orange-400/10 border border-orange-400/25">
          <div className="flex items-center gap-2 mb-2">
            <TriangleAlert size={14} className="text-amber-400" />
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wide">ข้อควรระวัง</span>
          </div>
          <ul className="space-y-1">
            {info.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-amber-200/75 text-xs">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ── Main page ───────────────────────────────────── */
export const Exercise = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const exerciseId = parseInt(id) || 1;

  const exercise = mockPrograms.find((p) => p.id === exerciseId) ?? { title: 'Exercise', titleEn: 'Physiotherapy' };
  const info = exerciseInstructions[exerciseId];
  const poseConfig = POSE_CONFIGS[exerciseId];

  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('demo'); // 'demo' | 'active'
  const [keypoints, setKeypoints] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);

  const { settings } = useSettings();

  const {
    feedback,
    currentAngle,
    repCount,
    targetReps,
    fsmState,
    shouldCapture,
    activeSide,
    isDangerous
  } = usePoseAnalysis(keypoints, exerciseId);

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, []);

  // Trigger TTS voice when entering the active phase
  useEffect(() => {
    if (phase === 'active' && settings.aiVoice) {
      speakThai(`พร้อมแล้ว เริ่ม ${exercise.title} ได้เลยครับ`);
    }
  }, [phase, exercise.title, settings.aiVoice]);

  // Track active duration
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  // Capture peak image screenshot when triggered by FSM
  useEffect(() => {
    if (shouldCapture && phase === 'active') {
      const canvas = document.getElementById("mediapipe-canvas");
      if (canvas) {
        try {
          const imageSrc = canvas.toDataURL("image/jpeg", 0.75);
          setCapturedImages((prev) => [
            ...prev,
            {
              pose: exercise.title,
              rep: repCount,
              imageSrc,
              angle: currentAngle,
              timestamp: Date.now()
            }
          ]);
        } catch (err) {
          console.error("Screenshot capture failed:", err);
        }
      }
    }
  }, [shouldCapture, phase, repCount, currentAngle, exercise.title]);

  const handleStop = () => {
    setIsRunning(false);
    const mins = Math.floor(seconds / 60);
    const s = seconds % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    setTimeout(() => {
      navigate(`/report/${exerciseId}`, {
        state: {
          duration: timeStr,
          reps: repCount,
          targetReps: targetReps,
          capturedImages: capturedImages
        }
      });
    }, 400);
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden text-white font-sans">
      {/* MediaPipe Camera Canvas */}
      <ExerciseCanvas 
        onKeypoints={setKeypoints} 
        isDangerous={isDangerous} 
        exerciseId={exerciseId} 
      />

      {/* Scrim overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.65) 100%)',
          zIndex: 2
        }}
      />

      {/* Exercise Demo Countdown Overlay */}
      {phase === 'demo' && (
        <ExerciseDemoOverlay
          exercise={exercise}
          exerciseImage={EXERCISE_IMAGES[exerciseId]}
          peakAngle={poseConfig?.peakAngle ?? 90}
          targetReps={poseConfig?.targetReps ?? 10}
          onComplete={() => {
            setPhase('active');
            setIsRunning(true);
          }}
        />
      )}

      {/* Interface overlay */}
      <main className="absolute inset-0 flex flex-col p-5 gap-0" style={{ zIndex: 10 }}>
        {/* Top bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <ExerciseTopBar title={exercise.title} />
          </div>
          {/* Help button */}
          {info && (
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setShowInstructions(true)}
              className="bg-black/45 p-3 rounded-full flex-shrink-0 backdrop-blur-xl border border-white/10"
            >
              <CircleHelp size={22} className="text-white" />
            </motion.button>
          )}
        </div>

        {/* Dynamic metrics panel */}
        <div className="flex items-start gap-3 mt-2">
          <ExerciseMetricsPanel 
            repCount={repCount} 
            targetReps={targetReps}
            currentAngle={currentAngle}
            peakAngle={poseConfig?.peakAngle ?? 90}
            formattedTime={formattedTime} 
          />
        </div>

        {/* Spacer */}
        <div className="flex-1 relative">
          {/* Small PiP Tutorial Window */}
          {phase === 'active' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="absolute top-4 right-0 w-28 lg:w-36 aspect-square bg-slate-900 rounded-2xl border-2 border-white/20 shadow-2xl overflow-hidden z-20 flex items-center justify-center"
            >
              <img 
                src={EXERCISE_IMAGES[exerciseId]} 
                alt="Tutorial" 
                className="w-full h-full object-contain opacity-90"
              />
              <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ตัวอย่าง
              </div>
            </motion.div>
          )}
        </div>

        {/* Coach coaching bar + Stop Button */}
        <div className="flex flex-col gap-4">
          <ExerciseFeedbackBar 
            feedback={feedback} 
            progress={(repCount / targetReps) * 100} 
            isDangerous={isDangerous} 
            fsmState={fsmState}
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleStop}
            className="w-full py-5 rounded-[20px] text-xl font-black uppercase tracking-widest transition-all bg-rose-500 shadow-[0_10px_32px_rgba(244,63,94,0.42)]"
          >
            จบการออกกำลังกาย
          </motion.button>
        </div>
      </main>

      {/* Instructions slide overlay */}
      {showInstructions && info && (
        <InstructionOverlay info={info} onClose={() => setShowInstructions(false)} />
      )}
    </div>
  );
};
