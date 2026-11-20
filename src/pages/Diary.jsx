import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  PenSquare,
  BookOpen,
  Search,
  Heart,
  Calendar,
  CloudSun,
  CloudRain,
  Sun,
  Cloud,
  Moon,
  Wind,
  Snowflake,
  Tag,
  Image,
  Trash2,
  Edit3,
  Check,
  Sparkles,
  Filter,
  Eye,
  FileText
} from 'lucide-react';
import { useAppStore, useCurrentUser } from '../store/useAppStore';
import { formatUzbekDate, formatUzbekDateShort, formatTime } from '../utils/dateUtils';
import { soundEngine } from '../utils/audio';

const WEATHERS = [
  { id: 'quyoshli', label: 'Quyoshli', icon: Sun },
  { id: 'bulutli', label: 'Bulutli', icon: Cloud },
  { id: 'yomgir', label: 'Yomg‘irli', icon: CloudRain },
  { id: 'yulduzli', label: 'Yulduzli tun', icon: Moon },
  { id: 'shamol', label: 'Shamolli', icon: Wind },
  { id: 'qor', label: 'Qorli', icon: Snowflake },
];

const MOODS = [
  { id: 'ajoyib', label: 'Ajoyib', emoji: '✨' },
  { id: 'xotirjam', label: 'Xotirjam', emoji: '🕊️' },
  { id: 'oychan', label: 'O‘ychan', emoji: '🌙' },
  { id: 'minnatdor', label: 'Minnatdor', emoji: '🌸' },
  { id: 'charchagan', label: 'Charchagan', emoji: '🍃' },
  { id: 'xafa', label: 'Mayus', emoji: '🌧️' },
];

