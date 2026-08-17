# Registration Page Object Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Jira task AEQA-121 as reusable Playwright test `AE-SIGNUP-006` while preserving the existing suite-level branded HTML report for one-test and full-suite runs.

**Architecture:** Add four focused page objects and a synthetic registration-data factory. The new UI spec owns the cross-page business workflow and cleanup, while the existing shared UI fixture continues to handle advertisements and screenshot evidence and the existing custom reporter continues to generate the run-level HTML report.

**Tech Stack:** TypeScript, Playwright Test, existing `qa-analytics-reporter.ts`, existing shared UI fixture.

## Global Constraints

- Jira traceability is `AEQA-121` → `AEQA-106 / AE-SIGNUP-006` → `AEQA-1 / REQ-AUTH-001` → `SRC-TC-01`.
- Use only unique synthetic QA data and the reserved `example.com` domain.
- Select both optional newsletter and partner-offer checkboxes.
- Do not add hard-coded waits.
- Delete and verify deletion of the disposable account.
- Do not refactor unrelated existing tests or add GitHub Actions.
- Preserve the existing suite-level HTML analytics reporter and its automatic local opening behavior.

---

### Task 1: Synthetic registration data

**Files:**
- Create: `Automation Exercise Project/Automation/data/registration-data.ts`
- Create: `Automation Exercise Project/Automation/tests/reporting/registration-data.spec.ts`

**Interfaces:**
- Produces: `RegistrationData` type containing title, name, email, password, date-of-birth, address, contact, and optional-selection fields.
- Produces: `createRegistrationData(): RegistrationData`, returning unique disposable values with `newsletter: true` and `partnerOffers: true`.

- [ ] **Step 1: Write the failing data-factory test**

Create a Playwright test that calls `createRegistrationData()` twice and asserts that emails differ, both end in `@example.com`, required values are populated, and both optional-selection flags are true.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npx playwright test tests/reporting/registration-data.spec.ts`

Expected: discovery fails because `../../data/registration-data` does not exist.

- [ ] **Step 3: Implement the minimum data factory**

Create the exact exported type and factory. Use `Date.now()`, `process.pid`, and random base-36 entropy in the email. Keep all values synthetic and reusable by later registration or checkout tests.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npx playwright test tests/reporting/registration-data.spec.ts`

Expected: one passing test.

- [ ] **Step 5: Commit the data factory**

Commit message: `test: add reusable registration data factory`

### Task 2: Registration page objects and end-to-end spec

**Files:**
- Create: `Automation Exercise Project/Automation/pages/HomePage.ts`
- Create: `Automation Exercise Project/Automation/pages/SignupLoginPage.ts`
- Create: `Automation Exercise Project/Automation/pages/AccountInformationPage.ts`
- Create: `Automation Exercise Project/Automation/pages/AccountStatusPage.ts`
- Create: `Automation Exercise Project/Automation/tests/ui/registration.spec.ts`
- Modify only if required for shared utility access: `Automation Exercise Project/Automation/tests/ui/support/ui-test.ts`

**Interfaces:**
- Consumes: `RegistrationData` and `createRegistrationData()` from Task 1.
- Consumes: `dismissAdOverlay`, `test`, and `expect` from the shared UI fixture.
- Produces: `HomePage.open()`, `HomePage.openSignupLogin()`, `HomePage.expectLoggedInAs(name)`, and `HomePage.deleteAccount()`.
- Produces: `SignupLoginPage.expectReady()` and `SignupLoginPage.beginRegistration(name, email)`.
- Produces: `AccountInformationPage.expectReady()` and `AccountInformationPage.complete(data)`.
- Produces: `AccountStatusPage.expectCreated()`, `AccountStatusPage.continue()`, and `AccountStatusPage.expectDeleted()`.

- [ ] **Step 1: Write the failing end-to-end spec**

Create `registration.spec.ts` with title `AE-SIGNUP-006 | SRC-TC-01 | Complete user registration with optional subscriptions`. Instantiate all four page objects, create unique registration data, execute the workflow, capture the authenticated-state screenshot at `Execution Evidence/AE-SIGNUP-006.png`, and guarantee deletion in `finally` once account creation succeeds.

- [ ] **Step 2: Verify RED at test discovery**

Run: `npx playwright test tests/ui/registration.spec.ts --list`

Expected: discovery fails because the four page-object modules do not exist.

- [ ] **Step 3: Implement the minimum page objects**

Use role-based locators where the accessible name is stable and `data-qa` locators for form controls supplied by the site. Delegate existing ad handling to `dismissAdOverlay`. Keep cross-page assertions and cleanup state in the spec rather than hiding the full business workflow in a single page method.

- [ ] **Step 4: Verify discovery and TypeScript loading**

Run: `npx playwright test tests/ui/registration.spec.ts --list`

Expected: exactly one discovered Chromium test with ID `AE-SIGNUP-006`.

- [ ] **Step 5: Run the live registration test**

Run: `$env:QA_REPORT_OPEN='false'; npx playwright test tests/ui/registration.spec.ts`

Expected: the test registers a unique account, verifies both optional selections were checked before submission, verifies account creation and authenticated state, preserves sanitized evidence, deletes the account, and passes.

- [ ] **Step 6: Refactor while green**

Remove any page-object duplication that can be eliminated without changing existing test behavior. Re-run the focused live test after refactoring.

- [ ] **Step 7: Commit the POM and test**

Commit message: `test: automate complete registration with page objects`

### Task 3: Shared report and regression verification

**Files:**
- Verify without modification: `Automation Exercise Project/Automation/reporting/qa-analytics-reporter.ts`
- Modify only if a focused failure demonstrates incompatibility: `Automation Exercise Project/Automation/README.md`

**Interfaces:**
- Consumes: the test title and `AE-SIGNUP-006.png` attachment generated by Task 2.
- Produces: `test-results/qa-analytics/index.html` and JSON run summary through the existing reporter.

- [ ] **Step 1: Verify the one-test report output**

Inspect the report generated by the focused run and assert that it includes `AE-SIGNUP-006`, contains one test result, links the registration evidence, and contains no synthetic password.

- [ ] **Step 2: Verify automatic report opening behavior without changing it**

Run from VS Code with `QA_REPORT_OPEN` unset: `npx playwright test tests/ui/registration.spec.ts`.

Expected: the existing branded HTML analytics report opens after the single-test run.

- [ ] **Step 3: Run static full-suite discovery**

Run: `npm test -- --list`

Expected: all previous tests plus `AE-SIGNUP-006` are discovered with no import or configuration errors.

- [ ] **Step 4: Run the broadest safe regression verification**

Run the reporting/data tests and existing API suite. Run the complete UI suite only if the external practice environment remains stable and disposable-account cleanup is confirmed.

- [ ] **Step 5: Check repository hygiene**

Run `git diff --check` and inspect `git status --short`. Confirm no `.env`, reusable credentials, transient `test-results`, or unintended evidence files are staged.

- [ ] **Step 6: Update documentation only if necessary**

If the existing README coverage table does not automatically describe the new test, add `AE-SIGNUP-006` under registration coverage and state that new workflows use the reusable page objects. Do not alter the established report instructions.

- [ ] **Step 7: Commit verification documentation if changed**

Commit message: `docs: record registration automation coverage`

## Plan Self-Review

- Every design requirement maps to Task 1, 2, or 3.
- New production interfaces are introduced only after a failing test or failing discovery step.
- File names, test ID, Jira IDs, and exported method names are consistent across tasks.
- No placeholder steps or unrelated refactors are included.
