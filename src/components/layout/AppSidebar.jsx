import { motion } from 'framer-motion';
import { Activity, Home, Zap, Clock, User, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/welcome' },
  { label: 'Programs', icon: Zap, path: '/programs' },
  { label: 'History', icon: Clock, path: '/history' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#f9f9ff] dark:bg-gray-900 border-r border-[#bcc9c6]/50 dark:border-gray-800 shadow-[1px_0_8px_rgba(0,0,0,0.04)] z-40 transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#bcc9c6]/40 dark:border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-[#00685f] flex items-center justify-center shadow-md shadow-[#00685f]/20">
          <Activity size={20} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-[#1a1c1e] dark:text-white leading-none">PhysioCare</p>
          <p className="text-xs text-[#00685f] dark:text-emerald-400 font-medium mt-0.5">AI Physical Therapy</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active = isActive(path);
          return (
            <motion.button
              key={path}
              whileHover={{ x: active ? 0 : 2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(path)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer group',
                active
                  ? 'bg-[#89f5e7] dark:bg-emerald-500/20 text-[#00201d] dark:text-emerald-400'
                  : 'text-[#3d4947] dark:text-gray-400 hover:bg-[#dde4e3]/60 dark:hover:bg-gray-800 hover:text-[#1a1c1e] dark:hover:text-white'
              )}
            >
              <Icon
                size={20}
                className={cn(
                  'flex-shrink-0 transition-colors',
                  active ? 'text-[#00685f] dark:text-emerald-400' : 'text-[#6d7a77] dark:text-gray-500 group-hover:text-[#00685f] dark:group-hover:text-emerald-400'
                )}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="flex-1 text-left">{label}</span>
              {active && <ChevronRight size={14} className="text-[#00685f] dark:text-emerald-400" />}
            </motion.button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-[#bcc9c6]/40 dark:border-gray-800">
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-[#dde4e3]/50 dark:bg-gray-800 cursor-pointer hover:bg-[#dde4e3] dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#89f5e7] border-2 border-[#6bd8cb] flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-[#00685f]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1a1c1e] dark:text-white truncate">ผู้ใช้งาน</p>
            <p className="text-xs text-[#6d7a77] dark:text-gray-400">LINE Account</p>
          </div>
          <ChevronRight size={14} className="text-[#6d7a77] dark:text-gray-400" />
        </div>
      </div>
    </aside>
  );
};
