import { randomUUID } from 'node:crypto';
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { test } from './support/ui-test';

test('AE-REVIEW-001 | AEQA-113 | AEQA-124 | Visitor submits a product review', async ({
  page,
}, testInfo) => {
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const uniqueValue = randomUUID().replaceAll('-', '').slice(0, 12);
  const review = {
    name: `McMahon QA ${uniqueValue}`,
    email: `mcmahon.qa.${uniqueValue}@example.com`,
    message: 'QA By The McMahon Standard',
  };

  await test.step('open the first product review form', async () => {
    await productsPage.open();
    await productsPage.openFirstProduct();
    await productDetailsPage.expectReviewForm();
  });

  await test.step('complete the review with generated identity data', async () => {
    await productDetailsPage.fillReview(review);
    const screenshotPath = await productDetailsPage.captureEvidence('AE-REVIEW-001(1).png');
    await testInfo.attach('AE-REVIEW-001(1) completed review form', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });

  await test.step('submit the review and verify the confirmation', async () => {
    await productDetailsPage.submitReview();
    await productDetailsPage.expectReviewSubmitted();
    const screenshotPath = await productDetailsPage.captureEvidence('AE-REVIEW-001(2).png');
    await testInfo.attach('AE-REVIEW-001(2) review confirmation', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });
});
