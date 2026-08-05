# Automation Exercise Playwright Tests

## Project Synopsis

This workstream introduces browser automation to the Automation Exercise QA portfolio. The current Playwright and TypeScript suite performs a complete valid-login flow, protects credentials through environment variables, and preserves execution evidence and an HTML report.

## Current coverage

| Test ID | Scenario | Status |
|---|---|---|
| `AE-LOGIN-001` | Login with valid credentials | Passing |

## Commands

- `npm test` - run tests in Chromium without opening the browser window.
- `npm run test:headed` - run tests while showing the browser.
- `npm run test:ui` - open Playwright UI Mode.
- `npm run report` - open the latest HTML report.

## Structure

- `tests/` - Playwright test specifications.
- `Execution Evidence/` - portfolio-safe screenshots from successful executions.
- `Test Results/` - concise execution summaries suitable for GitHub.
- `playwright.config.ts` - browser, evidence, and report configuration.
- `test-results/` - generated local HTML reports and diagnostic artifacts; excluded from Git.

## Credential handling

Credentials are loaded from a private `.env` file that is excluded from Git. 

## Latest execution

The first end-to-end test opens Automation Exercise, navigates to the login page, enters valid credentials, submits the form, and verifies the logged-in username. See `Test Results/AE-LOGIN-001-2026-08-01.md` for the execution record.
