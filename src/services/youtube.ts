// YouTube Data API v3 기반 서비스
// 가수 검색 쿼리로 실제 영상 ID + 썸네일 획득, 24시간 캐시
import { storage } from './storage';
import type { Video } from '../types';
import { SINGERS, SINGER_MAP } from '../data/singers';
import { APP_CONFIG } from '../constants/config';

const API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY ?? '';
const SEARCH_API = 'https://www.googleapis.com/youtube/v3/search';
const THUMB_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24시간

interface YTSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: {
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
  };
}

interface YTSearchResponse {
  items?: YTSearchItem[];
}

// YouTube Data API v3 검색 — 가수 쿼리로 실제 영상 목록 조회
async function searchYouTube(query: string, maxResults = 5): Promise<YTSearchItem[]> {
  console.log('[YouTube] searchYouTube 호출:', { query, maxResults, hasApiKey: !!API_KEY, apiKeyPrefix: API_KEY.substring(0, 10) });
  if (!API_KEY) {
    console.warn('[YouTube] API_KEY 없음 — 검색 건너뜀');
    return [];
  }
  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: String(maxResults),
      regionCode: 'KR',
      relevanceLanguage: 'ko',
      key: API_KEY,
    });
    const url = `${SEARCH_API}?${params}`;
    console.log('[YouTube] fetch URL:', url.replace(API_KEY, 'API_KEY_HIDDEN'));
    const res = await fetch(url);
    console.log('[YouTube] 응답 상태:', res.status, res.statusText);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[YouTube] API 에러 응답:', errorText.substring(0, 300));
      return [];
    }
    const data = await res.json() as YTSearchResponse;
    console.log('[YouTube] 검색 결과:', { query, itemCount: data.items?.length ?? 0 });
    return data.items ?? [];
  } catch (err) {
    console.error('[YouTube] fetch 예외:', err);
    return [];
  }
}

// 검색 결과 → Video 배열 변환
function itemToVideo(item: YTSearchItem, singer: { id: string; name: string }): Video {
  const thumbs = item.snippet.thumbnails;
  return {
    id: item.id.videoId,
    title: item.snippet.title,
    singerId: singer.id,
    singerName: singer.name,
    thumbnailUrl: thumbs.high?.url ?? thumbs.medium?.url ?? thumbs.default?.url ?? '',
  };
}

// 가수 썸네일 URL 획득 (API 검색 우선 → featuredVideoIds 폴백)
export async function getSingerThumbnail(singerId: string): Promise<string | null> {
  const singer = SINGER_MAP.get(singerId);
  if (!singer) {
    console.warn('[Thumbnail] 가수 못 찾음:', singerId);
    return null;
  }

  // 1순위: featuredVideoIds로 즉시 썸네일 (API 호출 불필요, 쿼터 절약)
  if (singer.featuredVideoIds && singer.featuredVideoIds.length > 0) {
    const videoId = singer.featuredVideoIds[0];
    const uri = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    console.log('[Thumbnail] featuredVideoIds 사용:', { singerId, uri: uri.substring(0, 60) });
    return uri;
  }

  // 2순위: 캐시 확인
  const cacheKey = `@trottong:thumb_${singerId}`;
  const cached = await storage.get<{ uri: string; cachedAt: number }>(cacheKey);
  if (cached && cached.uri && Date.now() - cached.cachedAt < THUMB_CACHE_TTL_MS) {
    console.log('[Thumbnail] 캐시 히트:', { singerId, uri: cached.uri.substring(0, 60) });
    return cached.uri;
  }
  if (cached && !cached.uri) {
    await storage.remove(cacheKey);
  }

  // 3순위: API 검색 (featuredVideoIds 없는 경우에만)
  if (API_KEY) {
    console.log('[Thumbnail] API 검색 시도:', { singerId, name: singer.name });
    const items = await searchYouTube(singer.searchQuery, 3);
    if (items.length > 0) {
      const item = items[0];
      const thumbs = item.snippet.thumbnails;
      const uri = thumbs.high?.url ?? thumbs.medium?.url ?? thumbs.default?.url ?? '';
      if (uri) {
        console.log('[Thumbnail] API 성공:', { singerId, uri: uri.substring(0, 60) });
        await storage.set(cacheKey, { uri, cachedAt: Date.now() });
        return uri;
      }
    }
    console.warn('[Thumbnail] API 검색 결과 없음:', singerId);
  }

  console.warn('[Thumbnail] 썸네일 없음:', singerId);
  return null;
}

// 가수별 영상 목록 반환 (캐시 → API 검색 순)
export async function getSingerVideos(singerId: string): Promise<Video[]> {
  const cacheKey = `${APP_CONFIG.STORAGE_KEYS.YT_CACHE_PREFIX}${singerId}`;
  const cached = await storage.get<{ videos: Video[]; cachedAt: number }>(cacheKey);
  if (cached && cached.videos?.length > 0 && Date.now() - cached.cachedAt < APP_CONFIG.YT_CACHE_TTL_MS) {
    // 캐시된 영상의 썸네일이 유효한지 확인 (가짜 ID 썸네일 걸러내기)
    const firstThumb = cached.videos[0]?.thumbnailUrl ?? '';
    const hasRealThumbs = firstThumb.includes('i.ytimg.com') || firstThumb.includes('yt3.ggpht.com');
    if (hasRealThumbs) {
      console.log('[Videos] 캐시 히트:', { singerId, count: cached.videos.length, firstThumb: firstThumb.substring(0, 60) });
      return cached.videos;
    }
    console.warn('[Videos] 캐시 썸네일 무효, 재검색:', { singerId, firstThumb });
    await storage.remove(cacheKey);
  }
  console.log('[Videos] 캐시 미스, API 검색:', singerId);

  const singer = SINGER_MAP.get(singerId);
  if (!singer) return [];

  const items = await searchYouTube(singer.searchQuery, 10);
  if (items.length > 0) {
    const videos = items.map(item => itemToVideo(item, singer));
    await storage.set(cacheKey, { videos, cachedAt: Date.now() });
    return videos;
  }

  // API 실패 시 기존 featuredVideoIds 폴백
  const fallback: Video[] = singer.featuredVideoIds.map(id => ({
    id,
    title: `${singer.name} 노래`,
    singerId: singer.id,
    singerName: singer.name,
    thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
  }));
  return fallback;
}

// 플레이리스트 영상 반환
export async function getPlaylistVideos(videoIds: string[]): Promise<Video[]> {
  const videoToSinger = new Map<string, { id: string; name: string }>();
  SINGERS.forEach(singer => {
    singer.featuredVideoIds.forEach(vid => {
      videoToSinger.set(vid, { id: singer.id, name: singer.name });
    });
  });

  return videoIds.map(id => {
    const singer = videoToSinger.get(id);
    return {
      id,
      title: '트로트 노래',
      singerId: singer?.id ?? 'unknown',
      singerName: singer?.name ?? '트로트',
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  });
}

// 카테고리별 영상 반환
export async function getCategoryVideos(videoIds: string[]): Promise<Video[]> {
  return getPlaylistVideos(videoIds);
}
