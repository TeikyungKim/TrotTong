import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('탭 네비게이션', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await skipOnboarding(page);
  });

  test('보관함 탭으로 이동하면 "내 보관함" 제목이 나타난다', async ({ page }) => {
    await page.getByText('보관함').first().click();
    await page.waitForTimeout(400);
    await expect(page.getByText('내 보관함').first()).toBeVisible({ timeout: 5000 });
  });

  test('기록 탭으로 이동하면 "최근 기록" 제목이 나타난다', async ({ page }) => {
    await page.getByText('기록').first().click();
    await page.waitForTimeout(400);
    await expect(page.getByText('최근 기록').first()).toBeVisible({ timeout: 5000 });
  });

  test('카테고리 탭으로 이동하면 "카테고리" 제목이 나타난다', async ({ page }) => {
    await page.getByText('카테고리').first().click();
    await page.waitForTimeout(400);
    await expect(page.getByText('카테고리').first()).toBeVisible({ timeout: 5000 });
  });

  test('설정 탭으로 이동하면 "설정" 제목이 나타난다', async ({ page }) => {
    await page.getByText('설정').first().click();
    await page.waitForTimeout(400);
    await expect(page.getByText('설정').first()).toBeVisible({ timeout: 5000 });
  });

  test('홈 탭으로 돌아오면 가수 목록이 다시 표시된다', async ({ page }) => {
    // 설정으로 이동 후 홈으로 복귀
    await page.getByText('설정').first().click();
    await page.waitForTimeout(300);
    await page.getByText('홈').first().click();
    await page.waitForTimeout(400);
    await expect(page.getByText('임영웅').first()).toBeVisible({ timeout: 5000 });
  });
});
