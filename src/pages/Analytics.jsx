import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Flame,
  FileText,
  Heart,
  Tag,
  Calendar,
  Sparkles,
  Smile,
  PenSquare
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../store/useAppStore';

export default function Analytics() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const entries = currentUser?.entries || [];
  const streak = currentUser?.streak || 0;

  // Metrics calculation
  const totalEntries = entries.length;
  const totalWords = useMemo(
    () => entries.reduce((acc, curr) => acc + (curr.wordCount || 0), 0),
    [entries]
  );
  const favoriteCount = entries.filter((e) => e.isFavorite).length;

  // Tag distribution
  const tagCounts = useMemo(() => {
    const counts = {};
    entries.forEach((e) => {
      (e.tags || []).forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [entries]);

  // Mood distribution based strictly on user entries
  const moodData = useMemo(() => {
    const moodMap = {
      ajoyib: { name: 'Ajoyib', count: 0, color: '#f59e0b' },
      xotirjam: { name: 'Xotirjam', count: 0, color: '#a855f7' },
      oychan: { name: 'O‘ychan', count: 0, color: '#6366f1' },
      minnatdor: { name: 'Minnatdor', count: 0, color: '#ec4899' },
      charchagan: { name: 'Charchagan', count: 0, color: '#14b8a6' },
      xafa: { name: 'Mayus', count: 0, color: '#64748b' }
    };
    entries.forEach((e) => {
      if (moodMap[e.mood]) {
        moodMap[e.mood].count += 1;
      }
    });
    return Object.values(moodMap);
  }, [entries]);

  // Activity over last 7 days chart data calculated from user's actual entries
  const activityData = useMemo(() => {
    const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const dayName = i === 0 ? 'Bugun' : days[d.getDay()];

      const dayWords = entries
        .filter((e) => (e.date || '').slice(0, 10) === dayStr)
        .reduce((sum, e) => sum + (e.wordCount || 0), 0);

      result.push({ day: dayName, words: dayWords });
    }
    return result;
  }, [entries]);

  // Calendar Heatmap generation (last 28 days) based on actual entries
  const heatmapDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 28 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (27 - i));
      const dayStr = d.toISOString().slice(0, 10);

      const count = entries.filter((e) => (e.date || '').slice(0, 10) === dayStr).length;
      const level = count >= 3 ? 3 : count === 2 ? 2 : count === 1 ? 1 : 0;
      return { day: d.getDate(), level, date: dayStr, count };
    });
  }, [entries]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-purple-500/15">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-purple-100 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-purple-400" />
          <span>Statistika & Qalb Tahlili</span>
        </h1>
        <p className="text-xs sm:text-sm text-purple-300/70 mt-1 font-sans">
          Xotiralaringiz miqdori, his-tuyg‘ular dinamikasi va ijodiy faollik ko‘rsatkichlari
        </p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-3xl glass-panel p-5 border border-purple-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
              Ketma-ketlik
            </span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-purple-100">
            {streak} kun
          </div>
          <p className="text-[11px] text-purple-300/60 mt-1">Uzluksiz kundalik odati</p>
        </div>

        <div className="rounded-3xl glass-panel p-5 border border-purple-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
              Jami So‘zlar
            </span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-purple-100">
            {totalWords}
          </div>
          <p className="text-[11px] text-purple-300/60 mt-1">Qog‘ozga tushgan so‘zlar</p>
        </div>

        <div className="rounded-3xl glass-panel p-5 border border-purple-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
              Xotiralar
            </span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-purple-100">
            {totalEntries} ta
          </div>
          <p className="text-[11px] text-purple-300/60 mt-1">Muhrlangan sahifalar</p>
        </div>

        <div className="rounded-3xl glass-panel p-5 border border-purple-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
              Sevimlilar
            </span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-purple-100">
            {favoriteCount} ta
          </div>
          <p className="text-[11px] text-purple-300/60 mt-1">Alohida belgilanganlar</p>
        </div>
      </div>

      {totalEntries === 0 ? (
        <div className="rounded-3xl glass-panel p-12 text-center border border-purple-500/20 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-purple-100 mb-2">
            Tahlillar hali shakllanmagan
          </h3>
          <p className="text-xs sm:text-sm text-purple-300/70 mb-6 leading-relaxed">
            Kundaligingizga dastlabki xotiralarni yozganingizdan so‘ng, so‘zlar dinamikasi, kayfiyat grafiklari va faollik xaritasi shu yerda jonlanadi.
          </p>
          <button
            onClick={() => navigate('/diary')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            <PenSquare className="w-4 h-4" />
            <span>Birinchi xotirani yozish</span>
          </button>
        </div>
      ) : (
        <>
          {/* Main Charts: Activity Trend & Mood Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Word Count Area Chart */}
            <div className="rounded-3xl glass-panel p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-purple-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span>Haftalik Yozish Faolligi</span>
                  </h3>
                  <p className="text-xs text-purple-300/60 mt-0.5">So‘zlar sonining kunlik dinamikasi</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      stroke="rgba(192, 132, 252, 0.4)"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="rgba(192, 132, 252, 0.4)"
                      fontSize={10}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(17, 12, 34, 0.9)',
                        borderColor: 'rgba(168, 85, 247, 0.3)',
                        borderRadius: '16px',
                        color: '#f3e8ff',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="words"
                      name="So‘zlar"
                      stroke="#c084fc"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#purpleGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mood Distribution Bar Chart */}
            <div className="rounded-3xl glass-panel p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-purple-100 flex items-center gap-2">
                    <Smile className="w-4 h-4 text-purple-400" />
                    <span>Kayfiyatlar Taqsimoti</span>
                  </h3>
                  <p className="text-xs text-purple-300/60 mt-0.5">Turli xil hissiy holatlar chastotasi</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      stroke="rgba(192, 132, 252, 0.4)"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="rgba(192, 132, 252, 0.4)"
                      fontSize={10}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(17, 12, 34, 0.9)',
                        borderColor: 'rgba(168, 85, 247, 0.3)',
                        borderRadius: '16px',
                        color: '#f3e8ff',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="count" name="Marta" radius={[8, 8, 0, 0]}>
                      {moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Calendar Heatmap & Frequent Tags */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Heatmap */}
            <div className="rounded-3xl glass-panel p-6 border border-purple-500/20 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-purple-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Yozuv Faolligi Xaritasi</span>
                </h3>
                <span className="text-[11px] text-purple-300/60 font-mono">So‘nggi 28 kun</span>
              </div>
              <p className="text-xs text-purple-300/70 mb-4 font-sans">
                Har bir katakcha qalb daftaringizga yozilgan kunlarni ifodalaydi.
              </p>

              <div className="grid grid-cols-7 gap-2">
                {heatmapDays.map((item, idx) => {
                  const bgClass =
                    item.level === 3
                      ? 'bg-purple-400 shadow-glow-sm'
                      : item.level === 2
                      ? 'bg-purple-600/70'
                      : item.level === 1
                      ? 'bg-purple-800/40'
                      : 'bg-purple-950/20 border border-purple-500/10';

                  return (
                    <div
                      key={idx}
                      className={`h-9 rounded-xl flex items-center justify-center text-[10px] font-mono transition-all hover:scale-110 cursor-pointer ${bgClass} text-purple-100`}
                      title={`${item.date}: ${item.count} ta yozuv`}
                    >
                      {item.day}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-purple-400/60">
                <span>Kam</span>
                <div className="w-2.5 h-2.5 rounded bg-purple-950/40 border border-purple-500/20" />
                <div className="w-2.5 h-2.5 rounded bg-purple-800/60" />
                <div className="w-2.5 h-2.5 rounded bg-purple-600" />
                <div className="w-2.5 h-2.5 rounded bg-purple-400" />
                <span>Ko‘p</span>
              </div>
            </div>

            {/* Most frequent tags */}
            <div className="rounded-3xl glass-panel p-6 border border-purple-500/20 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-semibold text-purple-100 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-400" />
                    <span>Eng Ko‘p Takrorlangan Mavzular</span>
                  </h3>
                </div>
                <p className="text-xs text-purple-300/70 mb-4 font-sans">
                  Fikrlaringiz markazida turgan qadriyat va tushunchalar
                </p>

                {tagCounts.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {tagCounts.map((t) => (
                      <div
                        key={t.name}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/20 text-xs font-medium text-purple-200"
                      >
                        <span>#{t.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300">
                          {t.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-purple-300/50 italic py-4">
                    Hali teglar kiritilmagan. Kundalik yozishda #teglar belgilang.
                  </p>
                )}
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/15">
                <p className="font-serif italic text-xs text-purple-200/90 leading-relaxed">
                  «Har bir yozilgan satr — vaqt to‘fonida yo‘qolib ketishdan asrab qolingan qalb parchasi.»
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
