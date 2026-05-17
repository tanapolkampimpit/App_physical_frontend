import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Repeat, ChevronRight, TriangleAlert, Shield, Activity, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockPrograms, exerciseInstructions } from '../components/features/exercise/exerciseData';

// Import images to showcase on the preview screen
import seatedKneeExtensionsImg from '../assets/seated_knee_extensions.png';
import armCirclesImg from '../assets/arm_circles.png';
import walkingBalanceImg from '../assets/walking_balance.png';
import hipFlexorStretchImg from '../assets/hip_flexor_stretch.png';
import resistanceBandRowsImg from '../assets/resistance_band_rows.png';
import singleLegStandImg from '../assets/single_leg_stand.png';

const IMAGE_MAP = {
  1: seatedKneeExtensionsImg,
  2: armCirclesImg,
  3: walkingBalanceImg,
  4: hipFlexorStretchImg,
  5: resistanceBandRowsImg,
  6: singleLegStandImg,
};

const THEME_MAP = {
  1: {
    gradient: 'from-blue-600 to-indigo-700',
    lightBg: 'bg-blue-50/50',
    accent: 'text-blue-600',
    border: 'border-blue-100',
    pill: 'bg-blue-500/10 text-blue-100 border-blue-400/20',
    btnShadow: 'shadow-blue-500/30 hover:shadow-blue-500/40',
    stepCircle: 'bg-blue-50 text-blue-600 border-blue-100',
    glow: 'rgba(59, 130, 246, 0.15)',
  },
  2: {
    gradient: 'from-purple-600 to-fuchsia-700',
    lightBg: 'bg-purple-50/50',
    accent: 'text-purple-600',
    border: 'border-purple-100',
    pill: 'bg-purple-500/10 text-purple-100 border-purple-400/20',
    btnShadow: 'shadow-purple-500/30 hover:shadow-purple-500/40',
    stepCircle: 'bg-purple-50 text-purple-600 border-purple-100',
    glow: 'rgba(168, 85, 247, 0.15)',
  },
  3: {
    gradient: 'from-amber-600 to-orange-700',
    lightBg: 'bg-amber-50/50',
    accent: 'text-amber-600',
    border: 'border-amber-100',
    pill: 'bg-amber-500/10 text-amber-100 border-amber-400/20',
    btnShadow: 'shadow-amber-500/30 hover:shadow-amber-500/40',
    stepCircle: 'bg-amber-50 text-amber-600 border-amber-100',
    glow: 'rgba(245, 158, 11, 0.15)',
  },
  4: {
    gradient: 'from-pink-600 to-rose-700',
    lightBg: 'bg-pink-50/50',
    accent: 'text-pink-600',
    border: 'border-pink-100',
    pill: 'bg-pink-500/10 text-pink-100 border-pink-400/20',
    btnShadow: 'shadow-pink-500/30 hover:shadow-pink-500/40',
    stepCircle: 'bg-pink-50 text-pink-600 border-pink-100',
    glow: 'rgba(236, 72, 153, 0.15)',
  },
  5: {
    gradient: 'from-emerald-600 to-teal-700',
    lightBg: 'bg-emerald-50/50',
    accent: 'text-emerald-600',
    border: 'border-emerald-100',
    pill: 'bg-emerald-500/10 text-emerald-100 border-emerald-400/20',
    btnShadow: 'shadow-emerald-500/30 hover:shadow-emerald-500/40',
    stepCircle: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    glow: 'rgba(16, 185, 129, 0.15)',
  },
  6: {
    gradient: 'from-cyan-600 to-teal-700',
    lightBg: 'bg-cyan-50/50',
    accent: 'text-cyan-600',
    border: 'border-cyan-100',
    pill: 'bg-cyan-500/10 text-cyan-100 border-cyan-400/20',
    btnShadow: 'shadow-cyan-500/30 hover:shadow-cyan-500/40',
    stepCircle: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    glow: 'rgba(6, 182, 212, 0.15)',
  },
};

