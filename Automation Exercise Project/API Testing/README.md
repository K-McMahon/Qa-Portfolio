<p align="center">
  <img src="../Assets/automation-exercise-logo.png" alt="Automation Exercise" width="380" />
</p>

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

The current status is supported by Playwright evidence dated August 5, 2026 and a clean Postman Collection Runner execution completed on August 9, 2026. The August 1 Postman run remains preserved separately as the historical baseline.

## Latest Postman Runner Results

| Run detail | Result |
|---|---:|
| Collection | Automation Exercise QA - Corrected 14 Requests |
| Environment | Automation Exercise QA |
| Run time | August 9, 2026 at 10:46:10 PM ET |
| Iterations | 1 |
| Duration | 3.513 seconds |
| Requests | 14 |
| Assertions | 42 |
| Passed | **42** |
| Failed | **0** |
| Skipped | 0 |
| Errors | **0** |
| Overall result | **PASS** |

### 01 — Products

#### 🟢 GET · API-PRODUCT-001 — Get All Products List

`https://automationexercise.com/api/productsList` · `HTTP 200` · `530 ms` · `1.848 KB` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 200
- ✅ **PASS** — products list is present

#### 🟡 POST · API-PRODUCT-002 — POST to All Products List

`https://automationexercise.com/api/productsList` · `HTTP 200` · `152 ms` · `918 B` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 405
- ✅ **PASS** — response message is correct

### 02 — Brands

#### 🟢 GET · API-BRAND-001 — Get All Brands List

`https://automationexercise.com/api/brandsList` · `HTTP 200` · `142 ms` · `1.09 KB` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 200
- ✅ **PASS** — brands list is present

#### 🔵 PUT · API-BRAND-002 — PUT to All Brands List

`https://automationexercise.com/api/brandsList` · `HTTP 200` · `145 ms` · `920 B` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 405
- ✅ **PASS** — response message is correct

### 03 — Product Search

#### 🟡 POST · API-SEARCH-001 — Search Product

`https://automationexercise.com/api/searchProduct` · `HTTP 200` · `173 ms` · `1.353 KB` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 200
- ✅ **PASS** — products list is present

#### 🟡 POST · API-SEARCH-002 — Search Without Parameter

`https://automationexercise.com/api/searchProduct` · `HTTP 200` · `149 ms` · `924 B` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 400
- ✅ **PASS** — response message is correct

### 04 — Authentication

#### 🟡 POST · API-AUTH-001 — Verify Login with Valid Details

`https://automationexercise.com/api/verifyLogin` · `HTTP 200` · `150 ms` · `836 B` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 200
- ✅ **PASS** — response message is correct

#### 🟡 POST · API-AUTH-002 — Verify Login Without Email

`https://automationexercise.com/api/verifyLogin` · `HTTP 200` · `140 ms` · `929 B` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 400
- ✅ **PASS** — response message is correct

#### 🔴 DELETE · API-AUTH-003 — DELETE to Verify Login

`https://automationexercise.com/api/verifyLogin` · `HTTP 200` · `136 ms` · `914 B` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 405
- ✅ **PASS** — response message is correct

#### 🟡 POST · API-AUTH-004 — Verify Login with Invalid Details

`https://automationexercise.com/api/verifyLogin` · `HTTP 200` · `148 ms` · `875 B` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 404
- ✅ **PASS** — response message is correct

### 05 — Account Management

#### 🟡 POST · API-ACCOUNT-001 — Create User Account

`https://automationexercise.com/api/createAccount` · `HTTP 200` · `160 ms` · `827 B` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 201
- ✅ **PASS** — response message is correct

#### 🔵 PUT · API-ACCOUNT-003 — Update User Account

`https://automationexercise.com/api/updateAccount` · `HTTP 200` · `160 ms` · `828 B` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 200
- ✅ **PASS** — response message is correct

#### 🟢 GET · API-ACCOUNT-004 — Get User Details by Email

`https://automationexercise.com/api/getUserDetailByEmail?email=[REDACTED]` · `HTTP 200` · `139 ms` · `1.099 KB` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 200
- ✅ **PASS** — user detail is returned

#### 🔴 DELETE · API-ACCOUNT-002 — Delete User Account

`https://automationexercise.com/api/deleteAccount` · `HTTP 200` · `146 ms` · `868 B` · `3/3 passed`

- ✅ **PASS** — transport status is 200
- ✅ **PASS** — business response code is 200
- ✅ **PASS** — response message is correct

> Postman did not make native run-result export available on the active account. The linked JSON and Markdown records are transparent reconstructions from the clean runner results and version-controlled collection; they are not labeled as native exports.

## Cross-Tool Result Model

The RTM records API outcomes without blending test coverage and runner status:

| RTM field | Meaning |
|---|---|
| Execution Environment | QA target and configuration context |
| Postman Result | Historical August 1 outcome plus corrected-rerun status |
| Playwright Result | Current independent automated result |
| Overall Execution Status | Reconciled current conclusion |
| Evidence Reference(s) | Screenshots and reports only |
| Defect ID(s) | Linked defect identifiers; disposition remains authoritative in the defect log |
| Gap / Reconciliation Note | Pending actions or cross-tool discrepancies |

A tool disagreement is an execution discrepancy that requires investigation. It becomes partial coverage only when required behavior or assertions are missing from the mapped test design.

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
| [Corrected Postman collection](Collections/Automation%20Exercise%20QA%20-%20Corrected%2014%20Requests.postman_collection.json) | Rerunnable 14-request regression collection with request-level assertions |
| [Postman environment](Environments/Automation%20Exercise%20QA.postman_environment.json) | Portfolio-safe variables with secret fields left blank |
| [Clean Postman run summary](Execution%20Results/Postman%20Reports/AE-API_Full-Collection_QA_2026-08-09-Run-Summary.md) | Sanitized 42-of-42 clean execution summary |
| [Reconstructed Postman run JSON](Execution%20Results/Postman%20Reports/AE-API_Full-Collection_QA_2026-08-09.reconstructed.postman_run.json) | Request-level reconstructed runner record with credentials excluded |
| [Historical Postman run summary](Execution%20Results/Postman%20Reports/AE-API_Full-Collection_QA_2026-08-01-Run-Summary.md) | Auditable baseline, limitations, and reconciliation |
| `Execution Results/Screenshots/` | Postman request and response evidence for each API case |
| `../Automation/Execution Evidence/` | Current Playwright API verification screenshots |
| [RTM landing page](../Test%20Plan/README.md) | Requirement-to-test-to-result-to-evidence traceability |
| [Defect management landing page](../Bug%20Report/README.md) | Original observations, retest results, and rejected-defect rationale |

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
