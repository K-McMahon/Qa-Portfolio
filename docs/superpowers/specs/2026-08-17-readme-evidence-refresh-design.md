# README Evidence Refresh Design

## Objective

Refresh the Automation Exercise portfolio documentation so its Jira status, automation coverage, report descriptions, and displayed screenshots reflect the current August 17, 2026 project state.

## Documentation Scope

Update these four landing pages:

- Root `README.md`
- `Automation Exercise Project/README.md`
- `Automation Exercise Project/Jira Import Ready/README.md`
- `Automation Exercise Project/Automation/README.md`

The READMEs will use consistent execution counts, terminology, Jira references, and links. Statements that still describe completed tests as Not Run or omit the current Page Object Model coverage will be corrected using the repository and Jira as evidence.

## Screenshot Scope

Create sanitized, dated `2026-08-17` screenshots for:

- The current AEQA Jira Kanban board
- The branded QA analytics report
- The Playwright technical HTML report

Store the Jira board image with the existing Jira portfolio evidence. Store report images in a stable version-controlled documentation/evidence location rather than inside generated `test-results` output.

The newest screenshots will be displayed as the primary visuals. Older dated Jira screenshots will remain available under a concise historical-evidence section so the repository retains an audit trail without cluttering the current presentation.

## Content Design

The Jira Import Ready README will explain the import sequence as historical setup work and distinguish it from the current reconciled Jira state. It will show the refreshed board and point readers to current execution evidence.

The project and root READMEs will summarize the same current figures and link readers to the detailed Jira and automation documentation. The Automation README will show both reports and explain the difference between the stakeholder-oriented QA analytics report and Playwright's technical diagnostic report.

## Data and Privacy

Screenshots must exclude credentials, tokens, passwords, private environment values, and unnecessary personal data. Report and Jira views will be inspected before capture. Existing evidence files will not be overwritten when a dated replacement is appropriate.

## Verification

Before completion:

- Confirm every new Markdown image path resolves to an existing file.
- Confirm the four READMEs use consistent project counts and statuses.
- Render or preview the updated Markdown where practical.
- Verify the new screenshots are readable and sanitized.
- Review the final Git diff to ensure generated report internals and unrelated files are not included.
