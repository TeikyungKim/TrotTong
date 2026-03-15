// 앱 전체 설정값

export const APP_CONFIG = {
  // 광고 주파수
  INTERSTITIAL_TRIGGER_COUNT: 3,          // 가수 선택 N회마다 전면 광고
  INTERSTITIAL_MIN_INTERVAL_MS: 5 * 60 * 1000,  // 최소 5분 간격
  SESSION_WARMUP_MS: 60 * 1000,           // 앱 시작 후 1분 유예

  // 보관함 제한
  FREE_FAVORITES_LIMIT: 20,
  PREMIUM_FAVORITES_LIMIT: 999,
  REWARDED_FAVORITES_BONUS: 10,

  // 기록 제한
  FREE_HISTORY_LIMIT: 30,
  PREMIUM_HISTORY_LIMIT: 200,

  // AsyncStorage 키
  STORAGE_KEYS: {
    FAVORITES: '@trottong:favorites',
    HISTORY: '@trottong:history',
    USER_PREFS: '@trottong:user_prefs',
    STREAK: '@trottong:streak',
    APP_OPEN_COUNT: '@trottong:app_open_count',
    LAST_RATED_AT: '@trottong:last_rated_at',
    HAS_RATED: '@trottong:has_rated',
    AD_FREE_UNTIL: '@trottong:ad_free_until',
    YT_CACHE_PREFIX: '@trottong:yt_cache_',
    SLEEP_TIMER_LAST: '@trottong:sleep_timer_last',
    REMOTE_VIDEO_IDS: '@trottong:remote_video_ids',
  },

  // 원격 비디오 ID 데이터 (GitHub Pages)
  REMOTE_DATA_TTL_MS: 24 * 60 * 60 * 1000,  // 24시간 캐시

  // YouTube API (캐시 TTL)
  YT_CACHE_TTL_MS: 24 * 60 * 60 * 1000,  // 24시간

  // 앱 평점 유도 조건
  RATING_MIN_OPENS: 5,
  RATING_MIN_DAYS: 3,
  RATING_COOLDOWN_MS: 7 * 24 * 60 * 60 * 1000,

  // 프리미엄 구독 가격 (원)
  PREMIUM_MONTHLY_PRICE: 2900,
  PREMIUM_YEARLY_PRICE: 19900,
};
