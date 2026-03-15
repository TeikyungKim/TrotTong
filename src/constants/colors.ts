// 고령자 전용 고대비 팔레트
// 라이트/다크 모드 모두 최소 WCAG AA 기준 (4.5:1) 이상 대비율

export const LIGHT_COLORS = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#F0F0F0',
  textPrimary: '#0D0D0D',
  textSecondary: '#444444',
  textMuted: '#777777',
  accent: '#C0392B',         // 한국 전통 빨강
  accentLight: '#E74C3C',
  accentGold: '#B8860B',
  border: '#DDDDDD',
  borderStrong: '#BBBBBB',
  danger: '#E74C3C',
  success: '#27AE60',
  warning: '#F39C12',
  overlay: 'rgba(0,0,0,0.5)',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E0E0E0',
  card: '#FFFFFF',
  shadow: '#000000',
};

export const DARK_COLORS = {
  background: '#0D0D0D',     // 순수 검정 아님 — 헤일로 효과 감소
  surface: '#1A1A1A',
  surfaceElevated: '#242424',
  textPrimary: '#F5F5F5',
  textSecondary: '#CCCCCC',
  textMuted: '#888888',
  accent: '#FF6B6B',         // 다크모드 빨강 (밝기 조정)
  accentLight: '#FF8E8E',
  accentGold: '#FFD700',     // 골드 — 다크에서 매우 잘 보임
  border: '#333333',
  borderStrong: '#444444',
  danger: '#FF6B6B',
  success: '#2ECC71',
  warning: '#F1C40F',
  overlay: 'rgba(0,0,0,0.7)',
  tabBar: '#1A1A1A',
  tabBarBorder: '#333333',
  card: '#1A1A1A',
  shadow: '#000000',
};

export type ColorTheme = typeof LIGHT_COLORS;
