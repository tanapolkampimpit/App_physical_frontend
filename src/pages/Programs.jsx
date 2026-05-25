import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, ChevronRight, Menu, Sparkles, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { cn } from '../lib/utils';

// Import images
import seatedKneeExtensionsImg from '../assets/seated_knee_extensions.png';
import armCirclesImg from '../assets/arm_circles.png';
import walkingBalanceImg from '../assets/walking_balance.png';
import hipFlexorStretchImg from '../assets/hip_flexor_stretch.png';
import resistanceBandRowsImg from '../assets/resistance_band_rows.png';
import singleLegStandImg from '../assets/single_leg_stand.png';
import avatarImg from '../assets/avatar.png';

const SELF_PROGRAMS = [
  {
    id: 1,
    title: 'Seated Knee Extensions',
    description: 'Improves quadriceps strength and knee joint stability. Crucial for walking and standing up safely.',
    category: 'Lower Body',
    difficulty: 'Easy',
    duration: '15m',
    image: seatedKneeExtensionsImg,
    imagePosition: 'center 35%', // เห็นหน้า + ขาที่เหยียดออก
    difficultyStyle: 'bg-secondary-container text-on-secondary-container',
    difficultyDot: 'bg-secondary',
  },
  {
    id: 2,
    title: 'Arm Circles',
    description: 'Enhances shoulder range of motion and reduces stiffness. Helps with reaching overhead.',
    category: 'Upper Body',
    difficulty: 'Easy',
    duration: '10m',
    image: armCirclesImg,
    imagePosition: 'center 25%', // เห็นหน้า + แขนกางออกข้าง
    difficultyStyle: 'bg-secondary-container text-on-secondary-container',
    difficultyDot: 'bg-secondary',
  },
  {
    id: 3,
    title: 'Walking Balance',
    description: 'Improves gait stability and coordination. Reduces the risk of falls in daily life.',
    category: 'Balance',
    difficulty: 'Medium',
    duration: '20m',
    image: walkingBalanceImg,
    imagePosition: 'center 20%', // เห็นหน้า + มือจับราว
    difficultyStyle: 'bg-surface-variant text-on-surface',
    difficultyDot: 'bg-outline',
  },
  {
    id: 4,
    title: 'Hip Flexor Stretch',
    description: 'Stretches the front of the hip and thigh. Reduces stiffness from sitting or post-surgery.',
    category: 'Lower Body',
    difficulty: 'Easy',
    duration: '12m',
    image: hipFlexorStretchImg,
    imagePosition: 'center 75%', // เห็นหน้า + ท่า lunge สะโพก และเห็นเท้าขยับลงมา
    difficultyStyle: 'bg-secondary-container text-on-secondary-container',
    difficultyDot: 'bg-secondary',
  },
  {
    id: 5,
    title: 'Resistance Band Rows',
    description: 'Strengthens upper back and shoulder muscles using elastic resistance. Improves posture.',
    category: 'Upper Body',
    difficulty: 'Hard',
    duration: '18m',
    image: resistanceBandRowsImg,
    imagePosition: 'center 25%', // เห็นหน้า + แขนดึงยางยืด
    difficultyStyle: 'bg-error-container text-on-error-container',
    difficultyDot: 'bg-error',
  },
  {
    id: 6,
    title: 'Single Leg Stand',
    description: 'Improves ankle stability and standing balance. Promotes lower body muscular control.',
    category: 'Balance',
    difficulty: 'Medium',
    duration: '15m',
    image: singleLegStandImg,
    imagePosition: 'center 20%', // เห็นหน้า + ขาที่ยกขึ้น
    difficultyStyle: 'bg-surface-variant text-on-surface',
    difficultyDot: 'bg-outline',
  },
];



const CATEGORIES = ['All', 'Lower Body', 'Upper Body', 'Balance'];

