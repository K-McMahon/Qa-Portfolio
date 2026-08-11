# Jira Import Preparation and Data Reconciliation

This folder contains the sanitized, import-ready records used to establish the **Automation Exercise QA (AEQA)** Jira Cloud project. The source material came from the project's Excel requirements traceability matrix, manual and API test repositories, defect log, and execution evidence.

## Why This Work Matters

Importing inconsistent spreadsheet data directly into a test-management system can create duplicate records, invalid field values, misleading statuses, broken links, and false coverage. The source data was therefore treated as a migration dataset: audited first, normalized against the configured Jira schema, imported in dependency order, and reconciled after Jira keys were assigned.

## Data-Cleanup Decisions

- Preserved the original Requirement, Test Case, and Bug IDs as durable cross-system identifiers.
- Standardized work types, priorities, test types, execution statuses, automation statuses, and environment values to the available Jira options.
- Converted source priority `Critical` to Jira `Highest` where required by the destination configuration.
- Kept test outcomes in `Execution Status`; they were not incorrectly mapped to Jira workflow status.
- Retained rejected defects and historical failures for auditability rather than deleting inconvenient results.
- Kept evidence paths and reconciliation notes connected to their source records.
- Separated relationship data from record data so Test Case-to-Requirement links could be verified after Jira generated work-item keys.
- Added 13 automationexercise.com-specific manual cases to address the RTM's one partial and twelve uncovered requirement areas. These are intentionally `Manual / Not Run` pending execution.

## Import Package

| File | Purpose | Rows |
|---|---|---:|
| `01_Requirements.csv` | Requirement work items sourced from the RTM | 44 |
| `02_Test_Cases.csv` | Existing manual UI and API Test Cases | 35 |
| `03_Bugs.csv` | Investigated defects, including reconciled dispositions | 6 |
| `04_TestCase_Requirement_Links.csv` | Post-import Test Case-to-Requirement reconciliation manifest | 36 |
| `05_Manual_Coverage_Gap_Test_Cases.csv` | New manual cases for partial and uncovered RTM areas | 13 |

## Controlled Import Sequence

1. Import Requirements so destination keys exist.
2. Import the existing Test Cases.
3. Import Bugs with their reconciled status and defect metadata.
4. Recreate and verify `Test Case -> tests -> Requirement` relationships using the link manifest.
5. Import the 13 coverage-gap Test Cases and link each one to its mapped Requirement.
6. Validate counts, required fields, field option values, ownership, execution status, and relationship direction in Jira.
7. Capture board-level and work-item-level evidence for the portfolio.

## Reconciliation Result

- 44 Requirements staged from the formal RTM.
- 48 total Test Cases represented after adding the 13 coverage-gap cases.
- 6 investigated Bugs retained with their QA history.
- All 13 new cases imported successfully and linked to their intended Requirements.
- Previously passing Test Cases remain complete, while failed cases remain open for retest.
- New cases remain Not Run, avoiding any claim of execution that has not occurred.

## Portfolio Evidence

![AEQA Kanban board](../Portfolio%20Evidence/Jira/AEQA-Jira-Kanban-Board-2026-08-10.png)

![Test Case-to-Requirement traceability](../Portfolio%20Evidence/Jira/AEQA-Jira-TestCase-Traceability-2026-08-10.png)


