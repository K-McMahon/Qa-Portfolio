const { mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const EASTERN_TIME_ZONE = 'America/New_York';
const COUNT_FIELDS = ['total', 'passed', 'failed', 'flaky', 'skipped'];

function validateMonth(month) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month ?? '')) {
    throw new Error('REPORT_MONTH must use YYYY-MM.');
  }
}

function easternMonth(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: EASTERN_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  return year && month ? `${year}-${month}` : undefined;
}

function previousEasternMonth(value = new Date()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('The current date is invalid.');
  const currentMonth = easternMonth(date);
  const [year, month] = currentMonth.split('-').map(Number);
  const reportYear = month === 1 ? year - 1 : year;
  const reportMonth = month === 1 ? 12 : month - 1;
  return `${reportYear}-${String(reportMonth).padStart(2, '0')}`;
}

function normalizeCounts(summary) {
  if (!summary || typeof summary !== 'object' || Array.isArray(summary)) return undefined;
  const counts = {};

  for (const field of COUNT_FIELDS) {
    if (!Number.isInteger(summary[field]) || summary[field] < 0) return undefined;
    counts[field] = summary[field];
  }

  return counts;
}

function cleanRepository(value) {
  return typeof value === 'string' && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)
    ? value
    : undefined;
}

function cleanRunUrl(value, repository) {
  if (typeof value !== 'string' || !repository) return undefined;

  try {
    const url = new URL(value);
    const escapedRepository = repository
      .split('/')
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('\\/');
    const safePath = new RegExp(`^/${escapedRepository}/actions/runs/\\d+/?$`, 'i');
    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'github.com' ||
      url.port ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !safePath.test(url.pathname)
    ) {
      return undefined;
    }

    return `https://github.com${url.pathname}`;
  } catch {
    return undefined;
  }
}

function cleanJiraUrl(baseUrl, issueKey) {
  if (typeof issueKey !== 'string' || !/^[A-Z][A-Z0-9]+-\d+$/.test(issueKey)) return undefined;

  try {
    const url = new URL(baseUrl);
    if (
      url.protocol !== 'https:' ||
      url.port ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !url.hostname.endsWith('.atlassian.net') ||
      url.pathname.replace(/\/+$/, '') !== ''
    ) {
      return undefined;
    }

    return `https://${url.hostname}/browse/${issueKey}`;
  } catch {
    return undefined;
  }
}

function monthTitle(month) {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
  }).format(new Date(Date.UTC(year, monthNumber - 1, 15)));
}

function easternTimestamp(value) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: EASTERN_TIME_ZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(value));
}

function outcomeBucket(conclusion) {
  return ['success', 'failure', 'cancelled'].includes(conclusion) ? conclusion : 'other';
}

function outcomeLabel(conclusion) {
  const labels = { failure: 'Failed', cancelled: 'Cancelled', other: 'Other' };
  return labels[outcomeBucket(conclusion)];
}

