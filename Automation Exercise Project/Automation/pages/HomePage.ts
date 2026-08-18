import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
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

  async expectHeroVisible() {
    await expect
      .poll(() => this.page.evaluate(() => window.scrollY), {
        message: 'home page is positioned at the top',
      })
      .toBeLessThan(100);
    await expect(
      this.page.getByRole('heading', {
        name: 'Full-Fledged practice website for Automation Engineers',
        exact: true,
      })
    ).toBeVisible();
  }

  async scrollToSubscription() {
    const subscription = this.page.getByText('Subscription', { exact: true });

    for (let step = 0; step < 50; step += 1) {
      const inViewport = await subscription.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.top >= 0 && bounds.bottom <= window.innerHeight;
      });
      if (inViewport) return;

      const previousScrollY = await this.page.evaluate(() => window.scrollY);
      await this.page.mouse.wheel(0, 800);
      await expect
        .poll(() => this.page.evaluate(() => window.scrollY), {
          message: `page moves down during scroll step ${step + 1}`,
        })
        .toBeGreaterThan(previousScrollY);
    }

    throw new Error('Subscription did not enter the viewport after scrolling down.');
  }

  async expectSubscriptionAndScrollUpControl() {
    await expect(this.page.getByText('Subscription', { exact: true })).toBeVisible();
    await expect(this.page.locator('#scrollUp')).toBeVisible();
  }

  async returnToTopWithArrow() {
    const scrollUp = this.page.locator('#scrollUp');
    await expect(scrollUp).toBeVisible();
    await scrollUp.click();
    await expect
      .poll(() => this.page.evaluate(() => window.scrollY), {
        message: 'page returns to the top after selecting the arrow',
      })
      .toBeLessThan(100);
  }

  async captureEvidence(fileName: string) {
    const screenshotPath = resolve(process.cwd(), 'Execution Evidence', fileName);
    await mkdir(dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ path: screenshotPath, fullPage: false });
    return screenshotPath;
  }

  async addFirstRecommendedProductToCart() {
    await dismissAdOverlay(this.page);
    const recommendedItems = this.page.locator('.recommended_items');
    await recommendedItems.scrollIntoViewIfNeeded();
    await expect(
      recommendedItems.getByRole('heading', { name: 'recommended items', exact: true })
    ).toBeVisible();

    const product = recommendedItems.locator('.item.active .product-image-wrapper').first();
    await expect(product).toBeVisible();
    const productName = (await product.locator('.productinfo p').textContent())?.trim() ?? '';
    expect(productName).not.toBe('');

    await product.locator('a.add-to-cart').click();
    await expect(this.page.locator('#cartModal')).toHaveClass(/show/);

    return productName;
  }

  async openCartFromConfirmation() {
    const cartModal = this.page.locator('#cartModal');
    await expect(cartModal).toHaveClass(/show/);
    await cartModal.getByRole('link', { name: 'View Cart', exact: true }).click();
    await dismissAdOverlay(this.page);
    await expect(this.page).toHaveURL(/\/view_cart$/);
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
