import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, test as base, type Page } from '@playwright/test';

export const test = base;
export { expect };

const adRequestPattern =
  /doubleclick\.net|googlesyndication\.com|googleadservices\.com|adservice\.google\.com/i;

test.beforeEach(async ({ page }) => {
  // block third-party ads that cover the practice site
  await page.route(adRequestPattern, async (route) => route.abort());

  // remove ad containers added after the page loads
  await page.addInitScript(() => {
    const selectors = [
      'ins.adsbygoogle',
      'iframe[src*="doubleclick"]',
      'iframe[src*="googlesyndication"]',
      '[id^="google_ads_"]',
      '.google-auto-placed',
      '.grippy-host',
      '[data-anchor-shown="true"]',
      '[data-anchor-status="displayed"]',
    ];

    const hideAds = () => {
      document.querySelectorAll<HTMLElement>(selectors.join(',')).forEach((element) => {
        element.remove();
      });
    };

    new MutationObserver(hideAds).observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    window.addEventListener('DOMContentLoaded', hideAds);
    window.setInterval(hideAds, 250);
  });
});

test.afterEach(async ({ page }, testInfo) => {
  const testId = testInfo.title.match(/\bAE-[A-Z]+-\d{3}\b/)?.[0] ?? 'ui-test';
  const evidenceFolder = resolve(process.cwd(), 'Execution Evidence');
  const evidencePath = resolve(evidenceFolder, `${testId}.png`);

  // save the final browser state as test evidence
  if (!page.isClosed()) {
    await mkdir(evidenceFolder, { recursive: true });
    await page.screenshot({ path: evidencePath, fullPage: false });
    await testInfo.attach('browser evidence', {
      path: evidencePath,
      contentType: 'image/png',
    });
  }
});

export function getLoginCredentials() {
  const email = process.env.AE_EMAIL;
  const password = process.env.AE_PASSWORD;
  const username = process.env.AE_USERNAME;

  if (!email || !password || !username) {
    throw new Error(
      'Missing login test data. Add AE_EMAIL, AE_PASSWORD, and AE_USERNAME to the local .env file.'
    );
  }

  return { email, password, username };
}

export async function openHome(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await dismissAdOverlay(page);
  await expect(page).toHaveURL(/automationexercise\.com\/?$/);
  await expect(page.locator('body')).toBeVisible();
}

export async function dismissAdOverlay(page: Page) {
  // remove late ad elements before interacting with the page
  await page
    .evaluate(() => {
      const selectors = [
        'ins.adsbygoogle',
        'iframe[src*="doubleclick"]',
        'iframe[src*="googlesyndication"]',
        '[id^="google_ads_"]',
        '.google-auto-placed',
        '.grippy-host',
        '[data-anchor-shown="true"]',
        '[data-anchor-status="displayed"]',
      ];
      document.querySelectorAll(selectors.join(',')).forEach((element) => element.remove());
    })
    .catch(() => undefined);

  // close a vignette if the ad network still opens one
  if (page.url().includes('#google_vignette')) {
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.goto(page.url().replace(/#google_vignette.*$/, ''), {
      waitUntil: 'domcontentloaded',
    });
  }

  const closeText = page.getByText('Close', { exact: true });
  if (await closeText.isVisible({ timeout: 500 }).catch(() => false)) {
    await closeText.click({ force: true }).catch(() => undefined);
  }
}

export async function openSitePage(page: Page, linkName: string, expectedPath: RegExp) {
  const siteLinks: Record<string, string> = {
    'Signup / Login': '/login',
    'Contact us': '/contact_us',
    'Test Cases': '/test_cases',
    Products: '/products',
    Cart: '/view_cart',
  };
  const href = siteLinks[linkName];

  if (!href) {
    throw new Error(`No site path is configured for ${linkName}.`);
  }

  await dismissAdOverlay(page);
  await page.locator(`a[href="${href}"]`).first().click();
  await dismissAdOverlay(page);

  // retry the site link after closing an intercepted click
  if (!expectedPath.test(new URL(page.url()).pathname)) {
    await page.locator(`a[href="${href}"]`).first().click();
    await dismissAdOverlay(page);
  }

  await expect(page).toHaveURL(expectedPath);
}

export async function openLogin(page: Page) {
  await openHome(page);
  await openSitePage(page, 'Signup / Login', /\/login$/);
  await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
}

export async function login(page: Page, email: string, password: string) {
  await openLogin(page);
  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.locator('[data-qa="login-button"]').click();
}

export async function addListingProduct(page: Page, productId: number) {
  await dismissAdOverlay(page);
  const addButton = page
    .locator(`a.add-to-cart[data-product-id="${productId}"]`)
    .filter({ visible: true })
    .first();
  await addButton.scrollIntoViewIfNeeded();
  await addButton.click();
  await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
}
