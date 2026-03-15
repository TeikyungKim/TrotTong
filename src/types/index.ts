// 트롯통 전체 TypeScript 인터페이스 정의

export interface Singer {
  id: string;
  name: string;
  nameEn: string;
  tier: 'mega' | 'popular' | 'classic';
  channelId?: string;
  searchQuery: string;
  thumbnailUrl?: string;
  tags: string[];
  description: string;
  featuredVideoIds: string[]; // 오프라인/무API 재생용 대표 영상 ID 목록
}

export interface Video {
  id: string;           // YouTube videoId
  title: string;
  singerId: string;
  singerName: string;
  thumbnailUrl: string;
  duration?: string;
  viewCount?: string;
  publishedAt?: string;
}

export interface HistoryItem extends Video {
  playedAt: number;     // timestamp
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  searchQuery: string;
  color: string;
  featuredVideoIds: string[];
}

export interface Playlist {
  id: string;
  name: string;
  emoji: string;
  description: string;
  videoIds: string[];
  updatedAt: number;
}

export type FontLevel = 'normal' | 'large' | 'xlarge';
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface UserPreferences {
  fontLevel: FontLevel;
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  notificationTime: string;      // 'HH:MM'
  isPremium: boolean;
  premiumExpiresAt?: number;
  hasCompletedOnboarding: boolean;
  favoriteSingerIds: string[];
  adFreeUntil?: number;          // 보상형 광고로 얻은 광고 없는 시간
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastListenDate: string;        // 'YYYY-MM-DD'
  totalDaysListened: number;
}

export type RewardedAdType = 'favorites' | 'ad-free-24h';

// 네비게이션 파라미터
export type RootStackParamList = {
  MainTabs: undefined;
  Player: { video: Video; playlist?: Video[] };
  Onboarding: undefined;
};

export type MainTabParamList = {
  홈: undefined;
  보관함: undefined;
  기록: undefined;
  카테고리: undefined;
  설정: undefined;
};
