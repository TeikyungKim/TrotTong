import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { storage } from '../services/storage';
import { APP_CONFIG } from '../constants/config';
import type { Video } from '../types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Video[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigation = useNavigation();

  // 화면 포커스 시 스토리지에서 다시 읽어오기
  useEffect(() => {
    const load = () => {
      storage.get<Video[]>(APP_CONFIG.STORAGE_KEYS.FAVORITES).then(saved => {
        setFavorites(saved ?? []);
        setIsLoaded(true);
      });
    };
    load();
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  const isFavorite = useCallback((videoId: string) => {
    return favorites.some(v => v.id === videoId);
  }, [favorites]);

  const addFavorite = useCallback(async (video: Video): Promise<{ success: boolean; limitReached: boolean }> => {
    if (favorites.some(v => v.id === video.id)) {
      return { success: true, limitReached: false };
    }
    const updated = [video, ...favorites];
    setFavorites(updated);
    await storage.set(APP_CONFIG.STORAGE_KEYS.FAVORITES, updated);
    return { success: true, limitReached: false };
  }, [favorites]);

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

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, isLoaded };
}
