import React, { useState } from 'react';
import { Lock, Delete, Sparkles, KeyRound } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';

export default function LockScreen() {
  const { isLocked, unlockApp, user } = useAppStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked) return null;

  const handlePressDigit = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);

      if (nextPin.length === 4) {
        setTimeout(() => {
          const success = unlockApp(nextPin);
          if (success) {
            soundEngine.playChime('success');
            setPin('');
          } else {
            setError(true);
            soundEngine.playChime('error');
            setTimeout(() => {
              setPin('');
            }, 600);
          }
        }, 150);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-lunara-bg-deep/95 backdrop-blur-2xl p-4">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Glow emblem */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center shadow-glow-lg border border-purple-400/30">
            <Lock className="w-9 h-9 text-white" />
          </div>
          <Sparkles className="w-5 h-5 text-purple-300 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        <h2 className="font-serif text-3xl font-bold text-purple-100 tracking-wide mb-1">
          Lunara Qalbi
        </h2>
        <p className="text-sm text-purple-300/70 mb-8">
          {user.name ? `${user.name}, shaxsiy xotiralaringiz qulflangan` : 'Shaxsiy xotiralar qulflangan'}
        </p>

        {/* 4 Pin Dots with error shake */}
        <div className={`flex gap-5 mb-10 ${error ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  isFilled
                    ? 'bg-purple-400 scale-125 shadow-glow-md'
                    : 'bg-purple-950 border border-purple-500/40'
                } ${error ? 'bg-rose-500 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]' : ''}`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-rose-400 mb-4 animate-fade-in font-medium">
            PIN kod noto‘g‘ri kiritildi. Qayta urinib ko‘ring.
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 w-64">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handlePressDigit(digit.toString())}
              className="h-14 rounded-2xl glass-panel text-lg font-mono font-semibold text-purple-200 hover:text-white hover:bg-purple-600/30 active:scale-95 transition-all shadow-sm border border-purple-500/20 hover:border-purple-400/40 flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <div className="flex items-center justify-center">
            <KeyRound className="w-4 h-4 text-purple-500/40" />
          </div>
          <button
            onClick={() => handlePressDigit('0')}
            className="h-14 rounded-2xl glass-panel text-lg font-mono font-semibold text-purple-200 hover:text-white hover:bg-purple-600/30 active:scale-95 transition-all shadow-sm border border-purple-500/20 hover:border-purple-400/40 flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl glass-panel text-purple-300/80 hover:text-purple-100 hover:bg-purple-600/20 active:scale-95 transition-all shadow-sm border border-purple-500/20 flex items-center justify-center"
            title="O‘chirish"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

