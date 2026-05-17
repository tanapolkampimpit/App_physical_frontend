import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

export const SettingToggle = ({ icon: Icon, title, description, checked, onChange, activeColor = 'bg-emerald-500' }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
          checked ? `${activeColor}/10 text-${activeColor.replace('bg-', '')}` : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
        )}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>
      
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative flex items-center w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-emerald-500",
          checked ? activeColor : "bg-gray-300 dark:bg-gray-600"
        )}
      >
        <motion.div
          layout
          initial={false}
          animate={{ x: checked ? 26 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
};
