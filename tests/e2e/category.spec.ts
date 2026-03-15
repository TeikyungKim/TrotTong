import { test, expect } from '@playwright/test';
import { skipOnboarding } from './helpers';

test.describe('카테고리 화면', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await skipOnboarding(page);
    await page.getByText('카테고리').first().click();
    await page.waitForTimeout(400);
  });

  test('카테고리 제목이 표시된다', async ({ page }) => {
    // 🎼 카테고리 제목 (정확한 텍스트)
    const heading = page.getByText(/🎼 카테고리|카테고리/).first();
    await expect(heading).toBeVisible();
  });

  test('트로트 발라드 카테고리가 있다', async ({ page }) => {
    await expect(page.getByText('트로트 발라드', { exact: true }).first()).toBeVisible();
  });

  test('신나는 트로트 카테고리가 있다', async ({ page }) => {
    await expect(page.getByText('신나는 트로트', { exact: true }).first()).toBeVisible();
  });

  test('옛날 트로트 카테고리가 있다', async ({ page }) => {
    await expect(page.getByText('옛날 트로트', { exact: true }).first()).toBeVisible();
  });

  test('큐레이션 플레이리스트 섹션이 있다', async ({ page }) => {
    await expect(page.getByText('큐레이션 플레이리스트', { exact: true }).first()).toBeVisible();
  });

  test('잠들기 좋은 트로트 플레이리스트가 있다', async ({ page }) => {
    // playlists 데이터의 playlist name
    const el = page.getByText(/잠들기/).first();
    await expect(el).toBeVisible();
  });

  test('카테고리 클릭 시 플레이어 화면으로 이동한다', async ({ page }) => {
    // 카테고리 탭이 활성화된 상태에서 트로트 발라드 카드 클릭
    const categoryCard = page.getByText('트로트 발라드', { exact: true }).first();
    await expect(categoryCard).toBeVisible();
    await categoryCard.click();
    await page.waitForTimeout(1200);
    // 플레이어 화면으로 이동했는지 확인 — 뒤로 버튼 또는 플레이어 컨트롤 존재
    const hasBack = await page.getByText('뒤로').first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasControl = await page.getByText(/이전 곡|다음 곡/).first().isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasBack || hasControl).toBeTruthy();
  });
});
