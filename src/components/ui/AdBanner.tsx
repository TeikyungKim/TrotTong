import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '../../store/userStore';
import { useTheme } from '../../hooks/useTheme';

// Expo Go에서는 Mock 배너, EAS Build에서 실제 AdMob 배너로 교체
// import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
// import { AD_UNIT_IDS } from '../../services/admob';

interface Props {
  screen: 'home' | 'favorite' | 'history';
}

export function AdBanner({ screen }: Props) {
  const isAdFree = useUserStore(s => s.isAdFree)();

  if (isAdFree) return null;

  // EAS Build에서 아래 주석 해제:
  // return (
  //   <BannerAd
  //     unitId={AD_UNIT_IDS[`BANNER_${screen.toUpperCase()}` as keyof typeof AD_UNIT_IDS]}
  //     size={BannerAdSize.BANNER}
  //   />
  // );

  // 개발 중 Mock 배너
  if (!__DEV__) return null;

  return (
    <View style={styles.mockBanner}>
      <Text style={styles.mockText}>📣 광고 영역 (개발 중 미리보기)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mockBanner: {
    height: 50,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#CCCCCC',
  },
  mockText: {
    color: '#888888',
    fontSize: 12,
  },
});
