import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CircleHelp, TriangleAlert, ArrowLeftRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockPrograms, exerciseInstructions } from '../components/features/exercise/exerciseData';
import { ExerciseCanvas } from '../components/features/exercise/ExerciseCanvas';
import { ExerciseTopBar } from '../components/features/exercise/ExerciseTopBar';
import { ExerciseMetricsPanel } from '../components/features/exercise/ExerciseMetricsPanel';
import { ExerciseFeedbackBar } from '../components/features/exercise/ExerciseFeedbackBar';
import { usePoseAnalysis } from '../hooks/usePoseAnalysis';
import { useSettings } from '../contexts/SettingsContext';


/* ── Instruction overlay ─────────────────────────── */
const InstructionOverlay = ({ info, onClose }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-t-[28px] p-6 max-h-[75vh] overflow-y-auto"
        style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.12)' }}
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

        <div className="rounded-2xl p-4" style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.25)' }}>
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

/* ── Active Arm badge ────────────────────────────── */
const ARM_LABEL = { left: 'แขนซ้าย', right: 'แขนขวา', both: 'สองแขน', none: '-' };

const ArmBadge = ({ activeArm }) => {
  if (activeArm === 'none') return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      <ArrowLeftRight size={12} className="text-white/50" />
      <span className="text-xs font-bold text-white/80">{ARM_LABEL[activeArm]}</span>
    </motion.div>
  );
};

/* ── Main page ───────────────────────────────────── */
export const Exercise = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const exercise = mockPrograms.find((p) => p.id === parseInt(id)) ?? { title: 'Exercise' };
  const info = exerciseInstructions[parseInt(id)];

  const [reps] = useState(8);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [keypoints, setKeypoints] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const { feedback, accuracy, activeArm } = usePoseAnalysis(keypoints);
  const progress = accuracy;
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.aiVoice && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(`Are you ready? Prepare for ${exercise.title} in 3... 2... 1... Go!`);
      msg.lang = 'en-US';
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
    }
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [exercise.title, settings.aiVoice]);



  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStop = () => {
    setIsRunning(false);
    setTimeout(() => navigate('/report/1'), 400);
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden text-white">
      {/* Camera canvas */}
      <ExerciseCanvas onKeypoints={setKeypoints} />

      {/* Gradient overlay (top + bottom scrim) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.65) 100%)', zIndex: 2 }}
      />

      {/* Interface layer */}
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
              className="bg-black/45 p-3 rounded-full flex-shrink-0"
              style={{ backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <CircleHelp size={22} className="text-white" />
            </motion.button>
          )}
        </div>

        {/* Left metrics */}
        <div className="flex items-start gap-3 mt-2">
          <ExerciseMetricsPanel reps={reps} formattedTime={formattedTime} accuracy={accuracy} />
          {/* Arm badge floats next to metrics */}
          <div className="mt-1">
            <ArmBadge activeArm={activeArm} />
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom: Coaching + Stop */}
        <div className="flex flex-col gap-4">
          <ExerciseFeedbackBar feedback={feedback} progress={progress} />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleStop}
            className="w-full py-5 rounded-[20px] text-xl font-black uppercase tracking-widest transition-all"
            style={{
              background: '#F43F5E',
              boxShadow: '0 10px 32px rgba(244,63,94,0.42)',
            }}
          >
            Stop Exercise
          </motion.button>
        </div>
      </main>

      {/* Instruction overlay */}
      {showInstructions && info && (
        <InstructionOverlay info={info} onClose={() => setShowInstructions(false)} />
      )}
    </div>
  );
};
