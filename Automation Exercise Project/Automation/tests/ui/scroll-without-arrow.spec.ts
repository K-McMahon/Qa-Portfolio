import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { HomePage } from '../../pages/HomePage';
import { test } from './support/ui-test';

test.use({
  video: {
    mode: 'on',
    size: { width: 640, height: 360 },
  },
});

test('AE-AUTO-NAV-003 | AEQA-128 | Scroll down and return without the arrow', async ({
  page,
}, testInfo) => {
  const homePage = new HomePage(page);
  const evidenceDir = resolve(process.cwd(), 'Execution Evidence');
  const screenshotPath = resolve(evidenceDir, 'AE-AUTO-NAV-003.png');
  const videoPath = resolve(evidenceDir, 'AE-AUTO-NAV-003.webm');

  await mkdir(evidenceDir, { recursive: true });
  await homePage.open();
  await homePage.expectHeroVisible();
  await homePage.scrollToSubscription();
  await homePage.expectSubscriptionAndScrollUpControl();
  await homePage.returnToTopWithoutArrow();
  await homePage.expectHeroVisible();
  await homePage.captureEvidence('AE-AUTO-NAV-003.png');

  await testInfo.attach('AE-AUTO-NAV-003 returned-to-top screenshot', {
    path: screenshotPath,
    contentType: 'image/png',
  });

  const video = page.video();
  if (!video) throw new Error('Playwright video recording did not start.');
  await page.close();
  await video.saveAs(videoPath);

  await testInfo.attach('AE-AUTO-NAV-003 scrolling video', {
    path: videoPath,
    contentType: 'video/webm',
  });
});
