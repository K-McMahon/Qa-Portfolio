# Registration Page Object Model Design

## Objective

Implement Jira task AEQA-121 as Playwright test `AE-SIGNUP-006`, covering the complete positive registration workflow for `AEQA-1 / REQ-AUTH-001`. This test establishes the reusable Page Object Model pattern for future Automation Exercise Jira work without refactoring unrelated existing tests.

## Scope

The automated test will:

1. Start in a fresh, logged-out browser context.
2. Open Automation Exercise and navigate to **Signup / Login**.
3. Begin registration with a unique synthetic name and email address.
4. Complete every required account-information field.
5. Select the optional newsletter and partner-offer checkboxes.
6. Submit the account.
7. Verify the **Account Created** confirmation.
8. Continue and verify the authenticated `Logged in as` state.
9. Preserve sanitized screenshot evidence through the existing shared UI fixture.
10. Delete the disposable account in cleanup, including when the main assertion fails.

The implementation will not convert existing Playwright tests to page objects, introduce GitHub Actions, or change Jira records before a verified execution.

## Traceability

- Automation task: `AEQA-121`
- Test case: `AEQA-106 / AE-SIGNUP-006`
- Requirement: `AEQA-1 / REQ-AUTH-001`
- Source: `SRC-TC-01`
- Environment: QA at `automationexercise.com`

## Architecture

The new model separates navigation, registration entry, account information, account status, and synthetic test data. Each page object owns only locators and actions for its corresponding screen. The test owns the business flow and assertions that cross page boundaries.

### `pages/HomePage.ts`

- Opens the application through the configured Playwright base URL.
- Navigates to Signup/Login.
- Verifies the authenticated user indicator.
- Starts account deletion when cleanup is required.
- Uses the existing advertisement-handling utilities rather than duplicating them.

### `pages/SignupLoginPage.ts`

- Verifies that the new-user signup form is ready.
- Submits the synthetic name and email that begin registration.

### `pages/AccountInformationPage.ts`

- Verifies that the account-information form is ready.
- Fills all required identity, password, date-of-birth, and address fields.
- Selects the newsletter and partner-offer options.
- Submits the completed account.

### `pages/AccountStatusPage.ts`

- Verifies the Account Created confirmation.
- Continues into the authenticated application.
- Verifies Account Deleted during cleanup when deletion was initiated.

### `data/registration-data.ts`

- Defines the reusable registration-data type.
- Produces a unique synthetic account for each execution.
- Contains no personal credentials, production credentials, or reusable secrets.

### `tests/ui/registration.spec.ts`

- Creates the page objects and unique account data.
- Executes the complete `AE-SIGNUP-006` workflow.
- Uses stable role-based and `data-qa` locators.
- Uses Playwright assertions rather than hard-coded waits.
- Guarantees disposable-account cleanup with `finally`.

## Shared HTML Report

The existing `qa-analytics-reporter.ts` remains the only suite-level branded HTML report. The new test will integrate through the existing reporter contract:

- The test title includes `AE-SIGNUP-006` for traceability extraction.
- The shared UI fixture captures `Execution Evidence/AE-SIGNUP-006.png`.
- A one-test command produces and opens a one-test analytics report.
- A full-suite command produces and opens the complete analytics report.
- CI continues to suppress automatic browser opening.

The reporter will be changed only if a failing characterization test proves the new test cannot be represented correctly. No per-test HTML evidence generator will be introduced.

## Test Data and Cleanup

Synthetic data will use a timestamp plus additional entropy to prevent collisions during parallel or repeated runs. The password and all profile values are explicitly disposable QA data. The email will use the reserved `example.com` domain.

Cleanup begins only after an authenticated account exists. Cleanup errors must not silently replace the primary test failure, but a successful main workflow is not considered complete unless account deletion is verified.

## Error Handling and Evidence

- Playwright locator assertions provide synchronization.
- No `waitForTimeout` calls are permitted.
- The shared `afterEach` hook captures final browser evidence.
- When cleanup would replace the desired business-state screenshot, the test captures the authenticated state first and annotates the run to preserve that evidence.
- The analytics reporter continues to record status, duration, retries, traceability, failures, and evidence links.

## Verification

Implementation will follow test-driven development:

1. Add focused tests that fail because the page-object and data interfaces do not exist.
2. Implement the minimum interfaces needed to pass those tests.
3. Run the focused structural tests.
4. List the Playwright suite and confirm `AE-SIGNUP-006` is discovered.
5. Run `AE-SIGNUP-006` alone and confirm its branded analytics report opens.
6. Confirm the screenshot and report reference `AE-SIGNUP-006` without exposing reusable secrets.
7. Run the existing suite or the broadest safe local verification available.

## Success Criteria

- `AE-SIGNUP-006` completes registration from a logged-out state.
- Both optional subscription selections are exercised.
- Account creation and authenticated state are asserted.
- The disposable account is deleted and deletion is verified.
- Page responsibilities and synthetic data are reusable by future Jira tests.
- Existing tests retain their current structure and behavior.
- The shared branded HTML report works for both a single-test run and a complete run.
