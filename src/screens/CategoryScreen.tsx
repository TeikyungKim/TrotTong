import React, { useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../store/userStore';
import { useSound } from '../hooks/useSound';
import { CATEGORIES } from '../data/categories';
import { PLAYLISTS } from '../data/playlists';
import { getPlaylistVideos, getCategoryVideos } from '../services/youtube';
import { getCategoryVideoIds, getPlaylistVideoIds } from '../services/remoteData';
import { AdBanner } from '../components/ui/AdBanner';
import { getFontSize } from '../constants/fonts';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CategoryScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);
  const { play } = useSound();

  const handleCategoryPress = useCallback((categoryId: string) => {
    play('select');
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (category) {
      const videoIds = getCategoryVideoIds(category.id);
      const videos = getCategoryVideos(videoIds);
      if (videos.length === 0) {
        Alert.alert('알림', '영상을 불러올 수 없어요. 잠시 후 다시 시도해 주세요.');
        return;
      }
      navigation.navigate('Player', { video: videos[0], playlist: videos, title: category.name });
    }
  }, [navigation, play]);

  const handlePlaylistPress = useCallback((playlistId: string) => {
    play('select');
    const playlist = PLAYLISTS.find(p => p.id === playlistId);
    if (playlist) {
      const videoIds = getPlaylistVideoIds(playlist.id);
      const videos = getPlaylistVideos(videoIds);
      if (videos.length === 0) {
        Alert.alert('알림', '영상을 불러올 수 없어요. 잠시 후 다시 시도해 주세요.');
        return;
      }
      navigation.navigate('Player', { video: videos[0], playlist: videos, title: playlist.name });
    }
  }, [navigation, play]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary, fontSize: getFontSize('heading', fontLevel) }]}>
            🎼 카테고리
          </Text>
        </View>

        {/* 카테고리 섹션 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
            장르별
          </Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: cat.color,
                    shadowColor: cat.color,
                  },
                ]}
                onPress={() => handleCategoryPress(cat.id)}
                activeOpacity={0.75}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={[
                  styles.categoryName,
                  {
                    color: colors.textPrimary,
                    fontSize: getFontSize('body', fontLevel),
                  },
                ]}>
                  {cat.name}
                </Text>
                <Text style={[
                  styles.categoryDesc,
                  { color: colors.textMuted },
                ]} numberOfLines={1}>
                  {cat.description}
                </Text>
                <Text style={[styles.songCount, { color: cat.color }]}>
                  {getCategoryVideoIds(cat.id).length}곡 ▶
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 플레이리스트 섹션 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
            큐레이션 플레이리스트
          </Text>
          {PLAYLISTS.map(playlist => (
            <TouchableOpacity
              key={playlist.id}
              style={[
                styles.playlistRow,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handlePlaylistPress(playlist.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.playlistEmoji}>{playlist.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.playlistName, { color: colors.textPrimary, fontSize: getFontSize('body', fontLevel) }]}>
                  {playlist.name}
                </Text>
                <Text style={[styles.playlistDesc, { color: colors.textMuted }]} numberOfLines={1}>
                  {playlist.description} · {getPlaylistVideoIds(playlist.id).length}곡
                </Text>
              </View>
              <Text style={[styles.arrow, { color: colors.accent }]}>▶</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <AdBanner screen="category" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: { fontWeight: '700' },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '47%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    gap: 4,
  },
  categoryEmoji: { fontSize: 28 },
  categoryName: { fontWeight: '700' },
  categoryDesc: { fontSize: 11 },
  songCount: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 8,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  playlistEmoji: { fontSize: 28 },
  playlistName: { fontWeight: '600', marginBottom: 2 },
  playlistDesc: { fontSize: 12 },
  arrow: { fontSize: 16, fontWeight: '700' },
});
