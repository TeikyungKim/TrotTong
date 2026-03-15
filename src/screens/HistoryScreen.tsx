import React from 'react';
import {
  View, Text, FlatList, SectionList, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../store/userStore';
import { useHistory } from '../hooks/useHistory';
import { VideoCard } from '../components/ui/VideoCard';
import { AdBanner } from '../components/ui/AdBanner';
import { getFontSize } from '../constants/fonts';
import type { RootStackParamList, HistoryItem } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  if (hr < 24) return `${hr}시간 전`;
  return `${day}일 전`;
}

export function HistoryScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);
  const isPremium = useUserStore(s => s.prefs.isPremium);
  const { history, removeFromHistory, clearHistory, groupedHistory } = useHistory();

  const groups = groupedHistory();

  const handleVideoPress = (item: HistoryItem) => {
    navigation.navigate('Player', { video: item });
  };

  const handleClearAll = () => {
    Alert.alert(
      '전체 기록 삭제',
      '모든 재생 기록을 삭제할까요?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: clearHistory },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: getFontSize('heading', fontLevel) }]}>
          🕐 최근 기록
        </Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn} activeOpacity={0.7}>
            <Text style={[styles.clearText, { color: colors.danger, fontSize: getFontSize('caption', fontLevel) }]}>
              전체 삭제
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!isPremium && (
        <View style={[styles.limitBar, { backgroundColor: colors.surfaceElevated }]}>
          <Text style={[styles.limitText, { color: colors.textMuted, fontSize: getFontSize('caption', fontLevel) }]}>
            최근 30개 기록 보관 중 · PLUS에서 200개
          </Text>
        </View>
      )}

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🎵</Text>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary, fontSize: getFontSize('title', fontLevel) }]}>
            아직 재생 기록이 없어요
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
            가수를 선택해서 트로트를 들어보세요
          </Text>
        </View>
      ) : (
        <SectionList
          sections={groups.map(g => ({ title: g.label, data: g.items }))}
          keyExtractor={item => `${item.id}-${item.playedAt}`}
          renderSectionHeader={({ section }) => (
            <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: getFontSize('caption', fontLevel) }]}>
                {section.title}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <VideoCard
              video={item}
              onPress={() => handleVideoPress(item)}
              timeLabel={formatRelativeTime(item.playedAt)}
              rightAction={
                <TouchableOpacity
                  onPress={() => removeFromHistory(item.id)}
                  style={styles.deleteBtn}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={[styles.deleteBtnText, { color: colors.textMuted }]}>✕</Text>
                </TouchableOpacity>
              }
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
        />
      )}

      <AdBanner screen="history" />
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
  clearBtn: { padding: 8 },
  clearText: { fontWeight: '500' },
  limitBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  limitText: {},
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: { fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  list: { padding: 16 },
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
  deleteBtnText: { fontSize: 16, fontWeight: '700' },
});
