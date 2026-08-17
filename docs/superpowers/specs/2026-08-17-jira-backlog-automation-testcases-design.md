# Jira Backlog Automation Test Case Design

Date: August 17, 2026
Project: AEQA — Automation Exercise QA

## Objective

Close automation-traceability gaps for the six Requirements currently in the AEQA Backlog without duplicating existing manual Test Cases or existing automation Sub-tasks.

## Audit Result

| Requirement | Existing manual Test Case | Existing automation Sub-task | Action |
|---|---|---|---|
| AEQA-19 / REQ-CATALOG-002 | AEQA-111 | AEQA-123 | No new automation Test Case |
| AEQA-21 / REQ-REVIEW-001 | AEQA-113 | None | Create and link automation Test Case |
| AEQA-22 / REQ-CART-005 | AEQA-114 | None | Create and link automation Test Case |
| AEQA-24 / REQ-ORDER-005 | AEQA-116 | None | Create and link automation Test Case |
| AEQA-25 / REQ-NAV-002 | AEQA-117 | None | Create and link automation Test Case |
| AEQA-26 / REQ-NAV-003 | AEQA-118 | None | Create and link automation Test Case |

## Jira Field Design

Each new record will use:

- Project: `AEQA — Automation Exercise QA`
- Issue type: `Test Case`
- Status: `Backlog` (project default)
- Execution state in description: `Not Run — automation planned`
- Priority: inherited from its Requirement (`High` or `Medium`)
- Environment: `QA | https://automationexercise.com`
- Labels: `automation`, `playwright`, `coverage-gap`, `rtm-test-case`, the functional-area label, and the Requirement key label
- Link type: `Testing`, with the Test Case `tests` the Requirement
- Assignee: unassigned until the automation work is scheduled

Descriptions will include Objective, Preconditions, Test Data, Automation Steps, Expected Results and Assertions, Traceability, Execution Status, and Evidence requirements. No real credentials or payment data will be stored in Jira.

## Test Cases to Create

### 1. AE-AUTO-REVIEW-001 — Automate product review submission in Playwright

- Requirement: AEQA-21 / REQ-REVIEW-001
- Priority: Medium
- Official source: Automation Exercise Test Case 21
- Steps: open Products; confirm All Products; open the first product; confirm Write Your Review; enter synthetic name, email, and review text; submit; assert `Thank you for your review.`

### 2. AE-AUTO-CART-005 — Automate Recommended Items add-to-cart in Playwright

- Requirement: AEQA-22 / REQ-CART-005
- Priority: High
- Official source: Automation Exercise Test Case 22
- Steps: open the home page; scroll to the bottom; assert Recommended Items; record a recommended product; add it to the cart; open View Cart; assert the same product is present.

### 3. AE-AUTO-ORDER-005 — Automate invoice download after purchase in Playwright

- Requirement: AEQA-24 / REQ-ORDER-005
- Priority: High
- Official source: Automation Exercise Test Case 24
- Steps: open the home page; add a product; open Cart and checkout; register a synthetic user; confirm account creation and login; return to checkout; verify address/order details; place the order; use synthetic test-payment data from secure local configuration; confirm the order; download the invoice; assert a non-empty invoice file; delete the synthetic account as cleanup.

### 4. AE-AUTO-NAV-002 — Automate scroll-down and arrow return-to-top in Playwright

- Requirement: AEQA-25 / REQ-NAV-002
- Priority: Medium
- Official source: Automation Exercise Test Case 25
- Steps: open and verify the home page; scroll to the bottom; assert Subscription; click the bottom-right arrow; assert the page returns to the top and `Full-Fledged practice website for Automation Engineers` is visible.

### 5. AE-AUTO-NAV-003 — Automate scroll-down and scroll-up without the arrow in Playwright

- Requirement: AEQA-26 / REQ-NAV-003
- Priority: Medium
- Official source: Automation Exercise Test Case 26
- Steps: open and verify the home page; scroll to the bottom without using the arrow; assert Subscription; scroll to the top using browser scrolling; assert `Full-Fledged practice website for Automation Engineers` is visible.

## Verification

After creation:

1. Fetch each new issue and verify summary, type, priority, labels, description sections, and Backlog status.
2. Verify each Requirement contains exactly one new `Testing` link from the matching automation Test Case.
3. Re-query all six Backlog Requirements to confirm AEQA-19 remains covered by AEQA-123 and the other five now have both their existing manual Test Case and their new automation Test Case.
4. Confirm no duplicate automation Test Cases were created and no existing manual Test Cases were modified.

## Boundaries

- This work creates Jira planning and traceability records only; it does not claim that Playwright scripts have been implemented or executed.
- All new automation Test Cases remain Not Run until code and execution evidence exist.
- The official Automation Exercise steps are the behavioral source of truth; descriptions may clarify Playwright assertions without changing the user flow.
