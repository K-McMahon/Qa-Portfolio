import { expect, type Page } from '@playwright/test';
import { dismissAdOverlay } from '../tests/ui/support/ui-test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async expectReady(addressText: string, productName: string) {
    await dismissAdOverlay(this.page);
    await expect(this.page).toHaveURL(/\/checkout$/);
    await expect(this.page.getByText('Address Details', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Review Your Order', { exact: true })).toBeVisible();
    await expect(this.page.locator('#address_delivery')).toContainText(addressText);
    await expect(this.page.locator('#address_invoice')).toContainText(addressText);
    await expect(this.page.locator('#cart_info')).toContainText(productName);
  }

  async placeOrder(comment: string) {
    await this.page.locator('textarea[name="message"]').fill(comment);
    await this.page.getByRole('link', { name: 'Place Order', exact: true }).click();
    await dismissAdOverlay(this.page);
    await expect(this.page).toHaveURL(/\/payment$/);
  }
}
