import { access, mkdir } from 'node:fs/promises';
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

  const preserveExistingEvidence = testInfo.annotations.some(
    (annotation) => annotation.type === 'preserve-evidence'
  );

  // save the final browser state as test evidence, unless the test deliberately
  // captured an earlier business state before cleanup.
  if (!page.isClosed()) {
    await mkdir(evidenceFolder, { recursive: true });
    const evidenceAlreadyExists = await access(evidencePath)
      .then(() => true)
      .catch(() => false);
    if (!preserveExistingEvidence || !evidenceAlreadyExists) {
      await page.screenshot({ path: evidencePath, fullPage: false });
    }
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

export type DisposableAccountData = {
  title: 'Mr' | 'Mrs';
  name: string;
  email?: string;
  password: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
};

export async function registerDisposableAccount(
  page: Page,
  account: DisposableAccountData & { email: string }
) {
  await openHome(page);
  await openSitePage(page, 'Signup / Login', /\/login$/);
  await page.locator('[data-qa="signup-name"]').fill(account.name);
  await page.locator('[data-qa="signup-email"]').fill(account.email);
  await page.locator('[data-qa="signup-button"]').click();
  await expect(page.getByText('Enter Account Information', { exact: false })).toBeVisible();

  await page.locator(account.title === 'Mr' ? '#id_gender1' : '#id_gender2').check();
  await page.locator('[data-qa="password"]').fill(account.password);
  await page.locator('[data-qa="days"]').selectOption(account.birthDay);
  await page.locator('[data-qa="months"]').selectOption(account.birthMonth);
  await page.locator('[data-qa="years"]').selectOption(account.birthYear);
  await page.locator('[data-qa="first_name"]').fill(account.firstName);
  await page.locator('[data-qa="last_name"]').fill(account.lastName);
  await page.locator('[data-qa="company"]').fill(account.company);
  await page.locator('[data-qa="address"]').fill(account.address1);
  await page.locator('[data-qa="address2"]').fill(account.address2);
  await page.locator('[data-qa="country"]').selectOption({ label: account.country });
  await page.locator('[data-qa="state"]').fill(account.state);
  await page.locator('[data-qa="city"]').fill(account.city);
  await page.locator('[data-qa="zipcode"]').fill(account.zipcode);
  await page.locator('[data-qa="mobile_number"]').fill(account.mobileNumber);
  await page.locator('[data-qa="create-account"]').click();
  await expect(page.locator('[data-qa="account-created"]')).toBeVisible();
  await page.locator('[data-qa="continue-button"]').click();
  await dismissAdOverlay(page);
  await expect(page.getByText(`Logged in as ${account.name}`, { exact: true })).toBeVisible();
}

export async function deleteDisposableAccount(page: Page) {
  if (page.isClosed()) return;
  await dismissAdOverlay(page);
  const deleteLink = page.locator('a[href="/delete_account"]').first();
  if (!(await deleteLink.isVisible({ timeout: 1_000 }).catch(() => false))) return;
  await deleteLink.click();
  await dismissAdOverlay(page);
  await expect(page.locator('[data-qa="account-deleted"]')).toBeVisible();
}
