const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { mkdtempSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const {
  buildGithubSummary,
  deriveEffectiveResult,
  readQaSummary,
} = require('./run-summary.cjs');
const { buildJiraComment } = require('./jira-comment.cjs');

test('formats trusted run counts without credentials', () => {
  const input = { outcome: 'failed', total: 38, passed: 36, failed: 1, flaky: 1, skipped: 0,
    eventName: 'schedule', branch: 'main', sha: 'abc1234', runUrl: 'https://github.com/example/qa/actions/runs/7',
    token: 'should-not-appear', password: 'should-not-appear', authorization: 'should-not-appear' };
  const github = buildGithubSummary(input);
  const jira = JSON.stringify(buildJiraComment(input));
  assert.match(github, /36 passed/);
  assert.match(jira, /github\.com\/example\/qa\/actions\/runs\/7/);
  assert.doesNotMatch(`${github}${jira}`, /token|password|authorization/i);
});

test('labels absent analytics data without inventing totals', () => {
  assert.match(buildGithubSummary({ outcome: 'cancelled', eventName: 'workflow_dispatch' }), /Counts unavailable/);
});

test('pull request concurrency is unique across forks with the same branch name', () => {
  const workflow = readFileSync(
    resolve(__dirname, '../../../../.github/workflows/playwright-qa-regression.yml'),
    'utf8'
  );
  const concurrencyGroup = workflow.match(/group:\s*\$\{\{([^\n]+)\}\}/)?.[1] ?? '';

  assert.match(concurrencyGroup, /github\.event\.pull_request\.number/);
  assert.doesNotMatch(concurrencyGroup, /format\([^\n]*github\.head_ref\)/);
});

test('derives the effective result from both the job and selected test step', () => {
  assert.equal(deriveEffectiveResult('success', 'success'), 'success');
  assert.equal(deriveEffectiveResult('success', 'failure'), 'failure');
  assert.equal(deriveEffectiveResult('failure', 'success'), 'failure');
  assert.equal(deriveEffectiveResult('cancelled', 'success'), 'cancelled');
  assert.equal(deriveEffectiveResult('success', 'cancelled'), 'cancelled');
  assert.equal(deriveEffectiveResult('success', 'skipped'), 'failure');
  assert.equal(deriveEffectiveResult(undefined, 'success'), 'failure');
});

test('includes the run start and artifact retention details in the GitHub summary', () => {
  const summary = buildGithubSummary({
    outcome: 'failure',
    total: 4,
    passed: 4,
    failed: 0,
    flaky: 0,
    skipped: 0,
    eventName: 'schedule',
    startedAt: '2026-08-20T06:17:03Z',
    branch: 'main',
    sha: '1234567890abcdef',
    runUrl: 'https://github.com/example/qa/actions/runs/15',
    artifactName: 'qa-regression-evidence',
    artifactRetentionDays: 30,
  });

  assert.match(summary, /Result: failure/);
  assert.match(summary, /Trigger: schedule/);
  assert.match(summary, /Started: 2026-08-20T06:17:03\.000Z/);
  assert.ok(summary.includes('- Artifact: qa\\-regression\\-evidence'));
  assert.match(summary, /Retention: 30 days/);
});

test('returns undefined for missing or malformed analytics files', () => {
  const directory = mkdtempSync(join(tmpdir(), 'qa-ci-reporting-'));
  const malformedPath = join(directory, 'run-summary.json');

  try {
    assert.equal(readQaSummary(join(directory, 'missing.json')), undefined);
    writeFileSync(malformedPath, '{ not valid JSON', 'utf8');
    assert.equal(readQaSummary(malformedPath), undefined);
    writeFileSync(malformedPath, '{"summary":{"total":"38"}}', 'utf8');
    assert.equal(readQaSummary(malformedPath), undefined);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('builds a Jira document with only the approved review details', () => {
  const comment = buildJiraComment({
    outcome: 'passed', total: 2, passed: 2, failed: 0, flaky: 0, skipped: 0,
    eventName: 'push', branch: 'feature/safe-output', sha: '1234567890abcdef',
    runUrl: 'https://github.com/example/qa/actions/runs/11', token: 'should-not-appear', account: 'should-not-appear',
    password: 'should-not-appear', authorization: 'should-not-appear',
  });
  const text = JSON.stringify(comment);

  assert.deepEqual(comment.type, 'doc');
  assert.deepEqual(comment.version, 1);
  assert.match(text, /1234567/);
  assert.doesNotMatch(text, /12345678/);
  assert.match(text, /Review GitHub artifacts before defect triage\./);
  assert.doesNotMatch(text, /should-not-appear/);
});

test('normalizes Jira results to the three approved labels', () => {
  const expectedLabels = new Map([
    ['success', 'Pass'],
    ['failure', 'Fail'],
    ['cancelled', 'Cancelled'],
    ['skipped', 'Fail'],
  ]);

  for (const [outcome, label] of expectedLabels) {
    const comment = JSON.stringify(buildJiraComment({ outcome }));
    assert.match(comment, new RegExp(`Result: ${label}`));
    assert.doesNotMatch(comment, /Result: (success|failure|cancelled|skipped)/);
  }
});

test('rejects run URLs containing credentials or query data', () => {
  const input = { outcome: 'failed', total: 1, passed: 0, failed: 1, flaky: 0, skipped: 0 };
  const credentialUrl = buildGithubSummary({
    ...input,
    runUrl: 'https://qa-user:secret-value@github.com/example/qa/actions/runs/7',
  });
  const queryUrl = buildGithubSummary({
    ...input,
    runUrl: 'https://github.com/example/qa/actions/runs/7?access_key=secret-value',
  });

  assert.match(credentialUrl, /Run link unavailable/);
  assert.match(queryUrl, /Run link unavailable/);
  assert.doesNotMatch(`${credentialUrl}${queryUrl}`, /secret-value/);
});

test('labels malformed commit identifiers as unavailable', () => {
  const summary = buildGithubSummary({
    outcome: 'failed', total: 1, passed: 0, failed: 1, flaky: 0, skipped: 0,
    sha: 'abc12g4-not-a-sha',
  });

  assert.match(summary, /Commit: Unavailable/);
  assert.doesNotMatch(summary, /abc12/);
});
