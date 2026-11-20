import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Star,
  Quote,
  BookOpen,
  Music,
  Film,
  MapPin,
  Utensils,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { useAppStore, useCurrentUser } from '../store/useAppStore';

const DEFAULT_CATEGORIES = [
  'Barchasi',
  'Kitoblar',
  'Musiqa',
  'Filmlar',
  'Qadrli maskanlar',
  'Iqtiboslar',
  'Taomlar',
  'Qiziqishlar'
];

export default function Favorites() {
  const currentUser = useCurrentUser();
  const { addFavorite, deleteFavorite } = useAppStore();
  const favorites = currentUser?.favorites || [];

  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [category, setCategory] = useState('Kitoblar');
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [cover, setCover] = useState('');
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState('');
  const [note, setNote] = useState('');

  const filteredFavorites = selectedCategory === 'Barchasi'
    ? favorites
    : favorites.filter((f) => f.category === selectedCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addFavorite({
      category,
      title,
      creator,
      cover,
      rating,
      quote,
      note
    });

    setTitle('');
    setCreator('');
    setCover('');
    setQuote('');
    setNote('');
    setIsModalOpen(false);
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Kitoblar': return BookOpen;
      case 'Musiqa': return Music;
      case 'Filmlar': return Film;
      case 'Qadrli maskanlar': return MapPin;
      case 'Taomlar': return Utensils;
      case 'Iqtiboslar': return Quote;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/15">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-purple-100 flex items-center gap-3">
            <Heart className="w-8 h-8 text-purple-400" />
            <span>Yoqtirganlarim Kolleksiyasi</span>
          </h1>
          <p className="text-xs sm:text-sm text-purple-300/70 mt-1 font-sans">
            Sizga quvonch, ilhom va zavq beruvchi sara asarlar, ohanglar, maskanlar va hikmatlar
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi qo‘shish</span>
        </button>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DEFAULT_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-purple-600/40 text-purple-100 border border-purple-400/40 shadow-glow-sm'
                  : 'glass-panel text-purple-300/70 border-purple-500/15 hover:text-purple-200 hover:border-purple-400/30'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Favorites Cards Grid */}
      {filteredFavorites.length === 0 ? (
        <div className="rounded-3xl glass-panel p-12 text-center border border-purple-500/15">
          <Heart className="w-12 h-12 text-purple-400/30 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-semibold text-purple-200 mb-1">
            Ushbu toifada hali hech narsa yo‘q
          </h3>
          <p className="text-xs text-purple-300/60 mb-4">
            O‘zingiz yoqtirgan narsalarni birma-bir to‘plang.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-100 text-xs font-medium border border-purple-400/30"
          >
            Qo‘shish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((item) => {
            const Icon = getCategoryIcon(item.category);

            return (
              <div
                key={item.id}
                className="rounded-3xl glass-panel border border-purple-500/15 p-5 shadow-xl flex flex-col justify-between group glass-panel-hover relative overflow-hidden"
              >
                <div>
                  {/* Image cover if provided */}
                  {item.cover ? (
                    <div className="h-44 rounded-2xl overflow-hidden mb-4 border border-purple-500/20 relative">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-lunara-bg-deep/80 backdrop-blur-md border border-purple-500/30 text-[10px] text-purple-200 font-medium">
                        {item.category}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/20 text-[10px] text-purple-300">
                        <Icon className="w-3 h-3" />
                        <span>{item.category}</span>
                      </span>
                    </div>
                  )}

                  {/* Title & Creator */}
                  <h3 className="font-serif text-lg font-bold text-purple-100 mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  {item.creator && (
                    <p className="text-xs text-purple-300/60 mb-3 font-sans">
                      {item.creator}
                    </p>
                  )}

                  {/* Star rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= item.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-purple-900/60'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  {item.quote && (
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/10 mb-3">
                      <p className="font-serif italic text-xs text-purple-200/90 leading-relaxed">
                        «{item.quote}»
                      </p>
                    </div>
                  )}

                  {/* Personal note */}
                  {item.note && (
                    <p className="text-xs text-purple-300/70 font-sans leading-relaxed line-clamp-3">
                      {item.note}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-4 border-t border-purple-500/15 flex items-center justify-end">
                  <button
                    onClick={() => deleteFavorite(item.id)}
                    className="p-1.5 rounded-lg text-purple-400/50 hover:text-rose-400 hover:bg-rose-950/20 transition-all"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lunara-bg-deep/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-purple-500/15 mb-4">
              <h3 className="font-serif text-xl font-bold text-purple-100">
                Yangi Yoqtirgan Narsani Qo‘shish
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
                    Toifa
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 outline-none"
                  >
                    {DEFAULT_CATEGORIES.filter((c) => c !== 'Barchasi').map((c) => (
                      <option key={c} value={c} className="bg-lunara-bg-deep text-purple-100">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Baholash (1-5 yulduz)
                  </label>
                  <div className="flex items-center gap-2 pt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="text-purple-400 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= rating ? 'text-amber-400 fill-amber-400' : 'text-purple-900'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Nomi
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: «Kichkina shahzoda» yoki «Experience»"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Muallif / Ijrochi
                  </label>
                  <input
                    type="text"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="Masalan: Antuan de Sent-Ekzyuperi"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                    Rasm havolasi (URL)
                  </label>
                  <input
                    type="text"
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                    placeholder="Rasm manzili (ixtiyoriy)"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Iqtibos yoki esda qolarli satr
                </label>
                <input
                  type="text"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="«Asosiy narsani qalb ko‘zi bilan ko‘rish lozim...»"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40 font-serif italic"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                  Shaxsiy fikr va xulosangiz
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nega aynan bu asarni yoqtirasiz?"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40 h-20 resize-none"
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
                  Kolleksiyaga qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
