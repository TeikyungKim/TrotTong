import React, { useEffect } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSleepTimer } from '../../hooks/useSleepTimer';
import { useTheme } from '../../hooks/useTheme';
import { useUserStore } from '../../store/userStore';
import { getFontSize, BUTTON_HEIGHT } from '../../constants/fonts';

const TIMER_PRESETS = [
  { label: '30분', minutes: 30 },
  { label: '1시간', minutes: 60 },
  { label: '2시간', minutes: 120 },
  { label: '3시간', minutes: 180 },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function SleepTimerModal({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);
  const { isActive, formattedRemaining, startTimer, cancelTimer, loadLastDuration } = useSleepTimer();

  useEffect(() => {
    if (visible) loadLastDuration();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={[styles.sheet, { backgroundColor: colors.surface }]}
          activeOpacity={1}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary, fontSize: getFontSize('heading', fontLevel) }]}>
              🌙 잠들기 타이머
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeText, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 활성 타이머 상태 */}
          {isActive && (
            <View style={[styles.activeBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.accent }]}>
              <Text style={[styles.activeLabel, { color: colors.textSecondary }]}>남은 시간</Text>
              <Text style={[styles.activeTime, { color: colors.accent }]}>{formattedRemaining}</Text>
              <Text style={[styles.activeDesc, { color: colors.textMuted }]}>
                시간이 되면 자동으로 음악이 꺼집니다
              </Text>
            </View>
          )}

          {/* 프리셋 버튼 */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
            잠들기까지 얼마나 재생할까요?
          </Text>
          <View style={styles.presets}>
            {TIMER_PRESETS.map(preset => (
              <TouchableOpacity
                key={preset.minutes}
                style={[
                  styles.presetBtn,
                  { borderColor: colors.accent, backgroundColor: colors.surface },
                ]}
                onPress={() => { startTimer(preset.minutes); onClose(); }}
                activeOpacity={0.75}
              >
                <Text style={[styles.presetText, { color: colors.accent, fontSize: getFontSize('title', fontLevel) }]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 취소 버튼 */}
          {isActive && (
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={() => { cancelTimer(); onClose(); }}
              activeOpacity={0.75}
            >
              <Text style={[styles.cancelText, { color: colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
                타이머 취소
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.closeFullBtn, { backgroundColor: colors.surfaceElevated }]}
            onPress={onClose}
            activeOpacity={0.75}
          >
            <Text style={[styles.closeFullText, { color: colors.textPrimary, fontSize: getFontSize('body', fontLevel) }]}>
              닫기
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: '700',
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
  },
  activeBox: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  activeLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  activeTime: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  activeDesc: {
    fontSize: 13,
  },
  sectionLabel: {
    marginBottom: 12,
    fontWeight: '500',
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  presetBtn: {
    flex: 1,
    minWidth: '45%',
    height: BUTTON_HEIGHT,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  presetText: {
    fontWeight: '700',
  },
  cancelBtn: {
    height: BUTTON_HEIGHT,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cancelText: {
    fontWeight: '500',
  },
  closeFullBtn: {
    height: BUTTON_HEIGHT,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeFullText: {
    fontWeight: '600',
  },
});
