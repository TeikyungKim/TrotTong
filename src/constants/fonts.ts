import type { FontLevel } from '../types';

// 3단계 폰트 스케일 — 시니어 전용
// 기본 18sp (일반 앱의 1.5배), 크게 22sp, 아주크게 26sp

export const BASE_FONT = {
  body: 18,
  title: 24,
  button: 18,
  caption: 14,
  nav: 13,
  heading: 28,
  hero: 34,
};

export const FONT_SCALE: Record<FontLevel, number> = {
  normal: 1.0,
  large: 1.22,
  xlarge: 1.44,
};

export function getFontSize(base: keyof typeof BASE_FONT, level: FontLevel): number {
  return Math.round(BASE_FONT[base] * FONT_SCALE[level]);
}

// 최소 터치 영역 (절대 원칙)
export const MIN_TOUCH_SIZE = 44;
export const BUTTON_HEIGHT = 56;
export const CARD_HEIGHT_SINGER = 160;
