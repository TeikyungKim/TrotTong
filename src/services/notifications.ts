// expo-notifications 기반 로컬 알림 서비스 (서버 불필요)
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 권한 요청
export async function requestPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// 현재 권한 상태 확인
export async function getPermissionStatus(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

// 매일 추천곡 알림 스케줄 (기본 오전 10시)
export async function scheduleDailyReminder(hour: number = 10, minute: number = 0): Promise<void> {
  await cancelDailyReminder();
  await Notifications.scheduleNotificationAsync({
    identifier: 'daily-reminder',
    content: {
      title: '🎵 오늘의 트롯',
      body: '좋아하는 트로트 가수의 새 영상이 기다리고 있어요!',
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

// 매일 알림 취소
export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('daily-reminder').catch(() => {});
}

// 스트릭 알림 (당일 저녁 7시)
export async function scheduleStreakReminder(streakDays: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('streak-reminder').catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: 'streak-reminder',
    content: {
      title: `🔥 ${streakDays}일 연속 트롯 감상 중!`,
      body: '오늘도 잠깐 들러서 스트릭을 이어가세요 🎶',
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 19,
      minute: 0,
    },
  });
}

// 모든 알림 취소
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
