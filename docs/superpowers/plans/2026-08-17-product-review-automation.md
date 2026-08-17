# Product Review Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a headed-ready Playwright test for `AEQA-124` that submits a product review with generated identity data and verifies the success confirmation.

**Architecture:** Keep product-list navigation in `ProductsPage`, place review-form behavior in a new `ProductDetailsPage`, and keep the business journey and report attachments in one focused UI spec. Reuse the existing UI fixture, evidence folder, branded reporter, and Playwright HTML reporter.

**Tech Stack:** TypeScript, Playwright Test, existing Page Object Model, existing QA analytics reporter

## Global Constraints

- Work directly in the local QA Portfolio repository.
- Use a different synthetic name and email on every run.
- Enter the exact review message `QA By The McMahon Standard`.
- Save `AE-REVIEW-001(1).png` before submission and `AE-REVIEW-001(2).png` after successful submission.
- Use Playwright web-first assertions and no hard-coded waits.
- Do not run the full automation suite.
- Do not use em dashes in new project content.

---

### Task 1: Write the product review journey first

**Files:**
- Create: `Automation Exercise Project/Automation/tests/ui/review-submission.spec.ts`
- Test: `Automation Exercise Project/Automation/tests/ui/review-submission.spec.ts`

**Interfaces:**
- Consumes: `ProductsPage.open()` and the shared `test` fixture.
- Produces: the desired `ProductsPage.openFirstProduct()`, `ProductDetailsPage.expectReviewForm()`, `fillReview()`, `captureEvidence()`, `submitReview()`, and `expectReviewSubmitted()` interfaces.

- [ ] **Step 1: Write the failing test**

```ts
import { ProductDetailsPage } from '../../pages/ProductDetailsPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { test } from './support/ui-test';

test('AE-REVIEW-001 | AEQA-113 | AEQA-124 | Visitor submits a product review', async ({ page }, testInfo) => {
  const productsPage = new ProductsPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  const uniqueValue = Date.now();
  const review = {
    name: `McMahon QA ${uniqueValue}`,
    email: `mcmahon.qa.${uniqueValue}@example.com`,
    message: 'QA By The McMahon Standard',
  };

  await productsPage.open();
  await productsPage.openFirstProduct();
  await productDetailsPage.expectReviewForm();
  await productDetailsPage.fillReview(review);
  const completedForm = await productDetailsPage.captureEvidence('AE-REVIEW-001(1).png');
  await testInfo.attach('AE-REVIEW-001(1) completed review form', { path: completedForm, contentType: 'image/png' });
  await productDetailsPage.submitReview();
  await productDetailsPage.expectReviewSubmitted();
  const confirmation = await productDetailsPage.captureEvidence('AE-REVIEW-001(2).png');
  await testInfo.attach('AE-REVIEW-001(2) review confirmation', { path: confirmation, contentType: 'image/png' });
});
```

- [ ] **Step 2: Run the focused test to verify RED**

Run:

```powershell
npx playwright test tests/ui/review-submission.spec.ts --project=chromium --workers=1
```

Expected: FAIL because `ProductDetailsPage` and the new page-object methods do not exist.

### Task 2: Implement reusable page-object behavior

**Files:**
- Create: `Automation Exercise Project/Automation/pages/ProductDetailsPage.ts`
- Modify: `Automation Exercise Project/Automation/pages/ProductsPage.ts`
- Test: `Automation Exercise Project/Automation/tests/ui/review-submission.spec.ts`

**Interfaces:**
- Consumes: Playwright `Page`, the existing `dismissAdOverlay()` helper, and the shared evidence folder.
- Produces: `openFirstProduct(): Promise<void>`, `expectReviewForm(): Promise<void>`, `fillReview(data): Promise<void>`, `submitReview(): Promise<void>`, `expectReviewSubmitted(): Promise<void>`, and `captureEvidence(fileName): Promise<string>`.

- [ ] **Step 1: Add minimal product-list navigation**

Add `ProductsPage.openFirstProduct()` using the first visible `/product_details/` link, then verify the product details URL.

- [ ] **Step 2: Add the Product Details page object**

Use stable form locators:

```ts
#name
#email
#review
#button-review
```

Assert the `Write Your Review` heading and exact `Thank you for your review.` confirmation. Scroll the review form or confirmation into view before each named screenshot so the evidence is readable.

- [ ] **Step 3: Run the focused test to verify GREEN**

Run:

```powershell
$env:QA_REPORT_OPEN='false'; npx playwright test tests/ui/review-submission.spec.ts --project=chromium --workers=1
```

Expected: `1 passed`, with both named screenshots attached.

- [ ] **Step 4: Verify headed compatibility**

List the test and provide this user command without running the whole suite:

```powershell
npx playwright test tests/ui/review-submission.spec.ts --project=chromium --workers=1 --headed
```

### Task 3: Document and verify the new coverage

**Files:**
- Modify: `Automation Exercise Project/Automation/README.md`
- Verify: `Automation Exercise Project/Automation/Execution Evidence/AE-REVIEW-001(1).png`
- Verify: `Automation Exercise Project/Automation/Execution Evidence/AE-REVIEW-001(2).png`
- Verify: `Automation Exercise Project/Automation/test-results/qa-analytics/run-summary.json`

**Interfaces:**
- Consumes: the focused test result and reporter output.
- Produces: current portfolio coverage documentation and reusable evidence.

- [ ] **Step 1: Update the automation README**

Increase the UI scenario count from 20 to 21. Add review coverage for `AE-REVIEW-001`, `AEQA-124`, `SRC-TC-21`, and `REQ-REVIEW-001`. Document the generated identity data, exact review message, and two named screenshots.

- [ ] **Step 2: Run focused verification**

Verify the test list contains exactly one matching test, both PNG files are nonempty, the latest run summary reports 1 passed and 0 failed, and `git diff --check` reports no formatting errors.

- [ ] **Step 3: Commit the implementation**

```powershell
git add -- "Automation Exercise Project/Automation/pages/ProductDetailsPage.ts" "Automation Exercise Project/Automation/pages/ProductsPage.ts" "Automation Exercise Project/Automation/tests/ui/review-submission.spec.ts" "Automation Exercise Project/Automation/README.md" "Automation Exercise Project/Automation/Execution Evidence/AE-REVIEW-001(1).png" "Automation Exercise Project/Automation/Execution Evidence/AE-REVIEW-001(2).png" "Automation Exercise Project/Automation/Execution Evidence/AE-REVIEW-001.png"
git commit -m "test: automate product review submission"
```
