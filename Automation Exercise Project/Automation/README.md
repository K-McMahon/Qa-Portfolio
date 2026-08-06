# Automation Exercise Playwright Tests

## Project Synopsis

This workstream adds browser and API automation to the Automation Exercise QA portfolio. The Playwright and TypeScript suite maps browser scenarios to the manual Test Case Repository, protects credentials through environment variables, captures final browser evidence, and produces both a branded QA analytics report and Playwright's technical HTML report.

## Current coverage

| Area | Automated test IDs | Source coverage |
|---|---|---|
| Authentication | `AE-LOGIN-001` through `AE-LOGIN-004`, `AE-LOGOUT-001` | `SRC-TC-02`, `SRC-TC-03`, `SRC-TC-04` |
| Registration validation | `AE-SIGNUP-005` | `SRC-TC-05` |
| Contact and navigation | `AE-CONTACT-001`, `AE-NAV-001` | `SRC-TC-06`, `SRC-TC-07` |
| Products and search | `AE-PRODUCT-001`, `AE-PRODUCT-002` | `SRC-TC-08`, `SRC-TC-09` |
| Subscription | `AE-SUB-001`, `AE-SUB-002` | `SRC-TC-10`, `SRC-TC-11` |
| Cart | `AE-CART-001` through `AE-CART-003` | `SRC-TC-12`, `SRC-TC-13`, `SRC-TC-17` |
| Security | `AE-LOGIN-002` | Tester-derived SQL injection coverage |
| API | `API-PRODUCT`, `API-BRAND`, `API-SEARCH`, `API-AUTH`, `API-ACCOUNT` suites | Automation Exercise API requirements |

`AE-CART-001` deliberately verifies the missing overall cart total so a recurrence of the documented defect appears as a failed automated regression test.

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
