import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Compass,
  Users,
  Heart,
  CheckCircle,
  Target,
  BarChart3,
  Settings,
  Search,
  Moon,
  Sun,
  PenSquare,
  LogOut
} from 'lucide-react';
import { useAppStore, useCurrentUser, useTranslation } from '../../store/useAppStore';

export default function DesktopSidebar() {
  const currentUser = useCurrentUser();
  const { setTheme, setSearchOpen, logout } = useAppStore();
  const { t } = useTranslation();

  if (!currentUser) return null;

  const isWarm = currentUser.theme === 'warm';

  const toggleTheme = () => {
    setTheme(isWarm ? 'deep' : 'warm');
  };

  const navItems = [
    { path: '/', label: t('home'), icon: Sparkles },
    { path: '/diary', label: t('diary'), icon: BookOpen },
    { path: '/life-story', label: t('lifeStory'), icon: Compass },
    { path: '/loved-ones', label: t('lovedOnes'), icon: Users },
    { path: '/favorites', label: t('favorites'), icon: Heart },
    { path: '/routine', label: t('routine'), icon: CheckCircle },
    { path: '/goals', label: t('goals'), icon: Target },
    { path: '/analytics', label: t('analytics'), icon: BarChart3 },
    { path: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-lunara-bg-surface/80 backdrop-blur-2xl border-r border-purple-500/15 p-4 z-30 select-none">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-3 py-2 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 flex items-center justify-center shadow-glow-sm border border-purple-400/30">
          <Sparkles className="w-5 h-5 text-purple-100" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-purple-200 to-indigo-200">
            Lunara
          </h1>
          <p className="text-[10px] uppercase font-sans tracking-widest text-purple-400/70">
            {t('soulSanctuary')}
          </p>
        </div>
      </div>

      {/* Quick Search Pill */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center justify-between w-full px-3.5 py-2.5 mb-4 rounded-xl glass-input text-xs text-purple-300/60 hover:text-purple-200 hover:border-purple-400/30 transition-all group"
      >
        <span className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-purple-400/70 group-hover:text-purple-300" />
          <span>{t('search')}</span>
        </span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-purple-300/50 bg-purple-950/60 rounded border border-purple-500/20">
          Ctrl+K
        </kbd>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-purple-100 border border-purple-400/30 shadow-glow-sm'
                    : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-900/20'
                }`
              }
            >
              <Icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Streak Badge */}
      <div className="my-3 px-3.5 py-2.5 rounded-2xl glass-panel border border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🔥</span>
          <div>
            <div className="text-[11px] font-semibold text-purple-200">
              {currentUser.streak || 0} {t('streak')}
            </div>
            <div className="text-[10px] text-purple-400/60">{t('streakSub')}</div>
          </div>
        </div>
        <NavLink
          to="/diary"
          className="p-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 transition-all"
          title={t('writeNow')}
        >
          <PenSquare className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* User & Quick Actions Card */}
      <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between">
        <NavLink to="/settings" className="flex items-center gap-2.5 flex-1 overflow-hidden group">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-purple-400/40 group-hover:border-purple-300 transition-colors"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple-800/40 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-200">
              {currentUser.name ? currentUser.name[0] : 'U'}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-purple-100 truncate group-hover:text-purple-200">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-purple-400/60 truncate">
              @{currentUser.username}
            </p>
          </div>
        </NavLink>

        <div className="flex items-center gap-1">
          {/* Mood theme switch */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all text-xs ${
              isWarm
                ? 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-900/40'
                : 'bg-purple-950/40 text-purple-300 border-purple-500/30 hover:bg-purple-900/40'
            }`}
            title={isWarm ? "Switch to Deep Night" : "Switch to Warm Glow"}
          >
            {isWarm ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Logout button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-purple-950/40 text-purple-300/60 hover:text-rose-300 hover:bg-rose-950/30 border border-purple-500/20 transition-all text-xs"
            title={t('logout')}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
