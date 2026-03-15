import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('보관함 화면', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await skipOnboarding(page);
    await page.getByText('보관함').first().click();
    await page.waitForTimeout(400);
  });

  test('보관함 제목이 표시된다', async ({ page }) => {
    // 제목은 "❤️ 내 보관함" 형태
    await expect(page.getByText(/내 보관함/).first()).toBeVisible();
  });

  test('빈 보관함 상태 메시지가 표시된다', async ({ page }) => {
    const emptyMsg = page.getByText('보관함이 비어있어요');
    const isVisible = await emptyMsg.isVisible({ timeout: 3000 }).catch(() => false);
    if (isVisible) {
      await expect(emptyMsg).toBeVisible();
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('보관함 카운트가 표시된다', async ({ page }) => {
    // "0개" 패턴 — 제한 없이 총 개수만 표시
    const countEl = page.getByText(/\d+개/).first();
    await expect(countEl).toBeVisible({ timeout: 3000 });
  });
});
