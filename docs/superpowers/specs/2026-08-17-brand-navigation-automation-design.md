# Brand Navigation Automation Design

## Objective

Implement Playwright automation for `AEQA-19 / REQ-CATALOG-002` and its automation sub-task `AEQA-123`, using the existing Page Object Model and shared run-level reporting workflow.

## Traceability

- Requirement: `AEQA-19 / REQ-CATALOG-002 - View & Cart Brand Products`
- Manual Test Case: `AEQA-111 / AE-CATALOG-002`
- Automation sub-task: `AEQA-123 / Automate brand-based product navigation in Playwright`
- Official source: Automation Exercise Test Case 19
- Environment: `QA | https://automationexercise.com`

## Acceptance Criteria

1. The Automation Exercise Products page opens successfully.
2. The Brands navigation panel is visible and contains selectable brand links.
3. Selecting `Polo` navigates to the Polo brand-products page.
4. The heading identifies `Brand - Polo Products`, and at least one product result is visible.
5. Evidence is saved and attached to the run as `AE-CATALOG-002(1).png`.
6. Selecting `H&M` from the Brands panel navigates to the H&M brand-products page.
7. The heading identifies `Brand - H&M Products`, and at least one product result is visible.
8. Evidence is saved and attached to the run as `AE-CATALOG-002(2).png`.
9. The test uses reusable `ProductsPage` methods, stable locators, and web-first assertions without hard-coded waits.
10. The test is reported by both the branded QA analytics report and Playwright HTML report.

## Architecture

Extend `pages/ProductsPage.ts` with focused brand-navigation behavior:

- verify the Brands panel is ready;
- select a named brand through its brand URL;
- verify the selected brand heading and visible results;
- save a named evidence screenshot through the existing `Execution Evidence` convention.

Add a single `tests/ui/brand-navigation.spec.ts` workflow that coordinates those reusable methods through two explicit `test.step` blocks. The test will attach both named screenshots so the current reporter keeps both instead of substituting the generic teardown image.

## Error Handling

- Fail clearly when the Brands panel is absent.
- Fail when a named brand link is missing or navigation does not reach `/brand_products/<brand>`.
- Fail when the expected brand heading is absent.
- Fail when the selected brand page has no visible product cards.
- Continue using the project-wide ad-overlay cleanup before interactions.

## Verification

Follow a red-green cycle for the new `ProductsPage` interface and focused spec. Run only the new brand-navigation test during implementation, then run the reporting helper test and a Playwright test-list check. Preserve the final full user-facing execution command for the user’s VS Code terminal.
