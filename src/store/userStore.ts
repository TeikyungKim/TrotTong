import { create } from 'zustand';
import { storage } from '../services/storage';
import { APP_CONFIG } from '../constants/config';
import type { UserPreferences, StreakData, FontLevel, ThemeMode } from '../types';

const DEFAULT_PREFS: UserPreferences = {
  fontLevel: 'xlarge',
  themeMode: 'auto',
  notificationsEnabled: false,
  notificationTime: '10:00',
  isPremium: false,
  hasCompletedOnboarding: false,
  favoriteSingerIds: [],
};

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastListenDate: '',
  totalDaysListened: 0,
};

interface UserStore {
  prefs: UserPreferences;
  streak: StreakData;
  isLoaded: boolean;

  // 로드
  loadFromStorage: () => Promise<void>;

  // 폰트
  setFontLevel: (level: FontLevel) => Promise<void>;

  // 테마
  setThemeMode: (mode: ThemeMode) => Promise<void>;

  // 알림
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setNotificationTime: (time: string) => Promise<void>;

  // 온보딩
  completeOnboarding: (singerIds: string[]) => Promise<void>;

  // 프리미엄
  setPremium: (isPremium: boolean, expiresAt?: number) => Promise<void>;

  // 광고 없애기 (보상형)
  setAdFreeUntil: (timestamp: number) => Promise<void>;
  isAdFree: () => boolean;

  // 스트릭
  recordListen: () => Promise<{ isNewDay: boolean; milestone: number | null }>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  prefs: DEFAULT_PREFS,
  streak: DEFAULT_STREAK,
  isLoaded: false,

  loadFromStorage: async () => {
    const [prefs, streak] = await Promise.all([
      storage.get<UserPreferences>(APP_CONFIG.STORAGE_KEYS.USER_PREFS),
      storage.get<StreakData>(APP_CONFIG.STORAGE_KEYS.STREAK),
    ]);
    set({
      prefs: prefs ?? DEFAULT_PREFS,
      streak: streak ?? DEFAULT_STREAK,
      isLoaded: true,
    });
  },

  setFontLevel: async (level) => {
    const prefs = { ...get().prefs, fontLevel: level };
    set({ prefs });
    await storage.set(APP_CONFIG.STORAGE_KEYS.USER_PREFS, prefs);
  },

  setThemeMode: async (mode) => {
    const prefs = { ...get().prefs, themeMode: mode };
    set({ prefs });
    await storage.set(APP_CONFIG.STORAGE_KEYS.USER_PREFS, prefs);
  },

  setNotificationsEnabled: async (enabled) => {
    const prefs = { ...get().prefs, notificationsEnabled: enabled };
    set({ prefs });
    await storage.set(APP_CONFIG.STORAGE_KEYS.USER_PREFS, prefs);
  },

  setNotificationTime: async (time) => {
    const prefs = { ...get().prefs, notificationTime: time };
    set({ prefs });
    await storage.set(APP_CONFIG.STORAGE_KEYS.USER_PREFS, prefs);
  },

  completeOnboarding: async (singerIds) => {
    const prefs = { ...get().prefs, hasCompletedOnboarding: true, favoriteSingerIds: singerIds };
    set({ prefs });
    await storage.set(APP_CONFIG.STORAGE_KEYS.USER_PREFS, prefs);
  },

  setPremium: async (isPremium, expiresAt) => {
    const prefs = { ...get().prefs, isPremium, premiumExpiresAt: expiresAt };
    set({ prefs });
    await storage.set(APP_CONFIG.STORAGE_KEYS.USER_PREFS, prefs);
  },

  setAdFreeUntil: async (timestamp) => {
    const prefs = { ...get().prefs, adFreeUntil: timestamp };
    set({ prefs });
    await storage.set(APP_CONFIG.STORAGE_KEYS.USER_PREFS, prefs);
  },

  isAdFree: () => {
    const { prefs } = get();
    if (prefs.isPremium) return true;
    if (prefs.adFreeUntil && prefs.adFreeUntil > Date.now()) return true;
    return false;
  },

  recordListen: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { streak } = get();

    if (streak.lastListenDate === today) {
      return { isNewDay: false, milestone: null };
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const isConsecutive = streak.lastListenDate === yesterday;

    const newStreak: StreakData = {
      currentStreak: isConsecutive ? streak.currentStreak + 1 : 1,
      longestStreak: Math.max(streak.longestStreak, isConsecutive ? streak.currentStreak + 1 : 1),
      lastListenDate: today,
      totalDaysListened: streak.totalDaysListened + 1,
    };

    set({ streak: newStreak });
    await storage.set(APP_CONFIG.STORAGE_KEYS.STREAK, newStreak);

    // 마일스톤 체크
    const milestones = [7, 30, 100];
    const milestone = milestones.find(m => newStreak.currentStreak === m) ?? null;

    return { isNewDay: true, milestone };
  },
}));
