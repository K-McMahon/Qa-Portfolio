# Kevin McMahon | QA Analyst & Data Portfolio

## About Me

I am a computer science graduate with professional experience in operations, project coordination, process improvement, employee training, troubleshooting, production quality assurance, and customer service.

I am transitioning into software quality assurance and data analysis. This portfolio demonstrates hands-on work in manual web testing, requirements traceability, defect reporting, API testing, browser automation, SQL database design, and business-focused data analysis.

## Portfolio at a Glance

| Area | Completed Work | Current Result |
|---|---|---|
| Test execution | 48 portfolio Test Cases; 40 executed | 38 Passed, 2 Failed, 8 Not Run |
| Jira test management | 44 requirements, 48 Test Cases, and 6 Bugs tracked in AEQA | 5 manual coverage-gap cases Passed; 8 remain Not Run |
| Defect reporting | 6 investigated defects | 3 open, 3 rejected after reconciliation or retest |
| Requirements traceability | 44 UI, API, and tester-derived requirements | 44 fully covered by test design; Test Case execution is 38 Passed, 2 Failed, 8 Not Run |
| API testing | 14 canonical API cases with separate Postman and Playwright coverage | Postman: 14/14 passed; Playwright: 14 API scenarios implemented |
| API collection run | Corrected 14-request regression collection | Fresh run: 42/42 assertions passed, 0 errors; historical August 1 baseline retained |
| Browser automation | Playwright API and browser suites | 14 API and 19 UI scenarios implemented with linked evidence |
| Hacker News validation | Playwright ordering audit across paginated results | Exactly 100 unique articles verified with a branded HTML evidence report |
| SQL analysis | Six-table relational sales database and 15 analytical queries | Schema, sanitized data, queries, joins, subquery, and results report complete |

## Featured Project 1: Automation Exercise QA

<p align="center">
  <img src="Automation%20Exercise%20Project/Assets/automation-exercise-logo.png" alt="Automation Exercise" width="380" />
</p>

- [Open the complete Automation Exercise project overview](Automation%20Exercise%20Project/README.md)

