# Cart Persistence Page Object Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Jira task `AEQA-122` as reusable Playwright test `AE-CART-004`, proving that all products found by searching for `top` remain unchanged in the cart after login and publishing pre-login and post-login screenshots in the shared reports.

**Architecture:** Expand the existing Page Object Model with focused Products and Cart page objects and reusable login behavior in the existing Signup/Login page object. Keep orchestration and cross-page assertions in one readable end-to-end spec, while a small reporting utility preserves every named screenshot attachment in the existing suite-level analytics report.

**Tech Stack:** TypeScript, Playwright Test, Node.js file APIs, existing `qa-analytics-reporter.ts`, existing shared UI fixture.

## Global Constraints

- Traceability is `AEQA-122` → `AEQA-112 / AE-CART-004` → `AEQA-20 / REQ-CART-004`.
- Search for the exact term `top` and add every visible result.
- Record and compare product identity, name, price, quantity, and total.
- Capture `AE-CART-004-pre-login.png` and `AE-CART-004-post-login.png`.
- Both named screenshots must appear in Playwright's HTML report and the branded analytics report.
- Continue producing one suite-level report for both focused and full-suite runs.
- Load credentials only from `AE_EMAIL`, `AE_PASSWORD`, and `AE_USERNAME`.
- Do not include passwords or private email values in titles, annotations, screenshots, or report data.
- Use web-first assertions and no hard-coded waits.
- Do not refactor unrelated tests or alter user-owned evidence files except when the focused live test intentionally refreshes `AE-CART-004` evidence.

---

## File Structure

- Create `Automation Exercise Project/Automation/pages/ProductsPage.ts` for product search and adding all visible results.
- Create `Automation Exercise Project/Automation/pages/CartPage.ts` for cart navigation, cart snapshots, normalization, and screenshots.
- Modify `Automation Exercise Project/Automation/pages/SignupLoginPage.ts` to add reusable login methods while retaining registration behavior.
- Create `Automation Exercise Project/Automation/tests/ui/cart-persistence.spec.ts` for the traced business workflow.
- Create `Automation Exercise Project/Automation/reporting/evidence-attachments.ts` for selecting and de-duplicating named PNG evidence.
- Create `Automation Exercise Project/Automation/tests/reporting/evidence-attachments.spec.ts` for reporting behavior.
- Modify `Automation Exercise Project/Automation/reporting/qa-analytics-reporter.ts` to retain all screenshot evidence.
- Modify `Automation Exercise Project/Automation/README.md` to record `AE-CART-004` coverage and its two screenshots.

---

### Task 1: Products, Cart, and Login Page Objects

**Files:**
- Create: `Automation Exercise Project/Automation/tests/ui/cart-persistence.spec.ts`
- Create: `Automation Exercise Project/Automation/pages/ProductsPage.ts`
- Create: `Automation Exercise Project/Automation/pages/CartPage.ts`
- Modify: `Automation Exercise Project/Automation/pages/SignupLoginPage.ts`

**Interfaces:**
- Consumes: `test`, `expect`, `dismissAdOverlay`, and `getLoginCredentials()` from `tests/ui/support/ui-test.ts`.
- Produces: `ProductsPage.open(): Promise<void>`.
- Produces: `ProductsPage.search(term: string): Promise<void>`.
- Produces: `ProductsPage.addAllVisibleResultsToCart(): Promise<number>`.
- Produces: `CartItem` with `id`, `name`, `price`, `quantity`, and `total` string properties.
- Produces: `CartPage.open(): Promise<void>`.
- Produces: `CartPage.snapshot(): Promise<CartItem[]>` sorted by `id`.
- Produces: `CartPage.captureEvidence(fileName: string): Promise<string>` returning the absolute screenshot path.
- Produces: `SignupLoginPage.expectLoginReady(): Promise<void>`.
- Produces: `SignupLoginPage.login(email: string, password: string): Promise<void>`.

- [ ] **Step 1: Write the failing end-to-end test**

Create `tests/ui/cart-persistence.spec.ts` with the required modules and workflow before the new page-object modules exist:

```ts
import { resolve } from 'node:path';
import { CartPage } from '../../pages/CartPage';
import { HomePage } from '../../pages/HomePage';
import { ProductsPage } from '../../pages/ProductsPage';
import { SignupLoginPage } from '../../pages/SignupLoginPage';
import { expect, getLoginCredentials, test } from './support/ui-test';

test('AE-CART-004 | AEQA-112 | Search products remain in cart after login', async ({ page }, testInfo) => {
  const { email, password, username } = getLoginCredentials();
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const signupLoginPage = new SignupLoginPage(page);
  let preLoginCart = [];

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
    const path = await cartPage.captureEvidence('AE-CART-004-pre-login.png');
    await testInfo.attach('pre-login filled cart', { path, contentType: 'image/png' });
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
    const path = await cartPage.captureEvidence('AE-CART-004-post-login.png');
    await testInfo.attach('post-login retained cart', { path, contentType: 'image/png' });
  });
});
```

