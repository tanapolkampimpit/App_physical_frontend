import { motion } from 'framer-motion';
import { CheckCircle, Share2, RotateCcw, Clock, Repeat, Target, TrendingUp } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { speakThai } from '../utils/speak';
import { mockPrograms } from '../components/features/exercise/exerciseData';

export const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const sessionStats = location.state || {};
  const { settings } = useSettings();
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [painScale, setPainScale] = useState(3);
  const [isSaved, setIsSaved] = useState(false);

  const exerciseId = parseInt(id) || 1;
  const exercise = mockPrograms.find(p => p.id === exerciseId) || { title: 'ออกกำลังกาย' };

  const capturedImages = sessionStats.capturedImages || [];
  const reps = sessionStats.reps !== undefined ? sessionStats.reps : 0;
  const targetReps = sessionStats.targetReps !== undefined ? sessionStats.targetReps : 10;
  
  // Calculate maximum angle from the captured peaks or default to state
  const maxAngleVal = capturedImages.length > 0
    ? Math.max(...capturedImages.map(img => img.angle))
    : (sessionStats.maxAngle !== undefined ? sessionStats.maxAngle : 0);

  const accuracyVal = targetReps > 0 ? Math.round((reps / targetReps) * 100) : 100;

  const displayStats = [
    { icon: Clock, label: 'ระยะเวลา', value: sessionStats.duration || '00:00', color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { icon: Repeat, label: 'จำนวนครั้ง', value: `${reps} / ${targetReps}`, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { icon: Target, label: 'ความสำเร็จ', value: `${accuracyVal}%`, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { icon: TrendingUp, label: 'มุมสูงสุด', value: `${maxAngleVal}°`, color: 'text-orange-600 bg-orange-50 border-orange-100' },
  ];

  useEffect(() => {
    const handleResize = () => setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // AI Voice Gamification
    if (settings.aiVoice) {
      const speechText = reps >= targetReps
        ? `ทำได้ยอดเยี่ยมมาก! คุณบรรลุเป้าหมายท่า ${exercise.title} ครบถ้วนแล้วครับ`
        : `ทำได้ดีครับ! คุณออกกำลังกายท่า ${exercise.title} สำเร็จเป็นที่เรียบร้อย`;
      speakThai(speechText);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [settings.aiVoice, reps, targetReps, exercise.title]);

  const handleSaveAndExit = () => {
    setIsSaved(true);
    // Mock save to localStorage or backend history
    try {
      const currentHistory = JSON.parse(localStorage.getItem('kayapat_history') || '[]');
      const newRecord = {
        exerciseId,
        exerciseTitle: exercise.title,
        duration: sessionStats.duration || '00:00',
        reps,
        targetReps,
        maxAngle: maxAngleVal,
        painScale,
        timestamp: Date.now()
      };
      localStorage.setItem('kayapat_history', JSON.stringify([newRecord, ...currentHistory]));
    } catch (e) {
      console.error('Failed to save exercise history:', e);
    }

    setTimeout(() => {
      navigate('/history');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex flex-col items-center justify-center px-4 py-8 lg:py-16 overflow-y-auto font-sans">
      <Confetti
        width={windowDimension.width}
        height={windowDimension.height}
        recycle={false}
        numberOfPieces={250}
        gravity={0.12}
        colors={['#10b981', '#34d399', '#059669', '#38bdf8', '#fbbf24', '#f472b6']}
      />
      <div className="w-full max-w-lg lg:max-w-2xl relative z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-6 lg:p-10"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              className="relative mb-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl scale-150"
              />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-300/45">
                <CheckCircle size={40} className="text-white" strokeWidth={2.5} />
              </div>
            </motion.div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">เสร็จสิ้นท่าบริหาร!</h1>
            <p className="text-gray-500 text-sm">{exercise.title} ({exercise.titleEn})</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {displayStats.map(({ icon: Icon, label, value, color }, i) => {
              const [textColor, bgColor, borderColor] = color.split(' ');
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={`bg-slate-50/50 rounded-2xl p-4 text-center border ${borderColor ?? 'border-gray-100'}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2 ${bgColor} ${textColor}`}>
                    <Icon size={16} />
                  </div>
                  <p className={`text-2xl font-black ${textColor} leading-none`}>{value}</p>
                  <p className="text-[11px] font-semibold text-gray-400 mt-1.5">{label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Captured Peaks Gallery */}
          {capturedImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-6 border-t border-gray-100 pt-6"
            >
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-emerald-500 inline-block" />
                แกลเลอรี่ท่าทางขณะจุดสูงสุด (Peak ROM Screenshots)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
                {capturedImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="relative rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-slate-900 aspect-[4/3] group"
                  >
                    <img 
                      src={img.imageSrc} 
                      alt={`Rep ${img.rep}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-black/30 p-2 text-white flex items-center justify-between text-[10px] font-semibold">
                      <span>รอบที่ {img.rep}</span>
                      <span className="text-lime-400 font-extrabold">{Math.round(img.angle)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI Clinical Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-emerald-50/70 to-cyan-50/70 border border-emerald-100/60 rounded-2xl p-4 mb-6"
          >
            <p className="text-xs font-bold text-emerald-800 mb-1.5 uppercase tracking-wider">บทวิเคราะห์ AI (AI ROM Clinical Analysis)</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {reps >= targetReps
                ? `องศาการเคลื่อนไหว (ROM) ข้อต่อบริเวณ${exercise.title}ทำได้บรรลุเป้าหมายสูงสุด ${maxAngleVal}° การรักษาความเร็วคงที่ช่วยเสริมความแข็งแรงเส้นเอ็นและกล้ามเนื้อได้ดี`
                : `ทำได้ดีระดับหนึ่ง องศาการยืดสูงสุดเฉลี่ยคือ ${maxAngleVal}° ในการบริหารเซตถัดไปแนะนำให้ค่อยๆ ขยายช่วงมุมให้ใกล้เป้าหมาย ${displayStats[3].value} โดยไม่ฝืนเจ็บ`}
            </p>
          </motion.div>

          {/* Pain Scale assessment */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-6 bg-slate-50/50 p-4 rounded-2xl border border-gray-100"
          >
            <h3 className="text-xs font-bold text-gray-700 mb-2.5 text-center uppercase tracking-wide">
              ระดับความเจ็บปวดขณะฝึก (Post-Session Pain Scale)
            </h3>
            <div className="flex items-center gap-3 w-full bg-white px-4 py-2.5 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 font-bold">0 (ไม่เจ็บ)</span>
              <input
                type="range"
                min="0"
                max="10"
                value={painScale}
                onChange={(e) => setPainScale(parseInt(e.target.value))}
                className="flex-1 accent-emerald-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
              />
              <span className="text-xs text-gray-400 font-bold">10 (ปวดสุด)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center ml-2">
                <span className="font-extrabold text-emerald-600">{painScale}</span>
              </div>
            </div>
          </motion.div>

          {/* Buttons Controls */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(-1)}
                className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <RotateCcw size={16} />
                <span>ฝึกฝนอีกครั้ง</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-emerald-200/50 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Share2 size={16} />
                <span>แบ่งปันผลลัพธ์</span>
              </motion.button>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSaveAndExit}
              disabled={isSaved}
              className={`w-full text-center py-3.5 rounded-xl transition-all font-bold text-sm ${
                isSaved 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              } cursor-pointer`}
            >
              {isSaved ? '✓ บันทึกข้อมูลสำเร็จ' : 'บันทึกประวัติการออกกำลังกายและกลับ'}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
