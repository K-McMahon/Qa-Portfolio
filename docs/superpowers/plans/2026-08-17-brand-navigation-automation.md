# Brand Navigation Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable Page Object Model workflow and Playwright test for AEQA-123 that validates Polo-to-H&M brand navigation and preserves two named evidence screenshots.

**Architecture:** Extend the existing `ProductsPage` with brand-panel, selection, result, and evidence methods. Add one focused UI spec that calls those methods in two explicit business steps so the existing teardown, analytics reporter, and Playwright HTML reporter remain unchanged.

**Tech Stack:** TypeScript, Playwright Test, existing QA analytics reporter, Jira Cloud AEQA project

## Global Constraints

- Work directly in `Automation Exercise Project/Automation` inside the local QA Portfolio checkout.
- Use `AE-CATALOG-002(1).png` for Polo evidence and `AE-CATALOG-002(2).png` for H&M evidence.
- Use the existing Page Object Model and named attachment workflow.
- Use web-first assertions and no hard-coded waits.
- Keep manual execution `AEQA-111` distinct from automation sub-task `AEQA-123`.
- Run only the focused brand-navigation test during implementation; do not run the entire suite.

---

### Task 1: Brand Navigation Page Object and Test

**Files:**
- Create: `Automation Exercise Project/Automation/tests/ui/brand-navigation.spec.ts`
- Modify: `Automation Exercise Project/Automation/pages/ProductsPage.ts`
- Modify: `Automation Exercise Project/Automation/README.md`

**Interfaces:**
- Consumes: `ProductsPage.open()`, Playwright `test.step`, `testInfo.attach`, and the existing named-evidence reporter behavior.
- Produces: `ProductsPage.expectBrandsSidebar(): Promise<void>`, `ProductsPage.selectBrand(brand: string): Promise<void>`, `ProductsPage.expectBrandProducts(brand: string): Promise<void>`, and `ProductsPage.captureEvidence(fileName: string): Promise<string>`.

- [ ] **Step 1: Write the failing end-to-end test**

Create `tests/ui/brand-navigation.spec.ts` with the desired POM interface:

```ts
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
```

The realistic mutation this test catches is a broken/missing brand link, navigation to the wrong brand route, a stale heading, or an empty selected-brand result set.

- [ ] **Step 2: Run the focused test and verify the red failure**

Run from `Automation Exercise Project/Automation`:

```powershell
npx playwright test tests/ui/brand-navigation.spec.ts --project=chromium --workers=1
```

Expected: FAIL because the new `ProductsPage` methods do not exist yet. Confirm the failure reaches the missing POM interface rather than a syntax or import error.

- [ ] **Step 3: Implement the minimal reusable POM methods**

Add file-system imports and these methods to `ProductsPage.ts`:

```ts
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

async expectBrandsSidebar() {
  const brandsPanel = this.page.locator('.brands_products');
  await expect(brandsPanel.getByText('Brands', { exact: true })).toBeVisible();
  await expect(brandsPanel.locator('a[href^="/brand_products/"]').first()).toBeVisible();
}

async selectBrand(brand: string) {
  await dismissAdOverlay(this.page);
  const link = this.page.locator(`.brands_products a[href="/brand_products/${brand}"]`);
  await expect(link).toBeVisible();
  await link.click();
  await dismissAdOverlay(this.page);
}

async expectBrandProducts(brand: string) {
  const escapedBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(this.page).toHaveURL(new RegExp(`/brand_products/${escapedBrand}$`));
  await expect(this.page.getByText(`Brand - ${brand} Products`, { exact: true })).toBeVisible();
  const products = this.page.locator('.features_items .product-image-wrapper');
  await expect(products.first()).toBeVisible();
  expect(await products.count()).toBeGreaterThan(0);
}

async captureEvidence(fileName: string) {
  const screenshotPath = resolve(process.cwd(), 'Execution Evidence', fileName);
  await mkdir(dirname(screenshotPath), { recursive: true });
  await this.page.screenshot({ path: screenshotPath, fullPage: true });
  return screenshotPath;
}
```

- [ ] **Step 4: Run the focused test and verify green**

Run:

```powershell
npx playwright test tests/ui/brand-navigation.spec.ts --project=chromium --workers=1
```

Expected: 1 passed, with both named screenshots attached to the Playwright result.

- [ ] **Step 5: Update the local automation README**

Update coverage from 19 to 20 UI scenarios, add Catalog / `AE-CATALOG-002` / `SRC-TC-19` to the coverage table, and document the two named evidence files and AEQA-123 traceability.

- [ ] **Step 6: Run focused reporter and discovery verification**

Run:

```powershell
npx playwright test tests/reporting/evidence-attachments.spec.ts --project=chromium --workers=1
npx playwright test tests/ui/brand-navigation.spec.ts --project=chromium --list
```

Expected: the reporter helper passes and the new brand-navigation test is listed once.

- [ ] **Step 7: Verify saved files and inspect the diff**

Confirm both screenshot paths exist only after the green run, then inspect:

```powershell
git diff --check
git status --short
```

Expected code scope: the new spec, `ProductsPage.ts`, and the Automation README. The design and plan are separate documentation commits.

- [ ] **Step 8: Commit the implementation**

```powershell
git add -- "Automation Exercise Project/Automation/tests/ui/brand-navigation.spec.ts" "Automation Exercise Project/Automation/pages/ProductsPage.ts" "Automation Exercise Project/Automation/README.md"
git commit -m "test: automate brand navigation"
```

### Task 2: Jira Reconciliation

**Files:**
- Modify: Jira `AEQA-123` only after the local verification result is known.

**Interfaces:**
- Consumes: the focused Playwright result and evidence filenames from Task 1.
- Produces: a Jira sub-task that accurately distinguishes implemented automation from execution result.

- [ ] **Step 1: Verify the Jira fields written before implementation**

Confirm AEQA-123 is assigned to Kevin Mcmahon, In Progress, labeled for Playwright/POM/catalog work, and contains all ten acceptance criteria from the design.

- [ ] **Step 2: Reconcile execution text only from observed evidence**

If the focused green run succeeds, change `Execution Status` prose in the description from `Not Run — automation implementation in progress` to a Passed statement and reference both evidence files. If the run does not succeed, keep the item In Progress and record the observed blocker without marking it Done.

- [ ] **Step 3: Transition only after evidence is verified**

Transition AEQA-123 to Done only when the focused test passes and both screenshots exist. Otherwise leave it In Progress for the user’s VS Code execution.
