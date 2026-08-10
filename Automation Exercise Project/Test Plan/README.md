<p align="center">
  <img src="../Assets/automation-exercise-logo.png" alt="Automation Exercise" width="380" />
</p>

# Requirements Traceability and Test Planning

This workstream connects Automation Exercise requirements to test cases, execution results, evidence, defects, and remaining gaps. Its primary artifact is the portfolio RTM.

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
| Fully covered | 31 |
| Partially covered | 1 |
| Not covered | 12 |
| API requirements | 14 fully covered |

The corrected Postman collection still requires a fresh native runner execution. The August 1 Postman baseline remains historical, while current Playwright API verification passed all 14 scenarios.

