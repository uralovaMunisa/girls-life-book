import React, { useState } from 'react';
import { Sparkles, Moon, Sun, ArrowRight, Heart } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function OnboardingModal() {
  const { user, completeOnboarding } = useAppStore();
  const [name, setName] = useState(user.name || '');
  const [theme, setTheme] = useState('deep');

  if (user.isOnboarded) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    completeOnboarding(name.trim() || 'Dildoshim', theme);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-lunara-bg-deep/90 backdrop-blur-xl p-4">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl animate-scale-in">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-glow-lg flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-lunara-bg-deep flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-300 animate-pulse" />
          </div>
        </div>

        <div className="mt-8 text-center mb-6">
          <h2 className="font-serif text-3xl font-bold text-purple-100 mb-2">
            «Lunara» olamiga xush kelibsiz
          </h2>
          <p className="text-sm text-purple-300/80 leading-relaxed">
            Bu sizning shaxsiy, sirli va iliq qalb maskaningiz. Bolalik xotiralaridan bugungi kechki fikrlargacha — barchasi shu yerda asraladi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-purple-300/90 uppercase tracking-wider mb-2">
              Sizni qanday nom bilan chaqiraylik?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ismingiz yoki taxallusingiz (masalan: Zulayho)"
              className="w-full px-4 py-3 rounded-2xl glass-input text-purple-100 placeholder:text-purple-400/40 text-sm focus:border-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-300/90 uppercase tracking-wider mb-2">
              Kundalik muhiti va ko‘rinishi
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('deep')}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border text-center transition-all ${
                  theme === 'deep'
                    ? 'border-purple-400 bg-purple-900/40 shadow-glow-sm text-purple-100'
                    : 'border-purple-500/20 bg-purple-950/20 text-purple-300/60 hover:border-purple-400/30'
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-900/60 text-purple-300">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold">Tungi Osmon</div>
                  <div className="text-[10px] text-purple-300/60 mt-0.5">Sirli binafsha & yulduzlar</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme('warm')}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border text-center transition-all ${
                  theme === 'warm'
                    ? 'border-amber-400/60 bg-amber-950/30 shadow-glow-gold text-amber-100'
                    : 'border-purple-500/20 bg-purple-950/20 text-purple-300/60 hover:border-amber-400/30'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold">Iliq Nur</div>
                  <div className="text-[10px] text-amber-200/60 mt-0.5">Oltin shom & mayin jilo</div>
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm shadow-glow-md transition-all active:scale-[0.98]"
          >
            <span>Qalb maskaniga kirish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

