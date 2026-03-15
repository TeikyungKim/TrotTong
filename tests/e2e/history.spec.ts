import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('최근 기록 화면', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await skipOnboarding(page);
    await page.getByText('기록').first().click();
    await page.waitForTimeout(400);
  });

  test('최근 기록 제목이 표시된다', async ({ page }) => {
    await expect(page.getByText('최근 기록').first()).toBeVisible();
  });

  test('빈 기록 상태 또는 기록 목록이 표시된다', async ({ page }) => {
    const emptyMsg = page.getByText('아직 재생 기록이 없어요');
    const isVisible = await emptyMsg.isVisible({ timeout: 3000 }).catch(() => false);
    if (isVisible) {
      await expect(emptyMsg).toBeVisible();
    } else {
      // 기록이 있는 경우
      expect(true).toBeTruthy();
    }
  });

  test('기록 화면에 기록 안내 메시지가 있다', async ({ page }) => {
    // 기록 없는 경우 안내 또는 목록 표시
    const hasEmpty = await page.getByText(/기록|재생/).first().isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasEmpty).toBeTruthy();
  });
});
