import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { expect, type Page } from '@playwright/test';
import { dismissAdOverlay } from '../tests/ui/support/ui-test';

export type CartItem = {
  id: string;
  name: string;
  price: string;
  quantity: string;
  total: string;
};

export class CartPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded' });
    await dismissAdOverlay(this.page);
    await expect(this.page).toHaveURL(/\/view_cart$/);
    await expect(this.page.locator('body')).toBeVisible();
  }

  async clearAllItems() {
    const rows = this.page.locator('#cart_info_table tbody tr[id^="product-"]');

    while ((await rows.count()) > 0) {
      const previousCount = await rows.count();
      await rows.first().locator('.cart_quantity_delete').click();
      await expect(rows).toHaveCount(previousCount - 1);
    }

    await expect(this.page.getByText('Cart is empty!')).toBeVisible();
  }

  async snapshot(): Promise<CartItem[]> {
    const rows = this.page.locator('#cart_info_table tbody tr[id^="product-"]');
    await expect(this.page.locator('#cart_info_table')).toBeVisible();
    const items = await rows.evaluateAll((cartRows) =>
      cartRows.map((row) => ({
        id: row.id.replace(/^product-/, '').trim(),
        name: row.querySelector('.cart_description h4 a')?.textContent?.trim() ?? '',
        price: row.querySelector('.cart_price p')?.textContent?.trim() ?? '',
        quantity: row.querySelector('.cart_quantity button')?.textContent?.trim() ?? '',
        total: row.querySelector('.cart_total p')?.textContent?.trim() ?? '',
      }))
    );

    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.id).not.toBe('');
      expect(item.name).not.toBe('');
      expect(item.price).not.toBe('');
      expect(item.quantity).not.toBe('');
      expect(item.total).not.toBe('');
    }

    return items.sort((left, right) =>
      left.id.localeCompare(right.id, undefined, { numeric: true })
    );
  }

  async captureEvidence(fileName: string) {
    const screenshotPath = resolve(process.cwd(), 'Execution Evidence', fileName);
    await mkdir(dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }
}
