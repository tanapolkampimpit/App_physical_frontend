import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, ChevronRight, Menu, Sparkles, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { getProfile, saveProfile } from '../lib/profileStore';

// Import images
import shoulderRotationImg from '../assets/shoulder_rotation.png';
import overheadRaiseImg from '../assets/overhead_raise.png';
import seatedKneeExtImg from '../assets/seated_knee_ext.png';
import lyingKneeFlexImg from '../assets/lying_knee_flex.png';
import hipAbductionImg from '../assets/hip_abduction.png';
import bandPullImg from '../assets/band_pull.png';
import sitToStandImg from '../assets/sit_to_stand.png';
import avatarImg from '../assets/avatar.png';

const SELF_PROGRAMS = [
  {
    id: 1,
    title: 'หมุนแขนระดับไหล่',
    titleEn: 'Shoulder Rotation',
    description: 'ช่วยฟื้นฟูมุมการเคลื่อนไหวของข้อไหล่ ลดอาการไหล่ติด และเพิ่มความแข็งแรงรอบข้อต่อไหล่',
    category: 'Upper Body',
    difficulty: 'Easy',
    duration: '10m',
    image: shoulderRotationImg,
    imagePosition: 'center 35%',
  },
  {
    id: 2,
    title: 'ยกแขนเหนือศีรษะ',
    titleEn: 'Overhead Raise',
    description: 'เพิ่มความคล่องตัวของข้อไหล่และกล้ามเนื้อหลังช่วงบน ช่วยในการหยิบของในที่สูงและพยุงลำตัว',
    category: 'Upper Body',
    difficulty: 'Easy',
    duration: '10m',
    image: overheadRaiseImg,
    imagePosition: 'center 25%',
  },
  {
    id: 3,
    title: 'เหยียดข้อเข่าขณะนั่ง',
    titleEn: 'Seated Knee Extension',
    description: 'สร้างความแข็งแรงของกล้ามเนื้อต้นขาด้านหน้า ป้องกันข้อเข่าเสื่อม ช่วยการเดินและพยุงเข่าลุกขึ้น',
    category: 'Lower Body',
    difficulty: 'Easy',
    duration: '12m',
    image: seatedKneeExtImg,
    imagePosition: 'center 35%',
  },
  {
    id: 4,
    title: 'นอนงอข้อเข่า',
    titleEn: 'Lying Knee Flexion',
    description: 'เพิ่มองศาการงอเข่า ยืดกล้ามเนื้อหน้าขา และฟื้นฟูเข่าหลังการผ่าตัดหรือการนั่งนานๆ',
    category: 'Lower Body',
    difficulty: 'Easy',
    duration: '15m',
    image: lyingKneeFlexImg,
    imagePosition: 'center 50%',
  },
  {
    id: 5,
    title: 'กางสะโพก',
    titleEn: 'Hip Abduction',
    description: 'เสริมความแข็งแรงของสะโพกด้านข้าง เพิ่มความมั่นคงในการทรงตัวขณะยืนขาเดียวและลดความเสี่ยงการล้ม',
    category: 'Hip & Balance',
    difficulty: 'Medium',
    duration: '12m',
    image: hipAbductionImg,
    imagePosition: 'center 40%',
  },
  {
    id: 6,
    title: 'ดึงยางยืดบริหารกล้ามเนื้อ',
    titleEn: 'Band Pull',
    description: 'เพิ่มความแข็งแรงของกล้ามเนื้อแขนช่วงล่าง ไหล่ และหลังส่วนบน ช่วยลดอาการปวดเมื่อยออฟฟิศซินโดรม',
    category: 'Upper Body',
    difficulty: 'Medium',
    duration: '15m',
    image: bandPullImg,
    imagePosition: 'center 25%',
  },
  {
    id: 7,
    title: 'ลุก-นั่งจากเก้าอี้',
    titleEn: 'Sit to Stand',
    description: 'ฝึกการเคลื่อนไหวพื้นฐานสำคัญของร่างกาย เพิ่มกำลังขารวมและการพยุงตัวในชีวิตประจำวัน',
    category: 'Functional',
    difficulty: 'Hard',
    duration: '15m',
    image: sitToStandImg,
    imagePosition: 'center 30%',
  }
];

const CATEGORIES = ['All', 'Upper Body', 'Lower Body', 'Hip & Balance', 'Functional'];

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
      className="bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] rounded-[24px] p-4 lg:p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center cursor-pointer border border-gray-100/80 transition-all hover:shadow-[0_12px_32px_rgba(16,185,129,0.08)] group font-sans"
    >
      {/* Image / Thumbnail */}
      <div className="w-full sm:w-[160px] lg:w-[200px] h-[180px] sm:h-[140px] lg:h-[150px] shrink-0 rounded-[20px] overflow-hidden bg-slate-900 relative group-hover:shadow-inner">
        <img
          src={program.image}
          alt={program.title}
          style={{ objectPosition: program.imagePosition }}
          className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
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
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">{program.title}</h2>
            <span className="text-[11px] font-semibold text-gray-400 mt-0.5 block">{program.titleEn}</span>
          </div>
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
    // Load local profile store instead of hitting backend :8000
    const localProfile = getProfile();
    setProfile(localProfile);
  }, []);

  const handleModeSwitch = (mode) => {
    if (!profile) return;
    const updated = saveProfile({ usage_mode: mode });
    setProfile(updated);
    if (mode === 'caregiver') {
      navigate('/caregiver-programs');
    }
  };

  const processedPrograms = SELF_PROGRAMS.map((p) => {
    let recommended = false;
    let hidden = false;

    if (profile) {
      // Phase-based safety filtering
      if (profile.phase === 'acute') {
        // In acute phase, hide Hard and Medium active exercises
        if (p.difficulty === 'Hard' || p.difficulty === 'Medium') hidden = true;
      } else if (profile.phase === 'sub_acute') {
        // In sub_acute, hide Hard exercises
        if (p.difficulty === 'Hard') hidden = true;
      }

      // Target area filtering
      if (profile.target_area && profile.target_area !== 'all') {
        if (profile.target_area === 'shoulder' && p.category !== 'Upper Body') hidden = true;
        if (profile.target_area === 'knee' && p.category !== 'Lower Body' && p.category !== 'Functional') hidden = true;
        if (profile.target_area === 'hip' && p.category !== 'Hip & Balance' && p.category !== 'Functional') hidden = true;
      }
      
      // If not hidden, mark as recommended since it passed the safety checks
      if (!hidden) {
        recommended = true;
      }
    }
    
    return { ...p, recommended, hidden };
  }).sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0)); // Put recommended first

  const filtered = processedPrograms.filter((p) => {
    if (p.hidden) return false;
    const matchQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchQuery && matchCat;
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
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

        {/* AI Recommendation Banner */}
        {profile && profile.phase && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50/80 backdrop-blur border border-emerald-200/50 p-4 rounded-[24px] flex gap-3 shadow-sm"
          >
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600 h-fit">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-emerald-900">AI แนะนำสำหรับคุณ</h3>
              <p className="text-sm text-emerald-700 mt-0.5">
                จากอาการของคุณอยู่ในระยะ {profile.phase === 'acute' ? 'เฉียบพลัน' : profile.phase === 'sub_acute' ? 'กึ่งเฉียบพลัน' : 'ฟื้นฟู'} 
                ระบบได้คัดกรองท่าที่ปลอดภัยและเหมาะสมที่สุดให้แล้ว
              </p>
            </div>
          </motion.div>
        )}

        {/* Program List */}
        <section className="flex flex-col gap-4">
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
