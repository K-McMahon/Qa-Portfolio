# Jira Backlog Automation Test Cases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create five complete automation Test Case records in Jira and link each to the correct AEQA Backlog Requirement without duplicating existing manual cases or AEQA-19's automation Sub-task.

**Architecture:** Use the Atlassian connector for semantic Jira reads and writes. Preflight the Backlog immediately before mutation, create each Test Case with an exact field payload, link it using Jira's `Testing` relationship, then re-fetch every created issue and affected Requirement to verify fields and traceability.

**Tech Stack:** Jira Cloud / Atlassian Rovo connector, AEQA custom `Requirement` and `Test Case` issue types, Automation Exercise official Test Cases 21, 22, 24, 25, and 26.

## Global Constraints

- Do not create an automation Test Case for AEQA-19 because AEQA-123 is already its automation Sub-task.
- Do not modify or duplicate the existing manual Test Cases AEQA-113, AEQA-114, AEQA-116, AEQA-117, and AEQA-118.
- New records must use Project `AEQA`, Issue Type `Test Case`, Status `Backlog`, and execution text `Not Run — automation planned`.
- Priority must inherit from the Requirement: Medium for AEQA-21, High for AEQA-22, High for AEQA-24, Medium for AEQA-25, and Medium for AEQA-26.
- Every description must name environment `QA | https://automationexercise.com` and contain Objective, Preconditions, Test Data, Automation Steps, Expected Results and Assertions, Traceability, Execution Status, and Evidence.
- Use synthetic test identity and payment data; never store credentials, real payment data, or private values in Jira.
- Link each new Test Case to its Requirement using link type `Testing`, with the Test Case as the inward issue and the Requirement as the outward issue so Jira displays `Test Case tests Requirement`.
- Labels must include `automation`, `playwright`, `coverage-gap`, `rtm-test-case`, the functional-area label, and the lowercase Requirement identifier.

---

### Task 1: Reconfirm the Mutation Set and Jira Field Options

**Files:**
- Read: `docs/superpowers/specs/2026-08-17-jira-backlog-automation-testcases-design.md`

**Interfaces:**
- Consumes: Current AEQA Backlog, Test Case create metadata, issue-link types.
- Produces: A verified five-Requirement mutation set and valid Jira field/link values.

- [ ] **Step 1: Re-query Backlog Requirements and their child Sub-tasks.**

Use JQL:

```text
project = AEQA AND status = Backlog AND issuetype = Requirement ORDER BY key ASC
project = AEQA AND issuetype = Sub-task AND parent in (AEQA-19, AEQA-21, AEQA-22, AEQA-24, AEQA-25, AEQA-26) ORDER BY parent, key ASC
```

Expected: the six Requirements remain in Backlog; only AEQA-19 has an automation Sub-task, AEQA-123.

- [ ] **Step 2: Search for duplicate automation Test Cases.**

Use JQL:

```text
project = AEQA AND issuetype = "Test Case" AND (labels = automation OR summary ~ "AE-AUTO-") ORDER BY key ASC
```

Expected: no existing Test Case already covers the five proposed summaries. Stop rather than duplicate any match.

- [ ] **Step 3: Confirm field and link values.**

Expected valid values:

```text
Project: AEQA — Automation Exercise QA
Issue Type: Test Case
Status after creation: Backlog
Priorities: High, Medium
Link type: Testing (outward: tests; inward: is tested by)
```

---

### Task 2: Create and Link the Five Automation Test Cases

**Files:**
- Read: `docs/superpowers/specs/2026-08-17-jira-backlog-automation-testcases-design.md`

**Interfaces:**
- Consumes: Task 1's verified mutation set.
- Produces: Five Jira `Test Case` keys, each linked to exactly one Requirement.

- [ ] **Step 1: Create and link the AEQA-21 automation Test Case.**

