# Automation Exercise QA | Postman Collection Run Summary

> Record type: historical baseline reconstructed from the supplied Postman runner screenshots. This is not a native Postman export and is not the current final execution status.

## Run Information

| Field | Result |
|---|---:|
| Run date | 2026-08-01 |
| Source | Postman Collection Runner |
| Environment | Automation Exercise QA |
| Iterations | 1 |
| Duration | 4.174 seconds |
| Assertions | 37 |
| Passed | 28 |
| Failed | 9 |
| Skipped | 0 |
| Errors | 2 |
| Historical overall result | Error / Failed |

## Historical Findings

- `API-PRODUCT-001` and `API-BRAND-002` displayed no response and script `TypeError` errors.
- `API-PRODUCT-002` returned HTTP 200 but had no automated tests attached during the run.
- `API-AUTH-001` returned `User not found!` for the supplied valid-user test, indicating stale, missing, or invalid test credentials.
- `API-AUTH-002`, `API-AUTH-003`, `API-AUTH-004`, and `API-ACCOUNT-001` returned HTTP 200 while their JSON business codes represented 400, 405, 404, and 201.
- Account update, account-detail retrieval, and account deletion assertions passed.
- `API-SEARCH-002` was not visible in the supplied runner screenshots and was inconclusive in this reconstruction.

## Reconciliation and Disposition

The official Automation Exercise contract and current automated evidence confirm that these APIs use HTTP 200 as the transport response while placing the documented scenario result in the JSON `responseCode` field. The historical run mixed those two layers in several assertions.

The Postman collection has since been corrected to include all 14 requests, request-level assertions, exact business-code validation, and a stable account lifecycle. Independent Playwright API verification passed all 14 canonical scenarios on August 5, 2026.

| Current measure | Result |
|---|---:|
| Requirements passed | 14 |
| Requirements failed | 0 |
| Requirements not run | 0 |
| Confirmed open API defects | 0 |
| Rejected test-configuration defects | `BUG-API-001`, `BUG-API-002` |

This historical report remains part of the audit trail. It should not be presented as the current release status.

## Evidence

- `AE-API_Full-Collection_QA_2026-08-01-Summary-1.png`
- `AE-API_Full-Collection_QA_2026-08-01-Summary-2.png`
- `AE-API_Full-Collection_QA_2026-08-01.reconstructed.postman_run.json`
- `../Screenshots/` for request-level Postman evidence.
- `../../../Automation/Execution Evidence/` for current Playwright API evidence.

## Completed Follow-Up

The corrected 14-request collection was rerun on August 9, 2026. The clean run completed one iteration with 42 of 42 assertions passing and zero errors. See `AE-API_Full-Collection_QA_2026-08-09-Run-Summary.md` and the companion reconstructed JSON record. This August 1 baseline remains preserved to show the failure analysis, correction, and verified outcome.