export const ExercisePreview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const numId = parseInt(id);

  const program = mockPrograms.find((p) => p.id === numId);
  const info = exerciseInstructions[numId];

  if (!program || !info) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-sm">
          <TriangleAlert className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-gray-800 font-semibold text-lg">ไม่พบข้อมูลท่าออกกำลังกาย</p>
          <button onClick={() => navigate('/programs')} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl">
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  const theme = THEME_MAP[numId] ?? THEME_MAP[1];
  const exerciseImg = IMAGE_MAP[numId] ?? seatedKneeExtensionsImg;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-36 lg:pb-12 font-sans selection:bg-primary/10">
      {/* Hero Banner Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} text-white pt-12 pb-16 lg:pb-24 px-6 lg:px-12`}>
        {/* Glow meshes background */}
        <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-white/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[350px] h-[350px] rounded-full bg-black/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Back Navigation Button */}
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/programs')}
            className="mb-8 flex items-center gap-2 text-white/80 hover:text-white font-medium transition-colors group cursor-pointer"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-sm">กลับหน้าโปรแกรม</span>
          </motion.button>

          {/* Grid Layout: Text details + Floating Exercise Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border ${theme.pill}`}>
                  {info.category}
                </span>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white/90 border border-white/15">
                  <Star size={12} className="text-amber-300 fill-amber-300" />
                  {info.difficulty}
                </span>
              </div>

              <motion.h1 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
              >
                {program.title}
              </motion.h1>

              <p className="text-white/80 text-base lg:text-lg leading-relaxed max-w-2xl font-light">
                {info.description}
              </p>

              {/* Stat Badges row */}
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-2xl text-sm font-semibold">
                  <Clock size={16} className="text-white/80" />
                  <span>เวลาประมาณ {info.duration}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-2xl text-sm font-semibold">
                  <Repeat size={16} className="text-white/80" />
                  <span>เป้าหมาย {info.reps}</span>
                </div>
              </div>
            </div>

            {/* Premium Floating 3D-Effect Exercise Image Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.1 }}
              className="lg:col-span-5 w-full flex justify-center"
            >
              <div className="relative group w-full max-w-sm rounded-[24px] overflow-hidden bg-white p-3 shadow-[0_24px_50px_rgba(0,0,0,0.15)] border border-white/20 transition-all duration-300 hover:shadow-[0_32px_60px_rgba(0,0,0,0.22)]">
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-50 relative">
                  <img 
                    src={exerciseImg} 
                    alt={program.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: program.imagePosition ?? 'center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Visual Accent */}
                <div className="flex items-center justify-between mt-3 px-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Pose Detection Ready</span>
                  </div>
                  <Shield size={16} className="text-slate-400" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Grid Content Section */}
      <main className="max-w-6xl mx-auto px-6 lg:px-12 mt-[-24px] lg:mt-[-36px] relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Steps List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 bg-white rounded-[32px] p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-2xl ${theme.lightBg} ${theme.accent}`}>
                <Activity size={22} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">ขั้นตอนการทำท่ากายภาพ</h2>
            </div>

            <ol className="relative border-l border-slate-100 ml-4 pl-4 space-y-6">
              {info.steps.map((step, i) => (
                <motion.li 
                  key={i} 
                  className="relative flex gap-4 items-start"
                  whileHover={{ x: 2 }}
                >
                  {/* Custom animated step circle */}
                  <span className={`absolute left-[-29px] w-6 h-6 rounded-full border-2 ${theme.stepCircle} flex items-center justify-center font-bold text-xs shadow-sm bg-white`}>
                    {i + 1}
                  </span>
                  <div className="space-y-1">
                    <p className="text-slate-700 text-base leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* Right Column - Warnings & CTA Button */}
          <div className="lg:col-span-5 space-y-6">
            {/* Soft Frosted Amber Warning Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-amber-50/70 backdrop-blur-md rounded-[28px] border border-amber-100 p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-xl">
                  <TriangleAlert size={18} />
                </div>
                <h2 className="font-bold text-amber-800 text-base">ข้อควรระวังสำคัญ</h2>
              </div>
              <ul className="space-y-3">
                {info.tips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-amber-800/90 text-sm leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="font-medium">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Action CTA Panel — visible on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden lg:block bg-white rounded-[28px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100"
            >
              <h3 className="text-slate-800 font-bold mb-2">พร้อมสำหรับการฝึกแล้วหรือยัง?</h3>
              <p className="text-slate-400 text-xs mb-4">AI จะใช้กล้องหน้าตรวจจับตำแหน่งข้อมือ หัวเข่า และแกนลำตัวของคุณแบบสดๆ เพื่อให้แน่ใจว่าคุณขยับได้อย่างถูกต้องและปลอดภัยที่สุด</p>
              
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/exercise/${id}`)}
                className={`w-full bg-gradient-to-r ${theme.gradient} text-white font-bold py-4 rounded-[20px] flex items-center justify-center gap-2 shadow-lg ${theme.btnShadow} transition-all duration-300 cursor-pointer`}
              >
                <span className="text-base tracking-wide">เริ่มออกกำลังกาย</span>
                <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Mobile fixed bottom bar with glowing CTA button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/exercise/${id}`)}
          className={`w-full bg-gradient-to-r ${theme.gradient} text-white font-bold py-4 rounded-[20px] flex items-center justify-center gap-2 shadow-lg ${theme.btnShadow}`}
        >
          <span className="text-base tracking-wide">เริ่มออกกำลังกาย</span>
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};
