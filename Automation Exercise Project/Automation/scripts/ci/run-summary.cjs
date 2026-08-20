const { readFileSync } = require('node:fs');

const COUNT_FIELDS = ['total', 'passed', 'failed', 'flaky', 'skipped'];

function cleanText(value, fallback = 'Unavailable') {
  if (typeof value !== 'string') return fallback;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
  return cleaned ? cleaned.slice(0, 200) : fallback;
}

function cleanRunUrl(value) {
  if (typeof value !== 'string') return undefined;

  try {
    const url = new URL(value);
    const safeRunPath = /^\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/actions\/runs\/\d+\/?$/;
    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'github.com' ||
      url.port ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      value.includes('?') ||
      !safeRunPath.test(url.pathname)
    ) {
      return undefined;
    }

    return `https://github.com${url.pathname}`;
  } catch {
    return undefined;
  }
}

function normalizeCounts(input) {
  const counts = {};

  for (const field of COUNT_FIELDS) {
    if (!Number.isInteger(input?.[field]) || input[field] < 0) return undefined;
    counts[field] = input[field];
  }

  return counts;
}

function safeSummary(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined;
  const counts = normalizeCounts(input);
  if (typeof input.outcome !== 'string' || !counts) return undefined;

  return { outcome: cleanText(input.outcome), ...counts };
}

function readQaSummary(path) {
  try {
    const report = JSON.parse(readFileSync(path, 'utf8'));
    return safeSummary(report?.summary);
  } catch {
    return undefined;
  }
}

function escapeMarkdown(value) {
  return cleanText(value).replace(/([\\`*_{}\[\]()#+.!|>~-])/g, '\\$1');
}

function shortSha(value) {
  if (typeof value !== 'string') return 'Unavailable';
  const sha = value.trim();
  return /^[0-9a-f]{7,}$/i.test(sha) ? sha.slice(0, 7) : 'Unavailable';
}

function formatCounts(input) {
  const counts = normalizeCounts(input);
  if (!counts) return 'Counts unavailable';
  return `${counts.passed} passed, ${counts.failed} failed, ${counts.flaky} flaky, ${counts.skipped} skipped (${counts.total} total)`;
}

function buildGithubSummary(input = {}) {
  const runUrl = cleanRunUrl(input.runUrl);
  const run = runUrl ? `[Open GitHub Actions run](${runUrl})` : 'Run link unavailable';

  return [
    '## QA regression summary',
    '',
    `- Result: ${escapeMarkdown(input.outcome)}`,
    `- Counts: ${formatCounts(input)}`,
    `- Event: ${escapeMarkdown(input.eventName)}`,
    `- Branch: ${escapeMarkdown(input.branch)}`,
    `- Commit: ${shortSha(input.sha)}`,
    `- Run: ${run}`,
    '- Review GitHub artifacts before defect triage.',
  ].join('\n');
}

module.exports = {
  buildGithubSummary,
  cleanRunUrl,
  cleanText,
  formatCounts,
  readQaSummary,
  shortSha,
};
