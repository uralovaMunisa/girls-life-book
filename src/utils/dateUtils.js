// Uzbek date & time utility functions

export const UZ_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

export const UZ_MONTHS_GENITIVE = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
];

export const UZ_DAYS = [
  'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba',
  'Payshanba', 'Juma', 'Shanba'
];

export const UZ_DAYS_SHORT = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

export const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const EN_DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

/**
 * Format date by language (uz / en)
 */
export function formatUzbekDate(dateInput = new Date(), lang = 'uz') {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate();
  const year = d.getFullYear();

  if (lang === 'en') {
    const month = EN_MONTHS[d.getMonth()];
    const weekDay = EN_DAYS[d.getDay()];
    return `${month} ${day}, ${year} • ${weekDay}`;
  }

  const month = UZ_MONTHS[d.getMonth()];
  const weekDay = UZ_DAYS[d.getDay()];
  return `${day}-${month}, ${year} • ${weekDay}`;
}

/**
 * Format date to short: "20-Noyabr" or "Nov 20"
 */
export function formatUzbekDateShort(dateInput, lang = 'uz') {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  if (lang === 'en') {
    return `${EN_MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
  }
  return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}`;
}

/**
 * Format time to: "16:45"
 */
export function formatTime(dateInput = new Date()) {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Get greeting by current hour in Uzbek or English
 */
export function getTimeOfDayGreeting(userName = '', lang = 'uz') {
  const hour = new Date().getHours();
  let greeting = '';
  let subtext = '';
  let icon = 'sun';

  if (lang === 'en') {
    if (hour >= 5 && hour < 11) {
      greeting = 'Good morning';
      subtext = 'May this new morning bring calm clarity and luminous thoughts.';
      icon = 'sunrise';
    } else if (hour >= 11 && hour < 17) {
      greeting = 'Good afternoon';
      subtext = 'May your day be fruitful and your heart filled with quiet peace.';
      icon = 'sun';
    } else if (hour >= 17 && hour < 22) {
      greeting = 'Good evening';
      subtext = 'Take a deep breath and unwind in the gentle twilight.';
      icon = 'sunset';
    } else {
      greeting = 'Good night';
      subtext = 'Under the gentle stars, reflect on today’s blessings and rest.';
      icon = 'moon';
    }
    return {
      greeting: userName ? `${greeting}, ${userName}` : greeting,
      subtext,
      icon
    };
  }

  if (hour >= 5 && hour < 11) {
    greeting = 'Xayrli tong';
    subtext = 'Yangi tong yangi umidlar va yorug‘ fikrlar olib kelsin.';
    icon = 'sunrise';
  } else if (hour >= 11 && hour < 17) {
    greeting = 'Xayrli kun';
    subtext = 'Kuningiz unumli va qalbingiz xotirjamlikka to‘la bo‘lsin.';
    icon = 'sun';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Xayrli oqshom';
    subtext = 'Kunning shom pallasida ruhingizga orom bering.';
    icon = 'sunset';
  } else {
    greeting = 'Xayrli tun';
    subtext = 'Yulduzlar ostida bugungi kun xotiralarini sarhisob qiling.';
    icon = 'moon';
  }

  return {
    greeting: userName ? `${greeting}, ${userName}` : greeting,
    subtext,
    icon
  };
}

/**
 * Days until next birthday
 */
export function getDaysUntilBirthday(birthdayStr) {
  if (!birthdayStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bdate = new Date(birthdayStr);
  let nextBirthday = new Date(today.getFullYear(), bdate.getMonth(), bdate.getDate());

  if (nextBirthday < today) {
    nextBirthday = new Date(today.getFullYear() + 1, bdate.getMonth(), bdate.getDate());
  }

  const diffTime = nextBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

