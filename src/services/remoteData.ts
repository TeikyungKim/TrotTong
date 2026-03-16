// 원격 비디오 ID 데이터 — GitHub Pages에서 매일 갱신된 JSON fetch + 캐시 + 번들 폴백
import { storage } from './storage';
import { SINGERS } from '../data/singers';
import { CATEGORIES } from '../data/categories';
import { PLAYLISTS } from '../data/playlists';
import { APP_CONFIG } from '../constants/config';

const REMOTE_URL = 'https://teikyungkim.github.io/TrotTong/data/video-ids.json';
const CACHE_KEY = APP_CONFIG.STORAGE_KEYS.REMOTE_VIDEO_IDS;
const CACHE_TTL_MS = APP_CONFIG.REMOTE_DATA_TTL_MS;

interface RemoteVideoData {
  version: number;
  generatedAt: string;
  singers: Record<string, string[]>;
  categories: Record<string, string[]>;
  playlists: Record<string, string[]>;
}

interface CachedData {
  data: RemoteVideoData;
  fetchedAt: number;
}

// 모듈 수준 상태 — 한 번 로드 후 전역 사용
let _remoteData: RemoteVideoData | null = null;

/** 앱 시작 시 호출 — 원격 데이터를 캐시/네트워크에서 로드 */
export async function loadRemoteData(): Promise<void> {
  // 1. 캐시 확인
  const cached = await storage.get<CachedData>(CACHE_KEY);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    _remoteData = cached.data;
    return;
  }

  // 2. 네트워크 fetch (5초 타임아웃)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(REMOTE_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const data: RemoteVideoData = await response.json();
      if (data.version === 1 && data.singers) {
        _remoteData = data;
        await storage.set<CachedData>(CACHE_KEY, {
          data,
          fetchedAt: Date.now(),
        });
        return;
      }
    }
  } catch {
    // 네트워크 실패 — 캐시/번들로 폴백
  }

  // 3. 만료된 캐시라도 사용
  if (cached) {
    _remoteData = cached.data;
    return;
  }

  // 4. 원격 데이터 없음 — 번들 데이터 사용
  _remoteData = null;
}

/** 가수의 비디오 ID 목록 반환 (원격 > 번들 폴백) */
export function getSingerVideoIds(singerId: string): string[] {
  if (_remoteData?.singers[singerId]?.length) {
    return _remoteData.singers[singerId];
  }
  const singer = SINGERS.find(s => s.id === singerId);
  return singer?.featuredVideoIds ?? [];
}

// 카테고리 → 가수 태그 매핑 (곡 수 부족 시 가수 데이터에서 자동 보충)
const CATEGORY_TAG_MAP: Record<string, string[]> = {
  ballad: ['ballad'],
  upbeat: ['upbeat'],
  classic: ['classic'],
  latest: ['latest'],
  bedtime: ['ballad', 'classic'],
  morning: ['upbeat', 'latest'],
};

const TARGET_CATEGORY_SIZE = 15;

/** 가수 태그 기반으로 비디오 ID를 15개까지 자동 보충 */
function supplementFromSingerTags(existingIds: string[], tags: string[]): string[] {
  const existing = new Set(existingIds);
  const result = [...existingIds];

  for (const singer of SINGERS) {
    if (result.length >= TARGET_CATEGORY_SIZE) break;
    if (!singer.tags.some(t => tags.includes(t))) continue;
    for (const vid of singer.featuredVideoIds) {
      if (result.length >= TARGET_CATEGORY_SIZE) break;
      if (!existing.has(vid)) {
        result.push(vid);
        existing.add(vid);
      }
    }
  }

  return result;
}

/** 카테고리의 비디오 ID 목록 반환 (원격 > 번들 폴백, 부족 시 가수 태그로 자동 보충) */
export function getCategoryVideoIds(categoryId: string): string[] {
  const tags = CATEGORY_TAG_MAP[categoryId];

  // 원격 데이터 우선
  if (_remoteData?.categories[categoryId]?.length) {
    const remoteIds = _remoteData.categories[categoryId];
    if (remoteIds.length >= TARGET_CATEGORY_SIZE || !tags) return remoteIds;
    return supplementFromSingerTags(remoteIds, tags);
  }

  // 번들 데이터 + 가수 태그 보충
  const category = CATEGORIES.find(c => c.id === categoryId);
  const bundledIds = category?.featuredVideoIds ?? [];
  return tags ? supplementFromSingerTags(bundledIds, tags) : bundledIds;
}

/** 플레이리스트의 비디오 ID 목록 반환 (원격 > 번들 폴백) */
export function getPlaylistVideoIds(playlistId: string): string[] {
  if (_remoteData?.playlists[playlistId]?.length) {
    return _remoteData.playlists[playlistId];
  }
  const playlist = PLAYLISTS.find(p => p.id === playlistId);
  return playlist?.videoIds ?? [];
}
