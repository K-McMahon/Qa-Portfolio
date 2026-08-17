# README Evidence Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the Automation Exercise portfolio READMEs with the current Jira and Playwright state plus dated, sanitized screenshots of the Kanban board and both automation reports.

**Architecture:** Treat Jira and the saved Playwright reports as evidence sources, capture stable dated images into `Portfolio Evidence`, and make four README landing pages consume the same verified facts and visuals. Preserve older dated Jira images as historical evidence and keep generated `test-results` internals out of the documentation commit.

**Tech Stack:** Markdown, Jira Cloud, Playwright HTML reports, Git, PowerShell verification, in-app browser capture.

## Global Constraints

- Use August 17, 2026 as the date for new evidence filenames and current-state language.
- Never expose credentials, tokens, passwords, private environment values, or unnecessary personal data.
- Preserve older dated Jira screenshots instead of overwriting them.
- Store report screenshots under `Automation Exercise Project/Portfolio Evidence/Automation/`.
- Do not commit unrelated generated files from `Automation Exercise Project/Automation/test-results/`.
- Keep counts, execution statuses, Jira keys, and automation coverage consistent across all four READMEs.

---

### Task 1: Establish the Current Source-of-Truth Snapshot

**Files:**
- Read: `README.md`
- Read: `Automation Exercise Project/README.md`
- Read: `Automation Exercise Project/Jira Import Ready/README.md`
- Read: `Automation Exercise Project/Automation/README.md`
- Read: `Automation Exercise Project/Automation/test-results/qa-analytics/run-summary.json`
- Read: `Automation Exercise Project/Automation/test-results/qa-analytics/index.html`
- Read: `Automation Exercise Project/Automation/test-results/html-report/index.html`

**Interfaces:**
- Consumes: Current Jira AEQA issue fields and the latest saved report outputs.
- Produces: One verified fact set covering Jira work-item counts/statuses, automated test coverage, report run status, and current evidence dates.

- [ ] **Step 1: Query Jira for current AEQA Requirements, Test Cases, Bugs, workflow states, execution statuses, and automation statuses.**

Use the Jira connector with JQL scoped to project `AEQA`; retrieve `key`, `summary`, `issuetype`, `status`, `attachment`, and configured execution/automation fields.

- [ ] **Step 2: Read the latest QA analytics JSON and both report entry pages.**

Record the run ID/date, total tests, passed/failed/skipped counts, browser project, and any intentionally failing regression coverage exactly as displayed.

- [ ] **Step 3: Build a consistency checklist.**

The checklist must contain exact replacement values for:

```text
Requirements:
Test Cases:
Bugs:
Executed / Passed / Failed / Not Run:
Automated API scenarios:
Automated UI scenarios:
Current coverage-gap cases completed:
Current coverage-gap cases remaining:
Latest report run result:
```

- [ ] **Step 4: Verify the fact set against repository artifacts.**

Run:

```powershell
rg -n "44 requirements|48 test cases|Not Run|API scenarios|UI scenarios|AEQA-112|AE-CART-004" README.md "Automation Exercise Project"
```

Expected: every stale statement is identified before editing.

---

### Task 2: Capture the Current Jira Kanban Evidence

**Files:**
- Create: `Automation Exercise Project/Portfolio Evidence/Jira/AEQA-Jira-Kanban-Board-2026-08-17.png`
- Preserve: `Automation Exercise Project/Portfolio Evidence/Jira/AEQA-Jira-Kanban-Board-2026-08-10.png`
- Preserve: `Automation Exercise Project/Portfolio Evidence/Jira/AEQA-Jira-TestCase-Traceability-2026-08-10.png`

**Interfaces:**
- Consumes: The authenticated AEQA Kanban board and the Task 1 fact set.
- Produces: A sanitized, readable board screenshot referenced by project documentation.

- [ ] **Step 1: Open the AEQA Kanban board and select the current all-work view.**

