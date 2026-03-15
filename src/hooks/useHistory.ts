import { useState, useEffect, useCallback, useRef } from 'react';
import { storage } from '../services/storage';
import { APP_CONFIG } from '../constants/config';
import type { HistoryItem, Video } from '../types';

const HISTORY_LIMIT = 200;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const historyRef = useRef<HistoryItem[]>([]);

  // historyRef를 항상 최신 상태로 유지
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    storage.get<HistoryItem[]>(APP_CONFIG.STORAGE_KEYS.HISTORY).then(saved => {
      const loaded = saved ?? [];
      setHistory(loaded);
      historyRef.current = loaded;
      setIsLoaded(true);
    });
  }, []);

  const addToHistory = useCallback(async (video: Video) => {
    const item: HistoryItem = { ...video, playedAt: Date.now() };
    // ref에서 최신 상태를 읽어 stale closure 방지
    const current = historyRef.current;
    const filtered = current.filter(h => h.id !== video.id);
    const updated = [item, ...filtered].slice(0, HISTORY_LIMIT);
    setHistory(updated);
    historyRef.current = updated;
    await storage.set(APP_CONFIG.STORAGE_KEYS.HISTORY, updated);
  }, []);

  const removeFromHistory = useCallback(async (videoId: string) => {
    const current = historyRef.current;
    const updated = current.filter(h => h.id !== videoId);
    setHistory(updated);
    historyRef.current = updated;
    await storage.set(APP_CONFIG.STORAGE_KEYS.HISTORY, updated);
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    historyRef.current = [];
    await storage.set(APP_CONFIG.STORAGE_KEYS.HISTORY, []);
  }, []);

  // 날짜별 그룹핑
  const groupedHistory = useCallback(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const groups: { label: string; items: HistoryItem[] }[] = [];

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
