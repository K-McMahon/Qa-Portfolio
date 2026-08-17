# Automation Exercise Playwright Tests

## Project Synopsis

This workstream adds browser and API automation to the Automation Exercise QA portfolio. The Playwright and TypeScript suite maps browser scenarios to the manual Test Case Repository, protects credentials through environment variables, captures final browser evidence, and produces both a branded QA analytics report and Playwright's technical HTML report.

## Current coverage

The suite currently implements **14 API scenarios** and **21 UI scenarios**.

| Area | Automated test IDs | Source coverage |
|---|---|---|
| Authentication | `AE-LOGIN-001` through `AE-LOGIN-004`, `AE-LOGOUT-001` | `SRC-TC-02`, `SRC-TC-03`, `SRC-TC-04` |
| Registration | `AE-SIGNUP-005`, `AE-SIGNUP-006` | `SRC-TC-01`, `SRC-TC-05` |
| Contact and navigation | `AE-CONTACT-001`, `AE-NAV-001` | `SRC-TC-06`, `SRC-TC-07` |
| Products and search | `AE-PRODUCT-001`, `AE-PRODUCT-002` | `SRC-TC-08`, `SRC-TC-09` |
| Catalog and brands | `AE-CATALOG-002` / Jira `AEQA-123` | `SRC-TC-19` / `REQ-CATALOG-002` |
| Product reviews | `AE-REVIEW-001` / Jira `AEQA-124` | `SRC-TC-21` / `REQ-REVIEW-001` |
| Subscription | `AE-SUB-001`, `AE-SUB-002` | `SRC-TC-10`, `SRC-TC-11` |
| Cart | `AE-CART-001` through `AE-CART-004` | `SRC-TC-12`, `SRC-TC-13`, `SRC-TC-17`, `SRC-TC-20 / AEQA-112` |
| Checkout address | `AE-ORDER-004` / Jira `AEQA-115` | `REQ-ORDER-004` / Jira `AEQA-23` |
| Security | `AE-LOGIN-002` | Tester-derived SQL injection coverage |
| API | `API-PRODUCT`, `API-BRAND`, `API-SEARCH`, `API-AUTH`, `API-ACCOUNT` suites | Automation Exercise API requirements |

`AE-CART-001` deliberately verifies the missing overall cart total so a recurrence of the documented defect appears as a failed automated regression test.

`AE-CART-004` expands the project's Page Object Model with reusable Products and Cart behavior plus reusable login actions. It enforces the manual test's empty-account-cart precondition, adds every visible result for `top`, compares product identity, name, price, quantity, and total after login, and publishes `AE-CART-004(1).png` and `AE-CART-004(2).png` in the shared run-level reports.

`AE-CATALOG-002` uses reusable `ProductsPage` behavior to verify the Brands panel, select Polo, confirm matching Polo results, switch to H&M, and confirm the heading and results update. It publishes `AE-CATALOG-002(1).png` and `AE-CATALOG-002(2).png` in both shared run-level reports.

`AE-REVIEW-001` expands the Page Object Model with reusable product-details and review-form behavior. Each run generates a synthetic name and email, enters the exact message `QA By The McMahon Standard`, submits the review, and verifies the success confirmation. It publishes `AE-REVIEW-001(1).png` and `AE-REVIEW-001(2).png` in both shared run-level reports.

## Latest Saved Report Run: August 17, 2026

The latest saved QA analytics run is **Passed** on Chromium: **1/1 passed, 0 failed, 0 skipped**. It is run `ae-20260817225729` and covers `AE-REVIEW-001 | AEQA-113 | AEQA-124 | Visitor submits a product review`.

This automated run is traceable to the completed manual case `AEQA-113`, the automation test `AEQA-124`, and requirement `AEQA-21`. Their execution records and evidence remain independently auditable.

## Report Evidence

The branded QA analytics report is stakeholder-facing: it presents the concise run outcome, coverage, traceability, and QA assessment.

![Branded QA analytics report](../Portfolio%20Evidence/Automation/QA-Analytics-Report-2026-08-17.png)

The Playwright technical HTML report supports engineering diagnostics, including traces, attachments, and failure investigation.

![Playwright technical HTML report](../Portfolio%20Evidence/Automation/Playwright-HTML-Report-2026-08-17.png)

## Commands

- `npm test` - run all browser and API tests in Chromium.
- `npm run test:headed` - run only the mapped UI tests while showing the browser.
- `npm run test:api` - run only the API automation suite.
- `npm run test:ui` - open Playwright UI Mode with the mapped UI suite.
- `npm run report` - open the latest branded QA analytics report.
- `npm run report:playwright` - open Playwright's technical report for traces and debugging.

Every normal local test run automatically opens the branded analytics page when execution finishes. Set `QA_REPORT_OPEN=false` before a run when automatic opening is not wanted. CI runs never open a browser window.

## Structure

- `tests/ui/` - Chromium UI tests mapped to the Test Case Repository.
- `tests/api/` - Playwright API tests mapped to the API documentation.
- `pages/` - reusable page objects introduced with the complete registration workflow.
- `data/` - reusable synthetic QA test-data factories.
- `tests/fixtures/` - harmless files used by controlled test scenarios.
- `Execution Evidence/` - one final browser screenshot per UI test and API evidence images.
- `Test Results/` - concise execution summaries suitable for GitHub.
- `reporting/` - the custom QA analytics reporter and local brand asset.
- `playwright.config.ts` - browser, evidence, and report configuration.
- `test-results/qa-analytics/` - the latest branded HTML report and JSON run summary.
- `test-results/html-report/` - Playwright's technical report.
- `test-results/artifacts/` - failure screenshots, video, and traces.

## QA analytics content

The branded report includes run identity, outcome, environment, base URL, browser project, timestamps, duration, pass rate, traceability coverage, status distribution, retries, flaky results, source locations, evidence links, failure details, a QA assessment, and recommended next actions. It contains no credentials.

## Credential handling

Credentials are loaded from a private `.env` file that is excluded from Git. 

## Evidence behavior

Every mapped UI test captures the final browser viewport during teardown, including failed tests. The custom reporter copies the latest image to `Execution Evidence/<test-id>.png`, links the test to the RTM and Test Case Repository, and links its evidence image directly from the branded report.

`AE-SIGNUP-006` uses the project's Page Object Model pattern to complete end-to-end registration with unique synthetic data, select both optional subscription choices, verify the authenticated state, preserve sanitized evidence, and delete the disposable account during cleanup.

`AE-ORDER-004` creates a disposable synthetic account, verifies that checkout delivery and billing addresses match its registration data, and deletes the account afterward. Its Jira-ready evidence bundle is written to `Execution Evidence/AE-ORDER-004.png`, `Execution Evidence/AE-ORDER-004-evidence.html`, and `Execution Evidence/AE-ORDER-004-evidence.pdf`. The branded HTML and PDF include `AEQA-23`, `REQ-ORDER-004`, `AEQA-115`, `AE-ORDER-004`, execution details, expected versus actual address data, assertion results, and the readable McMahon Standard logo. The same files are attached to the Playwright HTML report.