Use `CartItem[]` for `preLoginCart` after the interface is available. Do not add alternate login data or fallback credentials.

- [ ] **Step 2: Run discovery to verify RED**

Run:

```powershell
npx playwright test tests/ui/cart-persistence.spec.ts --list
```

Expected: discovery fails because `ProductsPage` and `CartPage` do not exist.

- [ ] **Step 3: Implement the minimum Products page object**

Create `pages/ProductsPage.ts`:

```ts
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
      await cards.nth(index).locator('a.add-to-cart:visible').first().click();
      const modal = this.page.locator('#cartModal');
      await expect(modal).toHaveClass(/show/);
      await modal.getByRole('button', { name: 'Continue Shopping' }).click();
      await expect(modal).not.toHaveClass(/show/);
    }

    return count;
  }
}
```

- [ ] **Step 4: Implement the minimum Cart page object**

Create `pages/CartPage.ts`:

```ts
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { expect, type Page } from '@playwright/test';
import { dismissAdOverlay } from '../tests/ui/support/ui-test';

export type CartItem = {
  id: string;
  name: string;
  price: string;
  quantity: string;
  total: string;
};

export class CartPage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/view_cart', { waitUntil: 'domcontentloaded' });
    await dismissAdOverlay(this.page);
    await expect(this.page).toHaveURL(/\/view_cart$/);
    await expect(this.page.locator('#cart_info_table')).toBeVisible();
  }

  async snapshot(): Promise<CartItem[]> {
    const rows = this.page.locator('#cart_info_table tbody tr[id^="product-"]');
    const items = await rows.evaluateAll((cartRows) =>
      cartRows.map((row) => ({
        id: row.id.replace(/^product-/, '').trim(),
        name: row.querySelector('.cart_description h4 a')?.textContent?.trim() ?? '',
        price: row.querySelector('.cart_price p')?.textContent?.trim() ?? '',
        quantity: row.querySelector('.cart_quantity button')?.textContent?.trim() ?? '',
        total: row.querySelector('.cart_total p')?.textContent?.trim() ?? '',
      }))
    );

    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.id).not.toBe('');
      expect(item.name).not.toBe('');
      expect(item.price).not.toBe('');
      expect(item.quantity).not.toBe('');
      expect(item.total).not.toBe('');
    }
    return items.sort((left, right) => left.id.localeCompare(right.id, undefined, { numeric: true }));
  }

  async captureEvidence(fileName: string) {
    const path = resolve(process.cwd(), 'Execution Evidence', fileName);
    await mkdir(dirname(path), { recursive: true });
    await this.page.screenshot({ path, fullPage: true });
    return path;
  }
}
```

- [ ] **Step 5: Extend the existing Signup/Login page object**

Add these methods to `SignupLoginPage` without changing `expectReady()` or `beginRegistration()`:

```ts
async expectLoginReady() {
  await expect(this.page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
}

async login(email: string, password: string) {
  await this.page.locator('[data-qa="login-email"]').fill(email);
  await this.page.locator('[data-qa="login-password"]').fill(password);
  await this.page.locator('[data-qa="login-button"]').click();
}
```

- [ ] **Step 6: Correct the test type and verify discovery is GREEN**

Import `type CartItem` and declare `let preLoginCart: CartItem[] = [];`, then run:

```powershell
npx playwright test tests/ui/cart-persistence.spec.ts --list
```

Expected: exactly one Chromium test is discovered with ID `AE-CART-004` and no TypeScript import error.

- [ ] **Step 7: Run the focused live test**

Run without automatically opening the report during development:

```powershell
$env:QA_REPORT_OPEN='false'; npx playwright test tests/ui/cart-persistence.spec.ts
```

Expected: one passed test; both named screenshots exist; the post-login cart equals the pre-login cart. If the external site exposes a genuine product or persistence failure, retain the evidence and report the actual failure instead of weakening the assertions.

- [ ] **Step 8: Refactor while green and commit**

Remove only duplication introduced in this task, re-run the focused test, then commit:

```powershell
git add -- 'Automation Exercise Project/Automation/pages/ProductsPage.ts' 'Automation Exercise Project/Automation/pages/CartPage.ts' 'Automation Exercise Project/Automation/pages/SignupLoginPage.ts' 'Automation Exercise Project/Automation/tests/ui/cart-persistence.spec.ts'
git commit -m "test: automate cart persistence with page objects"
```

