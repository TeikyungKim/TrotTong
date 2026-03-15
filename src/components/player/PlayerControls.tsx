import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { usePlayerStore } from '../../store/playerStore';
import { useFavorites } from '../../hooks/useFavorites';
import { useTheme } from '../../hooks/useTheme';
import { useUserStore } from '../../store/userStore';
import { useSound } from '../../hooks/useSound';
import { SleepTimerModal } from '../ui/SleepTimerModal';
import { getFontSize } from '../../constants/fonts';

export function PlayerControls() {
  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);
  const [showTimer, setShowTimer] = useState(false);
  const { currentVideo, prevVideo, nextVideo, isRadioMode, setRadioMode, sleepTimerEndAt } = usePlayerStore();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { play } = useSound();

  if (!currentVideo) return null;

  const isFav = isFavorite(currentVideo.id);
  const timerActive = sleepTimerEndAt !== null && sleepTimerEndAt > Date.now();

  return (
    <View style={styles.container}>
      {/* 라디오 모드 토글 */}
      <TouchableOpacity
        style={[
          styles.radioBtn,
          {
            backgroundColor: isRadioMode ? colors.accent : colors.surfaceElevated,
            borderColor: colors.accent,
          },
        ]}
        onPress={() => {
          play('select');
          setRadioMode(!isRadioMode);
        }}
        activeOpacity={0.75}
      >
        <Text style={[styles.radioBtnText, { color: isRadioMode ? '#FFF' : colors.accent, fontSize: getFontSize('body', fontLevel) }]}>
          {isRadioMode ? '📻 라디오 모드 켜짐' : '📻 라디오 모드'}
        </Text>
      </TouchableOpacity>

      {/* 이전/다음/즐겨찾기/타이머 */}
      <View style={styles.controls}>
        {/* 이전 곡 */}
        <TouchableOpacity
          style={[styles.controlBtn, { backgroundColor: colors.surfaceElevated }]}
          onPress={() => {
            play('navigation');
            prevVideo();
          }}
          activeOpacity={0.75}
        >
          <Text style={styles.controlIcon}>⏮</Text>
          <Text style={[styles.controlLabel, { color: colors.textSecondary, fontSize: getFontSize('caption', fontLevel) }]}>이전 곡</Text>
        </TouchableOpacity>

        {/* 즐겨찾기 */}
        <TouchableOpacity
          style={[
            styles.favoriteBtn,
            { backgroundColor: isFav ? '#FFEAEA' : colors.surfaceElevated, borderColor: isFav ? colors.accent : colors.border },
          ]}
          onPress={async () => {
            play('favorite');
            await toggleFavorite(currentVideo);
          }}
          activeOpacity={0.75}
        >
          <Text style={[styles.controlIcon, { fontSize: 32 }]}>{isFav ? '❤️' : '🤍'}</Text>
          <Text style={[styles.controlLabel, { color: isFav ? colors.accent : colors.textSecondary, fontSize: getFontSize('caption', fontLevel) }]}>
            {isFav ? '보관됨' : '보관함에 담기'}
          </Text>
        </TouchableOpacity>

        {/* 다음 곡 */}
        <TouchableOpacity
          style={[styles.controlBtn, { backgroundColor: colors.surfaceElevated }]}
          onPress={() => {
            play('navigation');
            nextVideo();
          }}
          activeOpacity={0.75}
        >
          <Text style={styles.controlIcon}>⏭</Text>
          <Text style={[styles.controlLabel, { color: colors.textSecondary, fontSize: getFontSize('caption', fontLevel) }]}>다음 곡</Text>
        </TouchableOpacity>
      </View>

      {/* 잠들기 타이머 버튼 */}
      <TouchableOpacity
        style={[
          styles.timerBtn,
          { backgroundColor: timerActive ? '#FFF3CD' : colors.surfaceElevated, borderColor: timerActive ? '#F39C12' : colors.border },
        ]}
        onPress={() => {
          play('timer');
          setShowTimer(true);
        }}
        activeOpacity={0.75}
      >
        <Text style={[styles.timerBtnText, { color: timerActive ? '#F39C12' : colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
          {timerActive ? '⏰ 타이머 작동 중' : '🌙 잠들기 타이머 설정'}
        </Text>
      </TouchableOpacity>

      <SleepTimerModal visible={showTimer} onClose={() => setShowTimer(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  radioBtn: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  radioBtnText: {
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  controlBtn: {
    flex: 1,
    height: 72,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    gap: 4,
  },
  favoriteBtn: {
    flex: 1.6,
    height: 72,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    gap: 4,
  },
  controlIcon: {
    fontSize: 26,
  },
  controlLabel: {
    fontWeight: '500',
    textAlign: 'center',
  },
  timerBtn: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBtnText: {
    fontWeight: '500',
  },
});
