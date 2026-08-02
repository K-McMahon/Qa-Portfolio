import { test, expect } from '@playwright/test';

test('AE-LOGIN-001 - Login with valid credentials', async ({ page }) => {
  const email = process.env.AE_EMAIL;
  const password = process.env.AE_PASSWORD;
  const username = process.env.AE_USERNAME;

  if (!email || !password || !username) {
    throw new Error(
      'Missing login test data. Add AE_EMAIL, AE_PASSWORD, and AE_USERNAME to the local .env file.'
    );
  }

  await page.goto('/');

  await page.getByRole('link', { name: 'Signup / Login' }).click();

  await expect(
    page.getByRole('heading', { name: 'Login to your account' })
  ).toBeVisible();

  const emailInput = page.locator('[data-qa="login-email"]');
  const passwordInput = page.locator('[data-qa="login-password"]');
  let loginSucceeded = false;

  try {
    await emailInput.fill(email);
    await passwordInput.fill(password);
    await page.locator('[data-qa="login-button"]').click();

    const loggedInIndicator = page.locator('a', { hasText: 'Logged in as' });
    await expect(loggedInIndicator).toBeVisible();
    await expect(loggedInIndicator).toContainText(username);

    await page.screenshot({
      path: 'Execution Evidence/AE-LOGIN-001-success.png',
      fullPage: false,
    });
    loginSucceeded = true;
  } finally {
    // Clear private values before Playwright captures failure diagnostics.
    if (!loginSucceeded && (await emailInput.isVisible().catch(() => false))) {
      await emailInput.fill('');
      await passwordInput.fill('');
    }
  }
});
