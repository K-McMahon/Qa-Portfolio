import { CartPage } from '../../pages/CartPage';
import { HomePage } from '../../pages/HomePage';
import { test } from './support/ui-test';

test('AE-AUTO-CART-005 | AEQA-125 | Add a Recommended Items product to the cart', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const cartPage = new CartPage(page);

  await homePage.open();
  const productName = await homePage.addFirstRecommendedProductToCart();
  await homePage.openCartFromConfirmation();
  await cartPage.expectProductNamed(productName);
});
