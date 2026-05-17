import { motion } from 'framer-motion';

const glassStyle = {
  background: 'rgba(0,0,0,0.42)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: '1px solid rgba(255,255,255,0.10)',
};

const MetricCard = ({ label, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    style={glassStyle}
    className="rounded-[24px] px-5 py-4 w-fit min-w-[152px] shadow-2xl"
  >
    <p className="text-[10px] font-black text-white/55 uppercase tracking-widest mb-1">{label}</p>
    {children}
  </motion.div>
);

export const ExerciseMetricsPanel = ({ reps, formattedTime, accuracy }) => (
  <section className="flex flex-col gap-3 mt-4">
    <MetricCard label="Repetitions" delay={0.05}>
      <p className="text-4xl font-black tabular-nums text-white leading-none">
        {String(reps).padStart(2, '0')}{' '}
        <span className="text-xl text-white/35">/ 12</span>
      </p>
    </MetricCard>

    <MetricCard label="Timer" delay={0.12}>
      <p className="text-4xl font-black tabular-nums text-white leading-none font-mono">
        {formattedTime}
      </p>
    </MetricCard>

    <MetricCard label="AI Accuracy" delay={0.19}>
      <p
        className="text-3xl font-black leading-none"
        style={{ color: '#39FF14', textShadow: '0 0 12px rgba(57,255,20,0.5)' }}
      >
        {accuracy}%
      </p>
    </MetricCard>
  </section>
);
