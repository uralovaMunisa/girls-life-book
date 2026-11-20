import React, { useState } from 'react';
import { Volume2, VolumeX, CloudRain, Moon, Sparkles, Music } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

export default function AmbientSoundPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('rain'); // 'rain', 'night', 'meditation'
  const [isOpen, setIsOpen] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      soundEngine.stopAll();
      setIsPlaying(false);
    } else {
      soundEngine.playTrack(currentTrack);
      setIsPlaying(true);
    }
  };

  const selectTrack = (track) => {
    setCurrentTrack(track);
    soundEngine.playTrack(track);
    setIsPlaying(true);
    setIsOpen(false);
  };

  const tracks = [
    { id: 'rain', label: 'Mayin yomg‘ir', icon: CloudRain, desc: 'Tinchlantiruvchi yomg‘ir shovqini' },
    { id: 'meditation', label: '432Hz Garmoniya', icon: Sparkles, desc: 'Qalb xotirjamligi ohangi' },
    { id: 'night', label: 'Sokin tun osmoni', icon: Moon, desc: 'Yulduzli kechaning chuqur nafasi' },
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 p-1 rounded-full glass-panel border border-purple-500/20 shadow-glow-sm">
        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            isPlaying
              ? 'bg-purple-600/30 text-purple-200 border border-purple-400/40 shadow-glow-sm'
              : 'text-purple-300/70 hover:text-purple-100 hover:bg-purple-900/30'
          }`}
          title={isPlaying ? "Musiqani to'xtatish" : "Tinchlantiruvchi fon ovozini yoqish"}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="hidden sm:inline">
                {currentTrack === 'rain' ? 'Yomg‘ir' : currentTrack === 'meditation' ? '432Hz' : 'Tun'}
              </span>
              <span className="flex gap-0.5 items-end h-3">
                <span className="w-0.5 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 h-3 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-purple-400/60" />
              <span className="hidden sm:inline text-purple-300/60">Atmosfera</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-full text-purple-300/70 hover:text-purple-100 hover:bg-purple-800/30 transition-colors"
          title="Ovoz tanlash"
        >
          <Music className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Track Selector Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel p-2 shadow-2xl z-50 border border-purple-500/30 animate-scale-in">
          <div className="px-3 py-2 border-b border-purple-500/15 mb-1.5">
            <p className="text-xs font-semibold text-purple-200">Sehrli Fon Ohanglari</p>
            <p className="text-[11px] text-purple-300/60">Yozish va fikr jamlash uchun ambient</p>
          </div>
          <div className="space-y-1">
            {tracks.map((t) => {
              const Icon = t.icon;
              const isCurrent = currentTrack === t.id && isPlaying;
              return (
                <button
                  key={t.id}
                  onClick={() => selectTrack(t.id)}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all text-xs ${
                    isCurrent
                      ? 'bg-purple-600/25 text-purple-100 border border-purple-500/30'
                      : 'text-purple-300/80 hover:bg-purple-900/30 hover:text-purple-100'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg mt-0.5 ${isCurrent ? 'bg-purple-500/30 text-purple-300' : 'bg-purple-950/40 text-purple-400/80'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-medium">{t.label}</div>
                    <div className="text-[10px] text-purple-300/50">{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {isPlaying && (
            <div className="mt-2 pt-1.5 border-t border-purple-500/15">
              <button
                onClick={() => {
                  soundEngine.stopAll();
                  setIsPlaying(false);
                  setIsOpen(false);
                }}
                className="w-full py-1.5 text-center text-xs text-rose-300/80 hover:text-rose-200 transition-colors"
              >
                Ovozni to‘xtatish
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

