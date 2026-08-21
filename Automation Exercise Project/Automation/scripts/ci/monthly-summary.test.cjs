const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { buildMonthlySummary, previousEasternMonth } = require('./monthly-summary.cjs');

const links = {
  repository: 'example/qa-portfolio',
  jiraIssueKey: 'AEQA-121',
  jiraBaseUrl: 'https://kgmcmahon973.atlassian.net',
};

function run(overrides) {
  return {
    id: 1,
    event: 'schedule',
    conclusion: 'success',
    created_at: '2026-07-10T06:17:00Z',
    html_url: 'https://github.com/example/qa-portfolio/actions/runs/1',
    ...overrides,
  };
}

test('derives the previous month from the Eastern calendar at year and UTC boundaries', () => {
  assert.equal(previousEasternMonth('2026-01-01T07:47:00Z'), '2025-12');
  assert.equal(previousEasternMonth('2026-03-01T04:30:00Z'), '2026-01');
});

test('aggregates only scheduled runs in the requested Eastern calendar month', () => {
  const runs = [
    run({
      id: 101,
      created_at: '2026-07-01T04:00:00Z',
      html_url: 'https://github.com/example/qa-portfolio/actions/runs/101',
      qa_summary: { total: 40, passed: 39, failed: 0, flaky: 1, skipped: 0 },
    }),
    run({
      id: 102,
      created_at: '2026-08-01T03:59:59Z',
      html_url: 'https://github.com/example/qa-portfolio/actions/runs/102',
      qa_summary: { total: 42, passed: 42, failed: 0, flaky: 0, skipped: 0 },
    }),
    run({
      id: 103,
      conclusion: 'failure',
      created_at: '2026-07-15T06:17:00Z',
      html_url: 'https://github.com/example/qa-portfolio/actions/runs/103',
      qa_summary: { total: 38, passed: 36, failed: 2, flaky: 0, skipped: 0 },
      logs: 'raw password=do-not-publish',
    }),
    run({
      id: 104,
      conclusion: 'cancelled',
      created_at: '2026-07-20T06:17:00Z',
      html_url: 'https://github.com/example/qa-portfolio/actions/runs/104',
      qa_summary: { total: 10, passed: 8, failed: 0, flaky: 0, skipped: 2 },
      token: 'ghp_do-not-publish',
    }),
    run({
      id: 109,
      conclusion: 'timed_out',
      created_at: '2026-07-25T06:17:00Z',
      html_url: 'https://github.com/example/qa-portfolio/actions/runs/109',
      qa_summary: { total: 2, passed: 1, failed: 1, flaky: 0, skipped: 0 },
    }),
    run({ id: 105, event: 'workflow_dispatch' }),
    run({ id: 106, event: 'push' }),
    run({ id: 107, created_at: '2026-07-01T03:59:59Z' }),
    run({ id: 108, created_at: '2026-08-01T04:00:00Z' }),
  ];

  const markdown = buildMonthlySummary(runs, '2026-07', links);

  assert.match(markdown, /^# Monthly QA regression summary: July 2026/m);
  assert.match(markdown, /Scheduled executions \| 5/);
  assert.match(markdown, /Successful \| 2/);
  assert.match(markdown, /Failed \| 1/);
  assert.match(markdown, /Cancelled \| 1/);
  assert.match(markdown, /Other \| 1/);
  assert.match(markdown, /Tests recorded \| 132/);
  assert.match(markdown, /Passed \| 126/);
  assert.match(markdown, /Failed tests \| 3/);
  assert.match(markdown, /Flaky \| 1/);
  assert.match(markdown, /Skipped \| 2/);
  assert.match(markdown, /Latest successful run: \[July 31, 2026 at 11:59 PM EDT\]\(https:\/\/github\.com\/example\/qa-portfolio\/actions\/runs\/102\)/);
  assert.match(markdown, /Failed run: \[July 15, 2026 at 2:17 AM EDT\]\(https:\/\/github\.com\/example\/qa-portfolio\/actions\/runs\/103\)/);
  assert.match(markdown, /Cancelled run: \[July 20, 2026 at 2:17 AM EDT\]\(https:\/\/github\.com\/example\/qa-portfolio\/actions\/runs\/104\)/);
  assert.match(markdown, /Other run: \[July 25, 2026 at 2:17 AM EDT\]\(https:\/\/github\.com\/example\/qa-portfolio\/actions\/runs\/109\)/);
  assert.match(markdown, /\[AEQA-121\]\(https:\/\/kgmcmahon973\.atlassian\.net\/browse\/AEQA-121\)/);
  assert.doesNotMatch(markdown, /actions\/runs\/(105|106|107|108)/);
  assert.doesNotMatch(markdown, /password|token|raw log|do-not-publish|ghp_/i);
});

test('omits aggregated test totals unless every included run has structured totals', () => {
  const markdown = buildMonthlySummary([
    run({ id: 201, qa_summary: { total: 5, passed: 5, failed: 0, flaky: 0, skipped: 0 } }),
    run({ id: 202, conclusion: 'failure', created_at: '2026-07-11T06:17:00Z' }),
  ], '2026-07', links);

  assert.match(markdown, /Scheduled executions \| 2/);
  assert.doesNotMatch(markdown, /Tests recorded|Failed tests|Aggregated test totals/);
});

test('reports a month with no scheduled executions without exposing unrelated input', () => {
  const markdown = buildMonthlySummary([
    run({ event: 'workflow_dispatch', password: 'do-not-publish' }),
    run({ created_at: '2026-06-30T23:59:59Z', logs: 'raw log text' }),
  ], '2026-07', links);

  assert.match(markdown, /No nightly executions were recorded\./);
  assert.match(markdown, /Scheduled executions \| 0/);
  assert.doesNotMatch(markdown, /Latest successful run:/);
  assert.doesNotMatch(markdown, /password|raw log|do-not-publish/i);
});

test('rejects unsafe report months and untrusted links', () => {
  assert.throws(
    () => buildMonthlySummary([], '../../2026-07', links),
    /REPORT_MONTH must use YYYY-MM/,
  );

  const markdown = buildMonthlySummary([
    run({
      conclusion: 'failure',
      html_url: 'https://attacker.example/actions/runs/1?token=secret-value',
    }),
  ], '2026-07', {
    repository: 'example/qa-portfolio; echo injected',
    jiraIssueKey: 'AEQA-121](https://attacker.example)',
    jiraBaseUrl: 'https://attacker.example',
  });

  assert.match(markdown, /Failed run at July 10, 2026 at 2:17 AM EDT: Link unavailable/);
  assert.match(markdown, /Jira tracking: Link unavailable/);
  assert.doesNotMatch(markdown, /attacker|secret|injected/);

  const maliciousJira = buildMonthlySummary([], '2026-07', {
    jiraIssueKey: 'AEQA-121',
    jiraBaseUrl: 'https://attacker.example',
  });
  assert.match(maliciousJira, /Jira tracking: Link unavailable/);
  assert.doesNotMatch(maliciousJira, /attacker/);
});

test('CLI flattens paginated workflow responses and writes only the report month file', () => {
  const directory = mkdtempSync(join(tmpdir(), 'monthly-qa-summary-'));
  const inputPath = join(directory, 'workflow-runs.json');
  const outputDirectory = join(directory, 'reports');
  writeFileSync(inputPath, JSON.stringify([
    { total_count: 2, workflow_runs: [run({ id: 301 })] },
    { total_count: 2, workflow_runs: [run({ id: 302, conclusion: 'failure' })] },
  ]), 'utf8');

  try {
    const result = spawnSync(process.execPath, [__filename.replace(/\.test\.cjs$/, '.cjs'), inputPath, outputDirectory], {
      encoding: 'utf8',
      env: {
        ...process.env,
        REPORT_MONTH: '2026-07',
        GITHUB_REPOSITORY: 'example/qa-portfolio',
        JIRA_CI_ISSUE_KEY: 'AEQA-121',
        JIRA_BASE_URL: 'https://portfolio-links.atlassian.net',
      },
    });

    assert.equal(result.status, 0, result.stderr);
    const markdown = readFileSync(join(outputDirectory, '2026-07.md'), 'utf8');
    assert.match(markdown, /Scheduled executions \| 2/);
    assert.match(markdown, /Failed \| 1/);
    assert.match(markdown, /\[AEQA-121\]\(https:\/\/portfolio-links\.atlassian\.net\/browse\/AEQA-121\)/);
    assert.deepEqual(
      require('node:fs').readdirSync(outputDirectory),
      ['2026-07.md'],
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