---

### Task 2: Preserve Multiple Screenshots in the Shared Analytics Report

**Files:**
- Create: `Automation Exercise Project/Automation/tests/reporting/evidence-attachments.spec.ts`
- Create: `Automation Exercise Project/Automation/reporting/evidence-attachments.ts`
- Modify: `Automation Exercise Project/Automation/reporting/qa-analytics-reporter.ts`

**Interfaces:**
- Consumes: reporter attachments shaped as `{ name: string; path?: string; contentType: string }`.
- Produces: `EvidenceAttachment` with `name`, `path`, `contentType`, and `href`.
- Produces: `collectEvidenceAttachments(attachments, reportDir, canonicalEvidence?): EvidenceAttachment[]`.
- The reporter consumes the returned array as its `attachments` field and renders every entry in the Evidence column.

- [ ] **Step 1: Write the failing evidence-selection test**

Create `tests/reporting/evidence-attachments.spec.ts`:

```ts
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import { collectEvidenceAttachments } from '../../reporting/evidence-attachments';

test('keeps both named screenshots and removes duplicate screenshot paths', () => {
  const reportDir = resolve('test-results', 'qa-analytics');
  const pre = resolve('Execution Evidence', 'AE-CART-004-pre-login.png');
  const post = resolve('Execution Evidence', 'AE-CART-004-post-login.png');
  const attachments = [
    { name: 'pre-login filled cart', path: pre, contentType: 'image/png' },
    { name: 'post-login retained cart', path: post, contentType: 'image/png' },
    { name: 'duplicate post-login', path: post, contentType: 'image/png' },
    { name: 'trace', path: resolve('test-results', 'trace.zip'), contentType: 'application/zip' },
  ];

  const evidence = collectEvidenceAttachments(attachments, reportDir);

  expect(evidence.map((item) => item.name)).toEqual([
    'pre-login filled cart',
    'post-login retained cart',
  ]);
  expect(evidence.every((item) => item.href.length > 0)).toBeTruthy();
});
```

- [ ] **Step 2: Run the focused test to verify RED**

Run:

```powershell
npx playwright test tests/reporting/evidence-attachments.spec.ts
```

Expected: discovery fails because `reporting/evidence-attachments.ts` does not exist.

- [ ] **Step 3: Implement the minimum evidence collector**

Create `reporting/evidence-attachments.ts` with path-based de-duplication, PNG filtering, and report-relative links:

```ts
import { relative, resolve } from 'node:path';

type ReporterAttachment = { name: string; path?: string; contentType: string };

export type EvidenceAttachment = {
  name: string;
  path: string;
  contentType: string;
  href: string;
};

export function collectEvidenceAttachments(
  attachments: ReporterAttachment[],
  reportDir: string,
  canonicalEvidence?: ReporterAttachment
): EvidenceAttachment[] {
  const candidates = canonicalEvidence ? [...attachments, canonicalEvidence] : attachments;
  const seen = new Set<string>();

  return candidates.flatMap((attachment) => {
    if (!attachment.path || attachment.contentType !== 'image/png') return [];
    const absolutePath = resolve(attachment.path);
    if (seen.has(absolutePath)) return [];
    seen.add(absolutePath);
    return [{
      name: attachment.name,
      path: absolutePath,
      contentType: attachment.contentType,
      href: encodeURI(relative(reportDir, absolutePath).replace(/\\/g, '/')),
    }];
  });
}
```

- [ ] **Step 4: Run the focused test to verify GREEN**

Run:

```powershell
npx playwright test tests/reporting/evidence-attachments.spec.ts
```

Expected: one passing test.

- [ ] **Step 5: Integrate the collector into the reporter**

Import `collectEvidenceAttachments` into `qa-analytics-reporter.ts`. Preserve the existing copy to `Execution Evidence/<test-id>.png`, then replace the single-evidence substitution with:

```ts
const evidenceAttachments = collectEvidenceAttachments(
  record.attempts.flatMap((attempt) => attempt.attachments),
  this.reportDir,
  existsSync(evidencePath)
    ? {
        name: `${record.testId} final browser evidence`,
        path: evidencePath,
        contentType: 'image/png',
      }
    : undefined
);
```

Return `attachments: evidenceAttachments.length ? evidenceAttachments : attachments`. In the Evidence table cell, render every attachment as its own link using the attachment's descriptive name instead of rendering only the last screenshot.

- [ ] **Step 6: Verify the reporting tests**

Run:

```powershell
npx playwright test tests/reporting
```

Expected: all reporting tests pass, including the two-screenshot characterization.

