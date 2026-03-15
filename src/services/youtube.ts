// YouTube 서비스 — 가수별 영상 목록을 featuredVideoIds 기반으로 제공
// YouTube Data API v3 키 없이도 동작 (heuristic metadata)
import { storage } from './storage';
import type { Video } from '../types';
import { SINGERS, SINGER_MAP } from '../data/singers';
import { APP_CONFIG } from '../constants/config';

// featuredVideoId → Video 객체 변환 (썸네일 URL은 YouTube maxresdefault 패턴)
function videoIdToVideo(videoId: string, singer: { id: string; name: string }, titleHint?: string): Video {
  return {
    id: videoId,
    title: titleHint ?? `${singer.name} 노래`,
    singerId: singer.id,
    singerName: singer.name,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}

// 가수별 영상 목록 반환 (캐시 우선)
export async function getSingerVideos(singerId: string): Promise<Video[]> {
  const cacheKey = `${APP_CONFIG.STORAGE_KEYS.YT_CACHE_PREFIX}${singerId}`;

  // 캐시 확인
  const cached = await storage.get<{ videos: Video[]; cachedAt: number }>(cacheKey);
  if (cached && Date.now() - cached.cachedAt < APP_CONFIG.YT_CACHE_TTL_MS) {
    return cached.videos;
  }

  const singer = SINGER_MAP.get(singerId);
  if (!singer) return [];

  // featuredVideoIds로 즉시 Video 배열 생성
  const videos: Video[] = singer.featuredVideoIds.map(id => videoIdToVideo(id, singer));

  // 캐시 저장
  await storage.set(cacheKey, { videos, cachedAt: Date.now() });
  return videos;
}

// 모든 가수 영상을 합쳐 플레이리스트 형태로 반환
export async function getPlaylistVideos(videoIds: string[]): Promise<Video[]> {
  // videoId → singerId 역매핑 (featuredVideoIds 검색)
  const videoToSinger = new Map<string, { id: string; name: string }>();
  SINGERS.forEach(singer => {
    singer.featuredVideoIds.forEach(vid => {
      videoToSinger.set(vid, { id: singer.id, name: singer.name });
    });
  });

  return videoIds.map(id => {
    const singer = videoToSinger.get(id);
    return videoIdToVideo(id, singer ?? { id: 'unknown', name: '트로트' });
  });
}

// 카테고리별 영상 반환
export async function getCategoryVideos(videoIds: string[]): Promise<Video[]> {
  return getPlaylistVideos(videoIds);
}
