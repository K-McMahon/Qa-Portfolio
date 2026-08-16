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
| Requirements | 44 |
| Fully covered by test design | 44 |
| Partially covered | 0 |
| Not covered | 0 |
| Reconciled execution: Pass | 30 |
| Reconciled execution: Fail | 2 |
| Reconciled execution: Not Run | 12 |
| API requirements | 14 fully covered |

The RTM includes a **Jira Sync** sheet containing the 118-work-item AEQA snapshot, including Jira keys, work types, workflow states, custom IDs, execution and automation states, Testing links, parents, and update timestamps. All 13 former design gaps have linked manual Test Cases; `REQ-ORDER-001` is now reconciled as Passed through `AEQA-107 / AE-ORDER-001` with screenshot evidence, while 12 remain Not Run.

The corrected Postman collection completed a clean run on August 9: 14 requests, 42 of 42 assertions passed, and zero errors. Playwright independently passed all 14 API scenarios. The August 1 Postman baseline remains historical and is retained separately for auditability.