- [ ] **Step 7: Run AE-CART-004 and inspect report content**

Run:

```powershell
$env:QA_REPORT_OPEN='false'; npx playwright test tests/ui/cart-persistence.spec.ts
```

Then verify `test-results/qa-analytics/index.html` contains:

- `AE-CART-004`
- `pre-login filled cart`
- `post-login retained cart`
- no value equal to `AE_PASSWORD`
- links to both named PNG files

Also confirm `test-results/html-report/index.html` exists and both screenshots are attached to the Playwright result.

- [ ] **Step 8: Commit the reporting support**

```powershell
git add -- 'Automation Exercise Project/Automation/reporting/evidence-attachments.ts' 'Automation Exercise Project/Automation/reporting/qa-analytics-reporter.ts' 'Automation Exercise Project/Automation/tests/reporting/evidence-attachments.spec.ts'
git commit -m "test: report multiple cart evidence screenshots"
```

---

### Task 3: Portfolio Documentation and Final Verification

**Files:**
- Modify: `Automation Exercise Project/Automation/README.md`
- Verify: `Automation Exercise Project/Automation/Execution Evidence/AE-CART-004-pre-login.png`
- Verify: `Automation Exercise Project/Automation/Execution Evidence/AE-CART-004-post-login.png`
- Verify: `Automation Exercise Project/Automation/test-results/qa-analytics/index.html`
- Verify: `Automation Exercise Project/Automation/test-results/html-report/index.html`

**Interfaces:**
- Consumes: the implemented `AE-CART-004` test and both report outputs.
- Produces: documented terminal commands and portfolio traceability for future local and CI execution.

- [ ] **Step 1: Update README coverage**

Change the Cart coverage row to include `AE-CART-001` through `AE-CART-004` and source coverage through `SRC-TC-20` or the Jira manual-case reference used by this repository. Add one evidence paragraph stating that `AE-CART-004` uses Products, Cart, and Signup/Login page objects and produces named pre-login and post-login screenshots in the shared run-level report.

- [ ] **Step 2: Verify static suite discovery**

Run:

```powershell
npm test -- --list
```

Expected: the previous suite plus exactly one `AE-CART-004` Chromium test is discovered with no configuration or import errors.

- [ ] **Step 3: Run focused structural and reporting tests**

Run:

```powershell
npx playwright test tests/reporting
```

Expected: all reporting tests pass with zero failures.

- [ ] **Step 4: Run the focused live browser test with automatic opening disabled**

Run:

```powershell
$env:QA_REPORT_OPEN='false'; npx playwright test tests/ui/cart-persistence.spec.ts
```

Expected: one passed test and both required screenshot files exist. Read the output rather than inferring success from generated files.

- [ ] **Step 5: Verify report and credential safety**

Inspect both report files and confirm the branded report contains one `AE-CART-004` result, links both named screenshots, and does not contain the configured password or email. Confirm the Playwright HTML report contains both attachment names.

- [ ] **Step 6: Run the broadest safe regression verification**

Run:

```powershell
$env:QA_REPORT_OPEN='false'; npm test
```

Expected: all locally runnable tests pass. If the external practice site causes an unrelated failure, preserve the exact result and distinguish it from the focused test outcome.

- [ ] **Step 7: Check repository hygiene**

Run:

```powershell
git diff --check
git status --short
```

Confirm no `.env`, credentials, transient `test-results`, or unrelated user-owned screenshots are staged. Do not revert or overwrite pre-existing modified evidence files.

- [ ] **Step 8: Commit documentation**

```powershell
git add -- 'Automation Exercise Project/Automation/README.md'
git commit -m "docs: record cart persistence automation coverage"
```

- [ ] **Step 9: Provide the user's VS Code command**

After fresh verification passes, provide:

```powershell
cd 'C:\Users\kgmcm\OneDrive\Desktop\QA Portfolio\Qa-Portfolio\Automation Exercise Project\Automation'
npx playwright test tests/ui/cart-persistence.spec.ts --headed
```

Explain that the branded report opens automatically after the run when `QA_REPORT_OPEN` is unset. Also provide `npm run report:playwright` for the technical report and `npm run report` for reopening the branded report.

## Plan Self-Review

- Every scope, architecture, screenshot, reporting, credential-safety, and verification requirement from the design maps to a task.
- `CartItem`, `ProductsPage`, `CartPage`, `SignupLoginPage`, and `collectEvidenceAttachments` signatures remain consistent across tasks.
- Each production change follows a failing-test or failing-discovery step before implementation.
- The plan contains no deferred implementation placeholders.
- Existing user-owned evidence modifications remain outside all staged file lists.
