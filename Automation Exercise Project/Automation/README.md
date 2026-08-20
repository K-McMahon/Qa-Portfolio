# Automation Exercise Playwright Tests

## Project Synopsis

This workstream adds browser and API automation to the Automation Exercise QA portfolio. The Playwright and TypeScript suite maps browser scenarios to the manual Test Case Repository, protects credentials through environment variables, captures final browser evidence, and produces both a branded QA analytics report and Playwright's technical HTML report.

## Current coverage

The suite currently implements **14 API scenarios** and **24 UI scenarios**.

| Area | Automated test IDs | Source coverage |
|---|---|---|
| Authentication | `AE-LOGIN-001` through `AE-LOGIN-004`, `AE-LOGOUT-001` | `SRC-TC-02`, `SRC-TC-03`, `SRC-TC-04` |
| Registration | `AE-SIGNUP-005`, `AE-SIGNUP-006` | `SRC-TC-01`, `SRC-TC-05` |
| Contact and navigation | `AE-CONTACT-001`, `AE-NAV-001` | `SRC-TC-06`, `SRC-TC-07` |
| Products and search | `AE-PRODUCT-001`, `AE-PRODUCT-002` | `SRC-TC-08`, `SRC-TC-09` |
| Catalog and brands | `AE-CATALOG-002` / Jira `AEQA-123` | `SRC-TC-19` / `REQ-CATALOG-002` |
| Product reviews | `AE-REVIEW-001` / Jira `AEQA-124` | `SRC-TC-21` / `REQ-REVIEW-001` |
| Subscription | `AE-SUB-001`, `AE-SUB-002` | `SRC-TC-10`, `SRC-TC-11` |
| Cart | `AE-CART-001` through `AE-CART-004`; `AE-AUTO-CART-005 / AEQA-125` | `SRC-TC-12`, `SRC-TC-13`, `SRC-TC-17`, `SRC-TC-20`, `SRC-TC-22` |
| Checkout address | `AE-ORDER-004` / Jira `AEQA-115` | `REQ-ORDER-004` / Jira `AEQA-23` |
| Checkout invoice | `AE-AUTO-ORDER-005` / Jira `AEQA-126` | `SRC-TC-24` / `REQ-ORDER-005` |
| Scroll navigation | `AE-AUTO-NAV-002` / Jira `AEQA-127` | `SRC-TC-25` / `REQ-NAV-002` |
| Security | `AE-LOGIN-002` | Tester-derived SQL injection coverage |
| API | `API-PRODUCT`, `API-BRAND`, `API-SEARCH`, `API-AUTH`, `API-ACCOUNT` suites | Automation Exercise API requirements |

`AE-CART-001` deliberately verifies the missing overall cart total so a recurrence of the documented defect appears as a failed automated regression test.

`AE-CART-004` expands the project's Page Object Model with reusable Products and Cart behavior plus reusable login actions. It enforces the manual test's empty-account-cart precondition, adds every visible result for `top`, compares product identity, name, price, quantity, and total after login, and publishes `AE-CART-004(1).png` and `AE-CART-004(2).png` in the shared run-level reports.

`AE-CATALOG-002` uses reusable `ProductsPage` behavior to verify the Brands panel, select Polo, confirm matching Polo results, switch to H&M, and confirm the heading and results update. It publishes `AE-CATALOG-002(1).png` and `AE-CATALOG-002(2).png` in both shared run-level reports.

`AE-REVIEW-001` expands the Page Object Model with reusable product-details and review-form behavior. Each run generates a synthetic name and email, enters the exact message `QA By The McMahon Standard`, submits the review, and verifies the success confirmation. It publishes `AE-REVIEW-001(1).png` and `AE-REVIEW-001(2).png` in both shared run-level reports.

## Latest Saved Report Run: August 17, 2026

The latest saved QA analytics run is **Passed** on Chromium: **1/1 passed, 0 failed, 0 skipped**. It is run `ae-20260818014448` and covers `AE-AUTO-NAV-002 | AEQA-127 | Scroll down and return with the arrow`.

This automated run is traceable to the completed manual case `AEQA-117`, automation test `AEQA-127`, and requirement `AEQA-25`. The screenshot and short video remain independently auditable.

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

## GitHub Actions operation

The repository runs the full Playwright regression suite in GitHub Actions. This is the operating model for the portfolio, not proof that a hosted run has already passed. A maintainer must add the required repository secrets, then use **Actions > Playwright QA regression > Run workflow** to perform the first manual verification.

### Repository secrets

Add these twelve runtime values as encrypted GitHub repository secrets. Use the same names in a private local `.env` file when a local run needs them. Never commit a `.env` file or a secret value.

| Group | Secret | Purpose |
| --- | --- | --- |
| Existing account | `AE_EMAIL` | Email address for the saved test account. |
| Existing account | `AE_PASSWORD` | Password for the saved test account. |
| Existing account | `AE_USERNAME` | Expected displayed name for the saved test account. |
| Payment test data | `AE_CARD_NAME` | Fictional cardholder name. |
| Payment test data | `AE_CARD_NUMBER` | Fictional payment-card number. |
| Payment test data | `AE_CARD_CVC` | Fictional card verification code. |
| Payment test data | `AE_CARD_EXPIRY_MONTH` | Fictional expiry month. |
| Payment test data | `AE_CARD_EXPIRY_YEAR` | Fictional expiry year. |
| Jira ledger | `JIRA_BASE_URL` | HTTPS Jira Cloud site URL. |
| Jira ledger | `JIRA_EMAIL` | Jira account used to post the run comment. |
| Jira ledger | `JIRA_API_TOKEN` | Jira API token for that account. |
| Jira ledger | `JIRA_CI_ISSUE_KEY` | Existing Jira issue that holds the regression history. |

