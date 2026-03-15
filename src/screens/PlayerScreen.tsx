import React, { useCallback, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useKeepAwake } from 'expo-keep-awake';

// 웹: react-native-web-webview (iframe 렌더링)
// 네이티브: react-native-webview (WebView)
const WebView: React.ComponentType<any> = Platform.OS === 'web'
  ? (require('react-native-web-webview') as { default: React.ComponentType<any> }).default
  : (require('react-native-webview') as { WebView: React.ComponentType<any> }).WebView;
import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../store/userStore';
import { usePlayerStore } from '../store/playerStore';
import { useHistory } from '../hooks/useHistory';
import { PlayerControls } from '../components/player/PlayerControls';
import { getFontSize } from '../constants/fonts';
import { analytics, EVENTS } from '../services/analytics';
import type { RootStackParamList } from '../types';

type RouteType = RouteProp<RootStackParamList, 'Player'>;

export function PlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const { video, playlist } = route.params;

  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);
  const { currentVideo, setVideo, isRadioMode } = usePlayerStore();
  const { addToHistory } = useHistory();

  // 라디오 모드: 화면 꺼짐 방지
  useKeepAwake();

  // 화면 진입 시 플레이어 초기화
  useEffect(() => {
    setVideo(video, playlist);
    addToHistory(video);
    analytics.logEvent(EVENTS.VIDEO_PLAYED, {
      video_id: video.id,
      singer_name: video.singerName,
    });
  }, [video.id]);

  const displayVideo = currentVideo ?? video;

  const handleFavoriteLimitReached = useCallback(() => {
    Alert.alert(
      '보관함 가득참',
      `무료 보관함은 최대 20개입니다.\n\n광고를 보면 10개를 추가할 수 있어요!`,
      [
        { text: '취소', style: 'cancel' },
        { text: '광고 보고 추가하기', onPress: () => {} },
      ]
    );
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* 상단 뒤로가기 */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={[styles.backText, { color: colors.accent, fontSize: getFontSize('body', fontLevel) }]}>
            ← 뒤로
          </Text>
        </TouchableOpacity>
        {isRadioMode && (
          <View style={[styles.radioIndicator, { backgroundColor: colors.accent }]}>
            <Text style={styles.radioIndicatorText}>📻 라디오 모드</Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* YouTube 플레이어 */}
        <View style={styles.playerContainer}>
          {Platform.OS === 'web' ? (
            <WebView
              key={displayVideo.id}
              source={{ uri: `https://www.youtube.com/embed/${displayVideo.id}?playsinline=1&rel=0` }}
              style={{ height: 220 }}
              allowsInlineMediaPlayback
              allowsFullscreenVideo
            />
          ) : (
            <YoutubeIframe
              key={displayVideo.id}
              height={220}
              videoId={displayVideo.id}
              play={true}
              onError={(e: string) => console.log('YouTube Error:', e)}
            />
          )}
        </View>

        {/* 영상 정보 */}
        <View style={[styles.videoInfo, { borderBottomColor: colors.border }]}>
          <Text
            style={[styles.videoTitle, { color: colors.textPrimary, fontSize: getFontSize('title', fontLevel) }]}
            numberOfLines={3}
          >
            {displayVideo.title}
          </Text>
          <Text style={[styles.singerName, { color: colors.accent, fontSize: getFontSize('body', fontLevel) }]}>
            🎤 {displayVideo.singerName}
          </Text>
        </View>

        {/* 컨트롤 */}
        <PlayerControls onFavoriteLimitReached={handleFavoriteLimitReached} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    paddingVertical: 8,
    paddingRight: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: { fontWeight: '600' },
  radioIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  radioIndicatorText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  playerContainer: {
    width: '100%',
    backgroundColor: '#000',
  },
  videoInfo: {
    padding: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    gap: 6,
  },
  videoTitle: {
    fontWeight: '700',
    lineHeight: 32,
  },
  singerName: {
    fontWeight: '600',
  },
});
