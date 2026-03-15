import React from 'react';
import {
  TouchableOpacity, View, Text, Image, StyleSheet, Dimensions,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useUserStore } from '../../store/userStore';
import { getFontSize } from '../../constants/fonts';
import type { Singer } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;  // 2열, 패딩 16 * 3

const TIER_BADGE: Record<Singer['tier'], string> = {
  mega: '⭐ 인기',
  popular: '🎵 추천',
  classic: '🎙️ 명곡',
};

const TIER_BADGE_COLOR: Record<Singer['tier'], string> = {
  mega: '#C0392B',
  popular: '#2980B9',
  classic: '#8E44AD',
};

interface Props {
  singer: Singer;
  onPress: (singer: Singer) => void;
  isRecommended?: boolean;
}

export function SingerCard({ singer, onPress, isRecommended }: Props) {
  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => onPress(singer)}
      activeOpacity={0.75}
    >
      {/* 썸네일 영역 */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `https://img.youtube.com/vi/${singer.featuredVideoIds[0]}/hqdefault.jpg` }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* 티어 뱃지 */}
        <View style={[styles.badge, { backgroundColor: TIER_BADGE_COLOR[singer.tier] }]}>
          <Text style={styles.badgeText}>{TIER_BADGE[singer.tier]}</Text>
        </View>
        {isRecommended && (
          <View style={[styles.recommendedBadge, { backgroundColor: colors.accentGold }]}>
            <Text style={styles.badgeText}>맞춤 추천</Text>
          </View>
        )}
      </View>

      {/* 가수 이름 */}
      <View style={styles.info}>
        <Text
          style={[styles.name, { color: colors.textPrimary, fontSize: getFontSize('title', fontLevel) }]}
          numberOfLines={1}
        >
          {singer.name}
        </Text>
        <Text
          style={[styles.desc, { color: colors.textSecondary, fontSize: getFontSize('caption', fontLevel) }]}
          numberOfLines={1}
        >
          {singer.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    padding: 10,
  },
  name: {
    fontWeight: '700',
    marginBottom: 2,
  },
  desc: {
    lineHeight: 18,
  },
});
