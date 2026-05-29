import { ArrowLeft, Clock, Repeat, ChevronRight, TriangleAlert, Activity, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mockPrograms, exerciseInstructions } from '../components/features/exercise/exerciseData';
import { getProfile } from '../lib/profileStore';

// Import images to showcase on the preview screen
import shoulderRotationImg from '../assets/shoulder_rotation.png';
import overheadRaiseImg from '../assets/overhead_raise.png';
import seatedKneeExtImg from '../assets/seated_knee_ext.png';
import lyingKneeFlexImg from '../assets/lying_knee_flex.png';
import hipAbductionImg from '../assets/hip_abduction.png';
import bandPullImg from '../assets/band_pull.png';
import sitToStandImg from '../assets/sit_to_stand.png';
import caregiverKneeImg from '../assets/caregiver_knee.png';
import caregiverShoulderImg from '../assets/caregiver_shoulder.png';
import caregiverAnkleImg from '../assets/caregiver_ankle.png';
import caregiverElbowImg from '../assets/caregiver_elbow.png';

const IMAGE_MAP = {
  1: shoulderRotationImg,
  2: overheadRaiseImg,
  3: seatedKneeExtImg,
  4: lyingKneeFlexImg,
  5: hipAbductionImg,
  6: bandPullImg,
  7: sitToStandImg,
  101: caregiverShoulderImg,
  102: caregiverElbowImg,
  103: caregiverKneeImg,
  104: caregiverAnkleImg,
};

export const ExercisePreview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const numId = parseInt(id) || 1;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const localProfile = getProfile();
    setProfile(localProfile);
  }, []);

  const targetRoute = profile?.usage_mode === 'caregiver' ? `/caregiver-exercise/${numId}` : `/exercise/${numId}`;

  const program = mockPrograms.find((p) => p.id === numId);
  const info = exerciseInstructions[numId];

  if (!program || !info) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center font-sans">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-sm">
          <TriangleAlert className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-gray-800 font-semibold text-lg">ไม่พบข้อมูลท่าออกกำลังกาย</p>
          <button onClick={() => navigate('/programs')} className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-xl">
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  const exerciseImg = IMAGE_MAP[numId] ?? shoulderRotationImg;

  return (
    <div className="min-h-screen bg-surface pb-36 lg:pb-12 font-sans selection:bg-emerald-500/10 flex flex-col">
      {/* Top Navigation */}
      <div className="bg-white px-6 py-4 flex items-center border-b border-gray-100 sticky top-0 z-30">
        <button
          onClick={() => navigate(profile?.usage_mode === 'caregiver' ? '/caregiver-programs' : '/programs')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold">ย้อนกลับ</span>
        </button>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 lg:p-8 flex flex-col gap-6">
        
        {/* Header Section */}
        <section className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-6 items-center">
          {/* Image */}
          <div className="w-full lg:w-[280px] h-[220px] rounded-[20px] bg-gray-50 overflow-hidden shrink-0 relative group flex items-center justify-center">
            <img 
              src={exerciseImg} 
              alt={program.title} 
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Details */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100/50">
                {info.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-gray-100/50 ${
                info.difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
                info.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
                'bg-rose-50 text-rose-700'
              }`}>
                <Star size={12} className={
                  info.difficulty === 'Easy' ? 'text-green-500 fill-green-500' :
                  info.difficulty === 'Medium' ? 'text-amber-500 fill-amber-500' :
                  'text-rose-500 fill-rose-500'
                } />
                {info.difficulty}
              </span>
            </div>

            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {program.title}
              </h1>
              <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-wider">{program.titleEn}</p>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {info.description}
            </p>

            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-[16px] text-sm font-semibold">
                <Clock size={16} className="text-emerald-500" />
                <span>{info.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-[16px] text-sm font-semibold">
                <Repeat size={16} className="text-emerald-500" />
                <span>{info.reps} ครั้ง</span>
              </div>
            </div>
          </div>
        </section>

        {/* Instructions and Warnings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Steps List */}
          <div className="lg:col-span-7 bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Activity size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">ขั้นตอนการทำท่ากายภาพ</h2>
            </div>

            <ol className="relative border-l-2 border-gray-100 ml-3 pl-5 space-y-6">
              {info.steps.map((step, i) => (
                <li key={i} className="relative flex gap-4 items-start">
                  <span className="absolute left-[-33px] w-6 h-6 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-600 text-[11px] shadow-sm">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Warnings */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-amber-50 rounded-[24px] border border-amber-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-xl">
                  <TriangleAlert size={18} />
                </div>
                <h2 className="font-bold text-amber-900 text-base">ข้อควรระวังสำคัญ</h2>
              </div>
              <ul className="space-y-3">
                {info.tips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-amber-800 text-sm leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="font-medium">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Start Button (Desktop) */}
            <div className="hidden lg:block bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 text-center">
              <h3 className="text-gray-900 font-bold mb-2">พร้อมสำหรับการฝึกแล้วหรือยัง?</h3>
              <p className="text-gray-500 text-xs mb-6 px-4">ระบบจะใช้กล้องเพื่อช่วยนับจำนวนครั้งและวิเคราะห์ท่าทางให้คุณ</p>
              
              <button
                onClick={() => navigate(targetRoute)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-[20px] flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>{profile?.usage_mode === 'caregiver' ? 'เริ่มออกกำลังกาย (โหมดผู้ดูแล)' : 'เริ่มออกกำลังกาย'}</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Start Button (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-40 pb-safe">
        <button
          onClick={() => navigate(targetRoute)}
          className="w-full bg-emerald-500 active:bg-emerald-600 text-white font-bold py-4 rounded-[20px] flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <span>{profile?.usage_mode === 'caregiver' ? 'เริ่มออกกำลังกาย (โหมดผู้ดูแล)' : 'เริ่มออกกำลังกาย'}</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
