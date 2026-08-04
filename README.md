# Kevin McMahon — QA Analyst & Data Portfolio

## About Me

I am a computer science graduate with professional experience in operations, project coordination, process improvement, employee training, troubleshooting, production quality assurance, and customer service.

I am transitioning into software quality assurance and data analysis. This portfolio demonstrates hands-on work in manual web testing, requirements traceability, defect reporting, API testing, browser automation, SQL database design, and business-focused data analysis.

## Portfolio at a Glance

| Area | Completed Work | Current Result |
|---|---|---|
| Manual UI testing | 21 documented and executed test cases | 18 passed, 3 failed |
| Defect reporting | 6 independently documented defects | 6 open, 3 High severity |
| Requirements traceability | 44 UI, API, and tester-derived requirements | 31 fully covered, 1 partially covered, 12 not covered |
| API testing | 14 Postman API cases with execution evidence | 12 passed, 2 failed |
| API collection run | Automated Postman assertions across the collection | 37 assertions: 28 passed, 9 failed; 2 runner errors documented |
| Browser automation | Playwright end-to-end login scenario | 1 passing Chromium test with evidence |
| SQL analysis | Six-table relational sales database and 15 analytical queries | Schema, sanitized data, queries, joins, subquery, and results report complete |

## Featured Project 1: Automation Exercise QA

**Application under test:** [Automation Exercise](https://automationexercise.com/)

**Testing performed:** Manual functional testing, negative testing, security-oriented input validation, API testing, traceability analysis, defect reporting, and Playwright automation.

### Manual Test Repository

The manual repository contains 21 fully executed cases covering:

- Signup and account creation
- Login, invalid authentication, and logout
- Account persistence and deletion
- Product listing, details, and search
- Shopping-cart behavior
- Contact form submission
- Navigation
- Home-page and cart-page subscriptions

The workbook records preconditions, controlled test data, numbered steps, expected and actual results, execution status, evidence, defects, and requirement IDs.

- [Open the manual test-case repository](Automation%20Exercise%20Project/Test%20Cases/Automation%20Exercise%20-%20Test%20Case%20Repository.xlsx)
- [Browse UI execution evidence](Automation%20Exercise%20Project/Screenshots)

**Execution summary:** 21 executed; 18 passed; 3 failed; 0 not run.

### Defect Management

Six open defects are documented with reproducible steps, expected and actual behavior, severity, priority, environment, evidence, retest status, and QA notes.

Key findings include:

- Authenticated user information remaining visible after logout/back navigation
- An unhandled logout `KeyError` exposing internal Django debugging information
- Missing overall cart total
- Product quantity field not responding to edits
- Unsupported API method returning HTTP 200 instead of HTTP 405
- Product-search API returning all products when a required parameter is omitted

- [Open the defect log](Automation%20Exercise%20Project/Bug%20Report/Automation%20Exercise%20Defect%20Log.xlsx)

### Requirements Traceability Matrix

The RTM cross-references:

- 26 official UI scenarios
- 14 official API scenarios
- 4 tester-derived requirements
- 21 manual UI test cases
- API test cases and linked defects

| Coverage Status | Requirements |
|---|---:|
| Fully Covered | 31 |
| Partially Covered | 1 |
| Not Covered | 12 |
| **Total** | **44** |

The remaining gaps are primarily checkout, additional catalog behavior, product reviews, recommended items, and scroll-navigation scenarios.

- [Open the requirements traceability matrix](Automation%20Exercise%20Project/Test%20Plan/Automation%20Exercise%20Requirements%20Traceability%20Matrix.xlsx)

### API Testing With Postman

The Postman project contains 14 positive and negative API cases organized into Products, Brands, Product Search, Authentication, and Account Management modules.

Included assets:

- Version-controlled Postman collection and environment
- Environment-variable-based endpoints and credentials
- Request-level validation scripts
- API execution workbook
- 14 execution screenshots
- Reconstructed collection-run report and JSON record
- Defect links for failed API behavior

**Manual API execution:** 14 executed; 12 passed; 2 failed.

**Collection-run diagnostics:** 37 assertions ran; 28 passed and 9 failed. Two runner errors and one request without attached tests were preserved in the report rather than hidden, demonstrating investigation of both application behavior and test-script reliability.

- [API testing overview](Automation%20Exercise%20Project/API%20Testing/README.md)
- [API test execution workbook](Automation%20Exercise%20Project/API%20Testing/Documentation/Automation%20Exercise%20API%20Test%20Cases.xlsx)
- [Postman collection](Automation%20Exercise%20Project/API%20Testing/Collections/Automation%20Exercise%20QA.postman_collection.json)
- [Postman environment](Automation%20Exercise%20Project/API%20Testing/Environments/Automation%20Exercise%20QA.postman_environment.json)
- [Collection-run summary](Automation%20Exercise%20Project/API%20Testing/Execution%20Results/Postman%20Reports/AE-API_Full-Collection_QA_2026-08-01-Run-Summary.md)
- [API execution screenshots](Automation%20Exercise%20Project/API%20Testing/Execution%20Results/Screenshots)

### Playwright Automation

The automation project currently includes a passing Chromium test for `AE-LOGIN-001 — Login with valid credentials`.

The test:

1. Opens the application.
2. Navigates to Signup / Login.
3. Verifies the login form.
4. Uses credentials stored in a private `.env` file.
5. Submits valid credentials.
6. Verifies the authenticated username indicator.
7. Saves execution evidence without committing credentials.

- [Automation project and commands](Automation%20Exercise%20Project/Automation/README.md)
- [Playwright test](Automation%20Exercise%20Project/Automation/tests/login-success.spec.ts)
- [Execution summary](Automation%20Exercise%20Project/Automation/Test%20Results/AE-LOGIN-001-2026-08-01.md)
- [Passing-test evidence](Automation%20Exercise%20Project/Automation/Execution%20Evidence/AE-LOGIN-001-success.png)

## Featured Project 2: Online Sales Portal SQL Analysis

This project demonstrates database design and analytical SQL using a fictional online-sales dataset. The database contains six related tables:

- `customers`
- `products`
- `orders`
- `order_items`
- `payments`
- `inventory_logs`

The repository includes a reproducible schema, sanitized sample data, and 15 verified business-analysis queries.

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

## Tools and Technologies

| Category | Tools |
|---|---|
| Test management | Microsoft Excel, requirements traceability matrix, defect log |
| Manual testing | Browser developer workflow, screenshot evidence, exploratory testing |
| API testing | Postman, collection runner, JSON validation, environment variables |
| Automation | Playwright, TypeScript, Node.js, Chromium |
| Database and analysis | MySQL, MySQL Workbench, SQL |
| Visualization practice | Microsoft Power BI |
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
- Secure handling of credentials and sanitized evidence
- Relational database design and SQL analysis
- Professional repository organization and version control

## Current Development Focus

- Expand Playwright coverage beyond successful login
- Create manual cases for the remaining RTM coverage gaps
- Retest documented defects when fixes become available
- Continue Power BI dashboard development and add a publishable dashboard artifact
- Add concise project-level summaries as each workstream matures

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
└── README.md
```

## Portfolio Safety

Credentials, passwords, tokens, cookies, and private environment values are excluded from version control. Published database data is fictional and sanitized. Evidence should be reviewed for personal or session information before being committed.
