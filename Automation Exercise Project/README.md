<p align="center">
  <img src="Assets/automation-exercise-logo.png" alt="Automation Exercise" width="420" />
</p>

# Automation Exercise | End-to-End QA Project

## Project Synopsis

This project demonstrates a complete quality-assurance workflow for the Automation Exercise e-commerce application. It combines structured manual testing, requirements traceability, defect management, Postman API validation, and Playwright browser automation in one portfolio-ready repository.

## Results at a Glance

| Workstream | Result |
|---|---|
| Manual UI testing | 34 documented; 24 executed, 22 passed, 2 failed, and 10 not run |
| Defect management | 6 investigated defects: 3 open and 3 rejected after reconciliation or retest |
| Requirements traceability | 44 requirements fully covered by test design; 32 passed, 2 failed, and 10 not run |
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

## Jira QA Management

The live Jira Cloud project, **Automation Exercise QA (AEQA)**, is the operational QA layer for this portfolio. The Excel RTM remains the formal traceability source, while Jira tracks the working relationship:

`Requirement → is tested by → Test Case → relates to → Bug`

The Jira implementation includes custom Requirement and Test Case work types, structured manual-test fields, execution and automation statuses, evidence attachments, RTM-based links, defect traceability, and an indexed GitHub integration for `K-McMahon/Qa-Portfolio`.

Before import, the Excel RTM, test repositories, defect log, and evidence references were treated as a migration dataset. Original IDs were preserved; Jira field values and priorities were normalized; execution outcomes were kept separate from workflow status; rejected observations and historical failures were retained for auditability; and Test Case-to-Requirement relationships were staged separately for post-import reconciliation. This prevented invalid options, misleading completion states, and broken traceability from entering Jira.

Current Jira execution state:

- 36 executed Test Cases are assigned to the QA owner.
- 34 passing Test Cases are Done; 2 failed Test Cases remain open for retest.
- Of the 13 additional `automationexercise.com` manual Test Cases designed for documented RTM gaps, `AEQA-107 / AE-ORDER-001`, `AEQA-110 / AE-CATALOG-001`, and `AEQA-115 / AE-ORDER-004` are Passed; 10 remain Not Run.
- Every new coverage-gap Test Case links to its Requirement using the custom `tests` relationship.

The staged package contains 44 Requirements, 35 existing Test Cases, 6 Bugs, and a 36-row relationship manifest. After the gap analysis, 13 additional automationexercise.com manual cases were imported, bringing the represented Test Case total to 48. The new designs address the RTM's one partial and twelve uncovered areas; three have now been genuinely executed and passed, while 10 remain Not Run.

- [Review the Jira import preparation and reconciliation record](Jira%20Import%20Ready/README.md)

### Jira Evidence

- [AEQA reconciliation report — 2026-08-16](Portfolio%20Evidence/Jira/AEQA-Reconciliation-2026-08-16.md)

![AEQA Jira Kanban board](Portfolio%20Evidence/Jira/AEQA-Jira-Kanban-Board-2026-08-10.png)

![AEQA Test Case and Requirement traceability](Portfolio%20Evidence/Jira/AEQA-Jira-TestCase-Traceability-2026-08-10.png)

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

`Jira Cloud` | `GitHub` | `Excel` | `Postman` | `Playwright` | `TypeScript` | `Chromium` | Manual Testing | API Testing | RTM Design | Defect Reporting | Negative Testing | Test Evidence

## Application Under Test

[Automation Exercise](https://automationexercise.com/) is a public practice website. All artifacts in this folder were created independently for educational and portfolio purposes.