Use board URL:

```text
https://kgmcmahon973.atlassian.net/jira/software/c/projects/AEQA/boards/34
```

- [ ] **Step 2: Arrange the board for evidence capture.**

Close issue-detail overlays, ensure column headings and representative cards are visible, and avoid account menus, notifications, or private overlays.

- [ ] **Step 3: Capture and save the dated screenshot.**

Save exactly as:

```text
Automation Exercise Project/Portfolio Evidence/Jira/AEQA-Jira-Kanban-Board-2026-08-17.png
```

- [ ] **Step 4: Inspect the saved PNG.**

Expected: readable board title/columns, no credential material, and a non-zero file size.

- [ ] **Step 5: Commit the Jira evidence image.**

```powershell
git add -- "Automation Exercise Project/Portfolio Evidence/Jira/AEQA-Jira-Kanban-Board-2026-08-17.png"
git commit -m "docs: capture current Jira board evidence"
```

---

### Task 3: Capture Both Current Automation Reports

**Files:**
- Create: `Automation Exercise Project/Portfolio Evidence/Automation/QA-Analytics-Report-2026-08-17.png`
- Create: `Automation Exercise Project/Portfolio Evidence/Automation/Playwright-HTML-Report-2026-08-17.png`
- Read: `Automation Exercise Project/Automation/test-results/qa-analytics/index.html`
- Read: `Automation Exercise Project/Automation/test-results/html-report/index.html`

**Interfaces:**
- Consumes: The latest saved branded and technical HTML reports.
- Produces: Two stable README-ready screenshots explaining stakeholder versus diagnostic reporting.

- [ ] **Step 1: Start a local static server rooted at the Automation project.**

Run from `Automation Exercise Project/Automation`:

```powershell
npx.cmd http-server . -p 4173 -c-1
```

Expected: the server exposes the saved reports on `http://127.0.0.1:4173/`.

- [ ] **Step 2: Open and inspect the branded QA analytics report.**

Open:

```text
http://127.0.0.1:4173/test-results/qa-analytics/index.html
```

Expected: the report shows the current run summary, traceability/status information, and no secrets.

- [ ] **Step 3: Capture the branded report.**

Save a readable viewport or full-page capture as:

```text
Automation Exercise Project/Portfolio Evidence/Automation/QA-Analytics-Report-2026-08-17.png
```

- [ ] **Step 4: Open and inspect Playwright's technical report.**

Open:

```text
http://127.0.0.1:4173/test-results/html-report/index.html
```

Expected: the report shows the suite/test results and diagnostic navigation without exposing private values.

- [ ] **Step 5: Capture the Playwright report.**

Save as:

```text
Automation Exercise Project/Portfolio Evidence/Automation/Playwright-HTML-Report-2026-08-17.png
```

- [ ] **Step 6: Verify both PNGs and stop the local server.**

Run:

```powershell
Get-Item "Automation Exercise Project/Portfolio Evidence/Automation/*.png" | Select-Object Name, Length
```

Expected: both dated images exist and have non-zero lengths.

- [ ] **Step 7: Commit the report screenshots.**

```powershell
git add -- "Automation Exercise Project/Portfolio Evidence/Automation/QA-Analytics-Report-2026-08-17.png" "Automation Exercise Project/Portfolio Evidence/Automation/Playwright-HTML-Report-2026-08-17.png"
git commit -m "docs: add current automation report screenshots"
```

---

### Task 4: Refresh the Four README Landing Pages

**Files:**
- Modify: `README.md`
- Modify: `Automation Exercise Project/README.md`
- Modify: `Automation Exercise Project/Jira Import Ready/README.md`
- Modify: `Automation Exercise Project/Automation/README.md`

**Interfaces:**
- Consumes: Task 1 fact set and the three Task 2/3 image paths.
- Produces: Consistent portfolio navigation, current metrics, and current/historical evidence presentation.

