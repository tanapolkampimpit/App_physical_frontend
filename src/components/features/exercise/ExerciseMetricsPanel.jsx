import { motion } from 'framer-motion';

const glassStyle = {
  background: 'rgba(15, 23, 42, 0.65)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
};

const MetricCard = ({ label, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    style={glassStyle}
    className="rounded-[24px] px-5 py-4 w-fit min-w-[152px] shadow-2xl flex flex-col justify-center font-sans"
  >
    <p className="text-[10px] font-black text-white/55 uppercase tracking-widest mb-1">{label}</p>
    {children}
  </motion.div>
);

export const ExerciseMetricsPanel = ({ repCount, targetReps, currentAngle, peakAngle, formattedTime }) => {
  // Determine angle text color based on proximity to target peak
  const progressRatio = currentAngle / peakAngle;
  const angleColor = progressRatio >= 1.0 
    ? '#10b981' // Green when peak reached
    : progressRatio >= 0.7 
    ? '#f59e0b' // Orange when close
    : '#ffffff'; // White default

  return (
    <section className="flex flex-col gap-3 mt-4">
      {/* Repetitions Card */}
      <MetricCard label="Repetitions" delay={0.05}>
        <p className="text-4xl font-black tabular-nums text-white leading-none">
          {String(repCount).padStart(2, '0')}{' '}
          <span className="text-xl text-white/35">/ {targetReps}</span>
        </p>
      </MetricCard>

      {/* Timer Card */}
      <MetricCard label="Timer" delay={0.12}>
        <p className="text-4xl font-black tabular-nums text-white leading-none font-mono">
          {formattedTime}
        </p>
      </MetricCard>

      {/* Real-time Joint Angle Card */}
      <MetricCard label="Joint Angle" delay={0.19}>
        <div className="flex items-baseline gap-1">
          <span
            className="text-3xl font-black leading-none tabular-nums transition-colors duration-200"
            style={{ 
              color: angleColor, 
              textShadow: progressRatio >= 1.0 ? '0 0 12px rgba(16,185,129,0.5)' : 'none' 
            }}
          >
            {currentAngle}°
          </span>
          <span className="text-sm font-bold text-white/35">/ {peakAngle}°</span>
        </div>
      </MetricCard>
    </section>
  );
};
export default ExerciseMetricsPanel;
