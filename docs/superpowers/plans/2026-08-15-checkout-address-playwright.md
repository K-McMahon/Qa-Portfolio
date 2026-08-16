# AE-ORDER-004 Checkout Address Playwright Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a deterministic Playwright checkout-address test with branded screenshot, HTML, PDF, and standard Playwright evidence for Jira and RTM traceability.

**Architecture:** A focused UI spec creates a disposable synthetic account, adds a product, and validates checkout delivery and billing blocks. A reusable report helper receives structured execution metadata, renders a self-contained branded HTML document, and prints it to PDF using Playwright Chromium.

**Tech Stack:** TypeScript, Playwright Test 1.62, Node.js filesystem APIs, HTML/CSS.

## Global Constraints

- Work only in `Automation Exercise Project/Automation` in the Desktop repository.
- Use `AEQA-23 / REQ-ORDER-004`, `AEQA-115 / AE-ORDER-004`, `AEQA-102`, and `AEQA-105` exactly.
- Use only synthetic registration and address data; never emit passwords.
- Use `reporting/assets/the-mcmahon-standard-logo.png` prominently and legibly.
- Produce `AE-ORDER-004.png`, `AE-ORDER-004-evidence.html`, and `AE-ORDER-004-evidence.pdf` under `Execution Evidence`.
- Preserve the existing global QA analytics and Playwright HTML reporters.

---

### Task 1: Branded evidence report generator

**Files:**
- Create: `Automation Exercise Project/Automation/reporting/checkout-address-evidence.ts`
- Create: `Automation Exercise Project/Automation/tests/reporting/checkout-address-evidence.spec.ts`

**Interfaces:**
- Produces: `writeCheckoutAddressEvidence(input: CheckoutAddressEvidence): Promise<{ htmlPath: string; pdfPath: string }>`.
- Consumes: structured identifiers, execution result, expected/actual address lines, assertion results, screenshot path, logo path, and output directory.

- [ ] Write a failing unit-style Playwright test that imports the missing helper, generates evidence in a temporary directory, and expects HTML containing the four Jira identifiers and visible logo markup plus a non-empty PDF.
- [ ] Run `npx playwright test tests/reporting/checkout-address-evidence.spec.ts --project=chromium` and confirm failure because the helper does not exist.
- [ ] Implement HTML escaping, file-to-data-URL embedding, branded HTML rendering, atomic HTML writing, and Chromium PDF printing.
- [ ] Re-run the reporting test and confirm it passes.

### Task 2: Disposable checkout-address scenario

**Files:**
- Create: `Automation Exercise Project/Automation/tests/ui/checkout-address.spec.ts`
- Modify: `Automation Exercise Project/Automation/tests/ui/support/ui-test.ts`

**Interfaces:**
- Produces: one test titled `AE-ORDER-004 | REQ-ORDER-004 | Verify checkout delivery and billing addresses`.
- Consumes: the existing `test`, `expect`, `openHome`, `dismissAdOverlay`, and `addListingProduct` helpers plus `writeCheckoutAddressEvidence`.

- [ ] Write the complete scenario first with imports that do not yet exist for registration helpers, ensuring the initial run fails for the missing behavior.
- [ ] Run `npx playwright test tests/ui/checkout-address.spec.ts --project=chromium --workers=1` and confirm the expected failure.
- [ ] Add minimal reusable synthetic registration and account-cleanup helpers to `ui-test.ts`.
- [ ] Implement registration, product/cart setup, checkout navigation, scoped address assertions, screenshot capture, structured result collection, report generation, and cleanup.
- [ ] Re-run the targeted test until it passes against `automationexercise.com`.

### Task 3: Documentation and verification

**Files:**
- Modify: `Automation Exercise Project/Automation/README.md`

**Interfaces:**
- Documents the targeted command and evidence filenames for future portfolio runs.

- [ ] Document the new scenario, Jira/RTM traceability, command, and three dedicated evidence outputs.
- [ ] Run `npx playwright test tests/reporting/checkout-address-evidence.spec.ts tests/ui/checkout-address.spec.ts --project=chromium --workers=1`.
- [ ] Run `npx playwright test --project=chromium` to verify the complete suite.
- [ ] Inspect the generated HTML, PDF, and screenshot for readable branding, correct identifiers, unclipped content, and absence of secrets.
- [ ] Run `git diff --check` and review the final scoped diff.
