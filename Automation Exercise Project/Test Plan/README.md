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
| Portfolio Test Cases | 48 |
| Bugs | 6 |
| Test Cases executed | 40 |
| Test Case execution: Passed | 38 |
| Test Case execution: Failed | 2 |
| Test Case execution: Not Run | 8 |
| Playwright scenarios implemented | 14 API; 19 UI |

As of August 17, 2026, Jira contains 122 work items when the administrative requirement, tasks, and subtasks are included; the portfolio RTM requirement scope remains 44. All 13 former design gaps have linked manual Test Cases. Five are Passed and eight remain Not Run. `AEQA-121`, the Playwright registration-automation work item, is Done.

The RTM's **Jira Sync** sheet preserves a historical 121-work-item AEQA snapshot through August 16, 2026, including Jira keys, work types, workflow states, custom IDs, execution and automation states, Testing links, parents, and update timestamps.

The latest saved automated report is a separate Chromium run of `AE-CART-004 / AEQA-112`: Passed, 1/1 passed, 0 failed, and 0 skipped (`ae-20260817170106`, August 17, 2026). The Jira manual execution text for `AEQA-112` remains Not Run, so this automated result does not change the manual totals.

The corrected Postman collection completed a clean run on August 9: 14 requests, 42 of 42 assertions passed, and zero errors. Playwright implements all 14 API scenarios. The August 1 Postman baseline remains historical and is retained separately for auditability.
