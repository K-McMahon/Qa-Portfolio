import { expect, type Page } from '@playwright/test';

export class SignupLoginPage {
  constructor(private readonly page: Page) {}

  async expectLoginReady() {
    await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.page.locator('[data-qa="login-email"]').fill(email);
    await this.page.locator('[data-qa="login-password"]').fill(password);
    await this.page.locator('[data-qa="login-button"]').click();
  }

  async expectReady() {
    await expect(this.page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
  }

  async beginRegistration(name: string, email: string) {
    await this.page.locator('[data-qa="signup-name"]').fill(name);
    await this.page.locator('[data-qa="signup-email"]').fill(email);
    await this.page.locator('[data-qa="signup-button"]').click();
  }
}
