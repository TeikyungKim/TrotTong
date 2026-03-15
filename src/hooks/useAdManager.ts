import { useRef, useCallback } from 'react';
import { APP_CONFIG } from '../constants/config';
import { useUserStore } from '../store/userStore';
import { usePlayerStore } from '../store/playerStore';
import { showInterstitial, showRewarded } from '../services/admob';
import { analytics, EVENTS } from '../services/analytics';
import { storage } from '../services/storage';
import type { RewardedAdType } from '../types';

export function useAdManager() {
  const singerTapsRef = useRef(0);
  const lastInterstitialRef = useRef(0);
  const sessionStartRef = useRef(Date.now());

  const isAdFree = useUserStore(s => s.isAdFree);
  const setAdFreeUntil = useUserStore(s => s.setAdFreeUntil);
  const isRadioMode = usePlayerStore(s => s.isRadioMode);

  const canShowInterstitial = useCallback((): boolean => {
    if (isAdFree()) return false;
    if (isRadioMode) return false;
    if (singerTapsRef.current % APP_CONFIG.INTERSTITIAL_TRIGGER_COUNT !== 0) return false;
    if (singerTapsRef.current === 0) return false;
    if (Date.now() - lastInterstitialRef.current < APP_CONFIG.INTERSTITIAL_MIN_INTERVAL_MS) return false;
    if (Date.now() - sessionStartRef.current < APP_CONFIG.SESSION_WARMUP_MS) return false;
    return true;
  }, [isAdFree, isRadioMode]);

  const recordSingerTap = useCallback(async () => {
    singerTapsRef.current += 1;
    if (canShowInterstitial()) {
      const shown = await showInterstitial();
      if (shown) {
        lastInterstitialRef.current = Date.now();
        analytics.logEvent(EVENTS.AD_INTERSTITIAL_SHOWN, { count: singerTapsRef.current });
      }
    }
  }, [canShowInterstitial]);

  const showRewardedAd = useCallback(async (type: RewardedAdType): Promise<boolean> => {
    const success = await showRewarded(type);
    if (success) {
      analytics.logEvent(EVENTS.AD_REWARDED_COMPLETED, { type });
      if (type === 'ad-free-24h') {
        await setAdFreeUntil(Date.now() + 24 * 60 * 60 * 1000);
      }
    }
    return success;
  }, [setAdFreeUntil]);

  return { recordSingerTap, canShowInterstitial, showRewardedAd };
}