### Public repository variables

The monthly summary uses two non-sensitive repository variables only to build public review links. Configure `JIRA_BASE_URL` with the root HTTPS Jira Cloud URL and `JIRA_CI_ISSUE_KEY` with the existing ledger issue key. These public variables are separate from the twelve encrypted runtime secrets. The trusted regression Jira job still reads its four `JIRA_*` values from encrypted secrets, while the monthly workflow never reads secret-derived Jira configuration.

| Variable | Purpose |
| --- | --- |
| `JIRA_BASE_URL` | Public Jira Cloud base URL used in the monthly Markdown link. |
| `JIRA_CI_ISSUE_KEY` | Public Jira issue key used in the monthly Markdown link. |

The five payment values are fictional test data only. Tests that create disposable accounts use unique generated `example.com` addresses and clean up those created accounts. Tests using the saved `AE_*` account never delete that persistent account.

### When the workflows run

- The nightly regression is scheduled for 2:17 AM Eastern time every day.
- A push to `main` or a pull request targeting `main` runs the regression when the workflow file or files under `Automation Exercise Project/Automation/` change.
- The generated monthly-summary path, `Automation Exercise Project/Portfolio Evidence/GitHub Actions/Monthly/**`, is deliberately excluded from these regression triggers so publishing a summary does not create another regression run.
- A maintainer can run the regression manually with **Run workflow**. Manual runs are trusted runs and require the configured secrets.
- Pull requests run without repository secrets. Existing-account and payment-dependent tests skip when their required values are unavailable, protecting secrets from untrusted pull-request code.

GitHub may disable scheduled workflows in a public repository after 60 days with no repository activity. If this occurs, a maintainer must first re-enable the workflow through the GitHub Actions UI, the `gh workflow enable` CLI command, or the GitHub Actions API. After re-enabling it, use **Run workflow** to verify manual execution and then confirm the next scheduled run.

### Evidence and Jira follow-up

Every regression run uploads the Playwright HTML report, QA analytics report, traces, videos, screenshots, execution evidence, and concise test results as the `qa-regression-evidence` artifact. This regression evidence is retained for 30 days.

Trusted scheduled, manual, and `main` push runs add one allowlisted summary comment to the single Jira issue identified by `JIRA_CI_ISSUE_KEY`. The comment is a one-ticket ledger for result counts, event, branch, short commit identifier, and a GitHub Actions link. It does not include credentials, raw logs, or full analytics data. The automation never creates Jira Bug issues. Review the GitHub artifact first, then decide whether defect triage or a Bug is warranted.

The monthly workflow runs at 2:47 AM Eastern on the first day of the month. It creates one Markdown summary for the previous Eastern calendar month at `Portfolio Evidence/GitHub Actions/Monthly/YYYY-MM.md`. The summary reconciles every scheduled run as successful, failed, cancelled, or other, includes sanitized links for runs that need review, and shows aggregate test counts only when every included run has complete structured counts.

The monthly workflow uploads its Markdown file as a 90-day fallback artifact before it attempts to commit the same file. If branch protection blocks the bot's push, the workflow fails visibly and the fallback artifact remains available for review. Only the monthly commit job receives write permission; regression jobs remain read-only.

### Local checks and hosted acceptance

Run these safe checks from this directory before changing workflow documentation or helpers:

```powershell
npm run test:ci-helpers
npx playwright test tests/reporting --project=chromium
npx playwright test --list
```

The first two commands validate deterministic helpers and reporting tests. The list command confirms the full suite is discovered without executing the network-dependent browser and API tests. This workstation has recorded external baseline issues: an untrusted target certificate for API calls, the deliberately documented missing overall-cart-total defect, and an external test-cases-page timeout. Treat those as baseline constraints, not evidence of a successful hosted regression.

Do not claim that the nightly workflow or Jira integration works until a maintainer completes a manual GitHub Actions run with configured repository secrets and reviews its artifacts and Jira ledger comment.

## Evidence behavior

Every mapped UI test captures the final browser viewport during teardown, including failed tests. The custom reporter copies the latest image to `Execution Evidence/<test-id>.png`, links the test to the RTM and Test Case Repository, and links its evidence image directly from the branded report.

`AE-SIGNUP-006` uses the project's Page Object Model pattern to complete end-to-end registration with unique synthetic data, select both optional subscription choices, verify the authenticated state, preserve sanitized evidence, and delete the disposable account during cleanup.

`AE-ORDER-004` creates a disposable synthetic account, verifies that checkout delivery and billing addresses match its registration data, and deletes the account afterward. Its Jira-ready evidence bundle is written to `Execution Evidence/AE-ORDER-004.png`, `Execution Evidence/AE-ORDER-004-evidence.html`, and `Execution Evidence/AE-ORDER-004-evidence.pdf`. The branded HTML and PDF include `AEQA-23`, `REQ-ORDER-004`, `AEQA-115`, `AE-ORDER-004`, execution details, expected versus actual address data, assertion results, and the readable McMahon Standard logo. The same files are attached to the Playwright HTML report.
