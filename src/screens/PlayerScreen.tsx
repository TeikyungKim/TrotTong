import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { useKeepAwake } from 'expo-keep-awake';

import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../store/userStore';
import { usePlayerStore } from '../store/playerStore';
import { useHistory } from '../hooks/useHistory';
import { useSound } from '../hooks/useSound';
import { PlayerControls } from '../components/player/PlayerControls';
import { getFontSize } from '../constants/fonts';
import { analytics, EVENTS } from '../services/analytics';
import type { RootStackParamList } from '../types';

// 웹 전용: HTML iframe 엘리먼트 (React Native Web은 React DOM 기반이므로 직접 사용 가능)
const HtmlIFrame = ('iframe' as unknown) as React.ComponentType<Record<string, unknown>>;

/** 웹용 YouTube IFrame API 기반 플레이어 HTML — 자동재생 + 영상 종료 이벤트 전달 */
function getYouTubePlayerHTML(videoId: string): string {
  return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{margin:0;padding:0;overflow:hidden}html,body,#player{width:100%;height:100%;background:#000}</style>
</head><body>
<div id="player"></div>
<script>
var tag=document.createElement('script');
tag.src='https://www.youtube.com/iframe_api';
var f=document.getElementsByTagName('script')[0];
f.parentNode.insertBefore(tag,f);
function onYouTubeIframeAPIReady(){
  new YT.Player('player',{
    videoId:'${videoId}',
    width:'100%',
    height:'100%',
    playerVars:{autoplay:1,rel:0,playsinline:1,modestbranding:1,controls:1},
    events:{
      onReady:function(e){e.target.playVideo();},
      onStateChange:function(e){
        window.parent.postMessage(JSON.stringify({event:'onStateChange',info:e.data}),'*');
      }
    }
  });
}
</script>
</body></html>`;
}

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

  // === Android 자동재생 핵심 로직 ===
  // 원리: react-native-youtube-iframe은 play prop이 false→true로 변할 때 playVideo()를 호출.
  //       videoId가 바뀔 때 play=true면 loadVideoById()를 호출(자동재생).
  //       Android WebView의 autoplay 정책 우회를 위해 webViewProps 설정 필수.
  const [shouldPlay, setShouldPlay] = useState(false);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerReadyRef = useRef(false);

  const clearPlayTimer = useCallback(() => {
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
  }, []);

  // 한 곡이 끝나면 자동으로 다음 곡 재생
  const handleVideoEnd = useCallback(() => {
    nextVideo();
  }, [nextVideo]);

  // 플레이어 WebView 초기화 완료 — 첫 영상 자동재생
  const handlePlayerReady = useCallback(() => {
    playerReadyRef.current = true;
    clearPlayTimer();
    // Android: false→true 토글로 playVideo() 확실히 호출
    setShouldPlay(false);
    playTimerRef.current = setTimeout(() => setShouldPlay(true), 200);
  }, [clearPlayTimer]);

  // 비디오 전환 시 (next/prev/곡끝남) 자동재생 보장
  const displayVideo = currentVideo ?? video;
  useEffect(() => {
    // 첫 마운트는 onReady 핸들러에서 처리 (플레이어 초기화 전에는 play 무의미)
    if (!playerReadyRef.current) return;
    clearPlayTimer();
    // false→true 토글: Android에서 loadVideoById만으로 재생 안 될 때 playVideo() 강제 호출
    setShouldPlay(false);
    playTimerRef.current = setTimeout(() => setShouldPlay(true), 150);
    return clearPlayTimer;
  }, [displayVideo.id, clearPlayTimer]);

  // 플레이어 상태 변화 핸들러
  const handleStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      handleVideoEnd();
    }
  }, [handleVideoEnd]);

  // cleanup on unmount
  useEffect(() => clearPlayTimer, [clearPlayTimer]);

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
            <HtmlIFrame
              key={displayVideo.id}
              srcDoc={getYouTubePlayerHTML(displayVideo.id)}
              style={{ width: '100%', height: 220, border: 'none' }}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <YoutubeIframe
              height={220}
              videoId={displayVideo.id}
              play={shouldPlay}
              forceAndroidAutoplay={true}
              initialPlayerParams={{
                preventFullScreen: false,
                modestbranding: true,
                rel: false,
              }}
              webViewProps={{
                mediaPlaybackRequiresUserAction: false,
                allowsInlineMediaPlayback: true,
              }}
              onReady={handlePlayerReady}
              onChangeState={handleStateChange}
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
