# Cart Persistence Page Object Model Design

## Objective

Implement Jira subtask `AEQA-122` as Playwright test `AE-CART-004`, covering the search-and-cart-persistence workflow defined by `AEQA-112` for `AEQA-20 / REQ-CART-004`. The test will use reusable page objects and will include distinct pre-login and post-login cart evidence in the existing run-level HTML reports.

## Traceability

- Automation task: `AEQA-122`
- Manual test case: `AEQA-112 / AE-CART-004`
- Requirement: `AEQA-20 / REQ-CART-004`
- Search term: `top`
- Environment: QA at `automationexercise.com`

## Scope

The automated test will:

1. Start in a fresh, logged-out browser context with an empty cart.
2. Open Products and search for `top`.
3. Verify that one or more visible search results are displayed.
4. Add every visible search result to the cart.
5. Open the cart and record each product's name, price, quantity, and total.
6. Capture and attach a pre-login screenshot of the filled cart.
7. Log in with the dedicated QA credentials loaded from the private environment configuration.
8. Return to the cart.
9. Verify the authenticated user indicator.
10. Compare the post-login cart against the complete pre-login cart record.
11. Capture and attach a post-login screenshot showing the retained cart and authenticated state.
12. Publish the result and both screenshots through the existing branded analytics report and Playwright HTML report.

The implementation will not introduce GitHub Actions, convert unrelated tests to page objects, store credentials in source control, or update Jira execution-result fields before a verified run.

## Architecture

The recommended design uses focused page objects rather than one large workflow object or additional procedural helpers. Each page object owns the locators and operations for one application area. The test owns the cross-page business flow and traceability.

### `pages/ProductsPage.ts`

- Opens the Products page through the configured base URL.
- Searches for a supplied product term.
- Verifies that Searched Products is displayed.
- Reads the visible search result count.
- Adds every visible search result to the cart while handling the site's cart confirmation modal.
- Uses the existing advertisement-handling behavior rather than duplicating it.

### `pages/CartPage.ts`

- Opens the cart and verifies the cart table is visible.
- Reads every cart row into a reusable `CartItem` value containing product identity, name, price, quantity, and total.
- Verifies that the cart contains the expected number of items.
- Compares cart values with Playwright assertions in the test without relying on row order alone.
- Captures named pre-login and post-login screenshots through a small reusable evidence method.

### `pages/SignupLoginPage.ts`

- Retains the existing registration interface.
- Adds focused login readiness and login submission methods.
- Accepts credentials from the caller and never stores them as class properties or report data.

### `pages/HomePage.ts`

- Retains the existing home and registration behavior.
- Adds reusable cart and product navigation only if that avoids duplicating stable site navigation.
- Verifies the logged-in user indicator after authentication.

### `tests/ui/cart-persistence.spec.ts`

- Uses test title `AE-CART-004 | AEQA-112 | Search products remain in cart after login`.
- Loads `AE_EMAIL`, `AE_PASSWORD`, and `AE_USERNAME` through the existing credential helper.
- Orchestrates search, add-to-cart, pre-login recording, login, and post-login comparison.
- Captures `AE-CART-004-pre-login.png` and `AE-CART-004-post-login.png` and attaches both to the test result.
- Uses `test.step` to make the report readable.
- Uses web-first assertions and no hard-coded waits.

## Cart Comparison

Each cart row will be normalized into a plain value with trimmed text fields. Product identity will come from the stable product link or row identifier. The test will record the complete pre-login array and compare it with the complete post-login array after sorting both arrays by product identity. This proves that names, prices, quantities, and totals remain unchanged without assuming the site always renders rows in the same order.

The test will also assert that the pre-login array is non-empty and that its size matches the number of visible search results added to the cart.

## Screenshot Evidence

The two required screenshots serve different purposes:

- `AE-CART-004-pre-login.png` proves the searched products were present before authentication.
- `AE-CART-004-post-login.png` proves the authenticated user retained the same cart contents.

Both images will be attached explicitly with descriptive attachment names. The shared fixture may continue to create the canonical final `AE-CART-004.png` evidence image for compatibility with the existing portfolio structure.

The screenshots must not display the login form, password, or private email value. The post-login screenshot may display the configured QA username because the authenticated-state assertion requires it.

## Shared HTML Reporting

The existing `qa-analytics-reporter.ts` remains the single suite-level branded report. It will be enhanced only as needed to retain and render all named screenshot attachments for a test instead of collapsing the evidence display to one image.

- A one-test run will produce and open a one-result analytics report containing both screenshots.
- A full-suite run will produce and open one combined analytics report containing this test alongside the rest of the suite.
- Playwright's technical HTML report will retain both attachments for debugging.
- CI will continue suppressing automatic report opening.
- No per-test HTML report generator will be introduced.

Reporter behavior will be protected by a focused characterization test before modification.

## Error Handling

- Stable role, `data-qa`, and product-data locators will be preferred.
- Advertisement interception and cleanup will reuse the existing shared fixture behavior.
- Cart modal state will be asserted before continuing to the next result.
- Missing credentials will fail immediately with the existing safe configuration message.
- Screenshot paths will be created before capture.
- Assertions will identify which cart item or field changed when persistence fails.
- No credential values will appear in test titles, annotations, attachments, or generated report data.

## Test-Driven Implementation

Implementation will follow red-green-refactor:

1. Add a focused test for cart-item normalization and comparison interfaces and verify that it fails because those interfaces do not exist.
2. Implement the minimum reusable cart value behavior and verify that the focused test passes.
3. Add the end-to-end spec and verify discovery fails because the new page objects do not exist.
4. Implement the minimum Products and Cart page objects and extend the login page object.
5. Verify test discovery, then run `AE-CART-004` against the QA site.
6. Add a reporter characterization test that demonstrates multiple screenshot attachments are not represented correctly.
7. Make the minimum reporter change and verify the characterization test passes.
8. Re-run the focused live test and inspect both reports and screenshot files.
9. Run full-suite discovery and the broadest safe regression checks.

## Success Criteria

- Searching for `top` returns at least one visible product.
- Every visible result is added to the cart.
- Pre-login cart names, prices, quantities, and totals are recorded and visible in evidence.
- Login succeeds using private environment credentials.
- Post-login cart names, prices, quantities, and totals exactly match the pre-login values.
- Both required screenshots are attached to the Playwright result and linked from the branded report.
- The shared report works for both a one-test run and a full-suite run.
- The new page objects are reusable by future product, cart, login, and checkout tests.
- Existing test behavior and user-owned evidence files remain intact.
