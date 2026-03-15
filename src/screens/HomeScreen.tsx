import React, { useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../store/userStore';
import { useAdManager } from '../hooks/useAdManager';
import { useHistory } from '../hooks/useHistory';
import { useRecommendations } from '../hooks/useRecommendations';
import { SingerCard } from '../components/ui/SingerCard';
import { AdBanner } from '../components/ui/AdBanner';
import { SINGERS } from '../data/singers';
import { getSingerVideos } from '../services/youtube';
import { analytics, EVENTS } from '../services/analytics';
import { getFontSize } from '../constants/fonts';
import type { RootStackParamList, Singer } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);
  const favoriteSingerIds = useUserStore(s => s.prefs.favoriteSingerIds);
  const streak = useUserStore(s => s.streak);
  const recordListen = useUserStore(s => s.recordListen);
  const { recordSingerTap } = useAdManager();
  const { history } = useHistory();
  const recommended = useRecommendations(history, favoriteSingerIds);

  const handleSingerPress = useCallback(async (singer: Singer) => {
    // 광고 주파수 체크
    await recordSingerTap();

    // 기록 및 분석
    analytics.logEvent(EVENTS.SINGER_SELECTED, { singer_name: singer.name, source: 'home' });
    await recordListen();

    // 영상 로드 후 재생
    const videos = await getSingerVideos(singer.id);
    if (videos.length === 0) {
      Alert.alert('알림', '영상을 불러올 수 없어요. 잠시 후 다시 시도해 주세요.');
      return;
    }
    navigation.navigate('Player', { video: videos[0], playlist: videos });
  }, [recordSingerTap, recordListen, navigation]);

  const renderSingerCard = useCallback(({ item, index }: { item: Singer; index: number }) => (
    <SingerCard
      singer={item}
      onPress={handleSingerPress}
      isRecommended={recommended.some(r => r.id === item.id)}
    />
  ), [handleSingerPress, recommended]);

  const renderSeparator = () => <View style={{ width: 12 }} />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        {/* 상단 헤더 */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View>
            <Text style={[styles.appName, { color: colors.accent, fontSize: getFontSize('heading', fontLevel) }]}>
              🎵 트롯통
            </Text>
            <Text style={[styles.appSub, { color: colors.textMuted, fontSize: getFontSize('caption', fontLevel) }]}>
              손 하나로 즐기는 트로트 방송
            </Text>
          </View>
          {streak.currentStreak >= 2 && (
            <View style={[styles.streakBadge, { backgroundColor: '#FFF3CD', borderColor: '#F39C12' }]}>
              <Text style={styles.streakText}>🔥 {streak.currentStreak}일</Text>
            </View>
          )}
        </View>

        {/* 맞춤 추천 섹션 */}
        {recommended.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontSize: getFontSize('title', fontLevel) }]}>
              자주 듣는 가수
            </Text>
            <FlatList
              data={recommended}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.recCard, { backgroundColor: colors.surface, borderColor: colors.accent }]}
                  onPress={() => handleSingerPress(item)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.recCardText, { color: colors.accent, fontSize: getFontSize('title', fontLevel) }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.recCardSub, { color: colors.textSecondary, fontSize: getFontSize('caption', fontLevel) }]}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={renderSeparator}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recList}
            />
          </View>
        )}

        {/* 전체 가수 목록 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontSize: getFontSize('title', fontLevel) }]}>
            전체 가수
          </Text>
          <View style={styles.grid}>
            {SINGERS.map(singer => (
              <SingerCard
                key={singer.id}
                singer={singer}
                onPress={handleSingerPress}
                isRecommended={recommended.some(r => r.id === singer.id)}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <AdBanner screen="home" />
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
    paddingTop: 12,
    paddingBottom: 12,
  },
  appName: { fontWeight: '900', letterSpacing: 1 },
  appSub: { marginTop: 2 },
  streakBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  streakText: { fontWeight: '700', fontSize: 14, color: '#F39C12' },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
    paddingLeft: 2,
  },
  recList: { paddingVertical: 4 },
  recCard: {
    width: 160,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recCardText: { fontWeight: '700', marginBottom: 4 },
  recCardSub: { lineHeight: 18 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
