# GitHub Actions QA Regression Evidence

This folder holds portfolio evidence produced by the QA regression workflows. It is designed so a reviewer can understand the result without exposing credentials, payment details, or raw log content.

## What runs and when

- **Nightly regression:** 2:17 AM Eastern every day.
- **Code changes:** a push to `main` or pull request to `main` that changes the regression workflow or `Automation Exercise Project/Automation/`.
- **Manual execution:** a maintainer can select **Actions > Playwright QA regression > Run workflow** for an on-demand trusted run.
- **Monthly summary:** 2:47 AM Eastern on the first day of each month. It records the prior Eastern calendar month in `Monthly/YYYY-MM.md`.

The monthly-summary directory is excluded from regression path triggers. Publishing a monthly portfolio file therefore does not start another regression run.

GitHub can disable a scheduled workflow in a public repository after 60 days without activity. If that happens, a maintainer should run the workflow manually and confirm the next scheduled run.

## Evidence and retention

The regression workflow uploads `qa-regression-evidence` for 30 days. It includes Playwright's HTML report, the stakeholder-facing QA analytics report, failure artifacts such as traces, screenshots and videos, selected execution evidence, and concise test results.

The monthly workflow uploads the generated Markdown summary for 90 days before attempting to commit it. This is the recovery artifact if branch protection prevents the bot from pushing. The rejected push remains visible in the workflow result, while the uploaded Markdown is still available for review.

## Jira ledger

For trusted scheduled, manual, and `main` push runs, the workflow posts one sanitized comment to the existing Jira issue selected by `JIRA_CI_ISSUE_KEY`. This one-ticket ledger records the result, result counts, event, branch, short commit ID, and a GitHub Actions link.

The automation creates no Jira Bug issues. Review the artifact first, then decide whether a failure needs normal defect triage. Pull-request runs do not post to Jira and do not receive repository secrets.

## Required secret names

Add these as repository secrets before the first trusted run. Values are not stored in this repository.

| Category | Names |
| --- | --- |
| Saved account | `AE_EMAIL`, `AE_PASSWORD`, `AE_USERNAME` |
| Fictional payment data | `AE_CARD_NAME`, `AE_CARD_NUMBER`, `AE_CARD_CVC`, `AE_CARD_EXPIRY_MONTH`, `AE_CARD_EXPIRY_YEAR` |
| Jira ledger | `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_CI_ISSUE_KEY` |

Payment values must be fictional. Disposable account tests use generated `example.com` email addresses and remove the accounts they create. Tests using the saved account never delete it.

## Acceptance status

Local checks confirm the reporting helpers, reporting tests, and test discovery. They do not prove the overnight schedule, GitHub artifact upload, branch-protection behavior, or Jira comment. Verify those items with a manual GitHub Actions run after configuring repository secrets.
