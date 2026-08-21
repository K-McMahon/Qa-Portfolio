# Kevin McMahon | Software Quality Assurance Portfolio

I am a computer science graduate building a career in software quality assurance and data analysis. My professional background includes operations, project coordination, process improvement, employee training, troubleshooting, production quality, and customer service.

This portfolio shows how I approach quality from several directions: planning and executing tests, tracing requirements, investigating defects, validating APIs, building browser automation, checking data with SQL, creating dashboards, and explaining results to stakeholders. Each project includes the files and evidence behind the summary.

## Portfolio at a Glance

| Project | Focus | Result |
|---|---|---|
| [Automation Exercise QA](Automation%20Exercise%20Project/README.md) | Full QA lifecycle for an e-commerce website | 44 requirements covered, 53 Jira test cases, 6 investigated defects, 14 API cases, and Playwright automation |
| [QA Wolf Hacker News Validation](QA%20Wolf%20Take%20Home/README.md) | Independent Playwright coding challenge | Exactly 100 unique articles validated in newest-to-oldest order with an HTML evidence report |
| [Online Sales Portal Analysis](SQL%20Analysis%20Project/README.md) | SQL database design and business intelligence | Six-table database, 15 verified SQL analyses, and a two-page Power BI dashboard |
| [Academic Projects](Academic/README.md) | Quality assurance and web analytics coursework | 21 original artifacts covering requirements, test planning, execution, defects, automation research, analytics, and dashboards |

## Automation Exercise QA

This is an end-to-end testing project for a public e-commerce website. I reviewed requirements, designed manual and automated tests, recorded execution evidence, investigated possible defects, tested APIs, and organized the work in Jira.

The project includes 44 covered requirements and 53 Jira test cases. The current result is 51 passed and 2 failed because of documented application defects. Six possible defects were investigated: three remain open, and three were rejected after corrected retesting or review showed that the application was working as designed.

The API portion contains 14 positive and negative cases for products, brands, search, authentication, and account management. All 14 reconciled cases passed, and the corrected Postman collection completed 42 of 42 assertions without errors. Playwright provides repeatable API and browser coverage with reports, screenshots, video, and links back to the test documentation.

Key evidence:

- [Requirements traceability matrix and test plan](Automation%20Exercise%20Project/Test%20Plan/README.md)
- [Manual test case repository](Automation%20Exercise%20Project/Test%20Cases/Automation%20Exercise%20-%20Test%20Case%20Repository.xlsx)
- [Test execution screenshots](Automation%20Exercise%20Project/Screenshots/README.md)
- [Defect log and reports](Automation%20Exercise%20Project/Bug%20Report/README.md)
- [Jira project evidence](Automation%20Exercise%20Project/Portfolio%20Evidence/Jira/README.md)
- [API testing project](Automation%20Exercise%20Project/API%20Testing/README.md)
- [Playwright automation project](Automation%20Exercise%20Project/Automation/README.md)

## QA Wolf Hacker News Validation

This JavaScript and Playwright project checks that the first 100 articles on Hacker News Newest are ordered from newest to oldest. Because the site uses pagination, the script follows the `More` link across several pages and collects exact timestamps until it reaches 100 records.

The validation rejects missing data, duplicate article IDs, invalid timestamps, incomplete results, and ordering problems. It also includes bounded retries for temporary navigation failures and safely closes the browser after every run.

The project creates an HTML evidence report with the overall result, run time, pagination details, and all 100 article records. This demonstrates independent problem solving, reliable browser automation, data validation, failure diagnostics, and stakeholder-friendly reporting.

Key evidence:

- [Project setup and approach](QA%20Wolf%20Take%20Home/README.md)
- [Playwright validation script](QA%20Wolf%20Take%20Home/index.js)
- [HTML evidence reporter](QA%20Wolf%20Take%20Home/reporter.js)
- [Latest execution report](QA%20Wolf%20Take%20Home/reports/qa-wolf-hacker-news-report.html)

## Online Sales Portal SQL and Power BI Analysis

This project uses a fictional online sales business to demonstrate database design, SQL analysis, and visual reporting. I created six related tables for customers, products, orders, order items, payments, and inventory activity, along with sanitized sample data that makes the project reproducible.

