import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { writeCheckoutAddressEvidence } from '../../reporting/checkout-address-evidence';
import {
  addListingProduct,
  deleteDisposableAccount,
  dismissAdOverlay,
  expect,
  openHome,
  registerDisposableAccount,
  test,
  type DisposableAccountData,
} from './support/ui-test';

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

test('AE-ORDER-004 checkout delivery and billing addresses match the registered account', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'preserve-evidence', description: 'Checkout screenshot is captured before account cleanup.' });
  const uniqueAccount = {
    ...account,
    email: `mcmahon.qa.order004.${Date.now()}@example.com`,
  };
  const evidenceDir = resolve(process.cwd(), 'Execution Evidence');
  const screenshotPath = resolve(evidenceDir, 'AE-ORDER-004.png');
  const logoPath = resolve(process.cwd(), 'reporting', 'assets', 'the-mcmahon-standard-logo.png');
  const expectedAddressLines = [
    `${account.title}. ${account.firstName} ${account.lastName}`,
    account.company,
    account.address1,
    account.address2,
    `${account.city} ${account.state} ${account.zipcode}`,
    account.country,
    account.mobileNumber,
  ];
  let deliveryAddressLines: string[] = [];
  let billingAddressLines: string[] = [];
  let assertions = [
    { name: 'Delivery address matches registration', passed: false, details: 'Checkout was not reached.' },
    { name: 'Billing address matches registration', passed: false, details: 'Checkout was not reached.' },
  ];
  let failureDetails: string | undefined;

  await mkdir(evidenceDir, { recursive: true });
  try {
    await registerDisposableAccount(page, uniqueAccount);
    await openHome(page);
    await addListingProduct(page, 1);
    await page.getByRole('link', { name: 'View Cart' }).click();
    await dismissAdOverlay(page);
    const checkoutButton = page.locator('a.check_out');
    await page.waitForLoadState('networkidle');
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();
    await dismissAdOverlay(page);
    await expect(page).toHaveURL(/\/checkout$/);

    const delivery = page.locator('#address_delivery');
    const billing = page.locator('#address_invoice');
    await expect(delivery).toBeVisible();
    await expect(billing).toBeVisible();
    deliveryAddressLines = (await delivery.locator('li').allTextContents()).map((line) => line.trim()).filter(Boolean);
    billingAddressLines = (await billing.locator('li').allTextContents()).map((line) => line.trim()).filter(Boolean);
    const deliveryText = deliveryAddressLines.join(' ');
    const billingText = billingAddressLines.join(' ');
    const expectedValues = [account.firstName, account.lastName, account.company, account.address1, account.address2, account.city, account.state, account.zipcode, account.country, account.mobileNumber];
    const deliveryPassed = expectedValues.every((value) => deliveryText.includes(value));
    const billingPassed = expectedValues.every((value) => billingText.includes(value));
    assertions = [
      { name: 'Delivery address matches registration', passed: deliveryPassed, details: deliveryPassed ? 'All expected values are visible.' : 'One or more expected values are missing.' },
      { name: 'Billing address matches registration', passed: billingPassed, details: billingPassed ? 'All expected values are visible.' : 'One or more expected values are missing.' },
    ];
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const evidence = await writeCheckoutAddressEvidence({
      outputDir: evidenceDir,
      screenshotPath,
      logoPath,
      executedAt: new Date().toISOString(),
      environment: `${testInfo.project.name} / automationexercise.com`,
      status: deliveryPassed && billingPassed ? 'Passed' : 'Failed',
      expectedAddressLines,
      deliveryAddressLines,
      billingAddressLines,
      assertions,
    });
    await testInfo.attach('AE-ORDER-004 branded HTML evidence', {
      path: evidence.htmlPath,
      contentType: 'text/html',
    });
    await testInfo.attach('AE-ORDER-004 PDF evidence', {
      path: evidence.pdfPath,
      contentType: 'application/pdf',
    });

    expect(deliveryPassed, 'delivery address should contain every registered address value').toBe(true);
    expect(billingPassed, 'billing address should contain every registered address value').toBe(true);
  } catch (error) {
    failureDetails = error instanceof Error ? error.message : String(error);
    if (!page.isClosed()) {
      await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
    }
    const failedEvidence = await writeCheckoutAddressEvidence({
      outputDir: evidenceDir,
      screenshotPath,
      logoPath,
      executedAt: new Date().toISOString(),
      environment: `${testInfo.project.name} / automationexercise.com`,
      status: 'Failed',
      expectedAddressLines,
      deliveryAddressLines,
      billingAddressLines,
      assertions,
      failureDetails,
    }).catch(() => undefined);
    if (failedEvidence) {
      await testInfo.attach('AE-ORDER-004 branded HTML evidence', {
        path: failedEvidence.htmlPath,
        contentType: 'text/html',
      });
      await testInfo.attach('AE-ORDER-004 PDF evidence', {
        path: failedEvidence.pdfPath,
        contentType: 'application/pdf',
      });
    }
    throw error;
  } finally {
    await deleteDisposableAccount(page).catch(() => undefined);
  }
});
