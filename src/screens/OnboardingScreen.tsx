import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../store/userStore';
import { useTheme } from '../hooks/useTheme';
import { SINGERS } from '../data/singers';
import { getFontSize, BUTTON_HEIGHT } from '../constants/fonts';
import { requestPermission } from '../services/notifications';
import { scheduleDailyReminder } from '../services/notifications';

type Step = 1 | 2 | 3;

export function OnboardingScreen() {
  const [step, setStep] = useState<Step>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { colors } = useTheme();
  const fontLevel = useUserStore(s => s.prefs.fontLevel);
  const { completeOnboarding, setNotificationsEnabled } = useUserStore();

  const toggleSinger = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleNotificationYes = async () => {
    const granted = await requestPermission();
    if (granted) {
      await scheduleDailyReminder(10, 0);
      await setNotificationsEnabled(true);
    }
    await completeOnboarding(selectedIds);
  };

  const handleNotificationNo = async () => {
    await completeOnboarding(selectedIds);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* 진행 표시 */}
      <View style={styles.progressBar}>
        {[1, 2, 3].map(n => (
          <View
            key={n}
            style={[
              styles.progressDot,
              { backgroundColor: n <= step ? colors.accent : colors.border },
            ]}
          />
        ))}
      </View>

      {/* Step 1: 환영 */}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={[styles.emoji]}>🎵</Text>
          <Text style={[styles.mainTitle, { color: colors.accent, fontSize: getFontSize('hero', fontLevel) }]}>
            트롯통
          </Text>
          <Text style={[styles.subtitle, { color: colors.textPrimary, fontSize: getFontSize('heading', fontLevel) }]}>
            어서 오세요!
          </Text>
          <Text style={[styles.desc, { color: colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
            손 하나로 즐기는{'\n'}트로트 방송
          </Text>
          <Text style={[styles.subDesc, { color: colors.textMuted, fontSize: getFontSize('caption', fontLevel) }]}>
            임영웅, 이찬원, 송가인 등{'\n'}인기 트로트 가수의 영상을{'\n'}바로 감상하세요
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
            onPress={() => setStep(2)}
            activeOpacity={0.8}
          >
            <Text style={[styles.primaryBtnText, { fontSize: getFontSize('title', fontLevel) }]}>
              시작하기 →
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: 가수 선택 */}
      {step === 2 && (
        <View style={{ flex: 1 }}>
          <Text style={[styles.stepTitle, { color: colors.textPrimary, fontSize: getFontSize('heading', fontLevel) }]}>
            좋아하는 가수를{'\n'}선택해 주세요
          </Text>
          <Text style={[styles.stepHint, { color: colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
            (최소 1명 이상)
          </Text>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.singerGrid} showsVerticalScrollIndicator={false}>
            {SINGERS.map(singer => {
              const isSelected = selectedIds.includes(singer.id);
              return (
                <TouchableOpacity
                  key={singer.id}
                  style={[
                    styles.singerChip,
                    {
                      backgroundColor: isSelected ? colors.accent : colors.surface,
                      borderColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}
                  onPress={() => toggleSinger(singer.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.singerChipText, {
                    color: isSelected ? '#FFF' : colors.textPrimary,
                    fontSize: getFontSize('body', fontLevel),
                  }]}>
                    {singer.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              {
                backgroundColor: selectedIds.length > 0 ? colors.accent : colors.border,
                marginHorizontal: 16,
                marginBottom: 20,
              },
            ]}
            onPress={() => { if (selectedIds.length > 0) setStep(3); }}
            activeOpacity={0.8}
            disabled={selectedIds.length === 0}
          >
            <Text style={[styles.primaryBtnText, { fontSize: getFontSize('title', fontLevel) }]}>
              다음 ({selectedIds.length}명 선택) →
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 3: 알림 동의 */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.emoji}>🔔</Text>
          <Text style={[styles.subtitle, { color: colors.textPrimary, fontSize: getFontSize('heading', fontLevel) }]}>
            매일 트로트 소식을{'\n'}알려 드릴까요?
          </Text>
          <Text style={[styles.desc, { color: colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
            새 영상, 오늘의 추천곡을{'\n'}알려드려요
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
            onPress={handleNotificationYes}
            activeOpacity={0.8}
          >
            <Text style={[styles.primaryBtnText, { fontSize: getFontSize('title', fontLevel) }]}>
              네, 알려주세요 🎵
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={handleNotificationNo}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.textSecondary, fontSize: getFontSize('body', fontLevel) }]}>
              괜찮아요
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emoji: { fontSize: 64 },
  mainTitle: { fontWeight: '900', letterSpacing: 2 },
  subtitle: { fontWeight: '700', textAlign: 'center', lineHeight: 38 },
  desc: { textAlign: 'center', lineHeight: 28 },
  subDesc: { textAlign: 'center', lineHeight: 22 },
  stepTitle: {
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
    marginTop: 8,
    lineHeight: 38,
  },
  stepHint: {
    textAlign: 'center',
    marginBottom: 12,
  },
  singerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 16,
  },
  singerChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    elevation: 1,
  },
  singerChipText: { fontWeight: '600' },
  primaryBtn: {
    width: '100%',
    height: BUTTON_HEIGHT + 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryBtn: {
    width: '100%',
    height: BUTTON_HEIGHT,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontWeight: '500' },
});
