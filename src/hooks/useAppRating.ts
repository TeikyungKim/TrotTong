import { useCallback } from 'react';
import * as StoreReview from 'expo-store-review';
import { storage } from '../services/storage';
import { APP_CONFIG } from '../constants/config';
import { analytics, EVENTS } from '../services/analytics';

export function useAppRating() {
  const shouldPrompt = useCallback(async (): Promise<boolean> => {
    const [openCount, hasRated, lastRatedAt] = await Promise.all([
      storage.get<number>(APP_CONFIG.STORAGE_KEYS.APP_OPEN_COUNT),
      storage.get<boolean>(APP_CONFIG.STORAGE_KEYS.HAS_RATED),
      storage.get<number>(APP_CONFIG.STORAGE_KEYS.LAST_RATED_AT),
    ]);

    if (hasRated) return false;
    if ((openCount ?? 0) < APP_CONFIG.RATING_MIN_OPENS) return false;
    if (lastRatedAt && Date.now() - lastRatedAt < APP_CONFIG.RATING_COOLDOWN_MS) return false;
    if (!(await StoreReview.hasAction())) return false;

    return true;
  }, []);

  const requestRating = useCallback(async () => {
    try {
      await StoreReview.requestReview();
      await storage.set(APP_CONFIG.STORAGE_KEYS.HAS_RATED, true);
      await storage.set(APP_CONFIG.STORAGE_KEYS.LAST_RATED_AT, Date.now());
      analytics.logEvent(EVENTS.RATING_SUBMITTED);
    } catch {}
  }, []);

  const incrementOpenCount = useCallback(async () => {
    const current = (await storage.get<number>(APP_CONFIG.STORAGE_KEYS.APP_OPEN_COUNT)) ?? 0;
    await storage.set(APP_CONFIG.STORAGE_KEYS.APP_OPEN_COUNT, current + 1);
  }, []);

  return { shouldPrompt, requestRating, incrementOpenCount };
}
