<p align="center">
  <img src="Assets/automation-exercise-logo.png" alt="Automation Exercise" width="420" />
</p>

# Automation Exercise | End-to-End QA Project

## Project Synopsis

This project demonstrates a complete quality-assurance workflow for the Automation Exercise e-commerce application. It combines structured manual testing, requirements traceability, defect management, Postman API validation, and Playwright browser automation in one portfolio-ready repository.

## Results at a Glance

| Workstream | Result |
|---|---|
| Manual UI testing | 21 executed, 18 passed, 3 failed |
| Defect management | 6 open defects documented with evidence |
| Requirements traceability | 44 requirements, 31 fully covered, 1 partially covered, 12 not covered |
| API testing | 14 cases, 12 passed, 2 failed |
| Postman collection run | 37 assertions, 28 passed, 9 failed, 2 runner errors |
| Browser automation | 1 passing Playwright login scenario in Chromium |

## Project Artifacts

- [Manual test-case repository](Test%20Cases/Automation%20Exercise%20-%20Test%20Case%20Repository.xlsx)
- [Requirements Traceability Matrix](Test%20Plan/Automation%20Exercise%20Requirements%20Traceability%20Matrix.xlsx)
- [Defect log](Bug%20Report/Automation%20Exercise%20Defect%20Log.xlsx)
- [Manual execution evidence](Screenshots)
- [API testing documentation and assets](API%20Testing/README.md)
- [Playwright automation project](Automation/README.md)

## Test Coverage

Manual scenarios cover registration, authentication, logout, account management, product discovery, shopping-cart behavior, contact submission, subscription, and navigation. API coverage includes products, brands, search, authentication, and account-management endpoints. The RTM links official application requirements and tester-derived requirements to the corresponding test cases, evidence, and defects.

## Defect Highlights

- Authenticated account details remain visible after logout and browser-back navigation.
- Repeated logout triggers an unhandled Django `KeyError` and exposes internal debugging information.
- The cart does not display an overall total.
- Cart quantity cannot be edited as expected.
- Unsupported API methods return HTTP 200 while the response body reports the intended error code.
- Product search returns all products when the required search parameter is omitted.

## Tools and Skills

`Excel` | `Postman` | `Playwright` | `TypeScript` | `Chromium` | Manual Testing | API Testing | RTM Design | Defect Reporting | Negative Testing | Test Evidence

## Application Under Test

[Automation Exercise](https://automationexercise.com/) is a public practice website. All artifacts in this folder were created independently for educational and portfolio purposes.
