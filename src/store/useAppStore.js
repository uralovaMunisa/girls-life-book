import { create } from 'zustand';
import { INITIAL_PROMPTS, createEmptyUserData } from '../data/sampleData';
import { translations } from '../utils/translations';

const USERS_STORAGE_KEY = 'lunara_accounts_db_v2';
const SESSION_STORAGE_KEY = 'lunara_current_session_v2';
const LANG_STORAGE_KEY = 'lunara_lang_v2';

// Load stored accounts
const loadStoredAccounts = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading Lunara accounts:', err);
  }
  return {};
};

// Load current active session username
const loadStoredSession = () => {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY) || null;
  } catch (err) {
    return null;
  }
};

const initialAccounts = loadStoredAccounts();
const initialSession = loadStoredSession();
const initialLanguage = localStorage.getItem(LANG_STORAGE_KEY) || 'uz';

export const useAppStore = create((set, get) => ({
  accounts: initialAccounts,
  currentUsername: (initialSession && initialAccounts[initialSession]) ? initialSession : null,
  prompts: INITIAL_PROMPTS,
  language: initialLanguage,
  toasts: [],
  isSearchOpen: false,

  setLanguage: (lang) => {
    set({ language: lang });
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  },

  t: (key) => {
    const lang = get().language || 'uz';
    return (translations[lang] && translations[lang][key]) || (translations['uz'] && translations['uz'][key]) || key;
  },

  // Helper to persist current accounts and active session to localStorage
  _persist: () => {
    try {
      const { accounts, currentUsername } = get();
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
      if (currentUsername) {
        localStorage.setItem(SESSION_STORAGE_KEY, currentUsername);
      } else {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  },

  // Helper to update current user's data block
  _updateCurrentUser: (updater) => {
    const { accounts, currentUsername } = get();
    if (!currentUsername || !accounts[currentUsername]) return;

    const user = accounts[currentUsername];
    const updatedUser = typeof updater === 'function' ? updater(user) : { ...user, ...updater };

    set({
      accounts: {
        ...accounts,
        [currentUsername]: updatedUser
      }
    });
    get()._persist();
  },

  // Toast notifications
  addToast: (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  },

  // ---------------- AUTHENTICATION ----------------
  register: (username, name, password, avatar) => {
    const cleanUsername = username.toLowerCase().trim();
    if (!cleanUsername) {
      return { success: false, error: 'Foydalanuvchi nomini kiriting' };
    }
    if (!password) {
      return { success: false, error: 'Xavfsizlik kodini kiriting' };
    }

    const { accounts } = get();
    if (accounts[cleanUsername]) {
      return { success: false, error: 'Bu nomdagi hisob allaqachon mavjud. Boshqa nom tanlang yoki tizimga kiring.' };
    }

    const newUser = createEmptyUserData(cleanUsername, name, password, avatar);
    const nextAccounts = { ...accounts, [cleanUsername]: newUser };

    set({
      accounts: nextAccounts,
      currentUsername: cleanUsername
    });
    get()._persist();
    get().addToast(`Xush kelibsiz, ${newUser.name}! Yangi maskaningiz ochildi ✨`);
    return { success: true };
  },

  login: (username, password) => {
    const cleanUsername = username.toLowerCase().trim();
    const { accounts } = get();
    const user = accounts[cleanUsername];

    if (!user) {
      return { success: false, error: 'Bunday hisob topilmadi. Avval yangi hisob yarating.' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Kiritilgan xavfsizlik kodi noto‘g‘ri.' };
    }

    set({ currentUsername: cleanUsername });
    get()._persist();
    get().addToast(`Xush ko‘rdik, ${user.name}!`);
    return { success: true };
  },

  logout: () => {
    set({ currentUsername: null });
    get()._persist();
    get().addToast('Hisobdan chiqildi', 'info');
  },

  updateProfile: ({ name, newUsername, avatar, password, title }) => {
    const { accounts, currentUsername } = get();
    if (!currentUsername || !accounts[currentUsername]) return { success: false };

    const currentUser = accounts[currentUsername];
    const targetUsername = newUsername ? newUsername.toLowerCase().trim() : currentUsername;

    // If changing username, check if taken
    if (targetUsername !== currentUsername && accounts[targetUsername]) {
      return { success: false, error: 'Bu yangi login band. Boshqa nom tanlang.' };
    }

    const updatedUser = {
      ...currentUser,
      name: name !== undefined ? name.trim() : currentUser.name,
      avatar: avatar !== undefined ? avatar : currentUser.avatar,
      password: password !== undefined && password !== '' ? password : currentUser.password,
      title: title !== undefined ? title : currentUser.title,
      username: targetUsername
    };

    const nextAccounts = { ...accounts };
    if (targetUsername !== currentUsername) {
      delete nextAccounts[currentUsername];
    }
    nextAccounts[targetUsername] = updatedUser;

    set({
      accounts: nextAccounts,
      currentUsername: targetUsername
    });
    get()._persist();
    get().addToast('Profil ma’lumotlari muvaffaqiyatli yangilandi');
    return { success: true };
  },

  deleteAccount: () => {
    const { accounts, currentUsername } = get();
    if (!currentUsername) return;

    const nextAccounts = { ...accounts };
    delete nextAccounts[currentUsername];

    set({
      accounts: nextAccounts,
      currentUsername: null
    });
    get()._persist();
    get().addToast('Hisobingiz va barcha ma’lumotlar o‘chirildi', 'info');
  },

  // ---------------- THEME & MOOD ----------------
  setTheme: (theme) => {
    get()._updateCurrentUser({ theme });
  },

  setTodayMood: (mood) => {
    get()._updateCurrentUser({ todayMood: mood });
    get().addToast('Bugungi kayfiyatingiz qayd etildi ✨');
  },

  // ---------------- DIARY ENTRIES ----------------
  addEntry: (entryData) => {
    const newEntry = {
      id: 'entry-' + Date.now(),
      date: new Date().toISOString(),
      tags: [],
      isFavorite: false,
      wordCount: (entryData.content || '').trim().split(/\s+/).filter(Boolean).length,
      ...entryData
    };

    get()._updateCurrentUser((user) => {
      const today = new Date().toISOString().slice(0, 10);
      let newStreak = user.streak || 0;
      if (user.lastEntryDate !== today) {
        newStreak += 1;
      }
      return {
        ...user,
        entries: [newEntry, ...(user.entries || [])],
        streak: newStreak,
        lastEntryDate: today
      };
    });

    get().addToast('Yangi xotira muhrlandi');
    return newEntry;
  },

  updateEntry: (id, updatedFields) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      entries: (user.entries || []).map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updatedFields };
          if (updatedFields.content !== undefined) {
            updated.wordCount = updated.content.trim().split(/\s+/).filter(Boolean).length;
          }
          return updated;
        }
        return item;
      })
    }));
    get().addToast('O‘zgarishlar saqlandi');
  },

  deleteEntry: (id) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      entries: (user.entries || []).filter((item) => item.id !== id)
    }));
    get().addToast('Xotira o‘chirildi', 'info');
  },

  toggleFavoriteEntry: (id) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      entries: (user.entries || []).map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    }));
  },

  // ---------------- LIFE STORY ----------------
  addChapter: (chapterData) => {
    const newChapter = {
      id: 'chapter-' + Date.now(),
      milestones: [],
      ...chapterData
    };
    get()._updateCurrentUser((user) => ({
      ...user,
      lifeStory: [...(user.lifeStory || []), newChapter]
    }));
    get().addToast('Yangi hayot bobi qo‘shildi');
  },

  updateChapter: (id, updatedFields) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      lifeStory: (user.lifeStory || []).map((ch) =>
        ch.id === id ? { ...ch, ...updatedFields } : ch
      )
    }));
  },

  deleteChapter: (id) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      lifeStory: (user.lifeStory || []).filter((ch) => ch.id !== id)
    }));
    get().addToast('Bob o‘chirildi', 'info');
  },

  addMilestone: (chapterId, milestone) => {
    const newM = {
      id: 'm-' + Date.now(),
      ...milestone
    };
    get()._updateCurrentUser((user) => ({
      ...user,
      lifeStory: (user.lifeStory || []).map((ch) =>
        ch.id === chapterId ? { ...ch, milestones: [...(ch.milestones || []), newM] } : ch
      )
    }));
    get().addToast('Muhim daqiqa qo‘shildi');
  },

  // ---------------- LOVED ONES ----------------
  addLovedOne: (person) => {
    const newPerson = {
      id: 'person-' + Date.now(),
      likes: [],
      ...person
    };
    get()._updateCurrentUser((user) => ({
      ...user,
      lovedOnes: [...(user.lovedOnes || []), newPerson]
    }));
    get().addToast(`${person.name} yaqinlar ro‘yxatiga qo‘shildi`);
  },

  updateLovedOne: (id, fields) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      lovedOnes: (user.lovedOnes || []).map((p) => (p.id === id ? { ...p, ...fields } : p))
    }));
    get().addToast('Ma’lumotlar yangilandi');
  },

  deleteLovedOne: (id) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      lovedOnes: (user.lovedOnes || []).filter((p) => p.id !== id)
    }));
    get().addToast('O‘chirildi', 'info');
  },

  // ---------------- FAVORITES ----------------
  addFavorite: (fav) => {
    const newFav = {
      id: 'fav-' + Date.now(),
      rating: 5,
      ...fav
    };
    get()._updateCurrentUser((user) => ({
      ...user,
      favorites: [newFav, ...(user.favorites || [])]
    }));
    get().addToast('Yoqtirganlaringizga qo‘shildi');
  },

  deleteFavorite: (id) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      favorites: (user.favorites || []).filter((f) => f.id !== id)
    }));
    get().addToast('O‘chirildi', 'info');
  },

  // ---------------- ROUTINE ----------------
  toggleRoutineItem: (id) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      routine: (user.routine || []).map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  },

  addRoutineItem: (item) => {
    const newItem = {
      id: 'r-' + Date.now(),
      completed: false,
      streak: 1,
      ...item
    };
    get()._updateCurrentUser((user) => ({
      ...user,
      routine: [...(user.routine || []), newItem]
    }));
    get().addToast('Yangi odat qo‘shildi');
  },

  deleteRoutineItem: (id) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      routine: (user.routine || []).filter((r) => r.id !== id)
    }));
  },

  // ---------------- GOALS ----------------
  addGoal: (goal) => {
    const newGoal = {
      id: 'goal-' + Date.now(),
      progress: 0,
      completed: false,
      subtasks: [],
      ...goal
    };
    get()._updateCurrentUser((user) => ({
      ...user,
      goals: [newGoal, ...(user.goals || [])]
    }));
    get().addToast('Yangi maqsad belgilandi 🎯');
  },

  toggleGoalSubtask: (goalId, subtaskId) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      goals: (user.goals || []).map((g) => {
        if (g.id !== goalId) return g;
        const updatedSubtasks = (g.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, done: !st.done } : st
        );
        const doneCount = updatedSubtasks.filter((st) => st.done).length;
        const progress = updatedSubtasks.length > 0 ? Math.round((doneCount / updatedSubtasks.length) * 100) : 0;
        const completed = progress === 100;
        return {
          ...g,
          subtasks: updatedSubtasks,
          progress,
          completed
        };
      })
    }));
  },

  deleteGoal: (id) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      goals: (user.goals || []).filter((g) => g.id !== id)
    }));
    get().addToast('Maqsad o‘chirildi', 'info');
  },

  // ---------------- DREAM BOARD ----------------
  addDream: (dream) => {
    const newDream = {
      id: 'dream-' + Date.now(),
      ...dream
    };
    get()._updateCurrentUser((user) => ({
      ...user,
      dreamBoard: [newDream, ...(user.dreamBoard || [])]
    }));
    get().addToast('Orzular doskasiga qo‘shildi ✨');
  },

  deleteDream: (id) => {
    get()._updateCurrentUser((user) => ({
      ...user,
      dreamBoard: (user.dreamBoard || []).filter((d) => d.id !== id)
    }));
  },

  // ---------------- SEARCH MODAL ----------------
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

  // ---------------- BACKUP & RESTORE ----------------
  exportDataJSON: () => {
    const { accounts, currentUsername } = get();
    if (!currentUsername || !accounts[currentUsername]) return;

    const user = accounts[currentUsername];
    const dataToExport = {
      user: {
        username: user.username,
        name: user.name,
        title: user.title,
        avatar: user.avatar,
        theme: user.theme,
      },
      entries: user.entries || [],
      lifeStory: user.lifeStory || [],
      lovedOnes: user.lovedOnes || [],
      favorites: user.favorites || [],
      routine: user.routine || [],
      goals: user.goals || [],
      dreamBoard: user.dreamBoard || [],
      streak: user.streak || 0,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };

    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', `lunara_${user.username}_zaxira_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    get().addToast('Barcha shaxsiy ma’lumotlaringiz faylga yuklab olindi');
  },

  importDataJSON: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.entries !== undefined) {
        get()._updateCurrentUser((user) => ({
          ...user,
          entries: parsed.entries || user.entries || [],
          lifeStory: parsed.lifeStory || user.lifeStory || [],
          lovedOnes: parsed.lovedOnes || user.lovedOnes || [],
          favorites: parsed.favorites || user.favorites || [],
          routine: parsed.routine || user.routine || [],
          goals: parsed.goals || user.goals || [],
          dreamBoard: parsed.dreamBoard || user.dreamBoard || [],
          streak: parsed.streak !== undefined ? parsed.streak : user.streak
        }));
        get().addToast('Zaxira ma’lumotlari muvaffaqiyatli tiklandi');
        return true;
      }
    } catch (e) {
      console.error('Import error:', e);
      get().addToast('Faylni o‘qishda xatolik yuz berdi', 'error');
    }
    return false;
  },

  clearCurrentUserData: () => {
    get()._updateCurrentUser((user) => ({
      ...user,
      entries: [],
      lifeStory: [],
      lovedOnes: [],
      favorites: [],
      routine: [],
      goals: [],
      dreamBoard: [],
      todayMood: '',
      streak: 0,
      lastEntryDate: null
    }));
    get().addToast('Barcha xotiralar tozalandi');
  }
}));

// Convenience hook to get the active user object
export const useCurrentUser = () => {
  const { accounts, currentUsername } = useAppStore();
  if (!currentUsername || !accounts[currentUsername]) return null;
  return accounts[currentUsername];
};

// Convenience hook for localization
export const useTranslation = () => {
  const { language, setLanguage, t } = useAppStore();
  return { language, setLanguage, t };
};
