import { expect, type Page } from '@playwright/test';
import { dismissAdOverlay, type PaymentData } from '../tests/ui/support/ui-test';

export class PaymentPage {
  constructor(private readonly page: Page) {}

  async pay(payment: PaymentData) {
    await expect(this.page).toHaveURL(/\/payment$/);
    await this.page.locator('[data-qa="name-on-card"]').fill(payment.nameOnCard);
    await this.page.locator('[data-qa="card-number"]').fill(payment.cardNumber);
    await this.page.locator('[data-qa="cvc"]').fill(payment.cvc);
    await this.page.locator('[data-qa="expiry-month"]').fill(payment.expiryMonth);
    await this.page.locator('[data-qa="expiry-year"]').fill(payment.expiryYear);
    await this.page.locator('[data-qa="pay-button"]').click();
    await dismissAdOverlay(this.page);
    await expect(this.page).toHaveURL(/\/payment_done\/\d+$/);
  }
}
