const { cleanRunUrl, cleanText, formatCounts, shortSha } = require('./run-summary.cjs');

function text(value, marks) {
  const node = { type: 'text', text: value };
  if (marks) node.marks = marks;
  return node;
}

function bullet(value) {
  return {
    type: 'listItem',
    content: [{ type: 'paragraph', content: [text(value)] }],
  };
}

function linkBullet(label, runUrl) {
  if (!runUrl) return bullet(`${label}: Run link unavailable`);

  return {
    type: 'listItem',
    content: [{
      type: 'paragraph',
      content: [
        text(`${label}: `),
        text('Open GitHub Actions run', [{ type: 'link', attrs: { href: runUrl } }]),
      ],
    }],
  };
}

function buildJiraComment(input = {}) {
  const runUrl = cleanRunUrl(input.runUrl);

  return {
    type: 'doc',
    version: 1,
    content: [
      { type: 'paragraph', content: [text('QA regression summary')] },
      {
        type: 'bulletList',
        content: [
          bullet(`Result: ${cleanText(input.outcome)}`),
          bullet(`Counts: ${formatCounts(input)}`),
          bullet(`Event: ${cleanText(input.eventName)}`),
          bullet(`Branch: ${cleanText(input.branch)}`),
          bullet(`Commit: ${shortSha(input.sha)}`),
          linkBullet('Run', runUrl),
          bullet('Review GitHub artifacts before defect triage.'),
        ],
      },
    ],
  };
}

module.exports = { buildJiraComment };
