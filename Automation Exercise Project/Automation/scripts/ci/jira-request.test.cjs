const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { postJiraComment } = require('./post-jira-comment.cjs');

function fakeRequest(statusCode, capture) {
  return (options, callback) => {
    const request = new EventEmitter();
    request.end = (payload) => {
      capture.options = options;
      capture.payload = payload;
      queueMicrotask(() => {
        const response = new EventEmitter();
        response.statusCode = statusCode;
        callback(response);
        response.emit('end');
      });
    };
    return request;
  };
}

test('posts Jira ADF with an in-process authorization header', async () => {
  const capture = {};
  const messages = [];
  const body = { type: 'doc', version: 1, content: [] };

  await postJiraComment({
    baseUrl: 'https://portfolio-links.atlassian.net',
    email: 'automation@example.com',
    apiToken: 'private-test-token',
    issueKey: 'AEQA-121',
    body,
    request: fakeRequest(201, capture),
    log: (message) => messages.push(message),
  });

  assert.equal(capture.options.hostname, 'portfolio-links.atlassian.net');
  assert.equal(capture.options.path, '/rest/api/3/issue/AEQA-121/comment');
  assert.equal(capture.options.method, 'POST');
  assert.equal(
    capture.options.headers.Authorization,
    `Basic ${Buffer.from('automation@example.com:private-test-token').toString('base64')}`,
  );
  assert.deepEqual(JSON.parse(capture.payload), { body });
  assert.deepEqual(messages, ['Jira comment posted successfully.']);
  assert.doesNotMatch(messages.join(' '), /private-test-token|Authorization/i);
});

test('reports Jira response failures without exposing credentials', async () => {
  const capture = {};
  const secret = 'private-test-token';

  await assert.rejects(
    postJiraComment({
      baseUrl: 'https://portfolio-links.atlassian.net',
      email: 'automation@example.com',
      apiToken: secret,
      issueKey: 'AEQA-121',
      body: { type: 'doc', version: 1, content: [] },
      request: fakeRequest(401, capture),
      log: () => undefined,
    }),
    (error) => {
      assert.match(error.message, /HTTP 401/);
      assert.doesNotMatch(error.message, new RegExp(secret));
      assert.doesNotMatch(error.message, /Authorization/i);
      return true;
    },
  );
});
