import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function Toast() {
  const { toasts, removeToast } = useAppStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel shadow-2xl border transition-all animate-scale-in ${
              isError
                ? 'border-rose-500/40 bg-rose-950/40 text-rose-200'
                : isInfo
                ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-200'
                : 'border-purple-400/40 bg-purple-950/50 text-purple-100 shadow-glow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isError ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : isInfo ? (
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              )}
              <span className="text-xs font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-purple-400/50 hover:text-purple-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

