import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Search, Info } from 'lucide-react';
import { mockPrograms, exerciseInstructions } from '../exercise/exerciseData';
import { cn } from '../../../lib/utils';

export const ManageProgramModal = ({ isOpen, onClose, patientName, initialPrograms = [], onSave }) => {
  // initialPrograms: [{ exerciseId: 1, targetReps: 10, sets: 2 }]
  const [selectedPrograms, setSelectedPrograms] = useState([...initialPrograms]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Derive categories from exerciseInstructions
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    Object.values(exerciseInstructions).forEach(info => cats.add(info.category));
    return Array.from(cats);
  }, []);

  const filteredPrograms = useMemo(() => {
    return mockPrograms.filter(prog => {
      const info = exerciseInstructions[prog.id];
      const matchesSearch = prog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            prog.titleEn.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || (info && info.category === activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const toggleProgram = (programId) => {
    const exists = selectedPrograms.find(p => p.exerciseId === programId);
    if (exists) {
      setSelectedPrograms(selectedPrograms.filter(p => p.exerciseId !== programId));
    } else {
      setSelectedPrograms([...selectedPrograms, { exerciseId: programId, targetReps: 10, sets: 3 }]);
    }
  };

  const updateProgramDetails = (programId, field, value) => {
    setSelectedPrograms(prev => prev.map(p => 
      p.exerciseId === programId ? { ...p, [field]: value } : p
    ));
  };

  const handleSave = () => {
    onSave(selectedPrograms);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', sm: { y: 0, scale: 0.95 } }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: '100%', sm: { y: 0, scale: 0.95 } }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full h-[90vh] sm:h-auto sm:max-h-[85vh] sm:max-w-2xl bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">จัดโปรแกรมกายภาพ</h2>
              <p className="text-sm text-gray-500 font-medium">สำหรับ {patientName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search & Filter */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="ค้นหาท่ากายบริหาร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors",
                    activeCategory === cat 
                      ? "bg-blue-100 text-blue-700" 
                      : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {filteredPrograms.map(prog => {
              const isSelected = selectedPrograms.find(p => p.exerciseId === prog.id);
              const info = exerciseInstructions[prog.id];

              return (
                <div 
                  key={prog.id} 
                  className={cn(
                    "bg-white rounded-2xl border transition-all overflow-hidden",
                    isSelected ? "border-blue-400 shadow-sm ring-1 ring-blue-400/20" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div 
                    className="p-4 flex gap-4 cursor-pointer select-none"
                    onClick={() => toggleProgram(prog.id)}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                      isSelected ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300 bg-gray-50"
                    )}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{prog.title}</h3>
                      <p className="text-xs text-gray-500 truncate mb-1">{prog.titleEn}</p>
                      
                      {info && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                            {info.category}
                          </span>
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-md",
                            info.difficulty === 'Easy' ? "bg-emerald-50 text-emerald-600" :
                            info.difficulty === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                          )}>
                            {info.difficulty}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details config when selected */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-blue-50 bg-blue-50/30"
                      >
                        <div className="p-4 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">จำนวนครั้ง (Reps)</label>
                            <div className="flex items-center">
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateProgramDetails(prog.id, 'targetReps', Math.max(1, isSelected.targetReps - 1)); }}
                                className="w-8 h-8 rounded-l-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold"
                              >-</button>
                              <input 
                                type="number" 
                                value={isSelected.targetReps}
                                onChange={(e) => updateProgramDetails(prog.id, 'targetReps', parseInt(e.target.value) || 1)}
                                className="w-12 h-8 border-y border-gray-200 text-center text-sm font-bold text-gray-900 focus:outline-none"
                              />
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateProgramDetails(prog.id, 'targetReps', isSelected.targetReps + 1); }}
                                className="w-8 h-8 rounded-r-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold"
                              >+</button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">จำนวนเซ็ต (Sets)</label>
                            <div className="flex items-center">
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateProgramDetails(prog.id, 'sets', Math.max(1, isSelected.sets - 1)); }}
                                className="w-8 h-8 rounded-l-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold"
                              >-</button>
                              <input 
                                type="number" 
                                value={isSelected.sets}
                                onChange={(e) => updateProgramDetails(prog.id, 'sets', parseInt(e.target.value) || 1)}
                                className="w-12 h-8 border-y border-gray-200 text-center text-sm font-bold text-gray-900 focus:outline-none"
                              />
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateProgramDetails(prog.id, 'sets', isSelected.sets + 1); }}
                                className="w-8 h-8 rounded-r-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold"
                              >+</button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredPrograms.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 font-medium">ไม่พบท่ากายบริหาร</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <Check size={18} />
              บันทึกโปรแกรม ({selectedPrograms.length} ท่า)
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
