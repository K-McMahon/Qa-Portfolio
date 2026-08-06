import { resolve } from 'node:path';
import { test, expect, openHome, openSitePage } from './support/ui-test';

test('AE-CONTACT-001 | SRC-TC-06 | Submit the contact form', async ({ page }) => {
  await openHome(page);
  await openSitePage(page, 'Contact us', /\/contact_us$/);
  await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();

  await page.locator('[data-qa="name"]').fill('Kevin Tester');
  await page.locator('[data-qa="email"]').fill(`kevin.qa.${Date.now()}@gmail.com`);
  await page.locator('[data-qa="subject"]').fill('QA portfolio contact test');
  await page.locator('[data-qa="message"]').fill('This is controlled test data.');
  await page
    .locator('input[name="upload_file"]')
    .setInputFiles(resolve('tests', 'fixtures', 'contact-upload.txt'));

  // wait for the site's contact form handler
  await page.waitForFunction(() => {
    const siteWindow = window as typeof window & {
      jQuery?: {
        _data: (element: Element, key: string) => Record<string, unknown> | undefined;
      };
    };
    const form = document.querySelector('#contact-us-form');
    return Boolean(form && siteWindow.jQuery?._data(form, 'events')?.submit);
  });

  // accept the site's confirmation dialog
  let dialogMessage = '';
  page.once('dialog', async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.accept();
  });
  await page.locator('[data-qa="submit-button"]').click();
  await expect.poll(() => dialogMessage).toBe('Press OK to proceed!');

  await expect(page.locator('.status.alert-success')).toContainText(
    'Success! Your details have been submitted successfully.',
  );
  await expect(page.locator('#form-section a[href="/"]')).toBeVisible();
});

test('AE-NAV-001 | SRC-TC-07 | Open the test cases page', async ({ page }) => {
  await openHome(page);
  await openSitePage(page, 'Test Cases', /\/test_cases$/);

  await expect(page.getByText('Test Cases', { exact: true }).first()).toBeVisible();
});

test('AE-SUB-001 | SRC-TC-10 | Subscribe from the home page', async ({ page }) => {
  await openHome(page);
  await page.locator('#footer').scrollIntoViewIfNeeded();
  await expect(page.getByText('Subscription', { exact: true })).toBeVisible();
  await page.locator('#susbscribe_email').fill(`qa.home.${Date.now()}@example.com`);
  await page.locator('#subscribe').click();

  await expect(page.locator('#success-subscribe')).toContainText(
    'You have been successfully subscribed!'
  );
});

test('AE-SUB-002 | SRC-TC-11 | Subscribe from the cart page', async ({ page }) => {
  await openHome(page);
  await openSitePage(page, 'Cart', /\/view_cart$/);
  await page.locator('#footer').scrollIntoViewIfNeeded();
  await expect(page.getByText('Subscription', { exact: true })).toBeVisible();
  await page.locator('#susbscribe_email').fill(`qa.cart.${Date.now()}@example.com`);
  await page.locator('#subscribe').click();

  await expect(page.locator('#success-subscribe')).toContainText(
    'You have been successfully subscribed!'
  );
});
