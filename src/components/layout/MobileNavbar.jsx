import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Compass,
  CheckCircle,
  MoreHorizontal,
  Users,
  Heart,
  Target,
  BarChart3,
  Settings,
  X,
  LogOut
} from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';

export default function MobileNavbar() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { logout } = useAppStore();
  const { t } = useTranslation();

  const mainItems = [
    { path: '/', label: t('home'), icon: Sparkles },
    { path: '/diary', label: t('diary'), icon: BookOpen },
    { path: '/life-story', label: t('lifeStory'), icon: Compass },
    { path: '/routine', label: t('routine'), icon: CheckCircle },
  ];

  const moreItems = [
    { path: '/loved-ones', label: t('lovedOnes'), icon: Users },
    { path: '/favorites', label: t('favorites'), icon: Heart },
    { path: '/goals', label: t('goals'), icon: Target },
    { path: '/analytics', label: t('analytics'), icon: BarChart3 },
    { path: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <>
      {/* More Modal for Mobile */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-lunara-bg-deep/80 backdrop-blur-xl animate-fade-in flex flex-col justify-end p-4 pb-24">
          <div className="w-full rounded-3xl glass-panel p-5 border border-purple-500/30 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15 mb-3">
              <span className="text-xs font-semibold text-purple-200">Qo‘shimcha Bo‘limlar</span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 rounded-full text-purple-400/70 hover:text-purple-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMoreOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-purple-600/30 text-purple-100 border-purple-400/40'
                          : 'bg-purple-950/30 text-purple-300/80 border-purple-500/15 hover:border-purple-400/30'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-purple-500/15">
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-rose-950/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Hisobdan chiqish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-3 py-2 bg-lunara-bg-surface/90 backdrop-blur-2xl border-t border-purple-500/20 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {mainItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                    isActive
                      ? 'text-purple-300 scale-105'
                      : 'text-purple-400/60 hover:text-purple-200'
                  }`
                }
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}

          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              isMoreOpen ? 'text-purple-300 scale-105' : 'text-purple-400/60 hover:text-purple-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">Barchasi</span>
          </button>
        </div>
      </nav>
    </>
  );
}

