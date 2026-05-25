import { motion } from 'framer-motion';
import { Home, Zap, Clock, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useSettings } from '../../contexts/SettingsContext';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, path: '/welcome' },
  { label: 'Programs', icon: Zap, path: '/programs' },
  { label: 'History', icon: Clock, path: '/history' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const { settings } = useSettings();

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26,
  };
  const currentIconSize = iconSizes[settings?.iconSize] || 22;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f9f9ff]/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-[#bcc9c6]/50 dark:border-gray-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] transition-colors">
      <div className="flex justify-around items-center px-4 py-2 min-h-[72px] max-w-3xl mx-auto">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active = isActive(path);
          return (
            <motion.button
              key={path}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center justify-center min-h-[56px] transition-all duration-200 cursor-pointer flex-1 gap-1',
                active ? 'text-[#00201d] dark:text-emerald-400' : 'text-[#3d4947] dark:text-gray-400'
              )}
            >
              <div className={cn(
                'px-5 py-1.5 rounded-full transition-all duration-250 flex items-center justify-center relative',
                active ? 'bg-[#89f5e7] dark:bg-emerald-500/20' : 'hover:bg-[#dde4e3]/40 dark:hover:bg-gray-800/40'
              )}>
                <Icon
                  size={currentIconSize}
                  className={active ? 'text-[#00685f] dark:text-emerald-400' : 'text-[#6d7a77] dark:text-gray-400'}
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>
              <span className={cn(
                'text-xs leading-none mt-0.5',
                active 
                  ? 'font-bold text-[#00685f] dark:text-emerald-400' 
                  : 'font-normal text-[#6d7a77] dark:text-gray-400'
              )}>
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
