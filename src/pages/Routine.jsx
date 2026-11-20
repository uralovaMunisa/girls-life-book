import React, { useState } from 'react';
import {
  CheckCircle,
  Plus,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Clock,
  Flame,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  X,
  Sparkles
} from 'lucide-react';
import { useAppStore, useCurrentUser } from '../store/useAppStore';
import { soundEngine } from '../utils/audio';

export default function Routine() {
  const currentUser = useCurrentUser();
  const { toggleRoutineItem, addRoutineItem, deleteRoutineItem } = useAppStore();
  const routine = currentUser?.routine || [];

  const [activePeriodFilter, setActivePeriodFilter] = useState('all'); // 'all', 'tong', 'kun', 'oqshom', 'tun'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New routine item form
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('tong');
  const [time, setTime] = useState('08:00');

  const total = routine.length;
  const completed = routine.filter((r) => r.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleToggle = (id) => {
    toggleRoutineItem(id);
    soundEngine.playChime('success');
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRoutineItem({
      title,
      period,
      time,
      streak: 1
    });

    setTitle('');
    setIsModalOpen(false);
  };

  const filteredRoutine = activePeriodFilter === 'all'
    ? routine
    : routine.filter((r) => r.period === activePeriodFilter);

  const periods = [
    { id: 'all', label: 'Barchasi', icon: Sparkles },
    { id: 'tong', label: 'Tong (06:00 - 10:00)', icon: Sunrise },
    { id: 'kun', label: 'Kunduz (10:00 - 17:00)', icon: Sun },
    { id: 'oqshom', label: 'Oqshom (17:00 - 21:00)', icon: Sunset },
    { id: 'tun', label: 'Tun (21:00 - 06:00)', icon: Moon },
  ];

  const daysOfWeek = [
    { day: 'Dush', full: 'Dushanba', done: true },
    { day: 'Sesh', full: 'Seshanba', done: true },
    { day: 'Chor', full: 'Chorshanba', done: true },
    { day: 'Pay', full: 'Payshanba', done: true },
    { day: 'Jum', full: 'Juma (Bugun)', done: percentage > 50, isToday: true },
    { day: 'Shan', full: 'Shanba', done: false },
    { day: 'Yak', full: 'Yakshanba', done: false },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/15">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-purple-100 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-purple-400" />
            <span>Kunlik Rejim & Odatlar</span>
          </h1>
          <p className="text-xs sm:text-sm text-purple-300/70 mt-1 font-sans">
            Tongdan to tungacha qadriyatlarga mos yashash, ruhiy sokinlik va intizom
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi odat qo‘shish</span>
        </button>
      </div>

      {/* Progress & Weekly View Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Ring / Bar Summary */}
        <div className="md:col-span-1 rounded-3xl glass-panel p-6 border border-purple-500/20 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-2">
              Bugungi Intizom
            </span>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-mono text-4xl sm:text-5xl font-bold text-purple-100">
                {percentage}%
              </span>
              <span className="text-xs text-purple-300/60 font-sans">
                ({completed} / {total} bajarildi)
              </span>
            </div>
            <p className="text-xs text-purple-300/75 leading-relaxed font-sans">
              {percentage === 100
                ? 'Tabriklaymiz! Bugungi barcha ezgu amallar muvaffaqiyatli bajarildi 🌟'
                : 'Har bir kichik odat hayotingizni sokinlik sari yo‘naltiradi.'}
            </p>
          </div>

          <div className="mt-6">
            <div className="w-full h-2.5 rounded-full bg-purple-950/70 overflow-hidden p-0.5 border border-purple-500/20">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-violet-400 to-indigo-400 rounded-full transition-all duration-700 shadow-glow-sm"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weekly Habit Tracker View */}
        <div className="md:col-span-2 rounded-3xl glass-panel p-6 border border-purple-500/20 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Haftalik Odatlar Ko‘rinishi</span>
              </span>
              <span className="text-[11px] text-purple-300/60 font-mono">Noyabr, 2026</span>
            </div>
            <p className="text-xs text-purple-300/70 mb-4 font-sans">
              Ketma-ketlikni saqlab qoling. Kichik qadamlar buyuk o‘zgarishlar keltiradi.
            </p>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {daysOfWeek.map((d, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl border transition-all ${
                  d.isToday
                    ? 'border-purple-400 bg-purple-900/40 shadow-glow-sm'
                    : d.done
                    ? 'border-purple-500/30 bg-purple-950/40'
                    : 'border-purple-500/10 bg-purple-950/20 opacity-60'
                }`}
              >
                <div className="text-[11px] font-medium text-purple-300/80 mb-1.5">{d.day}</div>
                <div className="flex justify-center">
                  {d.done ? (
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-purple-500/30" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {periods.map((p) => {
          const Icon = p.icon;
          const isSelected = activePeriodFilter === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePeriodFilter(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-purple-600/40 text-purple-100 border border-purple-400/40 shadow-glow-sm'
                  : 'glass-panel text-purple-300/70 border-purple-500/15 hover:text-purple-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-purple-400" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Routine Items Checklist */}
      <div className="space-y-3">
        {filteredRoutine.length === 0 ? (
          <div className="rounded-3xl glass-panel p-8 text-center border border-purple-500/20">
            <CheckCircle2 className="w-10 h-10 text-purple-400/40 mx-auto mb-2" />
            <h4 className="font-serif text-lg font-bold text-purple-200 mb-1">
              Ushbu vaqt uchun rejim belgilanmagan
            </h4>
            <p className="text-xs text-purple-300/60 mb-4">
              O‘zingiz uchun kundalik foydali odat yoki reja qo‘shing.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-semibold border border-purple-400/30"
            >
              Yangi odat qo‘shish
            </button>
          </div>
        ) : (
          filteredRoutine.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl glass-panel border transition-all ${
              item.completed
                ? 'border-purple-500/20 bg-purple-950/20 opacity-80'
                : 'border-purple-500/20 bg-purple-950/40 hover:border-purple-400/30 shadow-md'
            }`}
          >
            <div
              onClick={() => handleToggle(item.id)}
              className="flex items-center gap-3.5 flex-1 cursor-pointer"
            >
              <button
                type="button"
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  item.completed
                    ? 'bg-purple-500 text-white shadow-glow-sm'
                    : 'border-2 border-purple-400/50 hover:border-purple-300'
                }`}
              >
                {item.completed && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <div>
                <h4
                  className={`text-sm sm:text-base font-medium transition-colors ${
                    item.completed
                      ? 'text-purple-300/50 line-through'
                      : 'text-purple-100 font-serif'
                  }`}
                >
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-purple-400/60 font-sans">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </span>
                  <span>•</span>
                  <span className="capitalize">{item.period}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {item.streak > 0 && (
                <div
                  className="flex items-center gap-1 text-xs text-amber-300/90 font-mono px-2.5 py-1 rounded-xl bg-amber-950/30 border border-amber-500/25"
                  title="Uzluksiz kunlar zanjiri"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{item.streak} kun</span>
                </div>
              )}

              <button
                onClick={() => deleteRoutineItem(item.id)}
                className="p-2 rounded-xl text-purple-400/40 hover:text-rose-400 hover:bg-rose-950/20 transition-all"
                title="O‘chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>

      {/* Add Routine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lunara-bg-deep/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15 mb-4">
              <h3 className="font-serif text-xl font-bold text-purple-100">
                Yangi Kunlik Odat Qo‘shish
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-purple-400/60 hover:text-purple-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Odat yoki vazifa nomi
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: 15 daqiqa kitob mutolaa qilish"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Kun qismi
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 outline-none"
                  >
                    <option value="tong" className="bg-lunara-bg-deep">Tong</option>
                    <option value="kun" className="bg-lunara-bg-deep">Kunduz</option>
                    <option value="oqshom" className="bg-lunara-bg-deep">Oqshom</option>
                    <option value="tun" className="bg-lunara-bg-deep">Tun</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Mo‘ljallangan vaqt
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-purple-300/70 hover:text-purple-200"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-sm"
                >
                  Odatni kiritish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