The analysis contains 15 verified queries that answer questions about sales, customers, payments, products, revenue, and inventory. The queries demonstrate filtering, sorting, aggregation, aliases, grouping, two-table and three-table joins, and subqueries.

A two-page Power BI dashboard turns the results into sales and inventory views. It uses data modeling, Power Query, DAX calculations, filters, and interactive visuals to make the findings easier for a business audience to review.

Key evidence:

- [Complete SQL and Power BI project](SQL%20Analysis%20Project/README.md)
- [Database schema and sample data](SQL%20Analysis%20Project/Database/README.md)
- [SQL query collection](SQL%20Analysis%20Project/Queries/README.md)
- [Consolidated results report](SQL%20Analysis%20Project/Documentation/online_sales_portal_query_results_report.md)
- [Power BI dashboard and screenshots](SQL%20Analysis%20Project/Power%20Bi/README.md)

## Academic Quality Assurance and Web Analytics

The academic portfolio contains 21 original files that show the development of my QA and analytics skills through complete course deliverables. Each academic landing page lists the exact filename, explains what the file contains, and identifies the skills it demonstrates.

The Quality Assurance coursework follows a Student Grading System and a Hangman application through requirements, configuration management, test planning, manual execution, defect reporting, software quality processes, and automation framework research. It shows how testing documents connect from the beginning of a project through final defect communication.

The Web Analytics coursework covers education, finance, social media, YouTube, and website performance. The work includes case studies, KPI selection, visualization proposals, dashboard design, data collection, privacy, ethics, and recommendations for non-technical stakeholders.

Key evidence:

- [Academic portfolio overview](Academic/README.md)
- [Quality Assurance coursework and file guide](Academic/Quality%20Assurance/README.md)
- [Web Analytics coursework and file guide](Academic/Web%20Analytics/README.md)
- [YouTube analytics dashboard](Academic/Web%20Analytics/YTDashboard.png)

## QA Skills Across the Portfolio

| Skill | How It Is Demonstrated |
|---|---|
| Requirements analysis | Requirements specification coursework and 44 traced e-commerce requirements |
| Test planning | Formal academic test plans and a portfolio RTM connecting requirements to coverage |
| Manual testing | Positive, negative, functional, regression, exploratory, and security-focused cases |
| Test execution | Expected-versus-actual results, statuses, screenshots, reports, and linked evidence |
| Defect management | Reproduction steps, severity, priority, environment, evidence, retesting, and disposition |
| Jira test management | Linked requirements, test cases, bugs, execution outcomes, and continuous integration records |
| API testing | Postman collections, environments, test data, assertions, screenshots, and run analysis |
| Test automation | Playwright browser and API checks using JavaScript and TypeScript |
| Data validation | Pagination, uniqueness, timestamp, ordering, response, and database checks |
| SQL analysis | Relational design, filtering, aggregation, joins, subqueries, and business questions |
| Visual reporting | HTML evidence reports, Power BI dashboards, Excel charts, and academic presentations |
| Communication | Plain-language summaries for technical and non-technical readers |

## Tools

| Area | Tools |
|---|---|
| Test management | Jira Cloud, Microsoft Excel, RTM, test repository, defect log |
| API testing | Postman, JSON, collection runner, environment variables |
| Automation | Playwright, JavaScript, TypeScript, Node.js, Chromium, GitHub Actions |
| Database and analysis | MySQL, MySQL Workbench, SQL, Microsoft Excel |
| Business intelligence | Power BI, Power Query, DAX, ODBC |
| Version control | Git and GitHub |

## Repository Guide

```text
Qa-Portfolio/
├── Academic/
│   ├── Quality Assurance/
│   └── Web Analytics/
├── Automation Exercise Project/
│   ├── API Testing/
│   ├── Automation/
│   ├── Bug Report/
│   ├── Jira Import Ready/
│   ├── Portfolio Evidence/
│   ├── Screenshots/
│   ├── Test Cases/
│   └── Test Plan/
├── QA Wolf Take Home/
├── SQL Analysis Project/
└── README.md
```

Each portfolio section has its own landing page with supporting files and evidence.
