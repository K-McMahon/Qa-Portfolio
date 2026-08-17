# Product Review Automation Design

## Purpose

Automate `AEQA-124` for requirement `AEQA-21 / REQ-REVIEW-001` and manual test `AEQA-113 / AE-REVIEW-001`. The Playwright test will confirm that a visitor can submit a product review from a product details page and see the success confirmation.

## Test Flow

1. Open the Automation Exercise Products page.
2. Verify the All Products page is displayed.
3. Open the first product details page.
4. Verify the Write Your Review form is visible.
5. Generate a unique synthetic name and email for the current run.
6. Enter the generated name, generated email, and the exact review message `QA By The McMahon Standard`.
7. Capture `AE-REVIEW-001(1).png` with the completed form visible.
8. Submit the review.
9. Verify the exact confirmation `Thank you for your review.` is visible.
10. Capture `AE-REVIEW-001(2).png` with the confirmation visible.

## Structure

- Extend `ProductsPage` only with the responsibility for opening the first product.
- Add `ProductDetailsPage` for the review form, review submission, confirmation assertion, and evidence capture.
- Add `review-submission.spec.ts` for the business flow and Jira traceability.
- Use the existing shared UI fixture so ad handling, final browser evidence, the branded QA report, and the Playwright HTML report remain consistent with the project.

## Test Data

- Name: generated from a timestamp or other run-unique value.
- Email: generated from the same run-unique value using a safe example domain.
- Review message: exactly `QA By The McMahon Standard`.
- No personal information or authenticated account is required.

## Assertions

- The Products page loads.
- The first product details page opens.
- The Write Your Review form is visible.
- The generated name and email are entered.
- The exact review message is entered.
- The exact success confirmation appears after submission.
- Both named screenshots are saved and attached to the report.

## Error Handling

Use Playwright web-first assertions and stable page locators. Do not use hard-coded waits. A missing form, failed navigation, missing confirmation, or missing screenshot attachment must produce a clear test failure.

## Run Command

The user will run only this test in headed Chromium with one worker so the browser journey is visible:

```powershell
npx playwright test tests/ui/review-submission.spec.ts --project=chromium --workers=1 --headed
```
