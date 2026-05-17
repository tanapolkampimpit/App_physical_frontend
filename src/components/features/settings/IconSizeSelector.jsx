import { cn } from '../../../lib/utils';
import { LayoutGrid } from 'lucide-react';

const SIZES = [
  { id: 'sm', label: 'เล็ก', iconSize: 16 },
  { id: 'md', label: 'กลาง', iconSize: 20 },
  { id: 'lg', label: 'ใหญ่', iconSize: 24 },
];

export const IconSizeSelector = ({ value, onChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
          <LayoutGrid size={16} className="text-blue-500 dark:text-blue-400" />
        </div>
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm">ขนาดไอคอน</h2>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {SIZES.map((size) => {
          const isSelected = value === size.id;
          return (
            <button
              key={size.id}
              onClick={() => onChange(size.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                isSelected
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-gray-600 bg-transparent text-gray-500 dark:text-gray-400"
              )}
            >
              <LayoutGrid size={size.iconSize} />
              <span className="text-xs font-semibold">{size.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
