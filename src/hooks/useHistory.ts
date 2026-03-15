import { useState, useEffect, useCallback } from 'react';
import { storage } from '../services/storage';
import { APP_CONFIG } from '../constants/config';
import { useUserStore } from '../store/userStore';
import type { HistoryItem, Video } from '../types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const isPremium = useUserStore(s => s.prefs.isPremium);
  const limit = isPremium ? APP_CONFIG.PREMIUM_HISTORY_LIMIT : APP_CONFIG.FREE_HISTORY_LIMIT;

  useEffect(() => {
    storage.get<HistoryItem[]>(APP_CONFIG.STORAGE_KEYS.HISTORY).then(saved => {
      setHistory(saved ?? []);
      setIsLoaded(true);
    });
  }, []);

  const addToHistory = useCallback(async (video: Video) => {
    const item: HistoryItem = { ...video, playedAt: Date.now() };
    // 중복 제거 후 최신 항목을 앞에 추가
    const filtered = history.filter(h => h.id !== video.id);
    const updated = [item, ...filtered].slice(0, limit);
    setHistory(updated);
    await storage.set(APP_CONFIG.STORAGE_KEYS.HISTORY, updated);
  }, [history, limit]);

  const removeFromHistory = useCallback(async (videoId: string) => {
    const updated = history.filter(h => h.id !== videoId);
    setHistory(updated);
    await storage.set(APP_CONFIG.STORAGE_KEYS.HISTORY, updated);
  }, [history]);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await storage.set(APP_CONFIG.STORAGE_KEYS.HISTORY, []);
  }, []);

  // 날짜별 그룹핑
  const groupedHistory = useCallback(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const groups: { label: string; items: HistoryItem[] }[] = [];
    const seen = new Set<string>();

    const todayItems: HistoryItem[] = [];
    const yesterdayItems: HistoryItem[] = [];
    const olderItems: HistoryItem[] = [];

    history.forEach(item => {
      const d = new Date(item.playedAt).toDateString();
      if (d === today) todayItems.push(item);
      else if (d === yesterday) yesterdayItems.push(item);
      else olderItems.push(item);
    });

    if (todayItems.length > 0) groups.push({ label: '오늘', items: todayItems });
    if (yesterdayItems.length > 0) groups.push({ label: '어제', items: yesterdayItems });
    if (olderItems.length > 0) groups.push({ label: '지난 기록', items: olderItems });

    return groups;
  }, [history]);

  return { history, addToHistory, removeFromHistory, clearHistory, groupedHistory, isLoaded };
}
