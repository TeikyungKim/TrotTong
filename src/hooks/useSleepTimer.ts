import { useState, useEffect, useRef, useCallback } from 'react';
import { storage } from '../services/storage';
import { APP_CONFIG } from '../constants/config';
import { usePlayerStore } from '../store/playerStore';

export function useSleepTimer() {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(30);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { sleepTimerEndAt, setSleepTimer, setPlaying } = usePlayerStore();

  // 남은 시간 계산 인터벌
  useEffect(() => {
    if (!sleepTimerEndAt) {
      setRemainingSeconds(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const update = () => {
      const remaining = Math.max(0, Math.round((sleepTimerEndAt - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining === 0) {
        setPlaying(false);
        setSleepTimer(null);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    };

    update();
    intervalRef.current = setInterval(update, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [sleepTimerEndAt]);

  const startTimer = useCallback(async (minutes: number) => {
    setTargetMinutes(minutes);
    setSleepTimer(minutes);
    await storage.set(APP_CONFIG.STORAGE_KEYS.SLEEP_TIMER_LAST, minutes);
  }, [setSleepTimer]);

  const cancelTimer = useCallback(() => {
    setSleepTimer(null);
  }, [setSleepTimer]);

  const isActive = sleepTimerEndAt !== null && sleepTimerEndAt > Date.now();

  // 남은 시간 포맷 (MM:SS)
  const formattedRemaining = (() => {
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    return `${m}분 ${s.toString().padStart(2, '0')}초`;
  })();

  // 마지막으로 사용한 타이머 시간 불러오기
  const loadLastDuration = useCallback(async () => {
    const last = await storage.get<number>(APP_CONFIG.STORAGE_KEYS.SLEEP_TIMER_LAST);
    if (last) setTargetMinutes(last);
  }, []);

  return { isActive, remainingSeconds, formattedRemaining, targetMinutes, startTimer, cancelTimer, loadLastDuration };
}
