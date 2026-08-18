import { mkdir, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { expect, type Page } from '@playwright/test';

export class OrderConfirmationPage {
  constructor(private readonly page: Page) {}

  async expectConfirmed() {
    await expect(
      this.page.getByText('Congratulations! Your order has been confirmed!', { exact: true })
    ).toBeVisible();
    await expect(
      this.page.getByRole('link', { name: 'Download Invoice', exact: true })
    ).toBeVisible();
  }

  async downloadInvoice(fileName: string) {
    const invoicePath = resolve(process.cwd(), 'Execution Evidence', fileName);
    await mkdir(dirname(invoicePath), { recursive: true });

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.getByRole('link', { name: 'Download Invoice', exact: true }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/invoice.*\.txt$/i);
    await download.saveAs(invoicePath);

    const invoiceStats = await stat(invoicePath);
    expect(invoiceStats.size).toBeGreaterThan(0);
    const invoiceText = await readFile(invoicePath, 'utf8');
    expect(invoiceText.trim()).not.toBe('');

    return invoicePath;
  }

  async captureEvidence(fileName: string) {
    const screenshotPath = resolve(process.cwd(), 'Execution Evidence', fileName);
    await mkdir(dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }

  async continue() {
    await this.page.locator('[data-qa="continue-button"]').click();
    await expect(this.page).toHaveURL(/automationexercise\.com\/?$/);
  }
}