```text
Summary: AE-AUTO-REVIEW-001 - Automate product review submission in Playwright
Priority: Medium
Labels: automation, playwright, coverage-gap, rtm-test-case, reviews, req-review-001
Link: new Test Case tests AEQA-21

Objective:
Validate that Playwright can submit a product review and verify the site's success confirmation.

Preconditions:
- automationexercise.com is reachable in the QA environment.
- No authenticated account is required.

Test Data:
- A generated synthetic name and email address.
- Review text identifying the automated QA run without personal data.

Automation Steps:
1. Open https://automationexercise.com and select Products.
2. Assert the All Products page is displayed.
3. Open the first product with View Product.
4. Assert Write Your Review is visible.
5. Fill Name, Email Address, and Add Review with synthetic data.
6. Select Submit.
7. Assert the message Thank you for your review. is visible.

Expected Results and Assertions:
- Product details and the review form load successfully.
- The populated review is accepted.
- The exact success message is displayed.

Traceability: AEQA-21 / REQ-REVIEW-001 / official Test Case 21.
Execution Status: Not Run — automation planned.
Evidence: attach the Playwright HTML result and screenshots of the completed form and success message after execution.
Environment: QA | https://automationexercise.com
```

- [ ] **Step 2: Create and link the AEQA-22 automation Test Case.**

```text
Summary: AE-AUTO-CART-005 - Automate Recommended Items add-to-cart in Playwright
Priority: High
Labels: automation, playwright, coverage-gap, rtm-test-case, cart, recommended-items, req-cart-005
Link: new Test Case tests AEQA-22

Objective:
Validate that Playwright can add a product from Recommended Items and verify the same product in the cart.

Preconditions:
- The Automation Exercise home page is reachable.
- Recommended Items are available near the page footer.

Test Data:
- Capture the displayed name of the recommended product selected during the run.

Automation Steps:
1. Open https://automationexercise.com.
2. Scroll to the bottom of the home page.
3. Assert RECOMMENDED ITEMS is visible.
4. Record the name of a visible recommended product.
5. Select Add to cart for that product.
6. Select View Cart in the confirmation dialog.
7. Assert the cart contains the recorded product name.

Expected Results and Assertions:
- Recommended Items are displayed.
- Add to cart produces the confirmation dialog.
- The selected product appears in the cart.

Traceability: AEQA-22 / REQ-CART-005 / official Test Case 22.
Execution Status: Not Run — automation planned.
Evidence: attach the Playwright HTML result and screenshots of Recommended Items and the matching cart row after execution.
Environment: QA | https://automationexercise.com
```

- [ ] **Step 3: Create and link the AEQA-24 automation Test Case.**

```text
Summary: AE-AUTO-ORDER-005 - Automate invoice download after purchase in Playwright
Priority: High
Labels: automation, playwright, coverage-gap, rtm-test-case, checkout, invoice, end-to-end, req-order-005
Link: new Test Case tests AEQA-24

Objective:
Validate an end-to-end purchase and confirm that Playwright receives a usable invoice download.

Preconditions:
- The Automation Exercise site and checkout are reachable.
- Synthetic registration and test-payment values are available through secure local configuration.

Test Data:
- A unique synthetic account generated for the run.
- Non-production test card values loaded at runtime; values are not stored in Jira evidence.

Automation Steps:
1. Open https://automationexercise.com and assert the home page is visible.
2. Add a product to the cart, open Cart, and assert the cart page.
3. Select Proceed To Checkout, then Register / Login.
4. Create a synthetic account and assert ACCOUNT CREATED!; continue and assert Logged in as the generated username.
5. Return to Cart, proceed to checkout, and verify Address Details and Review Your Order.
6. Enter a non-sensitive order comment and select Place Order.
7. Fill payment fields from secure local test configuration and select Pay and Confirm Order.
8. Assert the successful order confirmation.
9. Start Playwright's download listener and select Download Invoice.
10. Assert the download completes, has an invoice filename, and is not empty.
11. Continue, delete the synthetic account, and assert ACCOUNT DELETED! as cleanup.

Expected Results and Assertions:
- Registration, authentication, checkout, payment confirmation, and cleanup succeed.
- The invoice download event occurs and the downloaded file is usable and non-empty.

Traceability: AEQA-24 / REQ-ORDER-005 / official Test Case 24.
Execution Status: Not Run — automation planned.
Evidence: attach the Playwright HTML result, order confirmation screenshot, and sanitized invoice-download metadata after execution.
Environment: QA | https://automationexercise.com
```

