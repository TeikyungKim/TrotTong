import { useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

// 사운드 타입 정의
export type SoundType = 'tap' | 'select' | 'favorite' | 'navigation' | 'timer';

// 웹에서는 Web Audio API 사용, 네이티브에서는 expo-av 사용
let webAudioContext: AudioContext | null = null;

function getWebAudioContext(): AudioContext {
  if (!webAudioContext) {
    webAudioContext = new AudioContext();
  }
  return webAudioContext;
}

// 웹 사운드 생성 (간단한 합성음)
function playWebSound(type: SoundType) {
  try {
    const ctx = getWebAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'tap':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
        break;
      case 'select':
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.12);
        // 두 번째 톤 (상승음)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 900;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.06);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc2.start(ctx.currentTime + 0.06);
        osc2.stop(ctx.currentTime + 0.18);
        break;
      case 'favorite':
        oscillator.frequency.value = 523; // C5
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
        // 상승 하모니
        const oscFav = ctx.createOscillator();
        const gainFav = ctx.createGain();
        oscFav.connect(gainFav);
        gainFav.connect(ctx.destination);
        oscFav.frequency.value = 659; // E5
        oscFav.type = 'sine';
        gainFav.gain.setValueAtTime(0.15, ctx.currentTime + 0.08);
        gainFav.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        oscFav.start(ctx.currentTime + 0.08);
        oscFav.stop(ctx.currentTime + 0.2);
        break;
      case 'navigation':
        oscillator.frequency.value = 440;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case 'timer':
        oscillator.frequency.value = 700;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.25);
        break;
    }
  } catch {
    // 사운드 재생 실패 시 무시
  }
}

// 네이티브 사운드 (expo-av 합성음 대체)
async function playNativeSound(type: SoundType) {
  try {
    // expo-av로 간단한 비프음 생성은 불가 — 무음 처리
    // 향후 실제 사운드 파일 추가 시 여기에 구현
  } catch {
    // 무시
  }
}

export function useSound() {
  const play = useCallback((type: SoundType = 'tap') => {
    if (Platform.OS === 'web') {
      playWebSound(type);
    } else {
      playNativeSound(type);
    }
  }, []);

  return { play };
}
