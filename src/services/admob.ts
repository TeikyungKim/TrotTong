// AdMob 서비스 — Expo Go에서는 Mock, EAS Build에서 실제 광고
// react-native-google-mobile-ads는 native 모듈 필요

export const AD_UNIT_IDS = {
  // 테스트 ID (개발용) — 실제 배포 시 EAS Secrets에서 실제 ID로 교체
  BANNER_HOME: 'ca-app-pub-3940256099942544/6300978111',
  BANNER_FAVORITE: 'ca-app-pub-3940256099942544/6300978111',
  BANNER_HISTORY: 'ca-app-pub-3940256099942544/6300978111',
  BANNER_CATEGORY: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
};

// AdMob 초기화 (EAS Build에서만 실행)
export async function initAdMob(): Promise<void> {
  try {
    // EAS Build 환경에서만 import
    // const mobileAds = require('react-native-google-mobile-ads').default;
    // await mobileAds().initialize();
    if (__DEV__) console.log('[AdMob] Mock initialized (Expo Go mode)');
  } catch {
    if (__DEV__) console.log('[AdMob] Native module not available');
  }
}

// Mock 전면 광고 (Expo Go 개발용)
export async function showInterstitial(): Promise<boolean> {
  try {
    if (__DEV__) {
      console.log('[AdMob] Mock interstitial shown');
      return true;
    }
    // EAS Build 시:
    // const { InterstitialAd, AdEventType } = require('react-native-google-mobile-ads');
    // ...
    return false;
  } catch {
    return false;
  }
}

// Mock 보상형 광고
export async function showRewarded(type: string): Promise<boolean> {
  try {
    if (__DEV__) {
      console.log(`[AdMob] Mock rewarded ad shown: ${type}`);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
