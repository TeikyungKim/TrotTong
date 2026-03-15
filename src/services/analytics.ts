// Firebase Analytics 추상화 — Expo Go에서는 콘솔 로깅으로 대체
// EAS Build + native 모듈 연동 시 실제 Firebase로 전환

const IS_DEV = __DEV__;

export const analytics = {
  logEvent(event: string, params?: Record<string, string | number | boolean>): void {
    if (IS_DEV) {
      console.log(`[Analytics] ${event}`, params ?? '');
    }
    // TODO: EAS Build에서 Firebase 연동
    // import analytics from '@react-native-firebase/analytics';
    // analytics().logEvent(event, params);
  },

  setUserProperty(name: string, value: string): void {
    if (IS_DEV) {
      console.log(`[Analytics] UserProp: ${name} = ${value}`);
    }
  },
};

// 이벤트 상수
export const EVENTS = {
  SINGER_SELECTED: 'singer_selected',
  VIDEO_PLAYED: 'video_played',
  VIDEO_COMPLETED: 'video_completed',
  RADIO_MODE_STARTED: 'radio_mode_started',
  SLEEP_TIMER_SET: 'sleep_timer_set',
  FAVORITE_ADDED: 'favorite_added',
  FAVORITE_REMOVED: 'favorite_removed',
  AD_INTERSTITIAL_SHOWN: 'ad_interstitial_shown',
  AD_REWARDED_COMPLETED: 'ad_rewarded_completed',
  PREMIUM_PROMPT_SHOWN: 'premium_prompt_shown',
  PREMIUM_PURCHASE_COMPLETED: 'premium_purchase_completed',
  FONT_SIZE_CHANGED: 'font_size_changed',
  DARK_MODE_TOGGLED: 'dark_mode_toggled',
  STREAK_MILESTONE: 'streak_milestone',
  RATING_SUBMITTED: 'rating_submitted',
  SHARE_TAPPED: 'share_tapped',
} as const;