const ProgramCard = ({ program, onClick, index }) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] rounded-[24px] p-4 lg:p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center cursor-pointer border border-gray-100/80 transition-all hover:shadow-[0_12px_32px_rgba(16,185,129,0.08)] group"
    >
      {/* Image / Thumbnail */}
      <div className="w-full sm:w-[160px] lg:w-[200px] h-[180px] sm:h-[140px] lg:h-[150px] shrink-0 rounded-[20px] overflow-hidden bg-gray-50 relative group-hover:shadow-inner">
        <img
          src={program.image}
          alt={program.title}
          style={{ objectPosition: program.imagePosition }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-xs font-bold text-gray-800 flex items-center gap-1.5 shadow-sm">
          <Clock size={14} className="text-emerald-500" />
          <span>{program.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center w-full min-w-0">
        <div className="flex justify-between items-start w-full gap-2">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">{program.title}</h2>
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-50 transition-colors">
            <ChevronRight size={18} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-2 mb-4 line-clamp-2 leading-relaxed">{program.description}</p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {program.recommended && (
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border border-emerald-100/50">
              <Sparkles size={12} className="text-emerald-500" />
              แนะนำสำหรับคุณ
            </span>
          )}
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl text-[11px] font-bold border border-blue-100/50">
            {program.category}
          </span>
          <span className={cn('px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border border-gray-100/50', 
            program.difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
            program.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
            'bg-rose-50 text-rose-700'
          )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', 
              program.difficulty === 'Easy' ? 'bg-green-500' :
              program.difficulty === 'Medium' ? 'bg-amber-500' :
              'bg-rose-500'
            )} />
            {program.difficulty}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export const Programs = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error('Failed to fetch profile', err));
  }, []);

  const handleModeSwitch = async (mode) => {
    if (!profile) return;
    const updated = { ...profile, usage_mode: mode };
    setProfile(updated);
    try {
      await fetch('http://localhost:8000/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (mode === 'caregiver') {
        navigate('/caregiver-programs');
      }
    } catch (err) {
      console.error('Failed to save mode', err);
    }
  };

  const processedPrograms = SELF_PROGRAMS.map((p) => {
    let recommended = false;
    let hidden = false;

    if (profile) {
      // Hide hard exercises if pain is high
      if (profile.pain_scale >= 8 && p.difficulty === 'Hard') {
        hidden = true;
      }
      
      // Recommend easy/medium exercises that avoid limitations
      const limitLower = profile.limitations?.toLowerCase() || '';
      const avoidShoulder = limitLower.includes('ไหล่') || limitLower.includes('shoulder');
      const avoidKnee = limitLower.includes('เข่า') || limitLower.includes('knee');

      if (avoidShoulder && p.category === 'Upper Body') hidden = true;
      if (avoidKnee && p.title.includes('Knee')) hidden = true;
      
      // Simple recommendation logic: if it's not hidden, and matches their general issue
      if (!hidden) {
        if (limitLower.includes('เข่า') && p.category === 'Lower Body' && p.difficulty !== 'Hard') recommended = true;
        else if (limitLower.includes('ไหล่') && p.category === 'Upper Body' && p.difficulty !== 'Hard') recommended = true;
        else if (profile.pain_scale >= 4 && p.difficulty === 'Easy') recommended = true; // Recommend easy if in pain
      }
    }
    
    return { ...p, recommended, hidden };
  }).sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0)); // Put recommended first

  const filtered = processedPrograms.filter((p) => {
    if (p.hidden) return false;
    const matchQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchQuery && matchCat;
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Main Canvas */}
      <main className="flex-1 w-full max-w-5xl mx-auto pt-8 pb-[120px] lg:pt-[48px] px-4 lg:px-8 flex flex-col gap-8">
        
        {/* Header section with Welcome text and Avatar */}
        <section className="flex justify-between items-center bg-white p-5 rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div 
              onClick={() => navigate('/profile')}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 p-0.5 cursor-pointer hover:scale-105 transition-transform shadow-md"
            >
              <div className="w-full h-full rounded-full bg-white overflow-hidden border-2 border-white">
                <img src={avatarImg} alt="User profile" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ยินดีต้อนรับกลับมา</p>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">โปรแกรมกายภาพ</h1>
            </div>
          </div>
          
          <button className="lg:hidden p-3 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
            <Menu size={24} />
          </button>
        </section>

        {/* Search & Mode Switcher */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            
            {/* Mode Switcher */}
            {profile && (
              <div className="flex bg-gray-100/80 backdrop-blur-sm border border-gray-200/60 rounded-full p-1.5 shadow-inner relative select-none w-full lg:w-auto">
                <button
                  onClick={() => handleModeSwitch('self')}
                  className={cn(
                    'flex-1 lg:flex-none relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 z-10 cursor-pointer',
                    profile.usage_mode !== 'caregiver'
                      ? 'text-emerald-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {profile.usage_mode !== 'caregiver' && (
                    <motion.div
                      layoutId="activeModeHighlight"
                      className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm border border-emerald-100"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <User size={16} className={profile.usage_mode !== 'caregiver' ? "text-emerald-500" : ""} />
                  <span>ออกกำลังกายเอง</span>
                </button>
                
                <button
                  onClick={() => handleModeSwitch('caregiver')}
                  className={cn(
                    'flex-1 lg:flex-none relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 z-10 cursor-pointer',
                    profile.usage_mode === 'caregiver'
                      ? 'text-amber-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {profile.usage_mode === 'caregiver' && (
                    <motion.div
                      layoutId="activeModeHighlight"
                      className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm border border-amber-100"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Users size={16} className={profile.usage_mode === 'caregiver' ? "text-amber-500" : ""} />
                  <span className="hidden sm:inline">โหมดผู้ดูแล (อัมพาตครึ่งซีก)</span>
                  <span className="sm:hidden">โหมดผู้ดูแล</span>
                </button>
              </div>
            )}

          </div>

          {/* Search bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ค้นหาท่าทาง, ส่วนของร่างกาย..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-white border border-gray-100 rounded-[20px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 shadow-sm transition-all"
            />
          </div>

          {/* Category chips */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'flex-shrink-0 px-5 py-2.5 rounded-[16px] text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm border',
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-emerald-200'
                    : 'bg-white border-gray-100 text-gray-600 hover:border-emerald-300 hover:text-emerald-600'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Program List */}
        <section className="flex flex-col gap-4 mt-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProgramCard
                key={p.id}
                program={p}
                index={i}
                onClick={() => navigate(`/exercise/${p.id}/preview`)}
              />
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-[24px] border border-gray-100 shadow-sm"
            >
              <Search size={44} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-bold text-gray-600">ไม่พบโปรแกรมที่ค้นหา</p>
              <p className="text-sm text-gray-400 mt-1">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ใหม่</p>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
};
