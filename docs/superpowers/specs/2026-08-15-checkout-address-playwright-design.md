# AE-ORDER-004 Checkout Address Playwright Test Design

## Purpose

Implement the automated checkout-address validation represented in Jira by:

- Requirement: `AEQA-23 / REQ-ORDER-004`
- Test Case: `AEQA-115 / AE-ORDER-004`
- Automation task: `AEQA-102`
- Assertion task: `AEQA-105`

The test will verify that checkout delivery and billing details match controlled registration data. It will also generate branded, Jira-ready execution evidence without exposing passwords or personal production data.

## Test Architecture

Create `tests/ui/checkout-address.spec.ts` using the existing fixture exported from `tests/ui/support/ui-test.ts`. The test will follow existing ad-blocking, screenshot, reporting, and Automation Exercise navigation conventions.

The scenario will create a disposable account with a unique synthetic email address and fixed synthetic address data. It will add an available product, proceed to checkout, and compare the displayed delivery and billing sections with the known registration data. Cleanup will delete the disposable account when the application allows it.

Shared registration or checkout helpers may be added to `tests/ui/support/ui-test.ts` only when they make the scenario clearer and remain reusable. No unrelated suite refactoring is in scope.

## Assertions

The test will verify:

1. Disposable account registration succeeds.
2. The logged-in username is visible.
3. A product is added and checkout becomes available.
4. The checkout page displays both delivery and billing address sections.
5. Each section contains the expected synthetic name, company, street lines, city/state/postcode, and country.
6. Delivery and billing values are mutually consistent.
7. No password or private credential is written to evidence artifacts.

Assertions will use stable application attributes and scoped checkout containers rather than brittle page-wide text checks.

## Evidence Outputs

The scenario will produce:

- `Execution Evidence/AE-ORDER-004.png`
- `Execution Evidence/AE-ORDER-004-evidence.html`
- `Execution Evidence/AE-ORDER-004-evidence.pdf`
- The existing Playwright HTML report under `test-results/html-report`

The dedicated HTML and PDF reports will contain:

- A prominent, readable McMahon Standard logo sourced from `reporting/assets/the-mcmahon-standard-logo.png`
- Test and requirement names and identifiers
- Jira keys for the Requirement, Test Case, and automation subtasks
- RTM requirement and manual Test Case identifiers
- Environment and execution timestamp
- Test objective and summarized execution steps
- Expected and actual address results using synthetic data
- Assertion-level results and final Pass/Fail status
- The final screenshot or a clear local reference when embedding is unavailable

The HTML report will be self-contained enough to open locally and publish through GitHub. The PDF will use a landscape or portrait layout selected to keep the logo, traceability block, results, and screenshot legible without clipping.

## Evidence Generation

Add a focused evidence-report helper under `reporting/`. The Playwright test will pass structured metadata and assertion results to this helper. The helper will render deterministic HTML and use the installed Playwright Chromium runtime to print the same document to PDF.

The report generator will not replace or modify the existing global QA analytics reporter. This limits risk to the current suite while creating a reusable pattern for future Jira-specific evidence reports.

## Error Handling and Cleanup

- A unique timestamped email will prevent collisions between runs.
- Cleanup will be attempted in a `finally` block when an account was created.
- Cleanup failure will be recorded without hiding the primary test outcome.
- Evidence generation will preserve the underlying test failure details.
- Missing browser/runtime dependencies will produce an explicit error rather than a silent partial report.
- Sensitive fields will never be included in HTML, PDF, screenshots, console messages, or Jira metadata.

## Test-Driven Implementation

Implementation will begin with failing tests for the evidence metadata/report helper and the new Playwright scenario contract. The expected initial failure will confirm that `AE-ORDER-004` and its evidence generator do not yet exist. Minimal implementation will then make the targeted tests pass before the full UI and API suites are run.

## Completion Criteria

The work is complete only when:

- The targeted Chromium test passes against `automationexercise.com`.
- Address assertions validate controlled delivery and billing data.
- Screenshot, HTML, PDF, and standard Playwright report outputs exist and are readable.
- The branded reports show the McMahon Standard logo at a legible size.
- Jira and RTM identifiers are correct throughout the test and reports.
- No secret or personal production data appears in generated evidence.
- Existing automated tests remain passing or any unrelated environmental failures are documented precisely.
