import { expect, type Page } from '@playwright/test';
import type { RegistrationData } from '../data/registration-data';

export class AccountInformationPage {
  constructor(private readonly page: Page) {}

  async expectReady() {
    await expect(this.page.getByText('Enter Account Information', { exact: false })).toBeVisible();
  }

  async complete(account: RegistrationData) {
    await this.page.locator(account.title === 'Mr' ? '#id_gender1' : '#id_gender2').check();
    await this.page.locator('[data-qa="password"]').fill(account.password);
    await this.page.locator('[data-qa="days"]').selectOption(account.birthDay);
    await this.page.locator('[data-qa="months"]').selectOption(account.birthMonth);
    await this.page.locator('[data-qa="years"]').selectOption(account.birthYear);

    if (account.newsletter) await this.page.locator('#newsletter').check();
    if (account.partnerOffers) await this.page.locator('#optin').check();

    await expect(this.page.locator('#newsletter')).toBeChecked();
    await expect(this.page.locator('#optin')).toBeChecked();

    await this.page.locator('[data-qa="first_name"]').fill(account.firstName);
    await this.page.locator('[data-qa="last_name"]').fill(account.lastName);
    await this.page.locator('[data-qa="company"]').fill(account.company);
    await this.page.locator('[data-qa="address"]').fill(account.address1);
    await this.page.locator('[data-qa="address2"]').fill(account.address2);
    await this.page.locator('[data-qa="country"]').selectOption({ label: account.country });
    await this.page.locator('[data-qa="state"]').fill(account.state);
    await this.page.locator('[data-qa="city"]').fill(account.city);
    await this.page.locator('[data-qa="zipcode"]').fill(account.zipcode);
    await this.page.locator('[data-qa="mobile_number"]').fill(account.mobileNumber);
    await this.page.locator('[data-qa="create-account"]').click();
  }
}
