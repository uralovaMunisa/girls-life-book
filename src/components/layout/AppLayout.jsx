import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DesktopSidebar from './DesktopSidebar';
import MobileNavbar from './MobileNavbar';
import Header from './Header';
import BackgroundGlow from '../ambient/BackgroundGlow';
import GlobalSearchModal from '../ambient/GlobalSearchModal';
import Toast from '../common/Toast';
import AuthPage from '../auth/AuthPage';
import { useCurrentUser } from '../../store/useAppStore';

export default function AppLayout() {
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (currentUser?.theme === 'warm') {
      document.body.classList.add('theme-warm');
    } else {
      document.body.classList.remove('theme-warm');
    }
  }, [currentUser?.theme]);

  // If no user is logged in, show the Authentication / Registration Screen
  if (!currentUser) {
    return (
      <>
        <AuthPage />
        <Toast />
      </>
    );
  }

  return (
    <div className="relative min-h-screen flex bg-lunara-bg-deep text-[#f3f0fa] selection:bg-purple-600/40 selection:text-purple-200">
      {/* Dynamic Starfield & Glowing Background Orbs */}
      <BackgroundGlow />

      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8 relative z-10">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavbar />

      {/* Overlays */}
      <GlobalSearchModal />
      <Toast />
    </div>
  );
}
