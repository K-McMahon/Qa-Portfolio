# Automation Exercise API Testing

## Project Synopsis

This workstream validates all 14 API scenarios published by Automation Exercise across products, brands, product search, authentication, and account management. The deliverable combines requirements traceability, reusable Postman assets, documented test cases, execution evidence, defect disposition, and independent Playwright API verification.

## Current QA Status

| Measure | Current result |
|---|---:|
| Official API requirements | 14 |
| Requirements currently passed | 14 |
| Requirements currently failed | 0 |
| Requirements not run | 0 |
| Confirmed open API defects | 0 |
| Rejected configuration defects | 2 |

The current status is based on the reconciled API test repository and Playwright evidence dated August 5, 2026. The August 1 Postman run remains preserved as a historical baseline and is not overwritten by the later verification.

## Historical Postman Baseline

| Measure | August 1, 2026 result |
|---|---:|
| Assertions | 37 |
| Passed | 28 |
| Failed | 9 |
| Runner errors | 2 |

Reconciliation showed that the historical failures were primarily caused by missing tests, stale credentials, script errors, or assertions that compared the HTTP transport status to the documented JSON business code. Automation Exercise commonly returns HTTP 200 and places the scenario result in the response body's `responseCode` field. These historical failures therefore do not represent nine confirmed product defects.

## Employer-Ready Deliverables

| Artifact | Purpose |
|---|---|
| [API test-case repository](Documentation/Automation%20Exercise%20API%20Test%20Cases.xlsx) | Test design, expected results, current execution status, evidence, and execution summary |
| [Postman collection](Collections/Automation%20Exercise%20QA.postman_collection.json) | Rerunnable 14-request regression collection with request-level assertions |
| [Postman environment](Environments/Automation%20Exercise%20QA.postman_environment.json) | Portfolio-safe variables with secret fields left blank |
| [Historical Postman run summary](Execution%20Results/Postman%20Reports/AE-API_Full-Collection_QA_2026-08-01-Run-Summary.md) | Auditable baseline, limitations, and reconciliation |
| `Execution Results/Screenshots/` | Postman request and response evidence for each API case |
| `../Automation/Execution Evidence/` | Current Playwright API verification screenshots |
| `../Test Plan/Automation Exercise Requirements Traceability Matrix.xlsx` | Requirement-to-test-to-evidence traceability |
| `../Bug Report/Automation Exercise Defect Log.xlsx` | Original observations, retest results, and rejected-defect rationale |

## Collection Design

The collection contains all 14 official requests and now includes assertions for:

- HTTP transport status.
- JSON business response code.
- Exact success or error message where specified.
- Expected product, brand, search, or user payload structure.
- Required-parameter validation.
- Valid and invalid authentication behavior.
- Account creation, update, retrieval, and deletion in stable lifecycle order.

## Recommended Regression Workflow

1. Import the collection and environment into Postman.
2. Enter portfolio-safe test credentials in local environment values only.
3. Run the full collection with one iteration.
4. Confirm all request assertions pass.
5. Export or capture the native runner result in `Execution Results/Postman Reports/`.
6. Update the API test repository, RTM, and defect log with the new execution date and evidence.
7. Retain the historical baseline instead of replacing it.

## Credential Safety

The committed environment contains no passwords or real account credentials. Secret values remain blank and must be supplied locally. Never commit production credentials, personal data, access tokens, or populated secret variables.
