import React from 'react';
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../store/userStore';
import { useFavorites } from '../hooks/useFavorites';
import { useSound } from '../hooks/useSound';
import { VideoCard } from '../components/ui/VideoCard';
import { AdBanner } from '../components/ui/AdBanner';
import { getFontSize } from '../constants/fonts';
import type { RootStackParamList, Video } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function FavoriteScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);
  const { favorites, removeFavorite } = useFavorites();
  const { play } = useSound();

  const handleVideoPress = (video: Video) => {
    play('tap');
    navigation.navigate('Player', { video, playlist: favorites });
  };

  const handleDelete = (videoId: string) => {
    play('tap');
    Alert.alert(
      '보관함에서 삭제',
      '이 영상을 보관함에서 삭제할까요?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => removeFavorite(videoId) },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: getFontSize('heading', fontLevel) }]}>
          ❤️ 내 보관함
        </Text>
        <Text style={[styles.count, { color: colors.textMuted, fontSize: getFontSize('caption', fontLevel) }]}>
          {favorites.length}개
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎵</Text>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontSize: getFontSize('title', fontLevel) }]}>
            보관함이 비어있어요
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
            영상 재생 중 ❤️ 버튼을 누르면{'\n'}여기에 저장돼요
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <VideoCard
              video={item}
              onPress={handleVideoPress}
              rightAction={
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.deleteBtn}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={[styles.deleteBtnText, { color: colors.danger }]}>✕</Text>
                </TouchableOpacity>
              }
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AdBanner screen="favorite" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: { fontWeight: '700' },
  count: {},
  list: {
    padding: 16,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontWeight: '700', textAlign: 'center' },
  emptyDesc: { textAlign: 'center', lineHeight: 26 },
  deleteBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { fontSize: 18, fontWeight: '700' },
});
