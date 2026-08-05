# Automation Exercise API Testing

## Project Synopsis

This API testing workstream validates 14 Automation Exercise endpoints across products, brands, product search, authentication, and account management. It contains reusable Postman assets, structured test documentation, execution screenshots, collection-run evidence, and defect traceability.

## Structure

- `Collections/` | exported Postman collection files.
- `Environments/` | exported Postman environment files. Do not commit secrets or real credentials.
- `Test Data/` | reusable CSV or JSON data for data-driven API tests.
- `Execution Results/Postman Reports/` | collection-run and reconstructed reports.
- `Execution Results/Screenshots/` | supporting execution evidence.
- `Documentation/` | API test cases and execution records.

## Postman Exports

- `Collections/Automation Exercise QA.postman_collection.json`
- `Environments/Automation Exercise QA.postman_environment.json`

## Execution Summary

| Area | Result |
|---|---|
| Documented API cases | 14 total, 12 passed, 2 failed |
| Collection assertions | 37 total, 28 passed, 9 failed |
| Runner errors | 2 documented |

- [Open the API test-case workbook](Documentation/Automation%20Exercise%20API%20Test%20Cases.xlsx)
- [Read the full collection-run summary](Execution%20Results/Postman%20Reports/AE-API_Full-Collection_QA_2026-08-01-Run-Summary.md)

## Coverage

The collection tests expected HTTP behavior, business response codes, response messages, JSON structures, required parameters, valid and invalid authentication, and the account lifecycle. Assertions are stored with the requests so the entire collection can be executed as a repeatable regression run.

## Credential Safety

The committed environment contains portfolio-safe values only. Real credentials and secrets should remain in local or private Postman variables and must not be committed to Git.
