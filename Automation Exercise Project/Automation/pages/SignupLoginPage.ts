import { expect, type Page } from '@playwright/test';

export class SignupLoginPage {
  constructor(private readonly page: Page) {}

  async expectReady() {
    await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  }

  async beginRegistration(name: string, email: string) {
    await this.page.locator('[data-qa="signup-name"]').fill(name);
    await this.page.locator('[data-qa="signup-email"]').fill(email);
    await this.page.locator('[data-qa="signup-button"]').click();
  }
}
