import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, AlertCircle, Activity, Thermometer, Calendar, Dumbbell, Footprints, Accessibility, User, Flame, ShieldCheck } from 'lucide-react';
import { getProfile, saveProfile } from '../lib/profileStore';
import { cn } from '../lib/utils';

const STEPS = [
  { id: 'area', title: 'บริเวณที่มีปัญหา' },
  { id: 'pain', title: 'ระดับความเจ็บปวด' },
  { id: 'duration', title: 'ระยะเวลา' },
  { id: 'swelling', title: 'อาการอักเสบ' }
];

export const Assessment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState({
    targetArea: '',
    painScale: 5,
    duration: '',
    swelling: null
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      finishAssessment();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    } else {
      navigate('/welcome');
    }
  };

  const finishAssessment = () => {
    // Evaluate Phase
    let phase = 'chronic';
    if (formData.duration === 'acute' || formData.swelling === true || formData.painScale >= 7) {
      phase = 'acute';
    } else if (formData.duration === 'sub_acute' || formData.painScale >= 4) {
      phase = 'sub_acute';
    }

    const profile = getProfile();
    saveProfile({
      ...profile,
      pain_scale: formData.painScale,
      target_area: formData.targetArea,
      phase: phase
    });

    if (profile.usage_mode === 'caregiver') {
      navigate('/caregiver-programs');
    } else {
      navigate('/programs');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 lg:p-8 pb-32">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pt-4">
          <button onClick={handleBack} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">ประเมินอาการ</h1>
            <p className="text-sm text-gray-500 mt-1">AI จะช่วยเลือกท่าที่ปลอดภัยที่สุดสำหรับคุณ</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: idx <= currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Activity size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">คุณมีอาการปวดหรือตึงบริเวณใดมากที่สุด?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'shoulder', label: 'หัวไหล่ / แขน', icon: <Dumbbell size={28} className="text-emerald-500" /> },
                    { id: 'knee', label: 'ข้อเข่า / ขา', icon: <Footprints size={28} className="text-emerald-500" /> },
                    { id: 'hip', label: 'สะโพก / หลังล่าง', icon: <Accessibility size={28} className="text-emerald-500" /> },
                    { id: 'all', label: 'ปวดเมื่อยทั่วไป (General)', icon: <User size={28} className="text-emerald-500" /> }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setFormData(prev => ({ ...prev, targetArea: item.id }))}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4",
                        formData.targetArea === item.id 
                          ? "border-emerald-500 bg-emerald-50" 
                          : "border-gray-100 hover:border-emerald-200"
                      )}
                    >
                      <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                        {item.icon}
                      </div>
                      <span className="font-semibold text-gray-800 text-lg">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">ระดับความเจ็บปวดปัจจุบัน (0-10)</h2>
                  <p className="text-sm text-gray-500 mt-2">0 = ไม่ปวดเลย, 10 = ปวดทนไม่ไหว</p>
                </div>
                <div className="px-4 py-8">
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    value={formData.painScale} 
                    onChange={(e) => setFormData(prev => ({ ...prev, painScale: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs font-bold text-gray-400 mt-4">
                    <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                  </div>
                  <div className="text-center mt-8">
                    <span className={cn(
                      "text-5xl font-black",
                      formData.painScale <= 3 ? "text-emerald-500" :
                      formData.painScale <= 6 ? "text-amber-500" : "text-rose-500"
                    )}>
                      {formData.painScale}
                    </span>
                    <p className="text-gray-500 font-medium mt-2">
                      {formData.painScale <= 3 ? "ปวดเล็กน้อย (Mild)" :
                       formData.painScale <= 6 ? "ปวดปานกลาง (Moderate)" : "ปวดมาก (Severe)"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">อาการปวดนี้เป็นมานานแค่ไหนแล้ว?</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'acute', label: 'เพิ่งเป็น (น้อยกว่า 1 สัปดาห์)', sub: 'ระยะเฉียบพลัน' },
                    { id: 'sub_acute', label: 'เป็นมาสักระยะ (1-4 สัปดาห์)', sub: 'ระยะกึ่งเฉียบพลัน' },
                    { id: 'chronic', label: 'เป็นมานาน (มากกว่า 1 เดือน)', sub: 'ระยะเรื้อรัง' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setFormData(prev => ({ ...prev, duration: item.id }))}
                      className={cn(
                        "p-5 rounded-2xl border-2 text-left transition-all",
                        formData.duration === item.id 
                          ? "border-emerald-500 bg-emerald-50" 
                          : "border-gray-100 hover:border-emerald-200"
                      )}
                    >
                      <h3 className="font-bold text-gray-900 text-lg">{item.label}</h3>
                      <p className="text-sm text-gray-500">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Thermometer size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">มีอาการ บวม แดง หรือร้อน บริเวณที่ปวดหรือไม่?</h2>
                  <p className="text-sm text-gray-500 mt-2">สัญญาณของการอักเสบเฉียบพลัน</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, swelling: true }))}
                    className={cn(
                      "flex-1 p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                      formData.swelling === true ? "border-rose-500 bg-rose-50 text-rose-700" : "border-gray-100 hover:border-gray-200 text-gray-600"
                    )}
                  >
                    <Flame size={36} className={formData.swelling === true ? "text-rose-500" : "text-gray-400"} />
                    <span className="font-bold">มีอาการ (บวม/แดง/ร้อน)</span>
                  </button>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, swelling: false }))}
                    className={cn(
                      "flex-1 p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
                      formData.swelling === false ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-100 hover:border-gray-200 text-gray-600"
                    )}
                  >
                    <ShieldCheck size={36} className={formData.swelling === false ? "text-emerald-500" : "text-gray-400"} />
                    <span className="font-bold">ไม่มี (ปวดเมื่อยทั่วไป)</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 0 && !formData.targetArea) ||
              (currentStep === 2 && !formData.duration) ||
              (currentStep === 3 && formData.swelling === null)
            }
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {currentStep === STEPS.length - 1 ? 'เสร็จสิ้นการประเมิน' : 'ถัดไป'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
