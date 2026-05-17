import { AppSidebar } from './AppSidebar';
import { BottomNav } from './BottomNav';

export const Layout = ({ children, showNav = true }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {showNav && <AppSidebar />}

      <main className={showNav ? 'lg:ml-64' : ''}>
        {children}
      </main>

      {showNav && <BottomNav />}
    </div>
  );
};
