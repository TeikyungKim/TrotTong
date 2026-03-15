import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,          // React Native Web 앱은 순차 실행이 안정적
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 30000,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    // 시니어 앱 테스트용 — 모바일 뷰포트
    viewport: { width: 390, height: 844 },
  },

  projects: [
    {
      // chromium으로 모바일 에뮬레이션 (webkit 설치 불필요)
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],   // chromium 기반 Android 에뮬레이션
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],

  // 테스트 실행 전 자동으로 dist/ 서빙
  webServer: {
    command: 'npx serve dist -p 4173 --no-clipboard',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
