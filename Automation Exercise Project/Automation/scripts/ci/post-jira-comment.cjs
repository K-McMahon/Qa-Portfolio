const { readFileSync } = require('node:fs');
const { request: httpsRequest } = require('node:https');

function jiraEndpoint(baseUrl, issueKey) {
  if (typeof issueKey !== 'string' || !/^[A-Z][A-Z0-9]+-\d+$/.test(issueKey)) {
    throw new Error('Jira configuration is invalid.');
  }

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
      throw new Error('invalid');
    }

    return {
      hostname: url.hostname,
      path: `/rest/api/3/issue/${issueKey}/comment`,
    };
  } catch {
    throw new Error('Jira configuration is invalid.');
  }
}

function postJiraComment({
  baseUrl,
  email,
  apiToken,
  issueKey,
  body,
  request = httpsRequest,
  log = console.log,
}) {
  if (!email?.trim() || !apiToken?.trim()) {
    return Promise.reject(new Error('Jira credentials are unavailable.'));
  }

  let endpoint;
  try {
    endpoint = jiraEndpoint(baseUrl, issueKey);
  } catch (error) {
    return Promise.reject(error);
  }

  const payload = JSON.stringify({ body });
  const authorization = Buffer.from(`${email}:${apiToken}`, 'utf8').toString('base64');

  return new Promise((resolve, reject) => {
    const outgoing = request({
      ...endpoint,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Authorization: `Basic ${authorization}`,
      },
    }, (response) => {
      response.once('error', () => {
        reject(new Error('Jira comment response could not be read.'));
      });
      response.once('end', () => {
        const statusCode = response.statusCode ?? 0;
        if (statusCode < 200 || statusCode >= 300) {
          reject(new Error(`Jira comment request failed with HTTP ${statusCode}.`));
          return;
        }

        log('Jira comment posted successfully.');
        resolve();
      });
      response.resume?.();
    });

    outgoing.once('error', () => {
      reject(new Error('Jira comment request failed before receiving a response.'));
    });
    outgoing.end(payload);
  });
}

async function runCli() {
  const [commentPath = 'jira-comment.json'] = process.argv.slice(2);
  const body = JSON.parse(readFileSync(commentPath, 'utf8')).body;
  await postJiraComment({
    baseUrl: process.env.JIRA_BASE_URL,
    email: process.env.JIRA_EMAIL,
    apiToken: process.env.JIRA_API_TOKEN,
    issueKey: process.env.JIRA_CI_ISSUE_KEY,
    body,
  });
}

if (require.main === module) {
  runCli().catch((error) => {
    console.error(`Unable to post Jira comment: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { jiraEndpoint, postJiraComment };
