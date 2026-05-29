import { motion } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ExerciseFeedbackBar = ({ feedback, progress, isDangerous, fsmState }) => {
  // Determine color scheme based on status
  let accentColor = '#39FF14'; // Default neon green
  let bannerBg = 'rgba(57, 255, 20, 0.12)';
  let icon = <Info size={16} style={{ color: '#39FF14' }} />;
  let labelText = 'AI Assistant';

  if (isDangerous) {
    accentColor = '#ef4444'; // Red for warning
    bannerBg = 'rgba(239, 68, 68, 0.18)';
    icon = <AlertTriangle size={16} style={{ color: '#ef4444' }} />;
    labelText = 'AI Alert (อันตราย)';
  } else if (fsmState === 'PEAK') {
    accentColor = '#10b981'; // Solid green for peak point reached
    bannerBg = 'rgba(16, 185, 129, 0.18)';
    icon = <CheckCircle2 size={16} style={{ color: '#10b981' }} />;
    labelText = 'AI Peak reached (จุดสูงสุด)';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-[24px] p-7 shadow-2xl font-sans"
      style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        border: `1px solid ${isDangerous ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.12)'}`,
      }}
    >
      {/* Dynamic Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg" style={{ background: bannerBg }}>
            {icon}
          </div>
          <span
            className="text-xs font-black uppercase tracking-wider transition-colors duration-200"
            style={{ color: accentColor }}
          >
            {labelText}
          </span>
        </div>

        {/* Peak Badge */}
        {fsmState === 'PEAK' && (
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-lime-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(132,204,22,0.4)]"
          >
            Peak!
          </motion.span>
        )}
      </div>

      {/* Main Feedback Message */}
      <h2 
        className="text-2xl font-black leading-tight text-white mb-4 tracking-tight transition-colors duration-200"
        style={{ color: isDangerous ? '#fca5a5' : '#ffffff' }}
      >
        {feedback}
      </h2>

      {/* Progress Bar (Overall set progress) */}
      <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background: isDangerous 
              ? 'linear-gradient(to right, #ef4444, #f43f5e)' 
              : 'linear-gradient(to right, #0d9488, #10b981)',
            boxShadow: isDangerous
              ? '0 0 14px rgba(239,68,68,0.45)'
              : '0 0 14px rgba(16,185,129,0.45)',
          }}
        />
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-bold text-white/35 uppercase tracking-wider">
        <span>ความคืบหน้าของเซต</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </motion.div>
  );
};
export default ExerciseFeedbackBar;
