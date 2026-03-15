import React, { useCallback, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform,
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
import { useSound } from '../hooks/useSound';
import { PlayerControls } from '../components/player/PlayerControls';
import { getFontSize } from '../constants/fonts';
import { analytics, EVENTS } from '../services/analytics';
import type { RootStackParamList } from '../types';

type RouteType = RouteProp<RootStackParamList, 'Player'>;

export function PlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const { video, playlist, title: screenTitle } = route.params;

  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);
  const { currentVideo, setVideo, nextVideo, isRadioMode } = usePlayerStore();
  const { addToHistory } = useHistory();
  const { play } = useSound();
  const prevVideoIdRef = useRef<string | null>(null);

  // 한 곡이 끝나면 자동으로 다음 곡 재생
  const handleVideoEnd = useCallback(() => {
    nextVideo();
  }, [nextVideo]);

  // 라디오 모드: 화면 꺼짐 방지
  useKeepAwake();

  // 웹: YouTube IFrame API postMessage로 영상 종료 감지
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handler = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // YouTube IFrame API: info.playerState === 0 means ended
        if (data?.event === 'onStateChange' && data?.info === 0) {
          handleVideoEnd();
        }
      } catch {
        // non-JSON messages — ignore
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [handleVideoEnd]);

  // 화면 진입 시 플레이어 초기화
  useEffect(() => {
    setVideo(video, playlist);
    addToHistory(video);
    analytics.logEvent(EVENTS.VIDEO_PLAYED, {
      video_id: video.id,
      singer_name: video.singerName,
    });
    prevVideoIdRef.current = video.id;
  }, [video.id]);

  // 다음/이전 곡 변경 시 기록 추가
  useEffect(() => {
    if (currentVideo && currentVideo.id !== prevVideoIdRef.current) {
      addToHistory(currentVideo);
      analytics.logEvent(EVENTS.VIDEO_PLAYED, {
        video_id: currentVideo.id,
        singer_name: currentVideo.singerName,
      });
      prevVideoIdRef.current = currentVideo.id;
    }
  }, [currentVideo?.id, addToHistory]);

  const displayVideo = currentVideo ?? video;

  const handleBack = useCallback(() => {
    play('navigation');
    navigation.goBack();
  }, [navigation, play]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* 상단 뒤로가기 */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={[styles.backText, { color: colors.accent, fontSize: getFontSize('body', fontLevel) }]}>
            ← {screenTitle ? screenTitle : '뒤로'}
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
              source={{ uri: `https://www.youtube.com/embed/${displayVideo.id}?playsinline=1&rel=0&autoplay=1&enablejsapi=1` }}
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
              onChangeState={(state: string) => {
                if (state === 'ended') handleVideoEnd();
              }}
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
        <PlayerControls />
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
