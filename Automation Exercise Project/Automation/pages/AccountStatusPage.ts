import { expect, type Page } from '@playwright/test';
import { dismissAdOverlay } from '../tests/ui/support/ui-test';

export class AccountStatusPage {
  constructor(private readonly page: Page) {}

  async expectCreated() {
    await expect(this.page.locator('[data-qa="account-created"]')).toBeVisible();
  }

  async continue() {
    await this.page.locator('[data-qa="continue-button"]').click();
    await dismissAdOverlay(this.page);
  }

  async expectDeleted() {
    await expect(this.page.locator('[data-qa="account-deleted"]')).toBeVisible();
  }
}
