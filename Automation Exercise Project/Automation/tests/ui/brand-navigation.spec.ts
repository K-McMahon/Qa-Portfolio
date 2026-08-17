import { ProductsPage } from '../../pages/ProductsPage';
import { test } from './support/ui-test';

test('AE-CATALOG-002 | AEQA-111 | AEQA-123 | Brand selection and switching display matching products', async ({
  page,
}, testInfo) => {
  const productsPage = new ProductsPage(page);

  await test.step('select Polo and verify matching brand products', async () => {
    await productsPage.open();
    await productsPage.expectBrandsSidebar();
    await productsPage.selectBrand('Polo');
    await productsPage.expectBrandProducts('Polo');
    const screenshotPath = await productsPage.captureEvidence('AE-CATALOG-002(1).png');
    await testInfo.attach('AE-CATALOG-002(1) Polo brand products', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });

  await test.step('switch to H&M and verify matching brand products', async () => {
    await productsPage.expectBrandsSidebar();
    await productsPage.selectBrand('H&M');
    await productsPage.expectBrandProducts('H&M');
    const screenshotPath = await productsPage.captureEvidence('AE-CATALOG-002(2).png');
    await testInfo.attach('AE-CATALOG-002(2) H&M brand products', {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });
});
