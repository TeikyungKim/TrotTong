// 앱 아이콘 생성 스크립트 — Playwright로 HTML Canvas를 스크린샷하여 PNG 생성
import { chromium } from 'playwright';
import * as path from 'path';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'generate-icons.html');
  await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`);
  await page.waitForTimeout(1000); // 렌더링 대기

  const assetsDir = path.resolve(__dirname, '..', 'assets');

  // 1. icon.png (1024x1024)
  const iconCanvas = page.locator('#icon');
  await iconCanvas.screenshot({ path: path.join(assetsDir, 'icon.png') });
  console.log('✅ icon.png 생성 완료');

  // 2. adaptive-icon.png (1024x1024)
  const adaptiveCanvas = page.locator('#adaptive');
  await adaptiveCanvas.screenshot({ path: path.join(assetsDir, 'adaptive-icon.png') });
  console.log('✅ adaptive-icon.png 생성 완료');

  // 3. favicon.png (48x48)
  const faviconCanvas = page.locator('#favicon');
  await faviconCanvas.screenshot({ path: path.join(assetsDir, 'favicon.png') });
  console.log('✅ favicon.png 생성 완료');

  // 4. splash.png (1284x2778)
  const splashCanvas = page.locator('#splash');
  await splashCanvas.screenshot({ path: path.join(assetsDir, 'splash.png') });
  console.log('✅ splash.png 생성 완료');

  await browser.close();
  console.log('\n🎉 모든 아이콘 생성 완료!');
}

main().catch(console.error);
