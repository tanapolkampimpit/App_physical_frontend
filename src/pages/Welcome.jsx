import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, X, User, Users, Check, Stethoscope } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { saveProfile, getProfile } from '../lib/profileStore';



export const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalContent, setModalContent] = useState(null); // 'terms' | 'privacy' | null

  const TERMS_CONTENT = (
    <div className="space-y-4 text-sm text-gray-600">
      <p>1. <strong>การยอมรับข้อตกลง</strong>: การใช้งานแอปพลิเคชัน PhysioCare ถือว่าผู้ใช้ยอมรับข้อตกลงและเงื่อนไขการใช้งานเหล่านี้ทั้งหมด</p>
      <p>2. <strong>วัตถุประสงค์</strong>: แอปพลิเคชันนี้ออกแบบมาเพื่อช่วยแนะนำท่ากายภาพบำบัดเบื้องต้นโดยใช้ AI ไม่สามารถใช้แทนการวินิจฉัยหรือการรักษาจากแพทย์ผู้เชี่ยวชาญได้</p>
      <p>3. <strong>ความรับผิดชอบของผู้ใช้</strong>: ผู้ใช้ควรประเมินสภาพร่างกายของตนเอง หากรู้สึกเจ็บปวดระหว่างการใช้งาน ควรหยุดทันทีและปรึกษาแพทย์</p>
      <p>4. <strong>การเปลี่ยนแปลงเงื่อนไข</strong>: เราขอสงวนสิทธิ์ในการปรับปรุงข้อตกลงโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</p>
    </div>
  );

  const PRIVACY_CONTENT = (
    <div className="space-y-4 text-sm text-gray-600">
      <p>1. <strong>ข้อมูลที่จัดเก็บ</strong>: เราจัดเก็บเฉพาะข้อมูลที่จำเป็น เช่น บัญชี LINE, ข้อมูลประวัติการออกกำลังกาย, และระยะเวลาการใช้งาน เพื่อนำมาวิเคราะห์ความก้าวหน้าของคุณ</p>
      <p>2. <strong>ข้อมูลวิดีโอ/ภาพถ่าย</strong>: การใช้กล้องเพื่อประมวลผลด้วย AI จะทำงานประมวลผลแบบ Real-time บนอุปกรณ์ของคุณ (On-device Processing) จะไม่มีการบันทึกหรือส่งวิดีโอ/ภาพถ่ายใดๆ กลับมาที่เซิร์ฟเวอร์ของเรา</p>
      <p>3. <strong>การเปิดเผยข้อมูล</strong>: เราจะไม่แบ่งปันข้อมูลส่วนตัวของคุณให้กับบุคคลที่สาม เว้นแต่จะได้รับความยินยอมจากคุณ หรือเป็นไปตามที่กฎหมายกำหนด</p>
      <p>4. <strong>การลบข้อมูล</strong>: ผู้ใช้สามารถร้องขอให้ลบข้อมูลบัญชีของตนเองได้ตลอดเวลาผ่านหน้าต่างตั้งค่า</p>
    </div>
  );

  const [isStarting, setIsStarting] = useState(false);
  const [selectedMode, setSelectedMode] = useState('self');

  const handleStart = (mode) => {
    setIsStarting(true);
    const profile = getProfile();
    saveProfile({ ...profile, usage_mode: mode });
    
    // Always navigate to assessment first
    navigate('/assessment');
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4 lg:p-8 relative",
      location.pathname === '/welcome' ? 'pb-40' : 'pb-28'
    )}>
      {/* Therapist Entry Point */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => navigate('/therapist/dashboard')} 
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-blue-100 rounded-full text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
        >
          <Stethoscope size={16} />
          <span className="hidden sm:inline">สำหรับนักกายภาพ (Therapist)</span>
          <span className="sm:hidden">นักกายภาพ</span>
        </button>
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-center z-10">

        {/* Left — Branding */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-400 rounded-3xl opacity-20 blur-3xl scale-150" />
            <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-300/40">
              <Activity size={40} className="text-white" />
            </div>
          </motion.div>

          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">Kayapat</h1>
            <p className="text-xl lg:text-2xl text-emerald-600 font-semibold mt-1">AI Physical Therapy</p>
            <p className="text-gray-500 mt-3 leading-relaxed max-w-sm lg:max-w-none">
              ฟื้นฟูร่างกายด้วยปัญญาประดิษฐ์ที่วิเคราะห์ท่าทางแบบ real-time
              เหมาะสำหรับผู้ที่ต้องการฟื้นฟูร่างกายอย่างมีประสิทธิภาพ
            </p>
          </div>


        </motion.div>

        {/* Right — Start card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center w-full animate-in"
        >
          <div className="w-full max-w-xl bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">เริ่มต้นใช้งาน</h2>
              <p className="text-sm text-gray-500 mt-1">กรุณาเลือกรูปแบบการออกกำลังกายที่เหมาะสมกับคุณ</p>
            </div>



            {/* Mode Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Self Exercise */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMode('self')}
                className={cn(
                  'relative rounded-2xl p-5 border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-3 select-none',
                  selectedMode === 'self'
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-lg shadow-emerald-100/50'
                    : 'border-gray-100 hover:border-emerald-300 bg-white shadow-sm'
                )}
              >
                {selectedMode === 'self' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300',
                  selectedMode === 'self' ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-50 text-gray-500'
                )}>
                  <User size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-gray-800">ออกกำลังกายเอง</h3>
                  <p className="text-xs text-gray-400 leading-normal">
                    ฝึกตามท่าทางด้วยตนเอง โดยมี AI คอยวิเคราะห์มุมข้อต่อแบบสดๆ
                  </p>
                </div>
              </motion.div>

              {/* Option 2: Caregiver Mode */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMode('caregiver')}
                className={cn(
                  'relative rounded-2xl p-5 border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-3 select-none',
                  selectedMode === 'caregiver'
                    ? 'border-amber-500 bg-amber-50/40 shadow-lg shadow-amber-100/50'
                    : 'border-gray-100 hover:border-amber-300 bg-white shadow-sm'
                )}
              >
                {selectedMode === 'caregiver' && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shadow-sm">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300',
                  selectedMode === 'caregiver' ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-50 text-gray-500'
                )}>
                  <Users size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-gray-800">โหมดผู้ดูแล (อัมพาตครึ่งซีก)</h3>
                  <p className="text-xs text-gray-400 leading-normal">
                    สำหรับผู้ช่วยพยุงผู้ป่วยอัมพาตครึ่งซีก โดย AI จะช่วยเฝ้าระวังและแจ้งเตือนมุมอันตราย
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Bottom CTA Button — visible on desktop */}
            <div className="hidden lg:block pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isStarting}
                onClick={() => handleStart(selectedMode)}
                className={cn(
                  'w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-base disabled:opacity-50 cursor-pointer',
                  selectedMode === 'caregiver'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-200 hover:shadow-amber-300'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-200 hover:shadow-emerald-300'
                )}
              >
                <span>{selectedMode === 'caregiver' ? 'เข้าสู่โหมดผู้ดูแล (อัมพาตครึ่งซีก)' : 'เริ่มต้นออกกำลังกาย'}</span>
                <ArrowRight size={18} />
              </motion.button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              การเข้าใช้งานถือว่ายอมรับ
              <span 
                onClick={() => setModalContent('terms')}
                className="text-emerald-600 ml-1 cursor-pointer hover:underline"
              >
                ข้อตกลงการใช้งาน
              </span>
              {' '}และ{' '}
              <span 
                onClick={() => setModalContent('privacy')}
                className="text-emerald-600 cursor-pointer hover:underline"
              >
                นโยบายความเป็นส่วนตัว
              </span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalContent(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl p-6 lg:p-8 overflow-hidden z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalContent === 'terms' ? 'ข้อตกลงการใช้งาน' : 'นโยบายความเป็นส่วนตัว'}
                </h3>
                <button 
                  onClick={() => setModalContent(null)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {modalContent === 'terms' ? TERMS_CONTENT : PRIVACY_CONTENT}
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                <button 
                  onClick={() => setModalContent(null)}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl transition-colors shadow-sm"
                >
                  ฉันเข้าใจและยอมรับ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Mobile fixed bottom bar with glowing CTA button */}
      <div className={cn(
        'lg:hidden fixed left-0 right-0 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] transition-all duration-300',
        location.pathname === '/welcome' ? 'bottom-[72px]' : 'bottom-0'
      )}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={isStarting}
          onClick={() => handleStart(selectedMode)}
          className={cn(
            'w-full text-white font-bold py-4 rounded-[20px] flex items-center justify-center gap-2 shadow-lg transition-all duration-300 disabled:opacity-50',
            selectedMode === 'caregiver'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-200'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-200'
          )}
        >
          <span className="text-base tracking-wide">
            {selectedMode === 'caregiver' ? 'เข้าสู่โหมดผู้ดูแล (อัมพาตครึ่งซีก)' : 'เริ่มต้นออกกำลังกาย'}
          </span>
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};
