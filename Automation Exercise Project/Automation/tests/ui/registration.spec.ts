import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRegistrationData } from '../../data/registration-data';
import { AccountInformationPage } from '../../pages/AccountInformationPage';
import { AccountStatusPage } from '../../pages/AccountStatusPage';
import { HomePage } from '../../pages/HomePage';
import { SignupLoginPage } from '../../pages/SignupLoginPage';
import { test } from './support/ui-test';

test('AE-SIGNUP-006 | SRC-TC-01 | Complete user registration with optional subscriptions', async ({ page }, testInfo) => {
  testInfo.annotations.push({
    type: 'preserve-evidence',
    description: 'Authenticated registration evidence is captured before account cleanup.',
  });

  const account = createRegistrationData();
  const homePage = new HomePage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountInformationPage = new AccountInformationPage(page);
  const accountStatusPage = new AccountStatusPage(page);
  const evidenceDir = resolve(process.cwd(), 'Execution Evidence');
  const evidencePath = resolve(evidenceDir, 'AE-SIGNUP-006.png');
  let accountCreated = false;
  let primaryError: unknown;

  try {
    await homePage.open();
    await homePage.openSignupLogin();
    await signupLoginPage.expectReady();
    await signupLoginPage.beginRegistration(account.name, account.email);
    await accountInformationPage.expectReady();
    await accountInformationPage.complete(account);
    await accountStatusPage.expectCreated();
    accountCreated = true;
    await accountStatusPage.continue();
    await homePage.expectLoggedInAs(account.name);

    await mkdir(evidenceDir, { recursive: true });
    await page.screenshot({ path: evidencePath, fullPage: false });
  } catch (error) {
    primaryError = error;
    throw error;
  } finally {
    if (accountCreated) {
      const cleanup = async () => {
        await homePage.deleteAccount();
        await accountStatusPage.expectDeleted();
      };

      if (primaryError) {
        await cleanup().catch(() => undefined);
      } else {
        await cleanup();
      }
    }
  }
});
