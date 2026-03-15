import { create } from 'zustand';
import type { Video } from '../types';
import { SINGERS } from '../data/singers';
import { CATEGORIES } from '../data/categories';
import { PLAYLISTS } from '../data/playlists';
import { getSingerVideos } from '../services/youtube';

interface ContentStore {
  singerVideos: Record<string, Video[]>;   // singerId → Video[]
  loadSingerVideos: (singerId: string) => Promise<void>;
  getSingerVideoList: (singerId: string) => Video[];
}

export const useContentStore = create<ContentStore>((set, get) => ({
  singerVideos: {},

  loadSingerVideos: async (singerId) => {
    if (get().singerVideos[singerId]) return; // 이미 로드됨
    const videos = await getSingerVideos(singerId);
    set(state => ({
      singerVideos: { ...state.singerVideos, [singerId]: videos },
    }));
  },

  getSingerVideoList: (singerId) => {
    return get().singerVideos[singerId] ?? [];
  },
}));

// Re-export static data for convenience
export { SINGERS, CATEGORIES, PLAYLISTS };