function buildMonthlySummary(runs, month, links = {}) {
  validateMonth(month);
  const repository = cleanRepository(links.repository);
  const jiraUrl = cleanJiraUrl(links.jiraBaseUrl, links.jiraIssueKey);
  const includedRuns = (Array.isArray(runs) ? runs : [])
    .filter((run) => run?.event === 'schedule' && easternMonth(run.created_at) === month)
    .sort((left, right) => new Date(left.created_at) - new Date(right.created_at));

  const conclusions = { success: 0, failure: 0, cancelled: 0, other: 0 };
  for (const run of includedRuns) {
    conclusions[outcomeBucket(run.conclusion)] += 1;
  }

  const summaries = includedRuns.map((run) => normalizeCounts(run.qa_summary));
  const aggregated = includedRuns.length > 0 && summaries.every(Boolean)
    ? Object.fromEntries(COUNT_FIELDS.map((field) => [
      field,
      summaries.reduce((sum, summary) => sum + summary[field], 0),
    ]))
    : undefined;
  const latestSuccess = includedRuns.findLast((run) => run.conclusion === 'success');
  const latestSuccessUrl = cleanRunUrl(latestSuccess?.html_url, repository);
  const workflowUrl = repository
    ? `https://github.com/${repository}/actions/workflows/playwright-qa-regression.yml`
    : undefined;

  const lines = [
    `# Monthly QA regression summary: ${monthTitle(month)}`,
    '',
    `Report month: \`${month}\` (America/New_York)`,
    '',
    '## Execution outcomes',
    '',
    '| Measure | Count |',
    '| --- | ---: |',
    `| Scheduled executions | ${includedRuns.length} |`,
    `| Successful | ${conclusions.success} |`,
    `| Failed | ${conclusions.failure} |`,
    `| Cancelled | ${conclusions.cancelled} |`,
    `| Other | ${conclusions.other} |`,
  ];

  if (aggregated) {
    lines.push(
      '',
      '## Aggregated test totals',
      '',
      '| Measure | Count |',
      '| --- | ---: |',
      `| Tests recorded | ${aggregated.total} |`,
      `| Passed | ${aggregated.passed} |`,
      `| Failed tests | ${aggregated.failed} |`,
      `| Flaky | ${aggregated.flaky} |`,
      `| Skipped | ${aggregated.skipped} |`,
    );
  }

  lines.push('', '## Review links', '');
  if (latestSuccess) {
    lines.push(latestSuccessUrl
      ? `- Latest successful run: [${easternTimestamp(latestSuccess.created_at)}](${latestSuccessUrl})`
      : '- Latest successful run: Link unavailable');
  }
  lines.push(workflowUrl
    ? `- Regression workflow: [View workflow runs](${workflowUrl})`
    : '- Regression workflow: Link unavailable');
  lines.push(jiraUrl
    ? `- Jira tracking: [${links.jiraIssueKey}](${jiraUrl})`
    : '- Jira tracking: Link unavailable');

  const reviewRuns = includedRuns.filter((run) => outcomeBucket(run.conclusion) !== 'success');
  if (reviewRuns.length > 0) {
    lines.push('', '## Runs requiring review', '');
    for (const run of reviewRuns) {
      const label = outcomeLabel(run.conclusion);
      const timestamp = easternTimestamp(run.created_at);
      const runUrl = cleanRunUrl(run.html_url, repository);
      lines.push(runUrl
        ? `- ${label} run: [${timestamp}](${runUrl})`
        : `- ${label} run at ${timestamp}: Link unavailable`);
    }
  }

  if (includedRuns.length === 0) {
    lines.push('', 'No nightly executions were recorded.');
  }

  return `${lines.join('\n')}\n`;
}

function workflowRuns(response) {
  if (Array.isArray(response)) {
    if (response.every((item) => Array.isArray(item?.workflow_runs))) {
      return response.flatMap((page) => page.workflow_runs);
    }
    return response;
  }
  return Array.isArray(response?.workflow_runs) ? response.workflow_runs : [];
}

function runCli() {
  const [inputPath, outputDirectory] = process.argv.slice(2);
  if (!inputPath || !outputDirectory) {
    throw new Error('Usage: node monthly-summary.cjs <workflow-runs.json> <output-directory>');
  }

  const month = process.env.REPORT_MONTH;
  validateMonth(month);
  const jiraBaseUrl = process.env.JIRA_BASE_URL;
  const jiraIssueKey = process.env.JIRA_CI_ISSUE_KEY;
  if (!cleanJiraUrl(jiraBaseUrl, jiraIssueKey)) {
    throw new Error('JIRA_BASE_URL and JIRA_CI_ISSUE_KEY must identify a valid Jira Cloud issue.');
  }
  const response = JSON.parse(readFileSync(inputPath, 'utf8'));
  const markdown = buildMonthlySummary(workflowRuns(response), month, {
    repository: process.env.GITHUB_REPOSITORY,
    jiraIssueKey,
    jiraBaseUrl,
  });
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, `${month}.md`), markdown, 'utf8');
}

if (require.main === module) {
  try {
    runCli();
  } catch (error) {
    console.error(`Unable to generate monthly QA summary: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { buildMonthlySummary, previousEasternMonth };
