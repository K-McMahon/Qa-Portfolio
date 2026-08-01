# Automation Exercise QA — Postman Collection Run Summary

> Documentation status: Screenshot-derived reconstruction. This is not a native Postman export.

## Run information

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
| Overall result | Error / Failed |

## Key findings

- `API-PRODUCT-001` and `API-BRAND-002` displayed **No response** and script `TypeError` errors. These require configuration/script investigation before they can be evaluated as product defects.
- `API-PRODUCT-002` returned HTTP 200 but had **no automated tests attached** during this run.
- `API-AUTH-001` returned `User not found!` for the supplied valid-user test, indicating invalid, missing, or stale test credentials.
- `API-AUTH-002`, `API-AUTH-003`, `API-AUTH-004`, and `API-ACCOUNT-001` returned HTTP 200 while their JSON business codes represented 400, 405, 404, and 201 respectively.
- Account update, account-detail retrieval, and account deletion assertions passed.
- `API-SEARCH-002` was not visible in the supplied run screenshots and is not represented as an execution in the reconstructed JSON.

## Evidence

- `AE-API_Full-Collection_QA_2026-08-01-Summary-1.png`
- `AE-API_Full-Collection_QA_2026-08-01-Summary-2.png`


