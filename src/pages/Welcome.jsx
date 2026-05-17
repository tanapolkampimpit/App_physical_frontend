import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Brain, TrendingUp, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: Brain, label: 'AI วิเคราะห์ท่าทาง real-time', desc: 'ตรวจจับการเคลื่อนไหวด้วย MoveNet', color: 'text-purple-600 bg-purple-50' },
  { icon: TrendingUp, label: 'ติดตามความก้าวหน้า', desc: 'กราฟ Range of Motion รายวัน/สัปดาห์', color: 'text-blue-600 bg-blue-50' },
  { icon: ShieldCheck, label: 'ปลอดภัย แนะนำโดยนักกายภาพ', desc: 'ท่าออกกำลังกายที่ได้รับการออกแบบมาแล้ว', color: 'text-emerald-600 bg-emerald-50' },
];

export const Welcome = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4 lg:p-8 relative">
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

          {/* Features — visible on desktop left column */}
          <div className="hidden lg:flex flex-col gap-3 w-full">
            {FEATURES.map(({ icon: Icon, label, desc, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-default"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — Login card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">เริ่มต้นใช้งาน</h2>
              <p className="text-sm text-gray-500 mt-1">เชื่อมต่อด้วย LINE เพื่อเข้าใช้งาน</p>
            </div>

            {/* Features — visible on mobile */}
            <div className="lg:hidden flex flex-col gap-3">
              {FEATURES.map(({ icon: Icon, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-3 bg-gray-50 rounded-2xl px-3 py-2.5"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/programs')}
                className="w-full bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200 transition-all duration-200 flex items-center justify-center gap-2 text-base"
              >
                <span className="text-xl font-black leading-none">L</span>
                <span>เข้าสู่ระบบด้วย LINE</span>
                <ArrowRight size={18} />
              </motion.button>

              <button
                onClick={() => navigate('/programs')}
                className="w-full text-gray-500 hover:text-gray-800 text-sm py-2 transition-colors"
              >
                ข้ามไปหน้าหลัก
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              การเข้าสู่ระบบถือว่ายอมรับ
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
    </div>
  );
};
