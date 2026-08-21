<p align="center">
  <img src="../Assets/automation-exercise-logo.png" alt="Automation Exercise" width="380" />
</p>

# Manual Test Case Repository

This folder contains the structured manual test repository for the Automation Exercise web application.

## Primary Artifact

- [Automation Exercise Test Case Repository](Automation%20Exercise%20-%20Test%20Case%20Repository.xlsx)

## Repository Contents

The workbook records 34 manual UI cases and 5 separate UI automation cases with requirement IDs, preconditions, controlled test data, numbered steps, expected and actual results, execution status, evidence, linked defects, and Jira traceability. Jira also contains 14 canonical API Test Cases, producing 53 Test Cases in total.

| Execution measure | Portfolio Test Cases | Manual workbook subset |
|---|---:|---:|
| Documented | 53 | 39 |
| Executed | 53 | 39 |
| Passed | 51 | 37 |
| Failed | 2 | 2 |
| Not Run | 0 | 0 |

Thirteen manual cases were synchronized from Jira after the RTM gap analysis and cover checkout, catalog navigation, reviews, recommended items, cart persistence, address and invoice checks, and scroll navigation. All 13 passed. Five separate automation Test Cases extend that design, and all five passed with local evidence. The two current failures remain traceable to open product defects.

## Related Evidence

- [Manual execution screenshots](../Screenshots/README.md)
- [Requirements Traceability Matrix](../Test%20Plan/Automation%20Exercise%20Requirements%20Traceability%20Matrix.xlsx)
- [Defect log](../Bug%20Report/Automation%20Exercise%20Defect%20Log.xlsx)
