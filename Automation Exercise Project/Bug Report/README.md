<p align="center">
  <img src="../Assets/automation-exercise-logo.png" alt="Automation Exercise" width="380" />
</p>

# Defect Management

This workstream preserves the complete investigation history for product failures, retests, and rejected observations.

## Primary Artifact

- [Automation Exercise Defect Log](Automation%20Exercise%20Defect%20Log.xlsx)

## Current Disposition

| Measure | Result |
|---|---:|
| Investigated | 6 |
| Open | 3 |
| Rejected | 3 |

Open findings include logout/session behavior and the missing overall cart total. `AE-BUG-004` was rejected after quantity 4 worked during corrected retesting. `BUG-API-001` and `BUG-API-002` were rejected after the API contract was reconciled: the application returns HTTP 200 at the transport layer and reports scenario-specific business outcomes through the JSON `responseCode`.

Rejected records remain in the log because they demonstrate investigation, correction, and evidence-based disposition. Test-script, test-data, and environment failures are not classified as product defects.

## Related Artifacts

- [Manual evidence](../Screenshots/README.md)
- [API testing overview](../API%20Testing/README.md)
- [Requirements Traceability Matrix](../Test%20Plan/Automation%20Exercise%20Requirements%20Traceability%20Matrix.xlsx)

