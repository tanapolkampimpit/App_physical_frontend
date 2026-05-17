import { motion } from 'framer-motion';
import { CheckCircle, Share2, RotateCcw, Clock, Repeat, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const STATS = [
  { icon: Clock, label: 'ระยะเวลา', value: '12:34', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { icon: Repeat, label: 'จำนวนครั้ง', value: '32', color: 'text-purple-600 bg-purple-50 border-purple-100' },
  { icon: Target, label: 'ความแม่นยำ', value: '94%', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { icon: TrendingUp, label: 'มุมสูงสุด', value: '120°', color: 'text-orange-600 bg-orange-50 border-orange-100' },
];

export const Report = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // AI Voice Gamification
    if (settings.aiVoice && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance("Great job! You have successfully completed the exercise. Your range of motion has improved.");
      msg.lang = 'en-US';
      msg.volume = 1;
      msg.rate = 1.0;
      window.speechSynthesis.speak(msg);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.speechSynthesis.cancel();
    };
  }, [settings.aiVoice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex flex-col items-center justify-center px-4 py-8 lg:py-16 overflow-hidden">
      <Confetti
        width={windowDimension.width}
        height={windowDimension.height}
        recycle={false}
        numberOfPieces={300}
        gravity={0.15}
        colors={['#10b981', '#34d399', '#059669', '#38bdf8', '#fbbf24', '#f472b6']}
      />
      <div className="w-full max-w-lg lg:max-w-2xl relative z-10">
        {/* Desktop: card wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:bg-white lg:rounded-3xl lg:shadow-xl lg:shadow-gray-200/60 lg:border lg:border-gray-100 lg:p-10"
        >
          {/* Success icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              className="relative mb-5"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl scale-150"
              />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-300/50">
                <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
              </div>
            </motion.div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">เสร็จสิ้น!</h1>
            <p className="text-gray-500 text-sm lg:text-base">ทำได้ดีมาก คุณออกกำลังกายครบตามเป้าหมาย</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {STATS.map(({ icon: Icon, label, value, color }, i) => {
              const [textColor, bgColor, borderColor] = color.split(' ');
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className={`bg-white rounded-2xl p-4 lg:p-5 text-center shadow-sm border ${borderColor ?? 'border-gray-100'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${bgColor} ${textColor}`}>
                    <Icon size={18} />
                  </div>
                  <p className={`text-2xl lg:text-3xl font-bold ${textColor}`}>{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* AI Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-100 rounded-2xl p-4 mb-6"
          >
            <p className="text-xs font-semibold text-emerald-700 mb-1">AI Feedback</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              ฟอร์มดีขึ้นอย่างมีนัยสำคัญ ลองขยายช่วงการเคลื่อนไหวให้มากขึ้นในเซสชันถัดไป
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(-1)}
                className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw size={18} />
                <span>ทำอีกครั้ง</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 size={18} />
                <span>แชร์</span>
              </motion.button>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/programs')}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors cursor-pointer"
            >
              กลับหน้าโปรแกรม
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
