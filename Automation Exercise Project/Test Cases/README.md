<p align="center">
  <img src="../Assets/automation-exercise-logo.png" alt="Automation Exercise" width="380" />
</p>

# Manual Test Case Repository

This folder contains the structured manual test repository for the Automation Exercise web application.

## Primary Artifact

- [Automation Exercise Test Case Repository](Automation%20Exercise%20-%20Test%20Case%20Repository.xlsx)

## Repository Contents

The workbook records requirement IDs, preconditions, controlled test data, numbered steps, expected and actual results, execution status, evidence, linked defects, and the Jira keys used to reconcile newly designed coverage.

| Execution measure | Result |
|---|---:|
| Documented | 34 |
| Executed | 22 |
| Passed | 20 |
| Failed | 2 |
| Not run | 12 |

Thirteen cases were synchronized from Jira after the RTM gap analysis and cover checkout, catalog navigation, reviews, recommended items, cart persistence, address and invoice checks, and scroll navigation. `AE-ORDER-001` is now Passed with Jira execution details and `AE-ORDER-001.png` evidence; 12 cases remain Not Run. The two current failures remain traceable to open product defects.

## Related Evidence

- [Manual execution screenshots](../Screenshots/README.md)
- [Requirements Traceability Matrix](../Test%20Plan/Automation%20Exercise%20Requirements%20Traceability%20Matrix.xlsx)
- [Defect log](../Bug%20Report/Automation%20Exercise%20Defect%20Log.xlsx)
