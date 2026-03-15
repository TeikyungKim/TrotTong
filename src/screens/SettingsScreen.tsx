import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Switch, Alert, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useUserStore } from '../store/userStore';
import { useSound } from '../hooks/useSound';
import { getFontSize } from '../constants/fonts';
import { cancelAllNotifications, scheduleDailyReminder } from '../services/notifications';
import { analytics, EVENTS } from '../services/analytics';
import type { FontLevel, ThemeMode } from '../types';

const FONT_LABELS: Record<FontLevel, string> = {
  normal: '기본',
  large: '크게',
  xlarge: '아주 크게',
};

const FONT_SAMPLE_SIZES: Record<FontLevel, number> = {
  normal: 18,
  large: 22,
  xlarge: 26,
};

const THEME_LABELS: Record<ThemeMode, string> = {
  light: '☀️ 밝게',
  dark: '🌙 어둡게',
  auto: '🔄 자동 (시스템)',
};

export function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);
  const themeMode = useUserStore(s => s.prefs.themeMode);
  const notificationsEnabled = useUserStore(s => s.prefs.notificationsEnabled);
  const streak = useUserStore(s => s.streak);
  const { setFontLevel, setThemeMode, setNotificationsEnabled } = useUserStore();
  const { play } = useSound();

  const handleFontChange = async (level: FontLevel) => {
    play('tap');
    await setFontLevel(level);
    analytics.logEvent(EVENTS.FONT_SIZE_CHANGED, { level });
  };

  const handleThemeChange = async (mode: ThemeMode) => {
    play('tap');
    await setThemeMode(mode);
    analytics.logEvent(EVENTS.DARK_MODE_TOGGLED, { enabled: mode === 'dark' });
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    await setNotificationsEnabled(enabled);
    if (enabled) {
      await scheduleDailyReminder(10, 0);
    } else {
      await cancelAllNotifications();
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          '📱 트롯통 - 어르신도 쉽게 쓰는 트로트 앱!\n' +
          '임영웅, 이찬원, 송가인 등 인기 트로트 가수 영상을 손 하나로!\n' +
          'https://play.google.com/store/apps/details?id=com.trottong.app',
        title: '트롯통 앱 소개',
      });
      analytics.logEvent(EVENTS.SHARE_TAPPED, { platform: 'native' });
    } catch {}
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionHeader, { color: colors.accent, fontSize: 13 }]}>{title}</Text>
      <View style={[styles.sectionBody, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );

  const SettingRow = ({
    label, value, onPress, rightEl,
  }: { label: string; value?: string; onPress?: () => void; rightEl?: React.ReactNode }) => (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <Text style={[styles.rowLabel, { color: colors.textPrimary, fontSize: getFontSize('body', fontLevel) }]}>
        {label}
      </Text>
      {value && (
        <Text style={[styles.rowValue, { color: colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
          {value}
        </Text>
      )}
      {rightEl}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={[styles.pageTitle, { color: colors.textPrimary, fontSize: getFontSize('heading', fontLevel) }]}>
          ⚙️ 설정
        </Text>

        {/* 글씨 크기 */}
        <Section title="글씨 크기">
          <View style={styles.fontRow}>
            {(['normal', 'large', 'xlarge'] as FontLevel[]).map(level => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.fontBtn,
                  {
                    backgroundColor: fontLevel === level ? colors.accent : colors.surfaceElevated,
                    borderColor: fontLevel === level ? colors.accent : colors.border,
                  },
                ]}
                onPress={() => handleFontChange(level)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.fontBtnSample,
                  { color: fontLevel === level ? '#FFF' : colors.textPrimary, fontSize: FONT_SAMPLE_SIZES[level] },
                ]}>
                  가
                </Text>
                <Text style={[
                  styles.fontBtnLabel,
                  { color: fontLevel === level ? '#FFF' : colors.textSecondary },
                ]}>
                  {FONT_LABELS[level]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* 화면 모드 */}
        <Section title="화면 모드">
          {(['light', 'dark', 'auto'] as ThemeMode[]).map((mode, idx, arr) => (
            <SettingRow
              key={mode}
              label={THEME_LABELS[mode]}
              rightEl={
                themeMode === mode ? (
                  <Text style={[styles.checkmark, { color: colors.accent }]}>✓</Text>
                ) : null
              }
              onPress={() => handleThemeChange(mode)}
            />
          ))}
        </Section>

        {/* 알림 */}
        <Section title="알림">
          <SettingRow
            label="매일 추천곡 알림"
            rightEl={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            }
          />
          {notificationsEnabled && (
            <SettingRow label="알림 시간" value="오전 10:00" />
          )}
        </Section>

        {/* 연속 청취 */}
        {streak.currentStreak > 0 && (
          <Section title="나의 기록">
            <SettingRow label="🔥 연속 청취" value={`${streak.currentStreak}일 연속`} />
            <SettingRow label="🏆 최장 연속 기록" value={`${streak.longestStreak}일`} />
            <SettingRow label="📅 총 청취일" value={`${streak.totalDaysListened}일`} />
          </Section>
        )}

        {/* 공유 */}
        <Section title="앱 공유">
          <SettingRow
            label="👨‍👩‍👧‍👦 가족에게 앱 소개하기"
            rightEl={<Text style={{ color: colors.textMuted }}>→</Text>}
            onPress={handleShare}
          />
        </Section>

        {/* 앱 정보 */}
        <Section title="앱 정보">
          <SettingRow label="버전" value="1.0.0" />
          <SettingRow label="문의" value="support@trottong.com" />
          <SettingRow label="개인정보처리방침" rightEl={<Text style={{ color: colors.textMuted }}>→</Text>} onPress={() => {}} />
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 40 },
  pageTitle: {
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  section: { marginBottom: 24, paddingHorizontal: 16 },
  sectionHeader: {
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionBody: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: { fontWeight: '400', flex: 1 },
  rowValue: { fontWeight: '400', textAlign: 'right' },
  checkmark: { fontSize: 20, fontWeight: '700' },
  fontRow: {
    flexDirection: 'row',
    gap: 0,
  },
  fontBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 4,
  },
  fontBtnSample: { fontWeight: '700' },
  fontBtnLabel: { fontSize: 12, fontWeight: '500' },
});
