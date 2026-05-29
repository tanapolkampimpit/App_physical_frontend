import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Activity, CheckCircle2, TrendingDown, ClipboardList, Plus, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_PATIENTS } from '../data/mockTherapistData';
import { mockPrograms } from '../components/features/exercise/exerciseData';
import { ManageProgramModal } from '../components/features/therapist/ManageProgramModal';
import { cn } from '../lib/utils';

export const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const patient = MOCK_PATIENTS.find(p => p.id === id);
  const [assignedPrograms, setAssignedPrograms] = useState(patient?.assignedPrograms || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold mb-4">Patient not found</h1>
        <button onClick={() => navigate('/therapist/dashboard')} className="text-blue-500 font-bold">Go back</button>
      </div>
    );
  }

  // Calculate simple stats
  const totalSessions = patient.history.length;
  const avgPain = totalSessions > 0 ? (patient.history.reduce((acc, curr) => acc + curr.pain, 0) / totalSessions).toFixed(1) : 0;

  const handleSavePrograms = (newPrograms) => {
    setAssignedPrograms(newPrograms);
    // In a real app, you would save this to the backend here
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 lg:pb-8 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/therapist/dashboard')}
            className="p-2 rounded-full hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Patient Detail</h1>
            <p className="text-xs text-gray-500">{patient.id}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 lg:p-8 space-y-6">
        
        {/* Profile Card */}
        <section className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          <div className="flex items-center gap-5">
            <div className={cn("w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl shrink-0", patient.avatarBg)}>
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{patient.name}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1"><User size={14} /> {patient.age} ปี • {patient.gender}</span>
              </div>
            </div>
          </div>

          <div className="h-px w-full lg:w-px lg:h-16 bg-gray-100 my-2 lg:my-0"></div>

          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">การวินิจฉัยโรค</p>
              <p className="font-bold text-gray-800">{patient.condition}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">ระยะการฟื้นฟู</p>
              <span className={cn(
                "px-3 py-1 rounded-full text-[11px] font-bold border",
                patient.phase === 'Acute' ? "bg-rose-50 text-rose-700 border-rose-100" :
                patient.phase === 'Sub-acute' ? "bg-amber-50 text-amber-700 border-amber-100" :
                "bg-green-50 text-green-700 border-green-100"
              )}>
                {patient.phase} Phase
              </span>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={24} className="text-emerald-500 mb-2" />
            <h3 className="text-3xl font-black text-gray-900">{patient.complianceScore}%</h3>
            <p className="text-sm font-semibold text-gray-500 mt-1">ความสม่ำเสมอ (Compliance)</p>
          </div>
          <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <Activity size={24} className={patient.painScale >= 7 ? "text-rose-500 mb-2" : "text-amber-500 mb-2"} />
            <h3 className="text-3xl font-black text-gray-900">{patient.painScale}/10</h3>
            <p className="text-sm font-semibold text-gray-500 mt-1">ระดับความปวดล่าสุด</p>
          </div>
          <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
            <TrendingDown size={24} className="text-blue-500 mb-2" />
            <h3 className="text-3xl font-black text-gray-900">{avgPain}</h3>
            <p className="text-sm font-semibold text-gray-500 mt-1">ความปวดเฉลี่ย (Avg Pain)</p>
          </div>
        </div>

        {/* Assigned Programs Section */}
        <section className="bg-white rounded-[24px] p-6 lg:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Settings2 className="text-blue-500" size={24} />
              <h3 className="text-xl font-bold text-gray-900">โปรแกรมกายภาพที่ได้รับมอบหมาย</h3>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 px-4 py-2 rounded-xl font-bold transition-colors"
            >
              <Plus size={18} />
              จัดโปรแกรม
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedPrograms.map((ap, idx) => {
              const progDef = mockPrograms.find(p => p.id === ap.exerciseId);
              if (!progDef) return null;
              return (
                <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1">{progDef.title}</h4>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-1">{progDef.titleEn}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/60">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">จำนวนครั้ง</p>
                      <p className="font-black text-gray-800">{ap.targetReps}</p>
                    </div>
                    <div className="w-px h-6 bg-gray-200"></div>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">จำนวนเซ็ต</p>
                      <p className="font-black text-gray-800">{ap.sets}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {assignedPrograms.length === 0 && (
              <div className="col-span-full py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">ยังไม่มีโปรแกรมที่ได้รับมอบหมาย</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-3 text-sm text-blue-500 font-bold hover:underline"
                >
                  เริ่มจัดโปรแกรมเลย
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Details & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Chart / Analytics */}
          <section className="lg:col-span-2 bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="text-blue-500" size={20} />
              <h3 className="text-lg font-bold text-gray-900">แนวโน้มระดับความปวด (Pain Trend)</h3>
            </div>
            
            {/* Very simple visual bar chart */}
            <div className="h-48 flex items-end justify-between gap-2 pt-4">
              {patient.history.map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded font-medium absolute -mt-10">
                    Pain: {h.pain}
                  </div>
                  {/* Bar */}
                  <div className="w-full bg-blue-50 rounded-t-lg relative flex items-end justify-center group-hover:bg-blue-100 transition-colors" style={{ height: '100%' }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(h.pain / 10) * 100}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={cn(
                        "w-full rounded-t-lg",
                        h.pain >= 7 ? "bg-rose-400" : h.pain >= 4 ? "bg-amber-400" : "bg-emerald-400"
                      )}
                    />
                  </div>
                  {/* Label */}
                  <span className="text-[10px] text-gray-400 font-semibold">{h.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Session History */}
          <section className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-blue-500" size={20} />
              <h3 className="text-lg font-bold text-gray-900">ประวัติการฝึกซ้อม</h3>
            </div>

            <div className="space-y-4">
              {patient.history.slice().reverse().map((h, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-gray-500">
                    <Activity size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{h.date}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 font-medium">
                      <span>จำนวน: <strong className="text-gray-900">{h.reps} ครั้ง</strong></span>
                      <span>Pain: <strong className={h.pain >= 7 ? "text-rose-500" : ""}>{h.pain}/10</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {patient.history.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">ไม่มีประวัติการฝึกซ้อม</p>
            )}
          </section>

        </div>
      </main>

      <ManageProgramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientName={patient.name}
        initialPrograms={assignedPrograms}
        onSave={handleSavePrograms}
      />
    </div>
  );
};
