import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createSyntheticIdentity } from '../../data/synthetic-identity';
import { writeOrderExecutionEvidence } from '../../reporting/order-execution-evidence';
import { cleanupWithWarning } from '../support/cleanup';
import {
  addListingProduct,
  deleteDisposableAccount,
  dismissAdOverlay,
  expect,
  getPaymentData,
  openHome,
  openSitePage,
  test,
  type DisposableAccountData,
} from './support/ui-test';
import { hasPaymentData } from './support/credential-availability';

const account: DisposableAccountData = {
  title: 'Mr',
  name: 'Kevin Tester',
  password: 'QaPortfolio!42',
  birthDay: '15',
  birthMonth: '8',
  birthYear: '1990',
  firstName: 'Kevin',
  lastName: 'Tester',
  company: 'The McMahon Standard QA',
  address1: '100 Quality Lane',
  address2: 'Suite 404',
  country: 'United States',
  state: 'Pennsylvania',
  city: 'Philadelphia',
  zipcode: '19103',
  mobileNumber: '2155550104',
};

test('AE-ORDER-001 register during checkout and complete the order', async ({ page }, testInfo) => {
  test.skip(!hasPaymentData(), 'Requires payment test data.');
  const paymentData = getPaymentData();
  testInfo.annotations.push({
    type: 'preserve-evidence',
    description: 'The order-confirmation screenshot is preserved before account cleanup.',
  });
  const uniqueEmail = createSyntheticIdentity('order-001').email;
  const evidenceDir = resolve(process.cwd(), 'Execution Evidence');
  const screenshotPath = resolve(evidenceDir, 'AE-ORDER-001.png');
  const logoPath = resolve(process.cwd(), 'reporting', 'assets', 'the-mcmahon-standard-logo.png');
  let assertions = [
    { name: 'Checkout prompts the logged-out visitor to register', passed: false, details: 'Not evaluated.' },
    { name: 'Registration completes during the checkout journey', passed: false, details: 'Not evaluated.' },
    { name: 'Checkout displays the registered address and selected product', passed: false, details: 'Not evaluated.' },
    { name: 'Order confirmation is displayed', passed: false, details: 'Not evaluated.' },
  ];
  await mkdir(evidenceDir, { recursive: true });

  try {
    await test.step('Add a product while logged out and proceed to checkout', async () => {
      await openHome(page);
      await addListingProduct(page, 1);
      await page.getByRole('link', { name: 'View Cart' }).click();
      await dismissAdOverlay(page);
      await page.waitForLoadState('networkidle');
      await page.locator('a.check_out').click();
      const registerLink = page.getByRole('link', { name: 'Register / Login' });
      await expect(registerLink).toBeVisible();
      assertions[0] = {
        name: 'Checkout prompts the logged-out visitor to register',
        passed: true,
        details: 'The checkout modal displayed the Register / Login action.',
      };
      await registerLink.click();
      await expect(page).toHaveURL(/\/login$/);
    });

    await test.step('Create a disposable account during the checkout journey', async () => {
      await page.locator('[data-qa="signup-name"]').fill(account.name);
      await page.locator('[data-qa="signup-email"]').fill(uniqueEmail);
      await page.locator('[data-qa="signup-button"]').click();
      await expect(page.getByText('Enter Account Information', { exact: false })).toBeVisible();
      await page.locator('#id_gender1').check();
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
      assertions[1] = {
        name: 'Registration completes during the checkout journey',
        passed: true,
        details: 'The disposable user was created and authenticated.',
      };
    });

    await test.step('Return to checkout and verify the order details', async () => {
      await openSitePage(page, 'Cart', /\/view_cart$/);
      await page.waitForLoadState('networkidle');
      await page.locator('a.check_out').click();
      await dismissAdOverlay(page);
      await expect(page).toHaveURL(/\/checkout$/);
      await expect(page.locator('#address_delivery')).toContainText(account.address1);
      await expect(page.locator('#address_invoice')).toContainText(account.address1);
      await expect(page.locator('#cart_info')).toContainText('Blue Top');
      assertions[2] = {
        name: 'Checkout displays the registered address and selected product',
        passed: true,
        details: 'Delivery, billing, and Blue Top order details were visible.',
      };
      await page.locator('textarea[name="message"]').fill('AE-ORDER-001 automated QA execution');
      await page.getByRole('link', { name: 'Place Order' }).click();
      await expect(page).toHaveURL(/\/payment$/);
    });

    await test.step('Submit synthetic payment data and verify confirmation', async () => {
      await page.locator('[data-qa="name-on-card"]').fill(paymentData.nameOnCard);
      await page.locator('[data-qa="card-number"]').fill(paymentData.cardNumber);
      await page.locator('[data-qa="cvc"]').fill(paymentData.cvc);
      await page.locator('[data-qa="expiry-month"]').fill(paymentData.expiryMonth);
      await page.locator('[data-qa="expiry-year"]').fill(paymentData.expiryYear);
      await page.locator('[data-qa="pay-button"]').click();
      const confirmation = page.getByText('Congratulations! Your order has been confirmed!', { exact: true });
      await expect(confirmation).toBeVisible();
      assertions[3] = {
        name: 'Order confirmation is displayed',
        passed: true,
        details: 'The site confirmed that the order was successfully placed.',
      };
      await page.screenshot({ path: screenshotPath, fullPage: true });
    });

    const evidence = await writeOrderExecutionEvidence({
      outputDir: evidenceDir,
      screenshotPath,
      logoPath,
      executedAt: new Date().toISOString(),
      environment: `${testInfo.project.name} / automationexercise.com`,
      status: 'Passed',
      assertions,
    });
    await testInfo.attach('AE-ORDER-001 branded HTML evidence', { path: evidence.htmlPath, contentType: 'text/html' });
    await testInfo.attach('AE-ORDER-001 PDF evidence', { path: evidence.pdfPath, contentType: 'application/pdf' });
  } catch (error) {
    const failureDetails = error instanceof Error ? error.message : String(error);
    if (!page.isClosed()) await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
    const evidence = await writeOrderExecutionEvidence({
      outputDir: evidenceDir,
      screenshotPath,
      logoPath,
      executedAt: new Date().toISOString(),
      environment: `${testInfo.project.name} / automationexercise.com`,
      status: 'Failed',
      assertions,
      failureDetails,
    }).catch(() => undefined);
    if (evidence) {
      await testInfo.attach('AE-ORDER-001 branded HTML evidence', { path: evidence.htmlPath, contentType: 'text/html' });
      await testInfo.attach('AE-ORDER-001 PDF evidence', { path: evidence.pdfPath, contentType: 'application/pdf' });
    }
    throw error;
  } finally {
    await cleanupWithWarning(() => deleteDisposableAccount(page));
  }
});
