import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Activity, AlertTriangle, Search, ChevronRight, ArrowLeft, Stethoscope, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PATIENTS, MOCK_OVERVIEW_STATS } from '../data/mockTherapistData';
import { cn } from '../lib/utils';
import avatarImg from '../assets/avatar.png';

export const TherapistDashboard = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, attention, active

  const filteredPatients = MOCK_PATIENTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(query.toLowerCase()) || p.condition.toLowerCase().includes(query.toLowerCase());
    const matchTab = activeTab === 'all' || p.status === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 lg:pb-8 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/welcome')}
            className="p-2 rounded-full hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Stethoscope size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Physiotherapist Portal</h1>
          </div>
        </div>
        
        <div className="w-10 h-10 rounded-full border-2 border-gray-100 overflow-hidden shrink-0">
          <img src={avatarImg} alt="Therapist" className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Overview Stats */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">ภาพรวมสถิติ (Overview)</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Users size={18} /></div>
                <span className="text-sm font-semibold text-gray-500">ผู้ป่วยทั้งหมด</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{MOCK_OVERVIEW_STATS.totalPatients}</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Activity size={18} /></div>
                <span className="text-sm font-semibold text-gray-500">เคลื่อนไหวสัปดาห์นี้</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{MOCK_OVERVIEW_STATS.activeThisWeek}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-5 rounded-[20px] shadow-sm border border-rose-100 bg-rose-50/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-xl"><AlertTriangle size={18} /></div>
                <span className="text-sm font-semibold text-rose-600">ต้องติดตามด่วน</span>
              </div>
              <p className="text-3xl font-black text-rose-700">{MOCK_OVERVIEW_STATS.needsAttention}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={18} /></div>
                <span className="text-sm font-semibold text-gray-500">ความสม่ำเสมอเฉลี่ย</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{MOCK_OVERVIEW_STATS.avgCompliance}%</p>
            </motion.div>
          </div>
        </section>

        {/* Patient List */}
        <section className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between lg:items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">รายชื่อผู้ป่วย (Patients)</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Tabs */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setActiveTab('all')} className={cn("px-4 py-1.5 text-sm font-semibold rounded-lg transition-all", activeTab === 'all' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}>ทั้งหมด</button>
                <button onClick={() => setActiveTab('attention')} className={cn("px-4 py-1.5 text-sm font-semibold rounded-lg transition-all", activeTab === 'attention' ? "bg-white text-rose-600 shadow-sm" : "text-gray-500 hover:text-gray-700")}>ต้องติดตาม</button>
              </div>

              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ค้นหาชื่อผู้ป่วย..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredPatients.map((patient, idx) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/therapist/patient/${patient.id}`)}
                  className="p-5 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col sm:flex-row gap-5 sm:items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0", patient.avatarBg)}>
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        {patient.name}
                        {patient.status === 'attention' && <span className="flex w-2 h-2 rounded-full bg-rose-500"></span>}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">{patient.condition} • {patient.age} ปี</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 pl-16 sm:pl-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">ความเจ็บปวด</p>
                      <div className="flex items-center gap-2 justify-end">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-bold",
                          patient.painScale >= 7 ? "bg-rose-100 text-rose-700" :
                          patient.painScale >= 4 ? "bg-amber-100 text-amber-700" :
                          "bg-green-100 text-green-700"
                        )}>
                          ระดับ {patient.painScale}/10
                        </span>
                      </div>
                    </div>

                    <div className="text-right w-24">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">ความสม่ำเสมอ</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", patient.complianceScore < 50 ? "bg-rose-500" : "bg-emerald-500")}
                            style={{ width: `${patient.complianceScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{patient.complianceScore}%</span>
                      </div>
                    </div>

                    <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPatients.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                ไม่พบข้อมูลผู้ป่วย
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};