- [ ] **Step 4: Create and link the AEQA-25 automation Test Case.**

```text
Summary: AE-AUTO-NAV-002 - Automate scroll-down and arrow return-to-top in Playwright
Priority: Medium
Labels: automation, playwright, coverage-gap, rtm-test-case, navigation, scroll, req-nav-002
Link: new Test Case tests AEQA-25

Objective:
Validate bottom-of-page navigation and return-to-top behavior using the site's arrow control.

Preconditions:
- The Automation Exercise home page is reachable.

Automation Steps:
1. Open https://automationexercise.com and assert the home page is visible.
2. Scroll to the bottom of the page.
3. Assert SUBSCRIPTION is visible.
4. Select the bottom-right arrow control.
5. Assert the page returns to the top.
6. Assert Full-Fledged practice website for Automation Engineers is visible.

Expected Results and Assertions:
- The footer Subscription section is reachable.
- The arrow control returns the page to the top.
- Expected top-of-page content becomes visible.

Traceability: AEQA-25 / REQ-NAV-002 / official Test Case 25.
Execution Status: Not Run — automation planned.
Evidence: attach the Playwright HTML result and before/after scroll screenshots after execution.
Environment: QA | https://automationexercise.com
```

- [ ] **Step 5: Create and link the AEQA-26 automation Test Case.**

```text
Summary: AE-AUTO-NAV-003 - Automate scroll-down and scroll-up without the arrow in Playwright
Priority: Medium
Labels: automation, playwright, coverage-gap, rtm-test-case, navigation, scroll, req-nav-003
Link: new Test Case tests AEQA-26

Objective:
Validate browser scrolling to the footer and back to the top without using the site's arrow control.

Preconditions:
- The Automation Exercise home page is reachable.

Automation Steps:
1. Open https://automationexercise.com and assert the home page is visible.
2. Scroll to the bottom without selecting the arrow control.
3. Assert SUBSCRIPTION is visible.
4. Scroll to the top using browser scrolling rather than the site arrow.
5. Assert Full-Fledged practice website for Automation Engineers is visible.

Expected Results and Assertions:
- Browser scrolling reaches both the footer and the top successfully.
- The site's arrow control is not used.
- Expected content is visible at both positions.

Traceability: AEQA-26 / REQ-NAV-003 / official Test Case 26.
Execution Status: Not Run — automation planned.
Evidence: attach the Playwright HTML result and before/after scroll screenshots after execution.
Environment: QA | https://automationexercise.com
```

For every step above, create the issue first. If creation succeeds but linking fails, retry and verify the one missing `Testing` link before creating the next issue.

---

### Task 3: Verify Jira Fields, Links, and Backlog Coverage

**Files:**
- Read: `docs/superpowers/specs/2026-08-17-jira-backlog-automation-testcases-design.md`

**Interfaces:**
- Consumes: The five created Test Case keys from Task 2.
- Produces: A verified Backlog traceability matrix with no duplicates or missing required fields.

- [ ] **Step 1: Fetch all five created Test Cases.**

Verify for each:

```text
Issue Type = Test Case
Status = Backlog
Priority = planned inherited value
Labels contain every planned label
Description contains all eight planned sections/fields
Execution Status = Not Run — automation planned
Exactly one Testing link targets the matching Requirement
```

- [ ] **Step 2: Re-fetch all six Backlog Requirements.**

Expected matrix:

```text
AEQA-19: manual AEQA-111 + automation Sub-task AEQA-123; no new automation Test Case
AEQA-21: manual AEQA-113 + new automation Test Case
AEQA-22: manual AEQA-114 + new automation Test Case
AEQA-24: manual AEQA-116 + new automation Test Case
AEQA-25: manual AEQA-117 + new automation Test Case
AEQA-26: manual AEQA-118 + new automation Test Case
```

- [ ] **Step 3: Run a duplicate and scope audit.**

Confirm exactly five new summaries begin with `AE-AUTO-`, no existing manual Test Cases changed, and no Requirement outside the six-item Backlog set received a new link.

- [ ] **Step 4: Report created keys and clickable Jira links.**

Report every new Test Case → Requirement relationship and call out any field the connector could not set rather than claiming it was populated.
