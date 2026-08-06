import {
  test,
  expect,
  addListingProduct,
  openHome,
  openSitePage,
} from './support/ui-test';

test('AE-PRODUCT-001 | SRC-TC-08 | View product details', async ({ page }) => {
  await openHome(page);
  await openSitePage(page, 'Products', /\/products$/);
  await expect(page.getByText('All Products', { exact: true })).toBeVisible();
  await expect(page.locator('.features_items .product-image-wrapper')).not.toHaveCount(0);
  await page.getByRole('link', { name: 'View Product' }).first().click();

  await expect(page).toHaveURL(/\/product_details\/\d+$/);
  const details = page.locator('.product-information');
  await expect(details.locator('h2')).toBeVisible();
  await expect(details).toContainText('Category:');
  await expect(details).toContainText('Rs.');
  await expect(details).toContainText('Availability:');
  await expect(details).toContainText('Condition:');
  await expect(details).toContainText('Brand:');
});

test('AE-PRODUCT-002 | SRC-TC-09 | Search for a product', async ({ page }) => {
  await openHome(page);
  await openSitePage(page, 'Products', /\/products$/);
  await page.locator('#search_product').fill('top');
  await page.locator('#submit_search').click();

  await expect(page.getByText('Searched Products', { exact: true })).toBeVisible();
  const productNames = page.locator('.features_items .productinfo p:visible');
  await expect(productNames.first()).toBeVisible();
  expect(await productNames.count()).toBeGreaterThan(0);
  for (const productName of await productNames.all()) {
    await expect(productName).toBeVisible();
  }
});

test('AE-CART-001 | SRC-TC-12 | Add two products and verify cart totals', async ({ page }) => {
  await openHome(page);
  await openSitePage(page, 'Products', /\/products$/);

  await addListingProduct(page, 1);
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await addListingProduct(page, 2);
  await page.getByRole('link', { name: 'View Cart' }).click({ force: true });

  const rows = page.locator('#cart_info_table tbody tr');
  await expect(rows).toHaveCount(2);
  for (const row of await rows.all()) {
    await expect(row.locator('.cart_price')).toBeVisible();
    await expect(row.locator('.cart_quantity')).toHaveText('1');
    await expect(row.locator('.cart_total')).toBeVisible();
  }

  // verify the required overall cart total is displayed
  await expect(page.getByText('Overall Total', { exact: true })).toBeVisible();
});

test('AE-CART-002 | SRC-TC-13 | Add a product with quantity four', async ({ page }) => {
  await openHome(page);
  await openSitePage(page, 'Products', /\/products$/);
  await page.getByRole('link', { name: 'View Product' }).first().click();
  await expect(page.locator('.product-information')).toBeVisible();
  await page.locator('#quantity').fill('4');

  const addToCartButton = page.getByRole('button', { name: 'Add to cart' });

  // wait for the site to connect its cart click handler
  await page.waitForFunction(() => {
    const button = document.querySelector('.product-information button.cart');
    const jquery = (window as typeof window & {
      jQuery?: { _data?: (element: Element, key: string) => { click?: unknown[] } };
    }).jQuery;
    return Boolean(button && jquery?._data?.(button, 'events')?.click?.length);
  });

  // confirm the cart request finishes before opening the cart
  await Promise.all([
    page.waitForResponse(
      (response) => response.url().includes('/add_to_cart/') && response.ok()
    ),
    addToCartButton.click(),
  ]);

  const cartModal = page.locator('#cartModal');
  await expect(cartModal).toHaveClass(/show/);
  await cartModal.getByRole('link', { name: 'View Cart' }).click();

  const row = page.locator('#cart_info_table tbody tr').first();
  await expect(row).toBeVisible();
  await expect(row.locator('.cart_quantity')).toHaveText('4');
});

test('AE-CART-003 | SRC-TC-17 | Remove a product from the cart', async ({ page }) => {
  await openHome(page);
  await openSitePage(page, 'Products', /\/products$/);
  await addListingProduct(page, 1);
  await page.getByRole('link', { name: 'View Cart' }).click();

  const rows = page.locator('#cart_info_table tbody tr');
  await expect(rows).toHaveCount(1);
  await rows.first().locator('.cart_quantity_delete').click();

  await expect(rows).toHaveCount(0);
  await expect(page.getByText('Cart is empty!')).toBeVisible();
});
