import React, { useState } from 'react';
import {
  Users,
  Plus,
  Heart,
  Cake,
  Sparkles,
  Trash2,
  Edit2,
  X,
  Gift,
  Smile,
  Calendar
} from 'lucide-react';
import { useAppStore, useCurrentUser } from '../store/useAppStore';
import { getDaysUntilBirthday, formatUzbekDateShort } from '../utils/dateUtils';

export default function LovedOnes() {
  const currentUser = useCurrentUser();
  const { addLovedOne, updateLovedOne, deleteLovedOne } = useAppStore();
  const lovedOnes = currentUser?.lovedOnes || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [birthday, setBirthday] = useState('');
  const [avatar, setAvatar] = useState('');
  const [whyMatters, setWhyMatters] = useState('');
  const [memories, setMemories] = useState('');
  const [likesInput, setLikesInput] = useState('');
  const [likes, setLikes] = useState([]);

  const handleOpenAdd = () => {
    setEditingPerson(null);
    setName('');
    setRelation('Oila');
    setBirthday('');
    setAvatar('');
    setWhyMatters('');
    setMemories('');
    setLikes(['Shirinlik', 'Kitob']);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPerson(p);
    setName(p.name || '');
    setRelation(p.relation || '');
    setBirthday(p.birthday || '');
    setAvatar(p.avatar || '');
    setWhyMatters(p.whyMatters || '');
    setMemories(p.memories || '');
    setLikes(p.likes || []);
    setIsModalOpen(true);
  };

  const handleAddLike = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = likesInput.trim();
      if (val && !likes.includes(val)) {
        setLikes([...likes, val]);
        setLikesInput('');
      }
    }
  };

  const handleRemoveLike = (item) => {
    setLikes(likes.filter((l) => l !== item));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingPerson) {
      updateLovedOne(editingPerson.id, {
        name,
        relation,
        birthday,
        avatar,
        whyMatters,
        memories,
        likes
      });
    } else {
      addLovedOne({
        name,
        relation,
        birthday,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        whyMatters,
        memories,
        likes
      });
    }
    setIsModalOpen(false);
  };

  // Check upcoming birthdays (next 30 days)
  const upcomingBirthdays = lovedOnes
    .map((p) => ({ ...p, daysLeft: getDaysUntilBirthday(p.birthday) }))
    .filter((p) => p.daysLeft !== null && p.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/15">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-purple-100 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" />
            <span>Yaqin Insonlarim</span>
          </h1>
          <p className="text-xs sm:text-sm text-purple-300/70 mt-1 font-sans">
            Hayotingizni ma’no va mehr bilan to‘ldirgan eng qadrli insonlar xazinasi
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yaqin inson qo‘shish</span>
        </button>
      </div>

      {/* Birthday Banner if any */}
      {upcomingBirthdays.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-amber-500/30 bg-amber-950/20 shadow-glow-gold flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 shrink-0">
            <Cake className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 text-xs">
            <span className="font-bold text-amber-200">Yaqinlashayotgan tug‘ilgan kunlar: </span>
            <span className="text-amber-100/90">
              {upcomingBirthdays.map((p) => (
                <span key={p.id} className="mr-3">
                  {p.name} ({p.daysLeft === 0 ? 'Bugun!' : `${p.daysLeft} kundan so‘ng`})
                </span>
              ))}
            </span>
          </div>
        </div>
      )}

      {/* Profiles Cards Grid */}
      {lovedOnes.length === 0 ? (
        <div className="rounded-3xl glass-panel p-10 text-center border border-purple-500/20 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-purple-400" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-purple-100 mb-2">
            Yaqinlar ro‘yxati hali bo‘sh
          </h3>
          <p className="text-xs sm:text-sm text-purple-300/70 mb-6 leading-relaxed">
            Hayotingizdagi eng qadrli insonlarni (ota-ona, oila, do‘stlar) qo‘shing, ularning tug‘ilgan kunlari va iliq xotiralarini saqlang.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Birinchi yaqin insoningizni qo‘shish</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lovedOnes.map((person) => {
          const daysUntil = getDaysUntilBirthday(person.birthday);

          return (
            <div
              key={person.id}
              className="rounded-3xl glass-panel border border-purple-500/20 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group glass-panel-hover"
            >
              <div>
                {/* Top Profile Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      {person.avatar ? (
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-400/40 shadow-glow-sm"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-purple-900/50 border-2 border-purple-400/30 flex items-center justify-center text-xl font-bold text-purple-200">
                          {person.name[0]}
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-lunara-bg-deep border border-purple-500/40 text-purple-300">
                        <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold text-purple-100">
                        {person.name}
                      </h3>
                      <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/20 text-purple-300 mt-1">
                        {person.relation}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(person)}
                      className="p-1.5 rounded-lg text-purple-300/60 hover:text-purple-200 hover:bg-purple-800/20 transition-all"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteLovedOne(person.id)}
                      className="p-1.5 rounded-lg text-rose-400/50 hover:text-rose-300 hover:bg-rose-950/20 transition-all"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Birthday pill */}
                {person.birthday && (
                  <div className="mb-4 flex items-center gap-2 text-xs text-purple-300/70">
                    <Cake className="w-3.5 h-3.5 text-purple-400" />
                    <span>{formatUzbekDateShort(person.birthday)}</span>
                    {daysUntil !== null && (
                      <span className="text-[10px] text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30">
                        {daysUntil === 0 ? 'Bugun tug‘ilgan kun!' : `${daysUntil} kun qoldi`}
                      </span>
                    )}
                  </div>
                )}

                {/* Why Matters */}
                {person.whyMatters && (
                  <div className="mb-4 p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/15">
                    <span className="text-[10px] uppercase font-semibold text-purple-400/80 tracking-wider block mb-1">
                      Nega men uchun qadrli?
                    </span>
                    <p className="text-xs text-purple-200/90 leading-relaxed font-sans">
                      «{person.whyMatters}»
                    </p>
                  </div>
                )}

                {/* Shared Memories */}
                {person.memories && (
                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-semibold text-purple-400/80 tracking-wider block mb-1">
                      Qadrli xotiralarimiz:
                    </span>
                    <p className="text-xs text-purple-300/70 leading-relaxed font-sans">
                      {person.memories}
                    </p>
                  </div>
                )}

                {/* Things they like */}
                {person.likes && person.likes.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-purple-400/80 tracking-wider block mb-1.5 flex items-center gap-1">
                      <Gift className="w-3 h-3 text-purple-400" />
                      <span>Yoqtirgan narsalari:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {person.likes.map((like, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-purple-900/40 border border-purple-500/20 text-purple-200"
                        >
                          {like}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lunara-bg-deep/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15 mb-4">
              <h3 className="font-serif text-xl font-bold text-purple-100">
                {editingPerson ? 'Yaqin Inson Ma’lumotlarini Tahrirlash' : 'Yangi Yaqin Inson Qo‘shish'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-purple-400/60 hover:text-purple-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Ismi
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Onajonim"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Munosabat
                  </label>
                  <input
                    type="text"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    placeholder="Masalan: Ona, Ota, Do‘st"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Tug‘ilgan kuni
                  </label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Foto rasmi (URL)
                  </label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="Rasm havolasi (ixtiyoriy)"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Nega u siz uchun nihoyatda qadrli?
                </label>
                <textarea
                  value={whyMatters}
                  onChange={(e) => setWhyMatters(e.target.value)}
                  placeholder="U insonning hayotingizdagi o‘rni va qadri haqida samimiy so‘zlar..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40 h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Birga o‘tgan unutilmas xotirangiz
                </label>
                <textarea
                  value={memories}
                  onChange={(e) => setMemories(e.target.value)}
                  placeholder="U bilan bog‘liq qalbingizga muhrlangan biron voqea..."
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40 h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Yoqtirgan narsalari (sovg‘a yoki qiziqishlari)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {likes.map((like) => (
                    <span
                      key={like}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-900/40 border border-purple-500/20 text-purple-200 text-xs"
                    >
                      <span>{like}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLike(like)}
                        className="text-purple-400/50 hover:text-rose-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={likesInput}
                  onChange={(e) => setLikesInput(e.target.value)}
                  onKeyDown={handleAddLike}
                  placeholder="Yangi narsa yozib Enter bosing..."
                  className="w-full px-4 py-2 rounded-xl glass-input text-xs text-purple-100 placeholder:text-purple-400/40"
                />
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
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
