<p align="center">
  <img src="Assets/automation-exercise-logo.png" alt="Automation Exercise" width="420" />
</p>

# Automation Exercise | End-to-End QA Project

## Project Synopsis

This project demonstrates a complete quality-assurance workflow for the Automation Exercise e-commerce application. It combines structured manual testing, requirements traceability, defect management, Postman API validation, and Playwright browser automation in one portfolio-ready repository.

## Results at a Glance

| Workstream | Result |
|---|---|
| Manual UI testing | 21 executed, 19 passed, 2 failed |
| Defect management | 6 investigated defects: 3 open and 3 rejected after reconciliation or retest |
| Requirements traceability | 44 requirements, 31 fully covered, 1 partially covered, 12 not covered |
| API testing | 14 canonical cases; Postman 14 passed and Playwright 14 passed |
| Postman collection run | Fresh result: 42/42 assertions passed, 0 errors; historical August 1 baseline retained separately |
| Browser automation | 14 API and 14 portfolio UI scenarios implemented in Playwright with linked evidence |

## Project Artifacts

- [Manual testing landing page](Test%20Cases/README.md)
- [Requirements traceability landing page](Test%20Plan/README.md)
- [Defect management landing page](Bug%20Report/README.md)
- [Manual execution evidence landing page](Screenshots/README.md)
- [API testing documentation and assets](API%20Testing/README.md)
- [Playwright automation project](Automation/README.md)

## Test Coverage

Manual scenarios cover registration, authentication, logout, account management, product discovery, shopping-cart behavior, contact submission, subscription, and navigation. API coverage includes products, brands, search, authentication, and account-management endpoints. The RTM separates requirement coverage from Manual, Postman, and Playwright execution results, then links each row to evidence, defects, and reconciliation notes.

## Defect Highlights

- Authenticated account details remain visible after logout and browser-back navigation.
- Repeated logout triggers an unhandled Django `KeyError` and exposes internal debugging information.
- The cart does not display an overall total.
- Product quantity 4 works after corrected retesting; `AE-BUG-004` is retained as a rejected observation.
- Two apparent API defects were rejected after contract reconciliation confirmed that the service uses HTTP 200 transport responses with business response codes in the JSON body.
- The corrected Postman collection now validates transport status, business response codes, response messages, and payload structure across all 14 endpoints.
- The clean August 9 Postman run executed all 14 requests and passed all 42 assertions with zero errors.

## Result Interpretation

- A requirement is **Fully Covered** when its required behavior and assertions are mapped, even if one runner has an obsolete or incorrect test script.
- A fresh disagreement between Postman and Playwright is marked **Investigation Required**, not Partially Covered.
- **Partially Covered** is reserved for missing behavior, conditions, or assertions.
- Test-script, credential, and environment failures are reconciled separately from confirmed product defects.

## Tools and Skills

`Excel` | `Postman` | `Playwright` | `TypeScript` | `Chromium` | Manual Testing | API Testing | RTM Design | Defect Reporting | Negative Testing | Test Evidence

## Application Under Test

[Automation Exercise](https://automationexercise.com/) is a public practice website. All artifacts in this folder were created independently for educational and portfolio purposes.
