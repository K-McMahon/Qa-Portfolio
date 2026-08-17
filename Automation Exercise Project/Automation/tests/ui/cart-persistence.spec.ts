import { CartPage, type CartItem } from '../../pages/CartPage';
import { HomePage } from '../../pages/HomePage';
import { ProductsPage } from '../../pages/ProductsPage';
import { SignupLoginPage } from '../../pages/SignupLoginPage';
import { expect, getLoginCredentials, test } from './support/ui-test';

test('AE-CART-004 | AEQA-112 | Search products remain in cart after login', async ({
  page,
}, testInfo) => {
  const { email, password, username } = getLoginCredentials();
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const signupLoginPage = new SignupLoginPage(page);
  let preLoginCart: CartItem[] = [];

  await test.step('enforce the empty-account-cart precondition', async () => {
    await homePage.open();
    await homePage.openSignupLogin();
    await signupLoginPage.expectLoginReady();
    await signupLoginPage.login(email, password);
    await homePage.expectLoggedInAs(username);
    await cartPage.open();
    await cartPage.clearAllItems();
    await homePage.logout();
    await signupLoginPage.expectLoginReady();
  });

  await test.step('search for top and add every visible result', async () => {
    await productsPage.open();
    await productsPage.search('top');
    const addedCount = await productsPage.addAllVisibleResultsToCart();
    expect(addedCount).toBeGreaterThan(0);
  });

  await test.step('record and capture the filled cart before login', async () => {
    await cartPage.open();
    preLoginCart = await cartPage.snapshot();
    expect(preLoginCart.length).toBeGreaterThan(0);
    const screenshotPath = await cartPage.captureEvidence('AE-CART-004(1).png');
    await testInfo.attach('AE-CART-004(1) pre-login filled cart', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });

  await test.step('authenticate and return to the cart', async () => {
    await homePage.openSignupLogin();
    await signupLoginPage.expectLoginReady();
    await signupLoginPage.login(email, password);
    await homePage.expectLoggedInAs(username);
    await cartPage.open();
  });

  await test.step('verify and capture the retained cart after login', async () => {
    await homePage.expectLoggedInAs(username);
    const postLoginCart = await cartPage.snapshot();
    expect(postLoginCart).toEqual(preLoginCart);
    const screenshotPath = await cartPage.captureEvidence('AE-CART-004(2).png');
    await testInfo.attach('AE-CART-004(2) post-login retained cart', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });
});
