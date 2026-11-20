import React, { useState, useRef, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  KeyRound,
  Download,
  Upload,
  RefreshCw,
  Moon,
  Sun,
  ShieldCheck,
  Check,
  AlertTriangle,
  LogOut,
  Trash2,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { useAppStore, useCurrentUser, useTranslation } from '../store/useAppStore';
import { AVATAR_PRESETS } from '../data/sampleData';

export default function Settings() {
  const fileInputRef = useRef(null);
  const jsonInputRef = useRef(null);

  const currentUser = useCurrentUser();
  const { language, setLanguage, t } = useTranslation();
  const {
    updateProfile,
    setTheme,
    exportDataJSON,
    importDataJSON,
    clearCurrentUserData,
    deleteAccount,
    logout
  } = useAppStore();

  // Form states
  const [name, setName] = useState(currentUser?.name || '');
  const [newUsername, setNewUsername] = useState(currentUser?.username || '');
  const [title, setTitle] = useState(currentUser?.title || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [password, setPassword] = useState(currentUser?.password || '');
  const [statusMessage, setStatusMessage] = useState('');

  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setNewUsername(currentUser.username || '');
      setTitle(currentUser.title || '');
      setAvatar(currentUser.avatar || '');
      setPassword(currentUser.password || '');
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setStatusMessage('');

    const res = updateProfile({
      name,
      newUsername,
      avatar,
      password,
      title
    });

    if (res.success) {
      setStatusMessage('Profil muvaffaqiyatli yangilandi ✨');
      setTimeout(() => setStatusMessage(''), 4000);
    } else {
      setStatusMessage(res.error || 'Xatolik yuz berdi');
    }
  };

  const handleJsonUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        importDataJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const isWarm = currentUser.theme === 'warm';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/15">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-purple-100 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-purple-400" />
            <span>Sozlamalar & Profil</span>
          </h1>
          <p className="text-xs sm:text-sm text-purple-300/70 mt-1 font-sans">
            Shaxsiy profilingiz, hisob rasmi, kirish kodi va ma’lumotlar xavfsizligi
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-950/40 hover:bg-rose-950/30 text-purple-300 hover:text-rose-300 border border-purple-500/20 hover:border-rose-500/30 text-xs font-semibold transition-all self-start sm:self-center"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Hisobdan chiqish</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-400/40 text-purple-200 text-xs font-medium animate-fade-in shadow-glow-sm">
          {statusMessage}
        </div>
      )}

      {/* Profile & Avatar Editing */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 shadow-xl">
        <h2 className="text-base sm:text-lg font-semibold text-purple-100 flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-purple-400" />
          <span>Shaxsiy Profil & Hisob Ma’lumotlari</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar section */}
          <div>
            <label className="block text-xs font-semibold text-purple-300/80 mb-3">
              Hisob Rasmi (Avatar)
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <div className="relative group w-20 h-20 rounded-3xl overflow-hidden border-2 border-purple-400/50 shadow-glow-sm">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[10px] text-white transition-opacity"
                >
                  <Camera className="w-5 h-5 mb-1" />
                  <span>O‘zgartirish</span>
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-800/40 border border-purple-400/30 text-purple-200 text-xs font-medium transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Kompyuterdan rasm tanlash</span>
                </button>
                <p className="text-[11px] text-purple-300/60 font-sans">
                  JPG, PNG yoki GIF formatdagi istalgan fotosuratingizni yuklashingiz mumkin
                </p>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-[11px] text-purple-400/70 mr-1 whitespace-nowrap">
                Yoki tanlang:
              </span>
              {AVATAR_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAvatar(p.url)}
                  className={`shrink-0 w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                    avatar === p.url
                      ? 'border-purple-400 scale-105 shadow-glow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  title={p.name}
                >
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                Ismingiz
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ismingizni kiriting"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                Login / Taxallus (@username)
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value.replace(/\s+/g, ''))}
                placeholder="Loginingiz"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                Qisqacha ta’rif / Ruh shiori
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Qalb sayyohi yoki Kitob oshuftasi"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-300/80 mb-1.5 flex items-center justify-between">
                <span>Kirish kodi / Parol</span>
                <span className="text-[10px] text-purple-400/60">Istalgan kod</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Yangi kodni kiriting"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 font-mono"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-glow-sm hover:shadow-glow-md transition-all active:scale-95"
            >
              O‘zgarishlarni saqlash
            </button>
          </div>
        </form>
      </div>

      {/* Theme Atmosphere */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 shadow-xl">
        <h2 className="text-base sm:text-lg font-semibold text-purple-100 flex items-center gap-2 mb-4">
          <Sun className="w-5 h-5 text-purple-400" />
          <span>Kundalik Muhiti & Jilosi</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setTheme('deep')}
            className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all ${
              !isWarm
                ? 'border-purple-400 bg-purple-900/40 shadow-glow-sm'
                : 'border-purple-500/15 bg-purple-950/20 text-purple-300/60 hover:border-purple-400/30'
            }`}
          >
            <div className="p-2 rounded-xl bg-purple-900/60 text-purple-300 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-purple-100">Tungi Osmon Rejimi</div>
              <div className="text-[11px] text-purple-300/60 mt-1">
                Chuqur qora-binafsha fon, sirli yulduzlar va sokin ametist nuri
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('warm')}
            className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all ${
              isWarm
                ? 'border-amber-400/60 bg-amber-950/30 shadow-glow-gold'
                : 'border-purple-500/15 bg-purple-950/20 text-purple-300/60 hover:border-amber-400/30'
            }`}
          >
            <div className="p-2 rounded-xl bg-amber-950/60 text-amber-400 shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-100">{t('warmGlow')}</div>
              <div className="text-[11px] text-amber-200/60 mt-1">
                {t('warmGlowDesc')}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 shadow-xl">
        <h2 className="text-base sm:text-lg font-semibold text-purple-100 flex items-center gap-2 mb-4">
          <span className="text-lg">🌐</span>
          <span>{language === 'uz' ? 'Tilni tanlash (Language)' : 'Language Selection'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setLanguage('uz')}
            className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all ${
              language === 'uz'
                ? 'border-purple-400 bg-purple-900/40 shadow-glow-sm text-purple-100'
                : 'border-purple-500/15 bg-purple-950/20 text-purple-300/60 hover:border-purple-400/30'
            }`}
          >
            <span className="text-2xl">🇺🇿</span>
            <div>
              <div className="text-xs font-semibold">O‘zbekcha (Lotin)</div>
              <div className="text-[11px] text-purple-300/60">Asosiy til</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all ${
              language === 'en'
                ? 'border-purple-400 bg-purple-900/40 shadow-glow-sm text-purple-100'
                : 'border-purple-500/15 bg-purple-950/20 text-purple-300/60 hover:border-purple-400/30'
            }`}
          >
            <span className="text-2xl">🇬🇧</span>
            <div>
              <div className="text-xs font-semibold">English</div>
              <div className="text-[11px] text-purple-300/60">English interface</div>
            </div>
          </button>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-purple-500/20 shadow-xl">
        <h2 className="text-base sm:text-lg font-semibold text-purple-100 flex items-center gap-2 mb-2">
          <Download className="w-5 h-5 text-purple-400" />
          <span>Shaxsiy Zaxira Nusxalar</span>
        </h2>
        <p className="text-xs text-purple-300/70 mb-6 font-sans leading-relaxed">
          Barcha yozgan xotiralaringiz, yaqinlaringiz va maqsadlaringiz faqat sizning qurilmangizda saqlanadi. Ma’lumotlaringizni xavfsiz JSON fayl ko‘rinishida yuklab oling va istalgan paytda qayta tiklang.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportDataJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-100 text-xs font-semibold border border-purple-400/30 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Zaxirani yuklab olish (JSON)</span>
          </button>

          <input
            type="file"
            ref={jsonInputRef}
            onChange={handleJsonUpload}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => jsonInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 text-purple-200 text-xs font-semibold border border-purple-500/25 transition-all"
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Zaxiradan tiklash</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Clear Memories / Delete Account */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-rose-500/20 shadow-xl">
        <h2 className="text-base sm:text-lg font-semibold text-rose-300 flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <span>Xavfli Hudud</span>
        </h2>
        <p className="text-xs text-purple-300/70 mb-6 font-sans leading-relaxed">
          Ushbu hisobdagi barcha xotiralarni tozalashingiz yoki hisobni butunlay o‘chirib tashlashingiz mumkin.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsConfirmClearOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 text-rose-300 text-xs font-semibold border border-rose-500/25 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Xotiralarni tozalash</span>
          </button>

          <button
            onClick={() => setIsConfirmDeleteOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-200 text-xs font-semibold border border-rose-500/40 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hisobni butunlay o‘chirish</span>
          </button>
        </div>
      </div>

      {/* Confirm Clear Modal */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lunara-bg-deep/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-rose-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-rose-200">
                Xotiralarni tozalash
              </h3>
            </div>
            <p className="text-xs text-purple-300/80 mb-6 leading-relaxed">
              Haqiqatan ham ushbu hisobdagi barcha xotiralar, maqsadlar va odatlarni tozalab bo‘shatmoqchimisiz?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmClearOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-purple-300/70 hover:text-purple-200"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCurrentUserData();
                  setIsConfirmClearOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm"
              >
                Ha, tozalansin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Account Modal */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lunara-bg-deep/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-rose-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-rose-200">
                Hisobni butunlay o‘chirish
              </h3>
            </div>
            <p className="text-xs text-purple-300/80 mb-6 leading-relaxed">
              @{currentUser.username} hisobi va unga tegishli barcha shaxsiy yozuvlar butunlay o‘chiriladi. Bu amalni ortga qaytarib bo‘lmaydi.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-purple-300/70 hover:text-purple-200"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAccount();
                  setIsConfirmDeleteOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm"
              >
                Ha, hisobni o‘chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
