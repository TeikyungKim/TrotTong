import { useState, useEffect, useCallback } from 'react';
import { storage } from '../services/storage';
import { APP_CONFIG } from '../constants/config';
import { useUserStore } from '../store/userStore';
import type { Video } from '../types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Video[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const isPremium = useUserStore(s => s.prefs.isPremium);
  const limit = isPremium ? APP_CONFIG.PREMIUM_FAVORITES_LIMIT : APP_CONFIG.FREE_FAVORITES_LIMIT;

  useEffect(() => {
    storage.get<Video[]>(APP_CONFIG.STORAGE_KEYS.FAVORITES).then(saved => {
      setFavorites(saved ?? []);
      setIsLoaded(true);
    });
  }, []);

  const isFavorite = useCallback((videoId: string) => {
    return favorites.some(v => v.id === videoId);
  }, [favorites]);

  const addFavorite = useCallback(async (video: Video): Promise<{ success: boolean; limitReached: boolean }> => {
    if (favorites.some(v => v.id === video.id)) {
      return { success: true, limitReached: false };
    }
    if (favorites.length >= limit) {
      return { success: false, limitReached: true };
    }
    const updated = [video, ...favorites];
    setFavorites(updated);
    await storage.set(APP_CONFIG.STORAGE_KEYS.FAVORITES, updated);
    return { success: true, limitReached: false };
  }, [favorites, limit]);

  const removeFavorite = useCallback(async (videoId: string) => {
    const updated = favorites.filter(v => v.id !== videoId);
    setFavorites(updated);
    await storage.set(APP_CONFIG.STORAGE_KEYS.FAVORITES, updated);
  }, [favorites]);

  const toggleFavorite = useCallback(async (video: Video) => {
    if (isFavorite(video.id)) {
      await removeFavorite(video.id);
      return { added: false, limitReached: false };
    }
    const result = await addFavorite(video);
    return { added: result.success, limitReached: result.limitReached };
  }, [isFavorite, addFavorite, removeFavorite]);

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, isLoaded, limit };
}
