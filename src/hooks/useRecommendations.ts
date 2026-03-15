import { useMemo } from 'react';
import { SINGERS } from '../data/singers';
import type { Singer, HistoryItem } from '../types';

// 최근 기록 기반 개인화 추천 — 상위 3명 가수 반환
export function useRecommendations(history: HistoryItem[], onboardingIds: string[]): Singer[] {
  return useMemo(() => {
    // 기록에서 가수별 재생 횟수 집계
    const countMap = new Map<string, number>();
    history.forEach(item => {
      countMap.set(item.singerId, (countMap.get(item.singerId) ?? 0) + 1);
    });

    if (countMap.size === 0) {
      // 콜드 스타트: 온보딩 선택 가수 또는 기본 메가스타
      const seeds = onboardingIds.length > 0
        ? onboardingIds
        : ['lim-young-woong', 'lee-chan-won', 'song-ga-in'];
      return seeds
        .slice(0, 3)
        .map(id => SINGERS.find(s => s.id === id))
        .filter((s): s is Singer => s !== undefined);
    }

    // 재생 횟수 내림차순 정렬 후 상위 3명
    const sorted = [...countMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => SINGERS.find(s => s.id === id))
      .filter((s): s is Singer => s !== undefined);

    return sorted;
  }, [history, onboardingIds]);
}