- [ ] **Step 1: Update the root portfolio summary.**

Replace stale Jira/manual/automation counts and current-development wording with the verified Task 1 values. Keep detailed evidence images in the project-level READMEs and link to those sections from the root page.

- [ ] **Step 2: Update the Automation Exercise project overview.**

Update `Results at a Glance`, `Current Jira execution state`, and coverage-gap language. Display the new Kanban screenshot first, then retain the August 10 board and traceability images under `Historical Jira Evidence`.

- [ ] **Step 3: Update Jira Import Ready documentation.**

Keep import package counts and sequence as historical migration facts. Add a clearly labeled `Current Reconciled State — August 17, 2026` section using Task 1 values, display the new Kanban board, and move older visuals beneath `Historical Import Evidence`.

- [ ] **Step 4: Update the Automation README.**

Correct current UI/API coverage and report-run details. Add `Report Evidence` with these images and captions:

```markdown
![Branded QA analytics report](../Portfolio%20Evidence/Automation/QA-Analytics-Report-2026-08-17.png)

![Playwright technical HTML report](../Portfolio%20Evidence/Automation/Playwright-HTML-Report-2026-08-17.png)
```

Explain that the branded report is stakeholder-facing and the Playwright report supports engineering diagnostics, traces, attachments, and failure investigation.

- [ ] **Step 5: Review the Markdown diff for consistent language.**

Run:

```powershell
git diff -- README.md "Automation Exercise Project/README.md" "Automation Exercise Project/Jira Import Ready/README.md" "Automation Exercise Project/Automation/README.md"
```

Expected: only current-state copy, links, headings, and image references change.

- [ ] **Step 6: Commit the README refresh.**

```powershell
git add -- README.md "Automation Exercise Project/README.md" "Automation Exercise Project/Jira Import Ready/README.md" "Automation Exercise Project/Automation/README.md"
git commit -m "docs: refresh Jira and automation portfolio READMEs"
```

---

### Task 5: Validate the Published Documentation Set

**Files:**
- Verify: `README.md`
- Verify: `Automation Exercise Project/README.md`
- Verify: `Automation Exercise Project/Jira Import Ready/README.md`
- Verify: `Automation Exercise Project/Automation/README.md`
- Verify: `Automation Exercise Project/Portfolio Evidence/Jira/AEQA-Jira-Kanban-Board-2026-08-17.png`
- Verify: `Automation Exercise Project/Portfolio Evidence/Automation/QA-Analytics-Report-2026-08-17.png`
- Verify: `Automation Exercise Project/Portfolio Evidence/Automation/Playwright-HTML-Report-2026-08-17.png`

**Interfaces:**
- Consumes: All implementation outputs.
- Produces: A clean, internally consistent, reviewable documentation change set.

- [ ] **Step 1: Check Markdown formatting.**

Run:

```powershell
git diff --check
```

Expected: exit code 0 and no whitespace errors.

- [ ] **Step 2: Validate every new image reference.**

Run a PowerShell check that extracts the three exact dated image paths from the four READMEs and confirms each decoded local path exists.

Expected: zero missing referenced images.

- [ ] **Step 3: Scan for stale values.**

Run:

```powershell
rg -n "2026-08-10|10 remain Not Run|14 portfolio UI scenarios|AEQA-121.*In Progress" README.md "Automation Exercise Project/README.md" "Automation Exercise Project/Jira Import Ready/README.md" "Automation Exercise Project/Automation/README.md"
```

Expected: older dates appear only in explicitly historical evidence sections; stale current-state claims do not appear.

- [ ] **Step 4: Inspect all three new images visually.**

Expected: each image is legible, correctly cropped, and sanitized.

- [ ] **Step 5: Verify Git scope.**

Run:

```powershell
git status -sb
git diff --stat origin/main...HEAD
```

Expected: only the design/plan documents, three evidence screenshots, and four README files are included; generated report internals remain unchanged.
