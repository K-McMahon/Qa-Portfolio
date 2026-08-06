import { test } from '@playwright/test';
import {
  apiBaseUrl,
  captureApiEvidence,
  cleanupAccount,
  createAccount,
  makeAccount,
  readBody,
  verifyCodes,
  verifyMessage,
} from './api-helpers';

test('API-AUTH-001 - Verify Login with Valid Details', async ({ request, page }, testInfo) => {
  const account = makeAccount('auth-valid');

  await createAccount(request, account);

  try {
    const response = await request.post(`${apiBaseUrl}/verifyLogin`, {
      form: { email: account.email, password: account.password },
    });
    const body = await readBody(response);
    await captureApiEvidence(page, testInfo, {
      method: 'POST',
      response,
      body,
      requestData: { email: account.email, password: account.password },
    });

    verifyCodes(response, body, 200);
    verifyMessage(body, 'User exists!');
  } finally {
    await cleanupAccount(request, account);
  }
});

test('API-AUTH-002 - Verify Login Without Email', async ({ request, page }, testInfo) => {
  const response = await request.post(`${apiBaseUrl}/verifyLogin`, {
    form: { password: 'QaPortfolio123!' },
  });
  const body = await readBody(response);
  await captureApiEvidence(page, testInfo, {
    method: 'POST',
    response,
    body,
    requestData: { password: 'QaPortfolio123!' },
  });

  verifyCodes(response, body, 400);
  verifyMessage(
    body,
    'Bad request, email or password parameter is missing in POST request.'
  );
});

test('API-AUTH-003 - DELETE to Verify Login', async ({ request, page }, testInfo) => {
  const response = await request.delete(`${apiBaseUrl}/verifyLogin`);
  const body = await readBody(response);
  await captureApiEvidence(page, testInfo, { method: 'DELETE', response, body });

  verifyCodes(response, body, 405);
  verifyMessage(body, 'This request method is not supported.');
});

test('API-AUTH-004 - Verify Login with Invalid Details', async ({ request, page }, testInfo) => {
  const response = await request.post(`${apiBaseUrl}/verifyLogin`, {
    form: {
      email: 'notregistered@example.com',
      password: 'InvalidPassword123!',
    },
  });
  const body = await readBody(response);
  await captureApiEvidence(page, testInfo, {
    method: 'POST',
    response,
    body,
    requestData: {
      email: 'notregistered@example.com',
      password: 'InvalidPassword123!',
    },
  });

  verifyCodes(response, body, 404);
  verifyMessage(body, 'User not found!');
});
