import { createRegistrationData } from '../../data/registration-data';
import { AccountInformationPage } from '../../pages/AccountInformationPage';
import { AccountStatusPage } from '../../pages/AccountStatusPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { HomePage } from '../../pages/HomePage';
import { OrderConfirmationPage } from '../../pages/OrderConfirmationPage';
import { PaymentPage } from '../../pages/PaymentPage';
import { SignupLoginPage } from '../../pages/SignupLoginPage';
import { cleanupWithWarning } from '../support/cleanup';
import { getPaymentData, test } from './support/ui-test';
import { hasPaymentData } from './support/credential-availability';

test('AE-AUTO-ORDER-005 | AEQA-126 | Download invoice after purchase', async ({
  page,
}, testInfo) => {
  test.skip(!hasPaymentData(), 'Requires payment test data.');
  testInfo.annotations.push({
    type: 'preserve-evidence',
    description: 'The order confirmation and invoice download evidence is preserved before cleanup.',
  });

  const account = createRegistrationData();
  const paymentData = getPaymentData();
  const homePage = new HomePage(page);
  const cartPage = new CartPage(page);
  const signupLoginPage = new SignupLoginPage(page);
  const accountInformationPage = new AccountInformationPage(page);
  const accountStatusPage = new AccountStatusPage(page);
  const checkoutPage = new CheckoutPage(page);
  const paymentPage = new PaymentPage(page);
  const orderConfirmationPage = new OrderConfirmationPage(page);
  let accountCreated = false;
  let productName = '';
  let primaryError: unknown;

  try {
    await test.step('add a product and open registration from checkout', async () => {
      await homePage.open();
      productName = await homePage.addFirstRecommendedProductToCart();
      await homePage.openCartFromConfirmation();
      await cartPage.expectProductNamed(productName);
      await cartPage.proceedToCheckout();
      await cartPage.openRegistrationFromCheckoutPrompt();
    });

    await test.step('create a disposable account', async () => {
      await signupLoginPage.expectReady();
      await signupLoginPage.beginRegistration(account.name, account.email);
      await accountInformationPage.expectReady();
      await accountInformationPage.complete(account);
      await accountStatusPage.expectCreated();
      accountCreated = true;
      await accountStatusPage.continue();
      await homePage.expectLoggedInAs(account.name);
    });

    await test.step('review checkout and place the order', async () => {
      if (!productName) throw new Error('The selected product name was not recorded.');

      await cartPage.open();
      await cartPage.expectProductNamed(productName);
      await cartPage.proceedToCheckout();
      await checkoutPage.expectReady(account.address1, productName);
      await checkoutPage.placeOrder('QA By The McMahon Standard');
    });

    await test.step('pay and verify order confirmation', async () => {
      await paymentPage.pay(paymentData);
      await orderConfirmationPage.expectConfirmed();
    });

    await test.step('download and preserve invoice evidence', async () => {
      const invoicePath = await orderConfirmationPage.downloadInvoice(
        'AE-AUTO-ORDER-005-invoice.txt'
      );
      const screenshotPath = await orderConfirmationPage.captureEvidence(
        'AE-AUTO-ORDER-005.png'
      );

      await testInfo.attach('AE-AUTO-ORDER-005 confirmation and download screenshot', {
        path: screenshotPath,
        contentType: 'image/png',
      });
      await testInfo.attach('AE-AUTO-ORDER-005 downloaded invoice', {
        path: invoicePath,
        contentType: 'text/plain',
      });
    });

    await orderConfirmationPage.continue();
  } catch (error) {
    primaryError = error;
    throw error;
  } finally {
    if (accountCreated) {
      const cleanup = async () => {
        await homePage.deleteAccount();
        await accountStatusPage.expectDeleted();
      };

      if (primaryError) await cleanupWithWarning(cleanup);
      else await cleanup();
    }
  }
});
