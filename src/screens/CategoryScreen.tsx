import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../store/userStore';
import { VideoCard } from '../components/ui/VideoCard';
import { CATEGORIES } from '../data/categories';
import { PLAYLISTS } from '../data/playlists';
import { getPlaylistVideos, getCategoryVideos } from '../services/youtube';
import { getFontSize, BUTTON_HEIGHT } from '../constants/fonts';
import type { RootStackParamList, Video } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function CategoryScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCategoryPress = useCallback(async (categoryId: string) => {
    setSelectedPlaylistId(null);
    setSelectedCategoryId(categoryId);
    setLoading(true);
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (category) {
      const vids = await getCategoryVideos(category.featuredVideoIds);
      setVideos(vids);
    }
    setLoading(false);
  }, []);

  const handlePlaylistPress = useCallback(async (playlistId: string) => {
    setSelectedCategoryId(null);
    setSelectedPlaylistId(playlistId);
    setLoading(true);
    const playlist = PLAYLISTS.find(p => p.id === playlistId);
    if (playlist) {
      const vids = await getPlaylistVideos(playlist.videoIds);
      setVideos(vids);
    }
    setLoading(false);
  }, []);

  const handleVideoPress = (video: Video) => {
    navigation.navigate('Player', { video, playlist: videos });
  };

  const selectedCategory = CATEGORIES.find(c => c.id === selectedCategoryId);
  const selectedPlaylist = PLAYLISTS.find(p => p.id === selectedPlaylistId);
  const pageTitle = selectedCategory?.name ?? selectedPlaylist?.name ?? null;

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
                    backgroundColor: selectedCategoryId === cat.id ? cat.color : colors.surface,
                    borderColor: cat.color,
                    shadowColor: cat.color,
                  },
                ]}
                onPress={() => handleCategoryPress(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={[
                  styles.categoryName,
                  {
                    color: selectedCategoryId === cat.id ? '#FFF' : colors.textPrimary,
                    fontSize: getFontSize('body', fontLevel),
                  },
                ]}>
                  {cat.name}
                </Text>
                <Text style={[
                  styles.categoryDesc,
                  { color: selectedCategoryId === cat.id ? 'rgba(255,255,255,0.8)' : colors.textMuted },
                ]} numberOfLines={1}>
                  {cat.description}
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
                  backgroundColor: selectedPlaylistId === playlist.id ? colors.accentGold + '22' : colors.surface,
                  borderColor: selectedPlaylistId === playlist.id ? colors.accentGold : colors.border,
                },
              ]}
              onPress={() => handlePlaylistPress(playlist.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.playlistEmoji}>{playlist.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.playlistName, { color: colors.textPrimary, fontSize: getFontSize('body', fontLevel) }]}>
                  {playlist.name}
                </Text>
                <Text style={[styles.playlistDesc, { color: colors.textMuted }]} numberOfLines={1}>
                  {playlist.description} · {playlist.videoIds.length}곡
                </Text>
              </View>
              <Text style={[styles.arrow, { color: colors.textMuted }]}>▶</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 선택된 카테고리/플레이리스트 영상 목록 */}
        {(selectedCategoryId || selectedPlaylistId) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontSize: getFontSize('title', fontLevel) }]}>
              {pageTitle} {loading ? '불러오는 중...' : `(${videos.length}곡)`}
            </Text>
            {videos.map(video => (
              <VideoCard key={video.id} video={video} onPress={handleVideoPress} />
            ))}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
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
  arrow: { fontSize: 14 },
});
