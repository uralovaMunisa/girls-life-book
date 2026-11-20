// Lunara defaults and presets (No hardcoded sample entries - clean slate)

export const AVATAR_PRESETS = [
  { id: 'av-1', name: 'Sehrli Oy', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'av-2', name: 'Tungi Yulduz', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { id: 'av-3', name: 'Qalb Sayyohi', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'av-4', name: 'Sokin Ruh', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
  { id: 'av-5', name: 'Nurli Qalb', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { id: 'av-6', name: 'Tabiat Oshuftasi', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80' },
];

export const INITIAL_PROMPTS = [
  "Bugun sizni ich-ichingizdan tabassum qilishga nima undadi?",
  "Agar bugungi kunga birgina so‘z bilan nom berish kerak bo‘lsa, u qanday so‘z bo‘lardi?",
  "Bugun o‘zingizga qaysi saboqni yoki kechirimlilikni berdingiz?",
  "Qalbingiz eng ko‘p nimaga ehtiyoj sezmoqda?",
  "Oxirgi marta qachon tabiat go‘zalligidan butun vujudingiz bilan hayratlandingiz?",
  "Bolalikdagi qaysi orzungiz bugungi sizni faxrlantiradi?",
  "Bugun kimga kichik bo‘lsa-da mehr yoki e’tibor bera oldingiz?",
  "Hozirgi lahzada o‘zingizga aytmoqchi bo‘lgan eng samimiy so‘zingiz nima?"
];

// Creates an empty user template
export const createEmptyUserData = (username, name, password, avatar) => ({
  id: 'user-' + Date.now(),
  username: username.toLowerCase().trim(),
  name: name.trim() || username.trim(),
  password: password, // user's custom code / password
  avatar: avatar || AVATAR_PRESETS[0].url,
  title: 'Qalb sayyohi',
  theme: 'deep', // 'deep' (Tungi osmon) or 'warm' (Iliq nur)
  createdAt: new Date().toISOString(),
  entries: [],
  lifeStory: [],
  lovedOnes: [],
  favorites: [],
  routine: [],
  goals: [],
  dreamBoard: [],
  todayMood: '',
  streak: 0,
  lastEntryDate: null,
});
