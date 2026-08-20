const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { readQaSummary, buildGithubSummary } = require('./run-summary.cjs');
const { buildJiraComment } = require('./jira-comment.cjs');

test('formats trusted run counts without credentials', () => {
  const input = { outcome: 'failed', total: 38, passed: 36, failed: 1, flaky: 1, skipped: 0,
    eventName: 'schedule', branch: 'main', sha: 'abc1234', runUrl: 'https://github.test/runs/7',
    token: 'should-not-appear', password: 'should-not-appear', authorization: 'should-not-appear' };
  const github = buildGithubSummary(input);
  const jira = JSON.stringify(buildJiraComment(input));
  assert.match(github, /36 passed/);
  assert.match(jira, /github\.test\/runs\/7/);
  assert.doesNotMatch(`${github}${jira}`, /token|password|authorization/i);
});

test('labels absent analytics data without inventing totals', () => {
  assert.match(buildGithubSummary({ outcome: 'cancelled', eventName: 'workflow_dispatch' }), /Counts unavailable/);
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
    runUrl: 'https://github.test/runs/11', token: 'should-not-appear', account: 'should-not-appear',
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
