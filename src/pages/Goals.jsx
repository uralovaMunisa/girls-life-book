import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Target,
  Plus,
  Sparkles,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  Image,
  Award,
  X,
  Flame,
  Check
} from 'lucide-react';
import { useAppStore, useCurrentUser } from '../store/useAppStore';
import { formatUzbekDateShort } from '../utils/dateUtils';
import { soundEngine } from '../utils/audio';

export default function Goals() {
  const currentUser = useCurrentUser();
  const {
    addGoal,
    toggleGoalSubtask,
    deleteGoal,
    addDream,
    deleteDream
  } = useAppStore();

  const goals = currentUser?.goals || [];
  const dreamBoard = currentUser?.dreamBoard || [];

  const [activeTab, setActiveTab] = useState('goals'); // 'goals' | 'dreamboard'
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDreamModalOpen, setIsDreamModalOpen] = useState(false);

  // New goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [category, setCategory] = useState('Ma’naviyat');
  const [deadline, setDeadline] = useState('2026-12-31');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState(['1-qadam', '2-qadam']);

  // New dream form state
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamQuote, setDreamQuote] = useState('');
  const [dreamImage, setDreamImage] = useState('');

  const handleToggleSubtask = (goalId, subtaskId, currentProgress) => {
    toggleGoalSubtask(goalId, subtaskId);
    soundEngine.playChime('success');

    // Trigger celebratory confetti if completing the final subtask
    const targetGoal = goals.find((g) => g.id === goalId);
    if (targetGoal) {
      const remaining = targetGoal.subtasks.filter((st) => !st.done && st.id !== subtaskId);
      if (remaining.length === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#c084fc', '#facc15', '#38bdf8']
        });
      }
    }
  };

  const handleAddSubtask = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = subtaskInput.trim();
      if (val) {
        setSubtasks([...subtasks, val]);
        setSubtaskInput('');
      }
    }
  };

  const handleRemoveSubtask = (idx) => {
    setSubtasks(subtasks.filter((_, i) => i !== idx));
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    addGoal({
      title: goalTitle,
      category,
      deadline,
      subtasks: subtasks.map((st, i) => ({ id: `st-${Date.now()}-${i}`, title: st, done: false }))
    });

    setGoalTitle('');
    setSubtasks([]);
    setIsGoalModalOpen(false);
  };

  const handleSaveDream = (e) => {
    e.preventDefault();
    if (!dreamTitle.trim()) return;

    addDream({
      title: dreamTitle,
      quote: dreamQuote,
      image: dreamImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
    });

    setDreamTitle('');
    setDreamQuote('');
    setDreamImage('');
    setIsDreamModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/15">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-purple-100 flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            <span>Maqsadlarim & Orzular Doskasi</span>
          </h1>
          <p className="text-xs sm:text-sm text-purple-300/70 mt-1 font-sans">
            Niyatlaringizni aniq qadamlarga aylantiring va orzularingizni ko‘z oldingizda jonlantiring
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-2xl glass-panel border border-purple-500/20 flex gap-1">
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'goals'
                  ? 'bg-purple-600/40 text-purple-100 border border-purple-400/40 shadow-glow-sm'
                  : 'text-purple-300/70 hover:text-purple-100'
              }`}
            >
              Maqsadlar ({goals.length})
            </button>
            <button
              onClick={() => setActiveTab('dreamboard')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'dreamboard'
                  ? 'bg-purple-600/40 text-purple-100 border border-purple-400/40 shadow-glow-sm'
                  : 'text-purple-300/70 hover:text-purple-100'
              }`}
            >
              Orzular Doskasi ({dreamBoard.length})
            </button>
          </div>

          <button
            onClick={() => (activeTab === 'goals' ? setIsGoalModalOpen(true) : setIsDreamModalOpen(true))}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-sm active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">
              {activeTab === 'goals' ? 'Maqsad qo‘shish' : 'Orzu qo‘shish'}
            </span>
          </button>
        </div>
      </div>

      {/* Goals View */}
      {activeTab === 'goals' && (
        goals.length === 0 ? (
          <div className="rounded-3xl glass-panel p-10 text-center border border-purple-500/20 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
              <Target className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-purple-100 mb-2">
              Hali maqsadlar belgilanmagan
            </h3>
            <p className="text-xs sm:text-sm text-purple-300/70 mb-6 leading-relaxed">
              O‘zingiz uchun qisqa yoki uzoq muddatli maqsad qo‘ying va unga bosqichma-bosqich erishing.
            </p>
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi maqsad belgilash</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`rounded-3xl glass-panel border p-6 shadow-xl flex flex-col justify-between group glass-panel-hover relative overflow-hidden ${
                  goal.completed ? 'border-emerald-500/30 bg-emerald-950/15' : 'border-purple-500/20'
                }`}
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/20 text-purple-300 font-medium">
                      {goal.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-200">
                        {goal.progress}%
                      </span>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1 rounded-lg text-purple-400/50 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-purple-100 mb-2">
                    {goal.title}
                  </h3>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-purple-950/70 overflow-hidden mb-4 border border-purple-500/15">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        goal.completed
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                          : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>

                  {/* Subtasks */}
                  <div className="space-y-2 mb-4">
                    {(goal.subtasks || []).map((st) => (
                      <div
                        key={st.id}
                        onClick={() => handleToggleSubtask(goal.id, st.id, goal.progress)}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-purple-900/30 cursor-pointer text-xs transition-colors"
                      >
                        {st.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-purple-500/40 shrink-0" />
                        )}
                        <span
                          className={
                            st.done ? 'text-purple-300/50 line-through' : 'text-purple-200 font-medium'
                          }
                        >
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deadline Footer */}
                <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between text-[11px] text-purple-400/60 font-sans">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Muddat: {formatUzbekDateShort(goal.deadline)}</span>
                  </span>
                  {goal.completed && (
                    <span className="text-emerald-300 font-semibold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Muvaffaqiyatli erishildi!</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Dream Board View */}
      {activeTab === 'dreamboard' && (
        dreamBoard.length === 0 ? (
          <div className="rounded-3xl glass-panel p-10 text-center border border-purple-500/20 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-purple-100 mb-2">
              Orzular doskasi hali bo‘sh
            </h3>
            <p className="text-xs sm:text-sm text-purple-300/70 mb-6 leading-relaxed">
              O‘zingiz intilayotgan go‘zal orzular, sayohatlar va ilhomlantiruvchi suratlarni doskaga iling.
            </p>
            <button
              onClick={() => setIsDreamModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Birinchi orzuni qo‘shish</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dreamBoard.map((dream) => (
              <div
                key={dream.id}
                className="rounded-3xl glass-panel border border-purple-500/20 overflow-hidden shadow-xl group glass-panel-hover flex flex-col justify-between"
              >
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={dream.image}
                    alt={dream.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-lunara-bg-deep via-transparent to-transparent" />
                  <button
                    onClick={() => deleteDream(dream.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-lunara-bg-deep/80 text-purple-300 hover:text-rose-400 backdrop-blur-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-purple-100 mb-2">
                    {dream.title}
                  </h3>
                  {dream.quote && (
                    <p className="font-serif italic text-xs text-purple-200/80 leading-relaxed">
                      «{dream.quote}»
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Add Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lunara-bg-deep/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15 mb-4">
              <h3 className="font-serif text-xl font-bold text-purple-100">
                Yangi Maqsad Belgilash
              </h3>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="text-purple-400/60 hover:text-purple-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Maqsad nomi
                </label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Masalan: Yil davomida 25 ta sara kitob o‘qish"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Toifa
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Masalan: Ta’lim, Salomatlik, Oila"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Oxirgi muddat
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Kichik bosqichlar (sub-steps)
                </label>
                <div className="space-y-1.5 mb-2">
                  {subtasks.map((st, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-purple-900/30 text-xs text-purple-200"
                    >
                      <span>• {st}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(i)}
                        className="text-purple-400/50 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={handleAddSubtask}
                  placeholder="Kichik qadam yozib Enter bosing..."
                  className="w-full px-4 py-2 rounded-xl glass-input text-xs text-purple-100 placeholder:text-purple-400/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-purple-300/70 hover:text-purple-200"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-sm"
                >
                  Maqsadni tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Dream Modal */}
      {isDreamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lunara-bg-deep/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15 mb-4">
              <h3 className="font-serif text-xl font-bold text-purple-100">
                Orzular Doskasiga Yangi Tasvir
              </h3>
              <button
                onClick={() => setIsDreamModalOpen(false)}
                className="text-purple-400/60 hover:text-purple-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDream} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Orzu nomi
                </label>
                <input
                  type="text"
                  value={dreamTitle}
                  onChange={(e) => setDreamTitle(e.target.value)}
                  placeholder="Masalan: Tinch dengiz bo‘yidagi yorug‘ uy"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Rasm havolasi (URL)
                </label>
                <input
                  type="text"
                  value={dreamImage}
                  onChange={(e) => setDreamImage(e.target.value)}
                  placeholder="Unsplash yoki rasm manzili"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Ilhomlantiruvchi iqtibos yoki so‘z
                </label>
                <textarea
                  value={dreamQuote}
                  onChange={(e) => setDreamQuote(e.target.value)}
                  placeholder="«Bu orzu bir kun albatta haqiqatga aylanadi...»"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40 h-20 resize-none font-serif italic"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDreamModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-purple-300/70 hover:text-purple-200"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-sm"
                >
                  Doskaga ilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
