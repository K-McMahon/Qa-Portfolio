import { expect, type Page } from '@playwright/test';
import { dismissAdOverlay } from '../tests/ui/support/ui-test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await dismissAdOverlay(this.page);
    await expect(this.page).toHaveURL(/automationexercise\.com\/?$/);
  }

  async openSignupLogin() {
    await dismissAdOverlay(this.page);
    await this.page.locator('a[href="/login"]').first().click();
    await dismissAdOverlay(this.page);
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async expectLoggedInAs(name: string) {
    await expect(this.page.getByText(`Logged in as ${name}`, { exact: true })).toBeVisible();
  }

  async logout() {
    await dismissAdOverlay(this.page);
    await this.page.locator('a[href="/logout"]').first().click();
    await dismissAdOverlay(this.page);
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async deleteAccount() {
    await dismissAdOverlay(this.page);
    await this.page.locator('a[href="/delete_account"]').first().click();
    await dismissAdOverlay(this.page);
  }
}
