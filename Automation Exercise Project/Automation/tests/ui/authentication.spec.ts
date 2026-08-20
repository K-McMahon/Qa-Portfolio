import { test, expect, getLoginCredentials, login, openLogin } from './support/ui-test';

test('AE-LOGIN-001 | SRC-TC-02 | Login with valid credentials', async ({ page }) => {
  const { email, password, username } = getLoginCredentials();
  const emailInput = page.locator('[data-qa="login-email"]');
  const passwordInput = page.locator('[data-qa="login-password"]');
  let loginSucceeded = false;

  await openLogin(page);

  try {
    await emailInput.fill(email);
    await passwordInput.fill(password);
    await page.locator('[data-qa="login-button"]').click();

    const loggedInIndicator = page.locator('a', { hasText: 'Logged in as' });
    await expect(loggedInIndicator).toBeVisible();
    await expect(loggedInIndicator).toContainText(username);
    loginSucceeded = true;
  } finally {
    // clear private values before playwright saves failure details
    if (!loginSucceeded && (await emailInput.isVisible().catch(() => false))) {
      await emailInput.fill('');
      await passwordInput.fill('');
    }
  }
});

test('AE-LOGIN-002 | Security | Reject SQL injection input', async ({ page }) => {
  const injectionInputs = ["'", "'1'='1'", '--'];

  for (const injectionInput of injectionInputs) {
    await test.step(`reject ${injectionInput} by itself`, async () => {
      await openLogin(page);
      const emailInput = page.locator('[data-qa="login-email"]');

      await emailInput.fill(injectionInput);
      await page.locator('[data-qa="login-password"]').fill('qa-test-value');
      await page.locator('[data-qa="login-button"]').click();

      const emailIsInvalid = await emailInput.evaluate(
        (input: HTMLInputElement) => !input.validity.valid
      );
      const safeErrorIsVisible = await page
        .getByText('Your email or password is incorrect!')
        .isVisible()
        .catch(() => false);

      expect(emailIsInvalid || safeErrorIsVisible).toBeTruthy();
      await expect(page.locator('a', { hasText: 'Logged in as' })).toHaveCount(0);
      await expect(page.locator('body')).not.toContainText(/sql syntax|traceback|database error/i);
    });
  }
});

test('AE-LOGIN-003 | SRC-TC-03 | Reject a wrong password', async ({ page }) => {
  const { email } = getLoginCredentials();

  await login(page, email, 'intentionally-wrong-password');

  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
  await expect(page.locator('a', { hasText: 'Logged in as' })).toHaveCount(0);
  await expect(page).toHaveURL(/\/login$/);
});

test('AE-LOGIN-004 | SRC-TC-03 | Reject an unregistered account', async ({ page }) => {
  const email = 'qa-unregistered@example.com';

  await login(page, email, 'not-a-real-password');

  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
  await expect(page.locator('a', { hasText: 'Logged in as' })).toHaveCount(0);
  await expect(page).toHaveURL(/\/login$/);
});

test('AE-LOGOUT-001 | SRC-TC-04 | Logout an authenticated user', async ({ page }) => {
  const { email, password, username } = getLoginCredentials();

  await login(page, email, password);
  await expect(page.locator('a', { hasText: 'Logged in as' })).toContainText(username);
  await page.getByRole('link', { name: 'Logout' }).click();

  await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  await expect(page.locator('a', { hasText: 'Logged in as' })).toHaveCount(0);
  await expect(page).toHaveURL(/\/login$/);
});

test('AE-SIGNUP-005 | SRC-TC-05 | Reject an existing email', async ({ page }) => {
  const { email, username } = getLoginCredentials();

  await openLogin(page);
  await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  await page.locator('[data-qa="signup-name"]').fill(username);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.locator('[data-qa="signup-button"]').click();

  await expect(page.getByText('Email Address already exist!')).toBeVisible();
  await expect(page).toHaveURL(/\/signup$/);
});
