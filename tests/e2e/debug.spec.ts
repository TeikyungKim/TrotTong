import { test } from '@playwright/test';

test('debug page load', async ({ page }) => {
  page.on('console', msg => console.log('CONSOLE', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGEERROR', err.stack));
  await page.goto('/');
  await page.waitForTimeout(5000);
  const rootContent = await page.evaluate(() => document.getElementById('root')?.innerHTML?.substring(0, 500) ?? 'empty');
  console.log('ROOT_CONTENT', rootContent);
});
