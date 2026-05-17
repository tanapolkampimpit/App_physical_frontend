import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Target, BarChart2 } from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_SESSIONS = [
  { id: 1, exercise: 'Seated Knee Extensions', date: '15 ม.ค.', time: '14:30', accuracy: 95, gradient: 'from-blue-400 to-blue-600' },
  { id: 2, exercise: 'Arm Circles', date: '14 ม.ค.', time: '10:15', accuracy: 92, gradient: 'from-purple-400 to-purple-600' },
  { id: 3, exercise: 'Hip Flexor Stretch', date: '13 ม.ค.', time: '09:45', accuracy: 88, gradient: 'from-pink-400 to-pink-600' },
  { id: 4, exercise: 'Walking Balance', date: '12 ม.ค.', time: '15:20', accuracy: 91, gradient: 'from-orange-400 to-orange-600' },
  { id: 5, exercise: 'Resistance Band Rows', date: '11 ม.ค.', time: '11:00', accuracy: 94, gradient: 'from-green-400 to-green-600' },
];

const CHART_DATA = {
  weekly: [
    { label: 'จ', value: 70 },
    { label: 'อ', value: 72 },
    { label: 'พ', value: 75 },
    { label: 'พฤ', value: 78 },
    { label: 'ศ', value: 82 },
    { label: 'ส', value: 85 },
    { label: 'อา', value: 88 },
  ],
  monthly: [
    { label: 'สัป 1', value: 72 },
    { label: 'สัป 2', value: 76 },
    { label: 'สัป 3', value: 81 },
    { label: 'สัป 4', value: 88 },
  ],
};

const SUMMARY = [
  { icon: Flame, label: 'ต่อเนื่อง', value: '5 วัน', color: 'text-orange-500 bg-orange-50 border-orange-100' },
  { icon: Target, label: 'ความแม่นยำ', value: '92%', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { icon: BarChart2, label: 'เซสชันทั้งหมด', value: '24', color: 'text-blue-500 bg-blue-50 border-blue-100' },
];

export const History = () => {
  const [tab, setTab] = useState('weekly');
  const data = CHART_DATA[tab];
  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = Math.min(...data.map((d) => d.value));
  const improvement = (((data[data.length - 1].value - data[0].value) / data[0].value) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-28 lg:pb-8 transition-colors">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-700 z-10 transition-colors">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-5 pb-3 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">ความก้าวหน้า</h1>
            <div className="flex gap-2">
              {['weekly', 'monthly'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer',
                    tab === t
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  {t === 'weekly' ? 'รายสัปดาห์' : 'รายเดือน'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 pt-5 space-y-5">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          {SUMMARY.map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className={cn('bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-5 text-center shadow-sm border transition-colors', color.split(' ')[2] ?? 'border-gray-100 dark:border-gray-700')}
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 dark:bg-opacity-20', color.split(' ')[1], color.split(' ')[0])}>
                <Icon size={18} />
              </div>
              <p className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Desktop: 2-column layout for chart + sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-colors"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 dark:text-white">Range of Motion</h2>
              <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-xl">
                <TrendingUp size={13} />
                <span>+{improvement}%</span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-2 h-44 lg:h-52">
              {data.map((d, i) => {
                const pct = maxVal === minVal ? 80 : 20 + ((d.value - minVal) / (maxVal - minVal)) * 75;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-xs text-gray-400 font-medium">{d.value}%</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: i * 0.06, type: 'spring', stiffness: 180 }}
                      className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-lg hover:from-emerald-600 hover:to-emerald-400 transition-colors cursor-default"
                    />
                    <span className="text-xs text-gray-400">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Sessions list */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors"
          >
            <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">เซสชันล่าสุด</h2>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {MOCK_SESSIONS.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  onClick={() => {}}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex-shrink-0 shadow-sm`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{s.exercise}</p>
                    <p className="text-xs text-gray-400">{s.date} · {s.time}</p>
                  </div>
                  <span className={cn(
                    'text-xs font-bold px-2.5 py-1 rounded-xl flex-shrink-0',
                    s.accuracy >= 90 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                  )}>
                    {s.accuracy}%
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
