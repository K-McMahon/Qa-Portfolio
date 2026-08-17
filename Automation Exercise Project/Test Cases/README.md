<p align="center">
  <img src="../Assets/automation-exercise-logo.png" alt="Automation Exercise" width="380" />
</p>

# Manual Test Case Repository

This folder contains the structured manual test repository for the Automation Exercise web application.

## Primary Artifact

- [Automation Exercise Test Case Repository](Automation%20Exercise%20-%20Test%20Case%20Repository.xlsx)

## Repository Contents

The workbook records 34 manual UI cases with requirement IDs, preconditions, controlled test data, numbered steps, expected and actual results, execution status, evidence, linked defects, and the Jira keys used to reconcile newly designed coverage. The current portfolio execution record also includes 14 canonical API Test Cases, producing 48 Jira Test Cases in total.

| Execution measure | Portfolio Test Cases | Manual workbook subset |
|---|---:|---:|
| Documented | 48 | 34 |
| Executed | 40 | 26 |
| Passed | 38 | 24 |
| Failed | 2 | 2 |
| Not Run | 8 | 8 |

Thirteen manual cases were synchronized from Jira after the RTM gap analysis and cover checkout, catalog navigation, reviews, recommended items, cart persistence, address and invoice checks, and scroll navigation. Five are now Passed and eight remain Not Run. The latest saved automated report separately records `AE-CART-004 / AEQA-112` as Passed in Chromium (1/1 passed); its Jira manual execution text remains Not Run, so it is not counted as a sixth manual completion. The two current failures remain traceable to open product defects.

## Related Evidence

- [Manual execution screenshots](../Screenshots/README.md)
- [Requirements Traceability Matrix](../Test%20Plan/Automation%20Exercise%20Requirements%20Traceability%20Matrix.xlsx)
- [Defect log](../Bug%20Report/Automation%20Exercise%20Defect%20Log.xlsx)
