import { create } from 'zustand';
import type { Video } from '../types';

interface PlayerStore {
  currentVideo: Video | null;
  playlist: Video[];
  currentIndex: number;
  isPlaying: boolean;
  isRadioMode: boolean;
  sleepTimerEndAt: number | null;   // timestamp, null이면 비활성

  setVideo: (video: Video, playlist?: Video[]) => void;
  setPlaying: (playing: boolean) => void;
  nextVideo: () => void;
  prevVideo: () => void;
  setRadioMode: (enabled: boolean) => void;
  setSleepTimer: (minutes: number | null) => void;
  clearPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentVideo: null,
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  isRadioMode: false,
  sleepTimerEndAt: null,

  setVideo: (video, playlist) => {
    const pl = playlist ?? [video];
    const idx = pl.findIndex(v => v.id === video.id);
    set({
      currentVideo: video,
      playlist: pl,
      currentIndex: idx >= 0 ? idx : 0,
      isPlaying: true,
    });
  },

  setPlaying: (playing) => set({ isPlaying: playing }),

  nextVideo: () => {
    const { playlist, currentIndex } = get();
    if (playlist.length === 0) return;
    const nextIdx = (currentIndex + 1) % playlist.length;
    set({
      currentVideo: playlist[nextIdx],
      currentIndex: nextIdx,
      isPlaying: true,
    });
  },

  prevVideo: () => {
    const { playlist, currentIndex } = get();
    if (playlist.length === 0) return;
    const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    set({
      currentVideo: playlist[prevIdx],
      currentIndex: prevIdx,
      isPlaying: true,
    });
  },

  setRadioMode: (enabled) => set({ isRadioMode: enabled }),

  setSleepTimer: (minutes) => {
    if (minutes === null) {
      set({ sleepTimerEndAt: null });
    } else {
      set({ sleepTimerEndAt: Date.now() + minutes * 60 * 1000 });
    }
  },

  clearPlayer: () => set({
    currentVideo: null,
    playlist: [],
    currentIndex: 0,
    isPlaying: false,
    isRadioMode: false,
    sleepTimerEndAt: null,
  }),
}));
