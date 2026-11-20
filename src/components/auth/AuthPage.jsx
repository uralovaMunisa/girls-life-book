import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Lock,
  User,
  ArrowRight,
  Upload,
  KeyRound,
  Eye,
  EyeOff,
  Users,
  Globe
} from 'lucide-react';
import { useAppStore, useTranslation } from '../../store/useAppStore';
import { AVATAR_PRESETS } from '../../data/sampleData';
import BackgroundGlow from '../ambient/BackgroundGlow';

export default function AuthPage() {
  const fileInputRef = useRef(null);
  const { accounts, register, login } = useAppStore();
  const { language, setLanguage, t } = useTranslation();

  const [mode, setMode] = useState('register'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0].url);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const existingUserList = Object.values(accounts || {});

  const handleSelectPresetAvatar = (url) => {
    setAvatar(url);
  };

  const handleCustomFileUpload = (e) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'register') {
      const res = register(username, name || username, password, avatar);
      if (!res.success) {
        setErrorMsg(res.error);
      }
    } else {
      const res = login(username, password);
      if (!res.success) {
        setErrorMsg(res.error);
      }
    }
  };

  const handleQuickSelectUser = (u) => {
    setUsername(u.username);
    setMode('login');
    setErrorMsg('');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'uz' ? 'en' : 'uz');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-lunara-bg-deep text-[#f3f0fa]">
      <BackgroundGlow />

      {/* Top right language toggle */}
      <div className="absolute top-5 right-5 z-20">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel text-xs font-semibold text-purple-200 border border-purple-500/25 hover:border-purple-400/50 hover:bg-purple-900/30 transition-all shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-purple-400" />
          <span>{language === 'uz' ? 'English' : 'O‘zbekcha'}</span>
        </button>
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-10 border border-purple-500/25 shadow-2xl animate-scale-in">
        {/* Emblem & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 flex items-center justify-center shadow-glow-lg border border-purple-400/30 mb-4 animate-float-slow">
            <Sparkles className="w-8 h-8 text-purple-100" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-purple-200 to-indigo-200">
            Lunara
          </h1>
          <p className="text-xs sm:text-sm text-purple-300/70 mt-1 max-w-xs font-sans">
            {t('appSubtitle')}
          </p>
        </div>

        {/* Existing Accounts Pill Bar (if any on this device) */}
        {existingUserList.length > 0 && (
          <div className="mb-6 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20">
            <span className="text-[10px] uppercase font-semibold text-purple-400/80 tracking-wider block mb-2 flex items-center gap-1.5">
              <Users className="w-3 h-3 text-purple-400" />
              <span>{t('accountsOnDevice')}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {existingUserList.map((u) => (
                <button
                  key={u.username}
                  type="button"
                  onClick={() => handleQuickSelectUser(u)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border text-xs transition-all ${
                    username.toLowerCase() === u.username
                      ? 'border-purple-400 bg-purple-900/50 text-purple-100 shadow-sm'
                      : 'border-purple-500/20 bg-purple-950/30 text-purple-300/70 hover:border-purple-400/30'
                  }`}
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-medium">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl glass-panel border border-purple-500/20 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'register'
                ? 'bg-purple-600/40 text-purple-100 border border-purple-400/40 shadow-glow-sm'
                : 'text-purple-300/70 hover:text-purple-100'
            }`}
          >
            {t('createNewAccount')}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'login'
                ? 'bg-purple-600/40 text-purple-100 border border-purple-400/40 shadow-glow-sm'
                : 'text-purple-300/70 hover:text-purple-100'
            }`}
          >
            {t('loginToAccount')}
          </button>
        </div>

        {/* Error message if any */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
                {t('yourName')}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-purple-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('yourNamePlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/35"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
              {t('username')}
            </label>
            <div className="relative">
              <span className="text-xs text-purple-400/60 font-mono absolute left-3.5 top-1/2 -translate-y-1/2">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                placeholder={t('usernamePlaceholder')}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/35 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-300/80 mb-1.5">
              {t('customPasscode')}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-purple-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passcodePlaceholder')}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-purple-100 placeholder:text-purple-400/35 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400/60 hover:text-purple-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === 'register' && (
              <p className="text-[10px] text-purple-400/60 mt-1">
                {t('passcodeHint')}
              </p>
            )}
          </div>

          {/* Avatar Selector (Only for registration) */}
          {mode === 'register' && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-purple-300/80 mb-2">
                {t('accountPicture')}
              </label>

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-400 shadow-glow-sm"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCustomFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/40 text-purple-200 text-xs border border-purple-500/25 transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t('uploadFromComputer')}</span>
                </button>
              </div>

              {/* Preset choices */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {AVATAR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(p.url)}
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
          )}

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-glow-md hover:shadow-glow-lg transition-all active:scale-[0.98] border border-purple-400/30"
          >
            <span>{mode === 'register' ? t('createAndEnter') : t('loginAndEnter')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
