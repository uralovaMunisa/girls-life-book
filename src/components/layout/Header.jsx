import React from 'react';
import { Search, Moon, Sun, LogOut, Globe } from 'lucide-react';
import { useAppStore, useCurrentUser, useTranslation } from '../../store/useAppStore';
import { formatUzbekDate } from '../../utils/dateUtils';
import AmbientSoundPlayer from '../ambient/AmbientSoundPlayer';

export default function Header() {
  const currentUser = useCurrentUser();
  const { setTheme, setSearchOpen, logout } = useAppStore();
  const { language, setLanguage, t } = useTranslation();

  const isWarm = currentUser?.theme === 'warm';
  const todayStr = formatUzbekDate(new Date(), language);

  const toggleLanguage = () => {
    setLanguage(language === 'uz' ? 'en' : 'uz');
  };

  return (
    <header className="sticky top-0 z-20 w-full px-4 sm:px-8 py-3.5 bg-lunara-bg-deep/75 backdrop-blur-xl border-b border-purple-500/10 flex items-center justify-between">
      {/* Left: Today's date with gentle sparkle */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-glow-sm" />
        <span className="text-xs sm:text-sm font-medium text-purple-200/90 font-sans tracking-wide">
          {todayStr}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel text-xs font-semibold text-purple-200 border border-purple-500/25 hover:border-purple-400/50 hover:bg-purple-900/30 transition-all shadow-sm"
          title={language === 'uz' ? "Switch to English" : "O‘zbek tiliga o‘tish"}
        >
          <Globe className="w-3.5 h-3.5 text-purple-400" />
          <span className="tracking-wider">{language === 'uz' ? 'UZ' : 'EN'}</span>
        </button>

        {/* Ambient audio player */}
        <AmbientSoundPlayer />

        {/* Global Search Button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 rounded-full glass-panel text-purple-300/80 hover:text-purple-100 hover:border-purple-400/40 transition-all border border-purple-500/20 shadow-sm"
          title={`${t('search')} (Ctrl+K)`}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Theme mood toggle (Warm / Deep Night) */}
        <button
          onClick={() => setTheme(isWarm ? 'deep' : 'warm')}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
            isWarm
              ? 'bg-amber-950/40 text-amber-200 border-amber-500/40 shadow-glow-gold'
              : 'glass-panel text-purple-200 border-purple-500/20 hover:border-purple-400/40'
          }`}
          title="Kayfiyat rejimi"
        >
          {isWarm ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('warmGlow')}</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('deepNight')}</span>
            </>
          )}
        </button>

        {/* Logout button */}
        <button
          onClick={logout}
          className="p-2 rounded-full glass-panel text-purple-300/70 hover:text-rose-300 hover:bg-rose-950/30 transition-all border border-purple-500/20"
          title={t('logout')}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
