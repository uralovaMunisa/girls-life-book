import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PenSquare,
  Clock,
  CheckCircle2,
  Circle,
  Target,
  ArrowRight,
  Heart,
  Flame,
  Calendar,
  Smile,
  Plus
} from 'lucide-react';
import { useAppStore, useCurrentUser, useTranslation } from '../store/useAppStore';
import { getTimeOfDayGreeting, formatUzbekDateShort } from '../utils/dateUtils';
import { soundEngine } from '../utils/audio';

export default function Home() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const { setTodayMood, toggleRoutineItem, prompts } = useAppStore();
  const { language, t } = useTranslation();

  const entries = currentUser?.entries || [];
  const routine = currentUser?.routine || [];
  const goals = currentUser?.goals || [];
  const todayMood = currentUser?.todayMood || '';
  const streak = currentUser?.streak || 0;

  const greeting = getTimeOfDayGreeting(currentUser?.name || '', language);

  // Pick a random past memory (or the most cherished favorite)
  const randomMemory = useMemo(() => {
    if (!entries || entries.length === 0) return null;
    const favorites = entries.filter((e) => e.isFavorite);
    const pool = favorites.length > 0 ? favorites : entries;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }, [entries]);

  // Today's prompt
  const todayPrompt = prompts[new Date().getDate() % prompts.length];

  // Routine stats
  const totalRoutines = routine.length;
  const completedRoutines = routine.filter((r) => r.completed).length;
  const routinePercent = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;

  // Active goals summary
  const activeGoals = goals.filter((g) => !g.completed).slice(0, 2);

  const moods = [
    { id: 'ajoyib', label: 'Ajoyib', emoji: '✨', color: 'from-amber-400 to-yellow-500' },
    { id: 'xotirjam', label: 'Xotirjam', emoji: '🕊️', color: 'from-purple-400 to-indigo-500' },
    { id: 'oychan', label: 'O‘ychan', emoji: '🌙', color: 'from-blue-400 to-indigo-600' },
    { id: 'minnatdor', label: 'Minnatdor', emoji: '🌸', color: 'from-rose-400 to-pink-500' },
    { id: 'charchagan', label: 'Charchagan', emoji: '🍃', color: 'from-teal-400 to-emerald-600' },
    { id: 'xafa', label: 'Mayus', emoji: '🌧️', color: 'from-slate-400 to-blue-500' },
  ];

  const handleMoodSelect = (moodId) => {
    setTodayMood(moodId);
    soundEngine.playChime('success');
  };

  const handleWritePrompt = () => {
    navigate('/diary', { state: { initialPrompt: todayPrompt } });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Greeting Section */}
      <div className="relative rounded-3xl glass-panel p-6 sm:p-10 border border-purple-500/20 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/20 text-purple-300 text-xs mb-3 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('soulSanctuary')}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-purple-100 mb-3">
              {greeting.greeting}
            </h1>
            <p className="text-sm sm:text-base text-purple-300/80 leading-relaxed font-sans">
              {greeting.subtext}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => navigate('/diary')}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-glow-md hover:shadow-glow-lg transition-all active:scale-[0.98] border border-purple-400/30"
            >
              <PenSquare className="w-4 h-4" />
              <span>{t('writeNewMemory')}</span>
            </button>
          </div>
        </div>

        {/* Daily Streak Bar */}
        <div className="mt-8 pt-6 border-t border-purple-500/15 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-purple-600/20 border border-amber-500/30 text-amber-300 shadow-glow-gold">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-purple-100 font-mono">
                {streak} {t('streak')}
              </div>
              <div className="text-xs text-purple-300/60">
                {streak > 0 ? t('streakSub') : (language === 'uz' ? 'Bugun ilk sahifangizni yozib zanjirni boshlang' : 'Start your journaling streak today')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-purple-300/70 font-sans">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>{entries.length} {t('memoriesMetric').toLowerCase()}</span>
          </div>
        </div>
      </div>

      {/* Daily Mood Check-in */}
      <div className="rounded-3xl glass-panel p-6 border border-purple-500/20 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-purple-100 flex items-center gap-2">
              <Smile className="w-4 h-4 text-purple-400" />
              <span>{t('howAreYouFeeling')}</span>
            </h2>
            <p className="text-xs text-purple-300/60 mt-0.5">
              {t('feelingsSubtext')}
            </p>
          </div>
          {todayMood && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/25 text-purple-300">
              {t('recorded')}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {moods.map((m) => {
            const isSelected = todayMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMoodSelect(m.id)}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border transition-all duration-300 text-center ${
                  isSelected
                    ? 'border-purple-400 bg-purple-900/40 shadow-glow-sm scale-105 text-purple-100'
                    : 'border-purple-500/15 bg-purple-950/20 text-purple-300/70 hover:border-purple-400/30 hover:bg-purple-900/20'
                }`}
              >
                <span className="text-2xl sm:text-3xl filter drop-shadow">{m.emoji}</span>
                <span className="text-xs font-medium">{t(`mood_${m.id}`)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Daily Prompt & Memory from Past */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Writing Prompt */}
        <div className="rounded-3xl glass-panel p-6 border border-purple-500/20 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bugungi Ilhomlantiruvchi Savol</span>
            </div>

            <p className="font-serif text-xl sm:text-2xl text-purple-100 italic leading-snug mb-4">
              «{todayPrompt}»
            </p>
            <p className="text-xs text-purple-300/60">
              Ushbu savol orqali bugungi ichki hislaringiz bilan yuzlashing va daftaringizga tushiring.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-purple-500/15 flex items-center justify-between">
            <span className="text-xs text-purple-400/60">1 daqiqalik dildan suhbat</span>
            <button
              onClick={handleWritePrompt}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-medium border border-purple-400/30 transition-all hover:gap-2 shadow-sm"
            >
              <span>Shu haqida yozish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Random Memory From the Past (or invitation to write if empty) */}
        {randomMemory ? (
          <div className="rounded-3xl glass-panel p-6 border border-purple-500/20 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>O‘tmishdan Aks-Sado</span>
                </span>
                <span className="text-[11px] text-purple-300/60 font-mono">
                  {formatUzbekDateShort(randomMemory.date)}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-purple-100 mb-2 line-clamp-1">
                {randomMemory.title}
              </h3>
              <p className="text-xs sm:text-sm text-purple-300/75 leading-relaxed line-clamp-3 font-sans">
                {randomMemory.content}
              </p>

              {randomMemory.image && (
                <div className="mt-3 h-28 rounded-xl overflow-hidden border border-purple-500/20">
                  <img
                    src={randomMemory.image}
                    alt={randomMemory.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-purple-500/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
                <span className="text-xs text-purple-300/70">Qadrli xotira</span>
              </div>
              <button
                onClick={() => navigate('/diary')}
                className="text-xs text-purple-300 hover:text-purple-100 flex items-center gap-1 transition-colors"
              >
                <span>Kundalikda ko‘rish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl glass-panel p-6 border border-purple-500/20 flex flex-col justify-between shadow-xl text-center">
            <div className="my-auto py-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-purple-400/60" />
              </div>
              <h3 className="font-serif text-lg font-bold text-purple-200 mb-1">
                O‘tmish sahifalari hali bo‘sh
              </h3>
              <p className="text-xs text-purple-300/60 max-w-xs mx-auto">
                Kundaligingizga dastlabki xotirani yozing va kelajakda ular sizga nur bag‘ishlaydi.
              </p>
            </div>
            <button
              onClick={() => navigate('/diary')}
              className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold border border-purple-400/30 transition-all"
            >
              Birinchi xotirani yozish
            </button>
          </div>
        )}
      </div>

      {/* Two Columns: Today's Routine & Active Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Routine Summary */}
        <div className="rounded-3xl glass-panel p-6 border border-purple-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-purple-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Bugungi Kunlik Rejim</span>
              </h3>
              <p className="text-xs text-purple-300/60 mt-0.5">
                {totalRoutines > 0 ? `${completedRoutines} / ${totalRoutines} bajarildi (${routinePercent}%)` : 'Odatlar ro‘yxati bo‘sh'}
              </p>
            </div>
            <button
              onClick={() => navigate('/routine')}
              className="text-xs text-purple-400 hover:text-purple-200 transition-colors"
            >
              Rejimga o‘tish
            </button>
          </div>

          {totalRoutines > 0 ? (
            <>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-purple-950/60 border border-purple-500/20 overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${routinePercent}%` }}
                />
              </div>

              {/* Checklist Preview */}
              <div className="space-y-2">
                {routine.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleRoutineItem(item.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl glass-panel-hover border border-purple-500/10 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-purple-500/40 shrink-0" />
                      )}
                      <span
                        className={
                          item.completed
                            ? 'text-purple-300/50 line-through'
                            : 'text-purple-200 font-medium'
                        }
                      >
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-400/60 font-mono">{item.time}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-purple-300/60 mb-3">Kunlik rejim va odatlaringizni rejalashtiring.</p>
              <button
                onClick={() => navigate('/routine')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/40 border border-purple-500/20 text-purple-200 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Odat qo‘shish</span>
              </button>
            </div>
          )}
        </div>

        {/* Goals Preview */}
        <div className="rounded-3xl glass-panel p-6 border border-purple-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-purple-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span>Asosiy Maqsadlarim</span>
              </h3>
              <p className="text-xs text-purple-300/60 mt-0.5">
                Katta orzular tomon dadil qadamlar
              </p>
            </div>
            <button
              onClick={() => navigate('/goals')}
              className="text-xs text-purple-400 hover:text-purple-200 transition-colors"
            >
              Maqsadlar doskasi
            </button>
          </div>

          {activeGoals.length > 0 ? (
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => navigate('/goals')}
                  className="p-3.5 rounded-2xl glass-panel-hover border border-purple-500/15 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-purple-100 line-clamp-1">
                      {goal.title}
                    </span>
                    <span className="text-xs font-mono text-purple-300 shrink-0 ml-2">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-purple-950/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-purple-400/60">
                    <span>{goal.category}</span>
                    <span>Muddati: {formatUzbekDateShort(goal.deadline)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-purple-300/60 mb-3">Hozircha faol maqsadlar kiritilmagan.</p>
              <button
                onClick={() => navigate('/goals')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/40 border border-purple-500/20 text-purple-200 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yangi maqsad belgilash</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
