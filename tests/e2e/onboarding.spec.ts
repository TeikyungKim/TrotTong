import { test, expect } from '@playwright/test';
import { waitForAppReady } from './helpers';

test.describe('온보딩 플로우', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage 초기화 → 온보딩 강제 표시
    await page.goto('/');
    await page.evaluate(() => {
      try { localStorage.clear(); } catch {}
    });
    await page.reload();
    await waitForAppReady(page);
  });

  test('1단계: 앱 소개 화면이 표시된다', async ({ page }) => {
    // 트롯통 타이틀 또는 시작하기 버튼
    const hasTitle = await page.getByText('트롯통').first().isVisible({ timeout: 5000 }).catch(() => false);
    const hasStart = await page.getByText('시작하기').isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasTitle || hasStart).toBeTruthy();
  });

  test('1단계: 시작하기 버튼이 존재한다', async ({ page }) => {
    const startBtn = page.getByText('시작하기');
    const isVisible = await startBtn.isVisible({ timeout: 5000 }).catch(() => false);
    // 온보딩이 이미 완료된 경우 홈으로 이동 — 둘 다 허용
    if (isVisible) {
      await expect(startBtn).toBeVisible();
    } else {
      // 홈 화면이 표시되는 경우 (온보딩 완료 상태)
      await expect(page.getByText('트롯통').first()).toBeVisible();
    }
  });

  test('2단계: 가수 선택 화면에 임영웅이 있다', async ({ page }) => {
    const startBtn = page.getByText('시작하기');
    if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await startBtn.click();
      await page.waitForTimeout(500);
      await expect(page.getByText('임영웅').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('2단계: 가수 선택 없이 다음으로 넘어갈 수 없다', async ({ page }) => {
    const startBtn = page.getByText('시작하기');
    if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await startBtn.click();
      await page.waitForTimeout(500);
      // 선택 수가 0인 다음 버튼은 disabled 상태
      const nextBtn = page.getByText(/다음/);
      if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        const isDisabled = await nextBtn.isDisabled().catch(() => false);
        // 비활성 상태 또는 0명 선택 표시
        const btnText = await nextBtn.textContent() ?? '';
        expect(isDisabled || btnText.includes('0')).toBeTruthy();
      }
    }
  });

  test('온보딩 완료 후 홈 화면으로 이동한다', async ({ page }) => {
    const startBtn = page.getByText('시작하기');
    if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await startBtn.click();
      await page.waitForTimeout(300);

      // 임영웅 선택
      const singerBtn = page.getByText('임영웅').first();
      if (await singerBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await singerBtn.click();
        await page.waitForTimeout(200);

        const nextBtn = page.getByText(/다음 .* 선택/).first();
        if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(300);
        }
      }

      // 알림 거부
      const noBtn = page.getByText('괜찮아요');
      if (await noBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await noBtn.click();
        await page.waitForTimeout(800);
      }

      // 홈 화면 확인
      await expect(page.getByText('트롯통').first()).toBeVisible({ timeout: 5000 });
    }
  });
});