**Application under test:** [Automation Exercise](https://automationexercise.com/)

**Testing performed:** Manual functional testing, negative testing, security-oriented input validation, API testing, traceability analysis, defect reporting, and Playwright automation.

### Manual Test Repository

The original manual workbook contains 34 documented UI cases. The current portfolio-level execution record in Jira covers 48 Test Cases: 40 executed, with 38 Passed, 2 Failed, and 8 Not Run. Coverage includes:

- Signup and account creation
- Login, invalid authentication, and logout
- Account persistence and deletion
- Product listing, details, and search
- Shopping-cart behavior
- Contact form submission
- Navigation
- Home-page and cart-page subscriptions
- Checkout and order placement
- Category and brand navigation
- Product reviews and recommended items
- Address, invoice, cart-persistence, and scroll-navigation checks

The workbook records preconditions, controlled test data, numbered steps, expected and actual results, execution status, evidence, defects, and requirement IDs.

- [Open the manual test-case repository](Automation%20Exercise%20Project/Test%20Cases/Automation%20Exercise%20-%20Test%20Case%20Repository.xlsx)
- [Browse UI execution evidence](Automation%20Exercise%20Project/Screenshots)

**Current execution summary:** 48 portfolio Test Cases; 40 executed; 38 Passed; 2 Failed; 8 Not Run. Detailed Jira evidence is available in the [project overview](Automation%20Exercise%20Project/README.md#jira-evidence).

### Defect Management

Six investigated defects are documented with reproducible steps, expected and actual behavior, severity, priority, environment, evidence, retest status, and QA notes. Three remain open and three were rejected after requirements reconciliation or successful retest.

Key findings include:

- Authenticated user information remaining visible after logout/back navigation
- An unhandled logout `KeyError` exposing internal Django debugging information
- Missing overall cart total
- Product quantity observation rejected after corrected retesting confirmed quantity 4 works
- Two API observations that were rejected after contract reconciliation showed the service reports business response codes inside an HTTP 200 JSON response

- [Open the defect-management landing page](Automation%20Exercise%20Project/Bug%20Report/README.md)

### Requirements Traceability Matrix

The RTM cross-references:

- 26 official UI scenarios
- 14 official API scenarios
- 4 tester-derived requirements
- 34 original manual UI test cases, with current Jira execution evidence maintained separately
- API test cases and linked defects

| Coverage Status | Requirements |
|---|---:|
| Fully Covered | 44 |
| Partially Covered | 0 |
| Not Covered | 0 |
| **Total** | **44** |

Jira now contains linked manual Test Cases for the former checkout, catalog, review, recommended-item, and scroll-navigation gaps. Five manual coverage-gap cases are reconciled as Passed, while eight remain Not Run. The project-level Jira documentation distinguishes that manual status from the latest successful automated run of `AE-CART-004 / AEQA-112`.

- [Open the requirements-traceability landing page](Automation%20Exercise%20Project/Test%20Plan/README.md)

### Jira QA Management and Data Migration

The **Automation Exercise QA (AEQA)** Jira Cloud project turns the repository's formal Excel RTM into a live QA-management workflow. Jira is used for day-to-day planning and status visibility; the version-controlled RTM remains the authoritative traceability record.

The migration work demonstrates more than a CSV upload:

- Audited and reconciled requirements, manual cases, API cases, defects, evidence paths, priorities, and execution results before import.
- Separated product execution results from Jira workflow status so `Passed`, `Failed`, and `Not Run` remain test outcomes rather than misleading board states.
- Normalized source values to valid Jira field options while preserving original IDs for cross-reference.
- Built staged import files for 44 Requirements, 35 previously existing Test Cases, 6 Bugs, and 36 Test Case-to-Requirement relationships.
- Designed and imported 13 additional manual cases for the RTM's partial and uncovered areas; five are now Passed with evidence and eight remain correctly marked `Not Run`.
- Linked each new Test Case to its Requirement using the custom `tests` relationship, producing the working chain `Requirement -> Test Case -> Bug`.
- Captured board and work-item evidence so employers can review the implementation without receiving edit access to the live Jira site.

The resulting Jira project reflects real QA judgment: passed work is complete, failed work remains visible for retest, rejected observations retain their audit history, and newly designed tests are not presented as executed.

- [View the Jira implementation and evidence](Automation%20Exercise%20Project/README.md#jira-qa-management)
- [Review the sanitized Jira import package](Automation%20Exercise%20Project/Jira%20Import%20Ready/README.md)

### API Testing With Postman

The Postman project contains 14 positive and negative API cases organized into Products, Brands, Product Search, Authentication, and Account Management modules.

Included assets:

- Version-controlled Postman collection and environment
- Environment-variable-based endpoints and credentials
- Request-level validation scripts
- API execution workbook
- 14 execution screenshots
- Reconstructed collection-run report and JSON record
- Traceability and disposition links for investigated API observations

**Current reconciled API execution:** 14 executed; 14 passed; 0 failed. The API workbook and RTM record that execution status; Playwright implements 14 API scenarios. The latest saved Playwright report separately covers one Chromium UI scenario.

**Current clean Postman run:** The corrected 14-request collection ran on August 9 with one iteration. All 42 assertions passed with zero failures and zero errors. The reconstructed JSON and Markdown summary are sanitized because native run export was unavailable on the active Postman account.

**Historical Postman baseline:** 37 assertions ran; 28 passed and 9 failed, with two runner errors and one request without tests. That August 1 record remains preserved for audit history. The failures were reconciled to stale assertions, missing scripts, or credentials rather than confirmed API defects.

- [API testing overview](Automation%20Exercise%20Project/API%20Testing/README.md)
- [API test execution workbook](Automation%20Exercise%20Project/API%20Testing/Documentation/Automation%20Exercise%20API%20Test%20Cases.xlsx)
- [Corrected Postman collection](Automation%20Exercise%20Project/API%20Testing/Collections/Automation%20Exercise%20QA%20-%20Corrected%2014%20Requests.postman_collection.json)
- [Postman environment](Automation%20Exercise%20Project/API%20Testing/Environments/Automation%20Exercise%20QA.postman_environment.json)
- [Collection-run summary](Automation%20Exercise%20Project/API%20Testing/Execution%20Results/Postman%20Reports/AE-API_Full-Collection_QA_2026-08-01-Run-Summary.md)
- [Clean August 9 collection-run summary](Automation%20Exercise%20Project/API%20Testing/Execution%20Results/Postman%20Reports/AE-API_Full-Collection_QA_2026-08-09-Run-Summary.md)
- [API execution screenshots](Automation%20Exercise%20Project/API%20Testing/Execution%20Results/Screenshots)

### Playwright Automation

The Playwright project contains 14 API scenarios and 19 mapped UI scenarios. It captures evidence, protects credentials through a private environment file, and produces both a stakeholder-oriented QA analytics report and Playwright's technical report. API automation currently covers all 14 canonical requirements; UI results remain independently traceable from the manual execution record.

- [Automation project, coverage, and commands](Automation%20Exercise%20Project/Automation/README.md)
- [Automation execution evidence](Automation%20Exercise%20Project/Automation/Execution%20Evidence)

## Featured Project 2: Online Sales Portal SQL and Power BI Analysis

- [Open the complete SQL Analysis project overview](SQL%20Analysis%20Project/README.md)

This project demonstrates database design and analytical SQL using a fictional online-sales dataset. The database contains six related tables:

- `customers`
- `products`
- `orders`
- `order_items`
- `payments`
- `inventory_logs`

The repository includes a reproducible schema, sanitized sample data, 15 verified business-analysis queries, and a two-page interactive Power BI dashboard covering sales and inventory.

### SQL Skills Demonstrated

- `SELECT`, `FROM`, and `WHERE`
- `AND`, `OR`, and `LIKE`
- Ascending and descending sorting
- `COUNT`, `SUM`, `AVG`, and `ROUND`
- Aliases and `GROUP BY`
- Two-table and three-table `INNER JOIN` operations
- Scalar subqueries
- Product, order, payment, revenue, and inventory analysis

### SQL Deliverables

- [Database schema](SQL%20Analysis%20Project/Database/online_sales_portal_schema.sql)
- [Sanitized sample data](SQL%20Analysis%20Project/Database/online_sales_portal_sample_data.sql)
- [Complete 15-query analysis script](SQL%20Analysis%20Project/Queries/online_sales_portal_analysis.sql)
- [Consolidated query results report](SQL%20Analysis%20Project/Documentation/online_sales_portal_query_results_report.md)
- [Power BI dashboard overview](SQL%20Analysis%20Project/Power%20Bi/README.md)
- [Power BI report file](SQL%20Analysis%20Project/Power%20Bi/online_sales_portal_dashboard.pbix)

## Featured Project 3: Hacker News Playwright Validation

<p align="center">
  <img src="QA%20Wolf%20Take%20Home/assets/qa-wolf-logo.png" alt="QA Wolf" width="260" />
</p>

This JavaScript and Playwright project validates that exactly the first 100 articles on [Hacker News Newest](https://news.ycombinator.com/newest) are ordered from newest to oldest.

Because Hacker News uses pagination, the script follows the `More` link across four pages, collects exact machine-readable timestamps, and compares every neighboring article. Equal timestamps are accepted, while incomplete records, duplicate IDs, invalid timestamps, and ordering inversions fail the run with a specific diagnostic message.

### Reliability and Reporting Features

- Bounded retries for temporary navigation failures
- HTTP response and article-row readiness checks
- Exact 100-article collection limit
- Duplicate-ID and missing-data protection
- Timestamp validation using JavaScript `Date` objects
- Guaranteed browser cleanup with `try` / `finally`
- Headless execution for automation and headed execution for demonstrations
- Automatically generated QA Wolf-styled HTML evidence report
- PASS/FAIL summary, run duration, pagination metrics, and 100 traceable article results
- Automatic report opening after headed runs

### Project Deliverables

- [Project instructions and setup](QA%20Wolf%20Take%20Home/README.md)
- [Playwright validation script](QA%20Wolf%20Take%20Home/index.js)
- [HTML evidence reporter](QA%20Wolf%20Take%20Home/reporter.js)
- [Latest execution report](QA%20Wolf%20Take%20Home/reports/qa-wolf-hacker-news-report.html)

Run the visible demonstration from the project directory with:

```powershell
npm.cmd install
npm.cmd run test:headed
```

## Tools and Technologies

| Category | Tools |
|---|---|
| Test management | Jira Cloud, Microsoft Excel, requirements traceability matrix, defect log |
| Manual testing | Browser developer workflow, screenshot evidence, exploratory testing |
| API testing | Postman, collection runner, JSON validation, environment variables |
| Automation | Playwright, JavaScript, TypeScript, Node.js, Chromium |
| Database and analysis | MySQL, MySQL Workbench, SQL |
| Business intelligence | Microsoft Power BI, Power Query, DAX, ODBC |
| Version control | Git, GitHub, GitHub Desktop |

## Core Competencies Demonstrated

- Software Testing Life Cycle fundamentals
- Test-case design and execution
- Positive, negative, functional, regression, exploratory, and security-oriented testing
- Objective expected-versus-actual result documentation
- Severity and priority classification
- Reproducible defect reporting
- Requirements coverage and gap analysis
- API request construction and response validation
- Distinguishing transport-level HTTP status from JSON business response codes
- Automated browser testing and failure diagnostics
- Pagination-aware data collection and chronological-order validation
- Stakeholder-friendly automated HTML evidence reporting
- Secure handling of credentials and sanitized evidence
- Relational database design and SQL analysis
- Power BI data modeling, DAX measures, interactive slicers, and dashboard design
- Professional repository organization and version control

## Current Development Focus

- Keep the clean Postman regression run and its sanitized evidence synchronized with future API changes
- Execute the 8 remaining Jira manual coverage-gap cases and reconcile the outcomes back to the formal RTM
- Retest open defects when fixes become available
- Refine Power BI presentation styling and expand the dataset over time
- Keep README landing pages and traceability links synchronized as each workstream matures

## Repository Structure


```text
Qa-Portfolio/
├── Automation Exercise Project/
│   ├── API Testing/
│   ├── Automation/
│   ├── Bug Report/
│   ├── Screenshots/
│   ├── Test Cases/
│   └── Test Plan/
├── SQL Analysis Project/
│   ├── Database/
│   ├── Documentation/
│   └── Queries/
├── QA Wolf Take Home/
│   ├── assets/
│   ├── reports/
│   ├── index.js
│   └── reporter.js
└── README.md
```

