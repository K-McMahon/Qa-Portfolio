import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
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

  async expectBrandsSidebar() {
    const brandsPanel = this.page.locator('.brands_products');
    await expect(brandsPanel.getByRole('heading', { name: 'Brands', exact: true })).toBeVisible();
    await expect(brandsPanel.locator('a[href^="/brand_products/"]').first()).toBeVisible();
  }

  async selectBrand(brand: string) {
    await dismissAdOverlay(this.page);
    const brandLink = this.page.locator(
      `.brands_products a[href="/brand_products/${brand}"]`
    );
    await expect(brandLink).toBeVisible();
    await brandLink.click();
    await dismissAdOverlay(this.page);
  }

  async expectBrandProducts(brand: string) {
    const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(this.page).toHaveURL(new RegExp(`/brand_products/${escapedBrand}$`));
    await expect(
      this.page.getByText(`Brand - ${brand} Products`, { exact: true })
    ).toBeVisible();

    const products = this.page.locator('.features_items .product-image-wrapper');
    await expect(products.first()).toBeVisible();
    await expect(products).not.toHaveCount(0);
  }

  async captureEvidence(fileName: string) {
    const screenshotPath = resolve(process.cwd(), 'Execution Evidence', fileName);
    await mkdir(dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
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
