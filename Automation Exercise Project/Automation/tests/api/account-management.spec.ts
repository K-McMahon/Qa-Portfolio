import { test, expect } from '@playwright/test';
import {
  apiBaseUrl,
  captureApiEvidence,
  cleanupAccount,
  createAccount,
  deleteAccount,
  makeAccount,
  readBody,
  verifyCodes,
  verifyMessage,
} from './api-helpers';

test('API-ACCOUNT-001 - Create User Account', async ({ request, page }, testInfo) => {
  const account = makeAccount('create');

  try {
    const response = await request.post(`${apiBaseUrl}/createAccount`, {
      form: account,
    });
    const body = await readBody(response);
    await captureApiEvidence(page, testInfo, {
      method: 'POST',
      response,
      body,
      requestData: account,
    });

    verifyCodes(response, body, 201);
    verifyMessage(body, 'User created!');
  } finally {
    await cleanupAccount(request, account);
  }
});

test('API-ACCOUNT-002 - Delete User Account', async ({ request, page }, testInfo) => {
  const account = makeAccount('delete');
  let accountDeleted = false;

  try {
    await createAccount(request, account);

    const response = await deleteAccount(request, account);
    const body = await readBody(response);
    accountDeleted = response.status() === 200 && body.responseCode === 200;
    await captureApiEvidence(page, testInfo, {
      method: 'DELETE',
      response,
      body,
      requestData: { email: account.email, password: account.password },
    });

    verifyCodes(response, body, 200);
    verifyMessage(body, 'Account deleted!');
  } finally {
    if (!accountDeleted) await cleanupAccount(request, account);
  }
});

test('API-ACCOUNT-003 - Update User Account', async ({ request, page }, testInfo) => {
  const account = makeAccount('update');
  const updatedAccount = {
    ...account,
    name: 'qa updated user',
    firstname: 'Updated',
    city: 'Brooklyn',
  };

  try {
    await createAccount(request, account);
    const response = await request.put(`${apiBaseUrl}/updateAccount`, {
      form: updatedAccount,
    });
    const body = await readBody(response);
    await captureApiEvidence(page, testInfo, {
      method: 'PUT',
      response,
      body,
      requestData: updatedAccount,
    });

    verifyCodes(response, body, 200);
    verifyMessage(body, 'User updated!');

    // confirm the saved values through the account detail endpoint
    const detailResponse = await request.get(`${apiBaseUrl}/getUserDetailByEmail`, {
      params: { email: account.email },
    });
    const detailBody = await readBody(detailResponse);

    verifyCodes(detailResponse, detailBody, 200);
    expect.soft(detailBody.user?.name).toBe(updatedAccount.name);
    expect.soft(detailBody.user?.first_name).toBe(updatedAccount.firstname);
    expect.soft(detailBody.user?.city).toBe(updatedAccount.city);
  } finally {
    await cleanupAccount(request, account);
  }
});

test('API-ACCOUNT-004 - Get User Details by Email', async ({ request, page }, testInfo) => {
  const account = makeAccount('details');

  try {
    await createAccount(request, account);
    const response = await request.get(`${apiBaseUrl}/getUserDetailByEmail`, {
      params: { email: account.email },
    });
    const body = await readBody(response);
    await captureApiEvidence(page, testInfo, {
      method: 'GET',
      response,
      body,
      requestData: { email: account.email },
    });

    verifyCodes(response, body, 200);
    expect(body.user).toEqual(
      expect.objectContaining({
        name: account.name,
        email: account.email,
        first_name: account.firstname,
        last_name: account.lastname,
      })
    );
  } finally {
    await cleanupAccount(request, account);
  }
});