export default function Diary() {
  const location = useLocation();
  const currentUser = useCurrentUser();
  const { addEntry, updateEntry, deleteEntry, toggleFavoriteEntry } = useAppStore();
  const entries = currentUser?.entries || [];

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'editor'
  const [editingId, setEditingId] = useState(null);

  // Editor form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('xotirjam');
  const [weather, setWeather] = useState('yulduzli');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Xotirjamlik']);
  const [image, setImage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('Tayyor');

  // Filter state for list view
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // If redirected with initialPrompt
  useEffect(() => {
    if (location.state?.initialPrompt) {
      setTitle(location.state.initialPrompt);
      setActiveTab('editor');
      setEditingId(null);
    }
  }, [location.state]);

  const handleStartNew = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setMood('xotirjam');
    setWeather('yulduzli');
    setTags(['Shaxsiy']);
    setImage('');
    setIsFavorite(false);
    setActiveTab('editor');
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setTitle(entry.title || '');
    setContent(entry.content || '');
    setMood(entry.mood || 'xotirjam');
    setWeather(entry.weather || 'yulduzli');
    setTags(entry.tags || []);
    setImage(entry.image || '');
    setIsFavorite(entry.isFavorite || false);
    setActiveTab('editor');
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    if (editingId) {
      updateEntry(editingId, {
        title: title || 'Nomsiz xotira',
        content,
        mood,
        weather,
        tags,
        image,
        isFavorite,
      });
    } else {
      addEntry({
        title: title || 'Nomsiz xotira',
        content,
        mood,
        weather,
        tags,
        image,
        isFavorite,
      });
    }
    soundEngine.playChime('success');
    setActiveTab('list');
  };

  const filteredEntries = entries.filter((e) => {
    if (showFavoritesOnly && !e.isFavorite) return false;
    if (selectedMoodFilter !== 'all' && e.mood !== selectedMoodFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title?.toLowerCase().includes(q);
      const matchContent = e.content?.toLowerCase().includes(q);
      const matchTag = (e.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTag) return false;
    }
    return true;
  });

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-500/15">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-purple-100 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-400" />
            <span>Qalb Kundaligi</span>
          </h1>
          <p className="text-xs sm:text-sm text-purple-300/70 mt-1 font-sans">
            Sizning shaxsiy kechinmalaringiz, o‘y-xayollaringiz va xotiralar daftari
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1 rounded-2xl glass-panel border border-purple-500/20 flex gap-1">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === 'list'
                  ? 'bg-purple-600/40 text-purple-100 border border-purple-400/40 shadow-glow-sm'
                  : 'text-purple-300/70 hover:text-purple-100'
                }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xotiralar ({entries.length})</span>
            </button>

            <button
              onClick={handleStartNew}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === 'editor' && !editingId
                  ? 'bg-purple-600/40 text-purple-100 border border-purple-400/40 shadow-glow-sm'
                  : 'text-purple-300/70 hover:text-purple-100'
                }`}
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Yangi yozish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor View */}
      {activeTab === 'editor' && (
        <div className="rounded-3xl glass-panel border border-purple-500/25 p-6 sm:p-10 shadow-2xl relative animate-scale-in">
          {/* Top Bar inside Editor */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-purple-500/15">
            <div className="flex flex-wrap items-center gap-3">
              {/* Mood selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-purple-950/40 border border-purple-500/20">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${mood === m.id
                        ? 'bg-purple-600/40 text-purple-100 border border-purple-400/40 shadow-sm'
                        : 'text-purple-300/60 hover:text-purple-200'
                      }`}
                    title={m.label}
                  >
                    <span>{m.emoji}</span>
                    <span className="hidden sm:inline ml-1 text-[11px]">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Weather selector */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-purple-950/40 border border-purple-500/20">
                {WEATHERS.map((w) => {
                  const Icon = w.icon;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWeather(w.id)}
                      className={`p-1.5 rounded-lg transition-all ${weather === w.id
                          ? 'bg-purple-600/40 text-purple-200 border border-purple-400/40'
                          : 'text-purple-400/50 hover:text-purple-200'
                        }`}
                      title={w.label}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>

              {/* Favorite toggle */}
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-xl border transition-all ${isFavorite
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 shadow-sm'
                    : 'bg-purple-950/40 border-purple-500/20 text-purple-400/50 hover:text-purple-200'
                  }`}
                title={isFavorite ? "Sevimlilardan o'chirish" : 'Sevimlilarga qo‘shish'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-purple-400/60 font-mono">
                {wordCount} ta so‘z
              </span>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{editingId ? 'O‘zgarishlarni saqlash' : 'Xotirani saqlash'}</span>
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div className="mt-6 mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Xotira sarlavhasi (masalan: Sokin oqshom kechinmalari)..."
              className="w-full bg-transparent font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-100 placeholder:text-purple-400/30 outline-none tracking-wide"
            />
          </div>

          {/* Tags bar */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Tag className="w-3.5 h-3.5 text-purple-400/60" />
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-200 text-xs font-sans"
              >
                <span>#{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="text-purple-400/50 hover:text-rose-300 text-xs"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Teg qo‘shish (Enter bosing)..."
              className="bg-transparent text-xs text-purple-200 placeholder:text-purple-400/30 outline-none w-44"
            />
          </div>

          {/* Text Area (Notebook Styled) */}
          <div className="min-h-[340px] notebook-paper">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Qalbingizdagilarni erkin yozing... Har bir so‘zingiz faqat o‘zingizga tegishli va xavfsiz."
              className="w-full h-80 bg-transparent font-serif text-lg sm:text-xl text-purple-100/90 placeholder:text-purple-400/25 outline-none resize-none leading-[2.2rem]"
            />
          </div>

          {/* Optional Image URL Input */}
          <div className="mt-6 pt-4 border-t border-purple-500/15 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-purple-300/70">
              <Image className="w-4 h-4 text-purple-400" />
              <span>Foto ilova (URL):</span>
            </div>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Rasm havolasini kiriting (ixtiyoriy)..."
              className="flex-1 px-3.5 py-2 rounded-xl glass-input text-xs text-purple-100 placeholder:text-purple-400/30"
            />
            {image && (
              <button
                type="button"
                onClick={() => setImage('')}
                className="text-xs text-rose-400/70 hover:text-rose-300"
              >
                O‘chirish
              </button>
            )}
          </div>

          {image && (
            <div className="mt-4 max-w-sm rounded-2xl overflow-hidden border border-purple-500/30">
              <img src={image} alt="Ko'rish" className="w-full h-44 object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Timeline / List View */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-3xl glass-panel border border-purple-500/20">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Xotiralar bo‘yicha qidiruv..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/40"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Mood Filter */}
              <select
                value={selectedMoodFilter}
                onChange={(e) => setSelectedMoodFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl glass-input text-xs text-purple-200 outline-none"
              >
                <option value="all">Barcha kayfiyatlar</option>
                {MOODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.emoji} {m.label}
                  </option>
                ))}
              </select>

              {/* Favorites toggle */}
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`p-2.5 rounded-2xl border text-xs transition-all ${showFavoritesOnly
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 shadow-sm'
                    : 'glass-panel border-purple-500/20 text-purple-400/60 hover:text-purple-200'
                  }`}
                title="Faqat sevimlilarni ko‘rsatish"
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-400 text-rose-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Entries Cards Grid */}
          {filteredEntries.length === 0 ? (
            <div className="rounded-3xl glass-panel p-12 text-center border border-purple-500/15">
              <FileText className="w-12 h-12 text-purple-400/40 mx-auto mb-3" />
              <h3 className="font-serif text-xl font-semibold text-purple-200 mb-1">
                Hech qanday xotira topilmadi
              </h3>
              <p className="text-xs text-purple-300/60 mb-6">
                Qidiruv so‘zini o‘zgartiring yoki yangi bir xotira qoldiring.
              </p>
              <button
                onClick={handleStartNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-100 text-xs font-medium border border-purple-400/30 transition-all shadow-glow-sm"
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Yangi yozuv boshlash</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEntries.map((entry) => {
                const currentMood = MOODS.find((m) => m.id === entry.mood);
                const currentWeather = WEATHERS.find((w) => w.id === entry.weather);
                const WeatherIcon = currentWeather?.icon || Sun;

                return (
                  <div
                    key={entry.id}
                    className="rounded-3xl glass-panel border border-purple-500/15 p-6 shadow-xl flex flex-col justify-between group glass-panel-hover relative overflow-hidden"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-xl bg-purple-950/60 border border-purple-500/20 text-purple-200 font-sans flex items-center gap-1.5">
                            <span>{currentMood?.emoji}</span>
                            <span>{currentMood?.label}</span>
                          </span>

                          <span
                            className="p-1.5 rounded-xl bg-purple-950/60 border border-purple-500/20 text-purple-300"
                            title={currentWeather?.label}
                          >
                            <WeatherIcon className="w-3.5 h-3.5" />
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-purple-400/60 font-mono">
                            {formatUzbekDateShort(entry.date)}
                          </span>
                          <button
                            onClick={() => toggleFavoriteEntry(entry.id)}
                            className="text-purple-400/50 hover:text-rose-400 transition-colors"
                          >
                            <Heart
                              className={`w-4 h-4 ${entry.isFavorite ? 'fill-rose-400 text-rose-400' : ''
                                }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-xl font-bold text-purple-100 mb-2 line-clamp-1 group-hover:text-purple-200 transition-colors">
                        {entry.title}
                      </h3>

                      {/* Content Preview */}
                      <p className="text-xs sm:text-sm text-purple-300/75 leading-relaxed font-sans line-clamp-4 mb-4">
                        {entry.content}
                      </p>

                      {/* Image Thumbnail */}
                      {entry.image && (
                        <div className="mb-4 h-36 rounded-2xl overflow-hidden border border-purple-500/20">
                          <img
                            src={entry.image}
                            alt={entry.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Tags */}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {entry.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/50 border border-purple-500/15 text-purple-300/80"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between">
                      <span className="text-[11px] text-purple-400/50 font-mono">
                        {entry.wordCount || 0} ta so‘z
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-1.5 rounded-lg text-purple-300/70 hover:text-purple-100 hover:bg-purple-800/30 transition-all"
                          title="Tahrirlash"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="p-1.5 rounded-lg text-rose-400/60 hover:text-rose-300 hover:bg-rose-950/30 transition-all"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
