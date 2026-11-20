import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Plus,
  Calendar,
  Clock,
  Heart,
  BookOpen,
  Award,
  ChevronDown,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { useAppStore, useCurrentUser } from '../store/useAppStore';

export default function LifeStory() {
  const currentUser = useCurrentUser();
  const { addChapter, deleteChapter, addMilestone } = useAppStore();
  const lifeStory = currentUser?.lifeStory || [];

  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState(null);

  // New chapter form
  const [period, setPeriod] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // New milestone form
  const [mYear, setMYear] = useState('');
  const [mTitle, setMTitle] = useState('');
  const [mNote, setMNote] = useState('');
  const [mEmotion, setMEmotion] = useState('Xotirjamlik');

  const handleOpenMilestoneModal = (chapterId) => {
    setSelectedChapterId(chapterId);
    setMYear(new Date().getFullYear().toString());
    setMTitle('');
    setMNote('');
    setMEmotion('Quvonch');
    setIsMilestoneModalOpen(true);
  };

  const handleSaveChapter = (e) => {
    e.preventDefault();
    if (!period || !title) return;
    addChapter({
      period,
      title,
      description,
      icon: 'Sparkles',
      milestones: []
    });
    setPeriod('');
    setTitle('');
    setDescription('');
    setIsChapterModalOpen(false);
  };

  const handleSaveMilestone = (e) => {
    e.preventDefault();
    if (!selectedChapterId || !mTitle) return;
    addMilestone(selectedChapterId, {
      year: mYear,
      title: mTitle,
      note: mNote,
      emotion: mEmotion
    });
    setIsMilestoneModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/15">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-purple-100 flex items-center gap-3">
            <Compass className="w-8 h-8 text-purple-400" />
            <span>Hayot Hikoyam</span>
          </h1>
          <p className="text-xs sm:text-sm text-purple-300/70 mt-1 font-sans">
            Bolalikdan to hozirgi kungacha bosib o‘tgan yo‘lingiz, hayotiy bosqichlar va unutilmas lahzalar
          </p>
        </div>

        <button
          onClick={() => setIsChapterModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Hayot Bobi</span>
        </button>
      </div>

      {/* Vertical Glowing Timeline */}
      {lifeStory.length === 0 ? (
        <div className="rounded-3xl glass-panel p-10 text-center border border-purple-500/20 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-purple-100 mb-2">
            Hayot xaritangiz hali boshlanmagan
          </h3>
          <p className="text-xs sm:text-sm text-purple-300/70 mb-6 leading-relaxed">
            Bolalik, maktab yoki yoshlik davrlaringizdan boshlab o‘z hayot kitobingiz boblarini varaqlashni boshlang.
          </p>
          <button
            onClick={() => setIsChapterModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Birinchi hayot bobini yaratish</span>
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-purple-400 before:via-purple-600/50 before:to-transparent">
        {lifeStory.map((chapter, idx) => (
          <div key={chapter.id} className="relative group">
            {/* Timeline Glowing Node */}
            <div className="absolute -left-6 sm:-left-10 top-1 w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-lunara-bg-deep border-2 border-purple-400 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md group-hover:scale-110 transition-all">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300" />
            </div>

            {/* Chapter Container Card */}
            <div className="rounded-3xl glass-panel border border-purple-500/25 p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-500/15">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[11px] font-mono tracking-wider mb-2">
                    {chapter.period}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-purple-100">
                    {chapter.title}
                  </h2>
                  {chapter.description && (
                    <p className="text-xs sm:text-sm text-purple-300/70 mt-1 font-sans">
                      {chapter.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => handleOpenMilestoneModal(chapter.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 text-purple-200 text-xs border border-purple-400/30 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Lahza qo‘shish</span>
                  </button>
                  <button
                    onClick={() => deleteChapter(chapter.id)}
                    className="p-1.5 rounded-xl text-purple-400/50 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
                    title="Bobni o‘chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Milestones inside this chapter */}
              <div className="mt-6 space-y-4">
                {(!chapter.milestones || chapter.milestones.length === 0) ? (
                  <p className="text-xs text-purple-300/50 italic py-2">
                    Ushbu davr uchun hali muhim daqiqalar kiritilmagan.
                  </p>
                ) : (
                  chapter.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/15 hover:border-purple-400/30 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-mono font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-900/50 border border-purple-500/20">
                            {m.year}
                          </span>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-purple-100">
                            {m.title}
                          </h4>
                          {m.emotion && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300">
                              {m.emotion}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-purple-300/80 leading-relaxed font-sans">
                          {m.note}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Add Chapter Modal */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lunara-bg-deep/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15 mb-4">
              <h3 className="font-serif text-xl font-bold text-purple-100">
                Yangi Hayot Bobi Qo‘shish
              </h3>
              <button
                onClick={() => setIsChapterModalOpen(false)}
                className="text-purple-400/60 hover:text-purple-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Davr / Yillar oralig‘i
                </label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="Masalan: 2016 — 2020 yoki Yoshlik davri"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Bob sarlavhasi
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Talabalik yillari: Yangi shahar va orzular"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Qisqacha ta’rif
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bu davr siz uchun qanday ma’no kasb etgan edi?"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40 h-24 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChapterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-purple-300/70 hover:text-purple-200"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-sm"
                >
                  Bobni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lunara-bg-deep/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15 mb-4">
              <h3 className="font-serif text-xl font-bold text-purple-100">
                Muhim Daqiqani Muhrlash
              </h3>
              <button
                onClick={() => setIsMilestoneModalOpen(false)}
                className="text-purple-400/60 hover:text-purple-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Yil yoki sana
                  </label>
                  <input
                    type="text"
                    value={mYear}
                    onChange={(e) => setMYear(e.target.value)}
                    placeholder="Masalan: 2018"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    His / Tuyg‘u
                  </label>
                  <input
                    type="text"
                    value={mEmotion}
                    onChange={(e) => setMEmotion(e.target.value)}
                    placeholder="Masalan: Baxt, Hayrat, Jasorat"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Voqea nomi
                </label>
                <input
                  type="text"
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  placeholder="Masalan: Birinchi marta mustaqil sayohat"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Xotira va taassurot
                </label>
                <textarea
                  value={mNote}
                  onChange={(e) => setMNote(e.target.value)}
                  placeholder="Ushbu lahzada qanday hislar kechgan edi? Nima sizni o‘zgartirdi?"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40 h-28 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-purple-300/70 hover:text-purple-200"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-sm"
                >
                  Muhrlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
