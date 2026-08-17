import { expect, type Page } from '@playwright/test';
import { dismissAdOverlay } from '../tests/ui/support/ui-test';

export class ProductsPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
    await dismissAdOverlay(this.page);
    await expect(this.page).toHaveURL(/\/products$/);
  }

  async search(term: string) {
    await this.page.locator('#search_product').fill(term);
    await this.page.locator('#submit_search').click();
    await expect(this.page.getByText('Searched Products', { exact: true })).toBeVisible();
  }

  async addAllVisibleResultsToCart() {
    const cards = this.page.locator('.features_items .product-image-wrapper');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      await dismissAdOverlay(this.page);
      const addButton = cards.nth(index).locator('a.add-to-cart').filter({ visible: true }).first();
      await addButton.scrollIntoViewIfNeeded();
      await expect
        .poll(
          () =>
            addButton.evaluate((button) => {
              const jquery = (window as typeof window & {
                jQuery?: { _data?: (element: Element, key: string) => { click?: unknown[] } };
              }).jQuery;
              return Boolean(jquery?._data?.(button, 'events')?.click?.length);
            }),
          { message: `cart click handler is ready for search result ${index + 1}` }
        )
        .toBeTruthy();
      await addButton.click();

      const modal = this.page.locator('#cartModal');
      await expect(modal).toHaveClass(/show/);
      await modal.getByRole('button', { name: 'Continue Shopping' }).click();
      await expect(modal).not.toHaveClass(/show/);
    }

    return count;
  }
}
