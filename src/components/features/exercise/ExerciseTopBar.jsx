import { motion } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExerciseTopBar = ({ title }) => {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-2 py-2 rounded-full shadow-2xl"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => navigate('/programs')}
        className="bg-black/50 p-3 rounded-full flex items-center justify-center"
        aria-label="Go back"
      >
        <ArrowLeft size={22} className="text-white" strokeWidth={2.5} />
      </motion.button>

      <h1 className="text-base font-bold tracking-tight text-white">{title}</h1>

      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(57,255,20,0.25)' }}
      >
        <motion.span
          animate={{ opacity: [1, 0.5, 1], scale: [1, 1.25, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: '#39FF14', boxShadow: '0 0 8px rgba(57,255,20,0.9)' }}
        />
        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#39FF14' }}>
          Tracking Active
        </span>
      </div>
    </motion.header>
  );
};
