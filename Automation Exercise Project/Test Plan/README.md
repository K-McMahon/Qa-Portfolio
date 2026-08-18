<p align="center">
  <img src="../Assets/automation-exercise-logo.png" alt="Automation Exercise" width="380" />
</p>

# Requirements Traceability and Test Planning

This workstream connects Automation Exercise requirements to Jira-managed test cases, execution results, evidence, defects, and reconciliation history. Jira is the operational traceability layer; the version-controlled RTM remains the formal synchronized artifact.

## Primary Artifact

- [Automation Exercise Requirements Traceability Matrix](Automation%20Exercise%20Requirements%20Traceability%20Matrix.xlsx)

## RTM Design

The matrix distinguishes three related but different QA concepts:

- **Coverage status** shows whether enough test design exists for the requirement.
- **Execution results** record Manual, Postman, and Playwright outcomes independently.
- **Overall execution status** states the current reconciled result.

Evidence references and defect IDs have separate columns. A disagreement between tools is recorded as an execution discrepancy requiring investigation; it is not labeled partial coverage unless required behavior or assertions are genuinely missing.

## Current Snapshot

| Measure | Result |
|---|---:|
| Portfolio requirements | 44 |
| Fully covered by test design | 44 |
| Partially covered | 0 |
| Not covered | 0 |
| Jira Test Cases | 53 |
| Bugs | 6 |
| Test Cases executed | 51 |
| Test Case execution: Passed | 49 |
| Test Case execution: Failed | 2 |
| Test Case execution: Not Run | 2 |
| Requirement execution: Passed / Failed / Not Run | 41 / 2 / 1 |
| Playwright scenarios implemented | 14 API; 24 UI |

As of August 17, 2026, the portfolio RTM requirement scope remains 44. All 13 former design gaps have linked manual Test Cases. Twelve are Passed and `AEQA-111` remains Not Run. Automation Test Cases `AEQA-125` through `AEQA-127` passed with evidence; `AEQA-128` remains In Progress and Not Run.

The RTM's **Jira Sync** sheet is reconciled through August 17, 2026 for the latest registration, checkout, cart-persistence, product-review, and planned automation records. It includes Jira keys, work types, workflow states, custom IDs, execution and automation states, Testing links, parents, and update timestamps.

The latest saved automated report is a focused Chromium run of `AE-AUTO-NAV-002 / AEQA-127`: Passed, 1/1 passed, 0 failed, and 0 skipped (`ae-20260818014448`, run locally on August 17, 2026). The linked manual case `AEQA-117` is independently recorded as Passed with its own evidence.

The corrected Postman collection completed a clean run on August 9: 14 requests, 42 of 42 assertions passed, and zero errors. Playwright implements all 14 API scenarios. The August 1 Postman baseline remains historical and is retained separately for auditability.
