// 영상 서비스 — 원격 데이터(GitHub Pages) 우선, 로컬 번들 폴백
import type { Video } from '../types';
import { SINGERS, SINGER_MAP } from '../data/singers';
import { getSingerVideoIds } from './remoteData';

// 모든 가수의 videoId → singer 매핑 (한 번만 빌드)
const VIDEO_TO_SINGER = new Map<string, { id: string; name: string }>();
SINGERS.forEach(singer => {
  singer.featuredVideoIds.forEach(vid => {
    VIDEO_TO_SINGER.set(vid, { id: singer.id, name: singer.name });
  });
});

// 가수 썸네일 URL (원격 데이터 또는 번들 첫 번째 ID 기반)
export function getSingerThumbnail(singerId: string): string | null {
  const videoIds = getSingerVideoIds(singerId);
  if (videoIds.length === 0) return null;
  return `https://img.youtube.com/vi/${videoIds[0]}/hqdefault.jpg`;
}

// 가수별 영상 목록 반환 (원격 데이터 우선)
export function getSingerVideos(singerId: string): Video[] {
  const singer = SINGER_MAP.get(singerId);
  if (!singer) return [];

  const videoIds = getSingerVideoIds(singerId);
  return videoIds.map(id => ({
    id,
    title: `${singer.name} 노래`,
    singerId: singer.id,
    singerName: singer.name,
    thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
  }));
}

// 플레이리스트/카테고리 영상 반환
export function getPlaylistVideos(videoIds: string[]): Video[] {
  return videoIds.map(id => {
    const singer = VIDEO_TO_SINGER.get(id);
    return {
      id,
      title: singer ? `${singer.name} 노래` : '트로트 노래',
      singerId: singer?.id ?? 'unknown',
      singerName: singer?.name ?? '트로트',
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  });
}

// 카테고리별 영상 반환
export function getCategoryVideos(videoIds: string[]): Video[] {
  return getPlaylistVideos(videoIds);
}
