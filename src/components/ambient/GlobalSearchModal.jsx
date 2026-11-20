import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, BookOpen, Clock, Users, Heart, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, useCurrentUser } from '../../store/useAppStore';
import { formatUzbekDateShort } from '../../utils/dateUtils';

export default function GlobalSearchModal() {
  const navigate = useNavigate();
  const { isSearchOpen, setSearchOpen } = useAppStore();
  const currentUser = useCurrentUser();

  const [query, setQuery] = useState('');

  const entries = currentUser?.entries || [];
  const lifeStory = currentUser?.lifeStory || [];
  const lovedOnes = currentUser?.lovedOnes || [];
  const favorites = currentUser?.favorites || [];
  const goals = currentUser?.goals || [];

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  // Search logic across all collections
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { entries: [], life: [], loved: [], favorites: [], goals: [] };

    const matchedEntries = entries.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.content?.toLowerCase().includes(q) ||
        (e.tags || []).some((t) => t.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedMilestones = [];
    lifeStory.forEach((chapter) => {
      (chapter.milestones || []).forEach((m) => {
        if (m.title?.toLowerCase().includes(q) || m.note?.toLowerCase().includes(q)) {
          matchedMilestones.push({ ...m, chapterTitle: chapter.title });
        }
      });
    });

    const matchedLoved = lovedOnes.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.relation?.toLowerCase().includes(q) ||
        p.whyMatters?.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedFavs = favorites.filter(
      (f) =>
        f.title?.toLowerCase().includes(q) ||
        f.creator?.toLowerCase().includes(q) ||
        f.quote?.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedGoals = goals.filter(
      (g) =>
        g.title?.toLowerCase().includes(q) ||
        g.category?.toLowerCase().includes(q) ||
        (g.subtasks || []).some((s) => s.title.toLowerCase().includes(q))
    ).slice(0, 3);

    return {
      entries: matchedEntries,
      life: matchedMilestones.slice(0, 3),
      loved: matchedLoved,
      favorites: matchedFavs,
      goals: matchedGoals
    };
  }, [query, entries, lifeStory, lovedOnes, favorites, goals]);

  if (!isSearchOpen) return null;

  const handleSelect = (path) => {
    setSearchOpen(false);
    navigate(path);
  };

  const totalResults =
    results.entries.length +
    results.life.length +
    results.loved.length +
    results.favorites.length +
    results.goals.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-lunara-bg-deep/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl glass-panel shadow-2xl border border-purple-500/30 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-purple-500/20">
          <Search className="w-5 h-5 text-purple-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kundalik, hayotiy lahzalar, yaqinlar, orzular bo‘ylab qidirish..."
            className="w-full bg-transparent text-sm sm:text-base text-purple-100 placeholder:text-purple-400/40 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-purple-400/60 hover:text-purple-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-purple-300/60 bg-purple-950/60 border border-purple-500/20 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-8 text-center text-purple-300/50 text-xs">
              Qidirmoqchi bo‘lgan so‘zni kiriting...
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-purple-300/50 text-xs">
              «{query}» so‘zi bo‘yicha hech narsa topilmadi.
            </div>
          ) : (
            <>
              {results.entries.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-purple-400/70 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Kundalik xotiralari ({results.entries.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.entries.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect('/diary')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-purple-900/30 transition-all text-xs group"
                      >
                        <div>
                          <div className="font-medium text-purple-200 group-hover:text-purple-100">{item.title}</div>
                          <div className="text-[11px] text-purple-400/50 line-clamp-1">{item.content}</div>
                        </div>
                        <div className="text-[10px] text-purple-400/60 shrink-0 ml-3">
                          {formatUzbekDateShort(item.date)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.life.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-purple-400/70 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Hayot hikoyam ({results.life.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.life.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelect('/life-story')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-purple-900/30 transition-all text-xs group"
                      >
                        <div>
                          <div className="font-medium text-purple-200">{m.title}</div>
                          <div className="text-[11px] text-purple-400/50 line-clamp-1">{m.note}</div>
                        </div>
                        <span className="text-[10px] text-purple-300/80 px-2 py-0.5 bg-purple-950/60 rounded border border-purple-500/20">
                          {m.year}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.loved.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-purple-400/70 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>Yaqinlarim ({results.loved.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.loved.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect('/loved-ones')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-purple-900/30 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-purple-800/40" />
                          )}
                          <div>
                            <div className="font-medium text-purple-200">{p.name}</div>
                            <div className="text-[10px] text-purple-400/50">{p.relation}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-purple-400/40" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.goals.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-purple-400/70 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                    <Target className="w-3.5 h-3.5" />
                    <span>Maqsadlar ({results.goals.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.goals.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleSelect('/goals')}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-purple-900/30 transition-all text-xs"
                      >
                        <div className="font-medium text-purple-200">{g.title}</div>
                        <span className="text-[10px] text-purple-300 font-mono">{g.progress}%</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
