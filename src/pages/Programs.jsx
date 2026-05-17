import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, ChevronRight, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

// Import images
import seatedKneeExtensionsImg from '../assets/seated_knee_extensions.png';
import armCirclesImg from '../assets/arm_circles.png';
import walkingBalanceImg from '../assets/walking_balance.png';
import hipFlexorStretchImg from '../assets/hip_flexor_stretch.png';
import resistanceBandRowsImg from '../assets/resistance_band_rows.png';
import singleLegStandImg from '../assets/single_leg_stand.png';
import avatarImg from '../assets/avatar.png';

const PROGRAMS = [
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className="bg-surface-container-lowest shadow-[0_4px_12px_rgba(15,23,42,0.08)] rounded-card p-padding-standard flex flex-col sm:flex-row gap-inline-gap items-start sm:items-center active:scale-[0.98] transition-transform cursor-pointer"
    >
      {/* Image / Thumbnail */}
      <div className="w-full sm:w-[180px] h-[140px] sm:h-[120px] shrink-0 rounded-xl overflow-hidden bg-white relative">
        <img
          src={program.image}
          alt={program.title}
          style={{ objectPosition: program.imagePosition }}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-1 rounded font-label-md text-label-md text-on-surface flex items-center gap-1">
          <Clock size={16} className="text-on-surface" />
          <span>{program.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2 w-full">
        <div className="flex justify-between items-start w-full">
          <h2 className="font-label-lg text-label-lg text-on-surface">{program.title}</h2>
          <ChevronRight size={24} className="text-primary flex-shrink-0" />
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{program.description}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-md text-label-md">
            {program.category}
          </span>
          <span className={cn('px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1', program.difficultyStyle)}>
            <span className={cn('w-2 h-2 rounded-full', program.difficultyDot)} />
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

  const filtered = PROGRAMS.filter((p) => {
    const matchQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchQuery && matchCat;
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* TopAppBar - visible on mobile only */}
      <header className="fixed top-0 w-full z-40 bg-surface shadow-sm flex justify-between items-center px-6 h-16 lg:hidden border-b border-outline-variant/30">
        <button className="min-h-touch-target-min min-w-[56px] flex items-center justify-start text-primary active:opacity-80 transition-opacity duration-150">
          <Menu size={28} />
        </button>
        <div className="font-headline-md text-headline-md font-bold text-on-surface">
          PhysioCare
        </div>
        <button 
          onClick={() => navigate('/profile')}
          className="min-h-touch-target-min min-w-[56px] flex items-center justify-end active:opacity-80 transition-opacity duration-150"
        >
          <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-outline-variant">
            <img src={avatarImg} alt="User profile photo" className="w-full h-full object-cover" />
          </div>
        </button>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 w-full max-w-3xl mx-auto pt-[88px] pb-[120px] lg:pt-[32px] px-margin-page flex flex-col gap-section-gap">
        {/* Header & Search */}
        <section className="flex flex-col gap-stack-gap">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Therapy Programs</h1>

          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-outline" />
            </div>
            <input
              type="text"
              placeholder="Search exercises, body parts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full min-h-touch-target-min pl-12 pr-4 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface placeholder-on-surface-variant/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-shadow"
            />
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide -mx-margin-page px-margin-page">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'flex-shrink-0 px-4 py-1.5 rounded-full font-label-md text-label-md transition-all duration-200 cursor-pointer',
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'bg-white border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Program List */}
        <section className="flex flex-col gap-stack-gap">
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
              className="text-center py-20 bg-surface-container-lowest rounded-card border border-outline-variant/30"
            >
              <Search size={44} className="mx-auto mb-3 text-outline-variant" />
              <p className="font-semibold text-on-surface-variant">No programs found</p>
              <p className="text-sm text-outline mt-1">Try changing your search keywords or categories</p>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
};
