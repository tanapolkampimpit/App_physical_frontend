import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

export const ExerciseFeedbackBar = ({ feedback, progress }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="rounded-[24px] p-7 shadow-2xl"
    style={{
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(22px)',
      WebkitBackdropFilter: 'blur(22px)',
      border: '1px solid rgba(255,255,255,0.15)',
    }}
  >
    {/* AI Assistant label */}
    <div className="flex items-center gap-2.5 mb-2">
      <div
        className="p-1.5 rounded-lg"
        style={{ background: 'rgba(57,255,20,0.18)' }}
      >
        <Info size={16} style={{ color: '#39FF14' }} />
      </div>
      <span
        className="text-xs font-black uppercase tracking-tighter"
        style={{ color: '#39FF14' }}
      >
        AI Assistant
      </span>
    </div>

    {/* Main feedback */}
    <h2 className="text-3xl font-black leading-tight text-white mb-1 tracking-tight">
      {feedback}
    </h2>
    <p className="text-base font-medium text-white/60 mb-5">
      Slow and steady movement
    </p>

    {/* Progress bar */}
    <div className="h-3.5 w-full bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{
          background: 'linear-gradient(to right, #0D9488, #10B981)',
          boxShadow: '0 0 14px rgba(16,185,129,0.55)',
        }}
      />
    </div>
    <div className="flex justify-between mt-2">
      <span className="text-[10px] font-bold text-white/35 uppercase tracking-wide">Current Rep Progress</span>
      <span className="text-[10px] font-bold text-white/35 uppercase">{progress}%</span>
    </div>
  </motion.div>
);
