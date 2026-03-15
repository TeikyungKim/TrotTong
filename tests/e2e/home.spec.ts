import { test, expect } from '@playwright/test';
import { waitForAppReady, skipOnboarding } from './helpers';

test.describe('홈 화면', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await skipOnboarding(page);
  });

  test('앱 타이틀이 트롯통으로 표시된다', async ({ page }) => {
    await expect(page.getByText('트롯통').first()).toBeVisible();
  });

  test('임영웅 가수 카드가 노출된다', async ({ page }) => {
    await expect(page.getByText('임영웅').first()).toBeVisible();
  });

  test('이찬원 가수 카드가 노출된다', async ({ page }) => {
    await expect(page.getByText('이찬원').first()).toBeVisible();
  });

  test('송가인 가수 카드가 노출된다', async ({ page }) => {
    await expect(page.getByText('송가인').first()).toBeVisible();
  });

  test('나훈아 가수 카드가 노출된다', async ({ page }) => {
    await expect(page.getByText('나훈아').first()).toBeVisible();
  });

  test('전체 가수 섹션이 존재한다', async ({ page }) => {
    await expect(page.getByText('전체 가수').first()).toBeVisible();
  });

  test('하단 탭 네비게이션 5개 탭이 모두 표시된다', async ({ page }) => {
    for (const tab of ['홈', '보관함', '기록', '카테고리', '설정']) {
      await expect(page.getByText(tab).first()).toBeVisible();
    }
  });
});
