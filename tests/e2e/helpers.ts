// 공통 테스트 헬퍼
import { type Page, expect } from '@playwright/test';

/** 앱이 완전히 로드될 때까지 대기 */
export async function waitForAppReady(page: Page) {
  // 로딩 스피너가 사라지거나 메인 컨텐츠가 나타날 때까지 대기
  await page.waitForLoadState('networkidle');
  // React 렌더링 완료 대기
  await page.waitForTimeout(500);
}

/** 온보딩을 건너뛰고 홈 화면으로 이동 */
export async function skipOnboarding(page: Page) {
  await waitForAppReady(page);

  // 온보딩 1단계: 시작하기
  const startBtn = page.getByText('시작하기');
  if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await startBtn.click();
    await page.waitForTimeout(300);

    // 온보딩 2단계: 가수 선택 (최소 1명)
    const singerBtn = page.getByText('임영웅');
    if (await singerBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await singerBtn.click();
      await page.waitForTimeout(200);
      // 다음 버튼 (선택 수 포함)
      const nextBtn = page.getByText(/다음 .* 선택/);
      if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(300);
      }
    }

    // 온보딩 3단계: 알림 거부
    const noBtn = page.getByText('괜찮아요');
    if (await noBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await noBtn.click();
      await page.waitForTimeout(500);
    }
  }
}

/** 탭 네비게이션으로 특정 탭으로 이동 */
export async function navigateToTab(page: Page, tabLabel: string) {
  const tab = page.getByRole('tab', { name: tabLabel })
    .or(page.locator(`text=${tabLabel}`).first());
  await tab.click();
  await page.waitForTimeout(300);
}

/** 텍스트 색상의 대비비 계산 (배경 대비) */
export async function getContrastRatio(
  page: Page,
  selector: string
): Promise<number> {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return 0;
    const style = window.getComputedStyle(el);
    const fg = style.color;
    const bg = style.backgroundColor;

    function parseLuminance(colorStr: string): number {
      const m = colorStr.match(/\d+(\.\d+)?/g);
      if (!m) return 0;
      const [r, g, b] = m.map(Number).map(v => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    const L1 = parseLuminance(fg);
    const L2 = parseLuminance(bg);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }, selector);
}
