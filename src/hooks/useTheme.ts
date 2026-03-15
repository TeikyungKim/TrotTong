import { useColorScheme } from 'react-native';
import { useUserStore } from '../store/userStore';
import { LIGHT_COLORS, DARK_COLORS, type ColorTheme } from '../constants/colors';

export function useTheme(): { colors: ColorTheme; isDark: boolean } {
  const themeMode = useUserStore(s => s.prefs.themeMode);
  const systemScheme = useColorScheme();

  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'auto' && systemScheme === 'dark');

  return {
    colors: isDark ? DARK_COLORS : LIGHT_COLORS,
    isDark,
  };
}
