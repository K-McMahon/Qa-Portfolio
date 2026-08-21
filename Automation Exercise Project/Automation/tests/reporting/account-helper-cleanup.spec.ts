import {
  expect,
  test,
  type APIRequestContext,
  type APIResponse,
} from '@playwright/test';
import { cleanupAccount } from '../api/api-helpers';
import { deleteDisposableAccount } from '../ui/support/ui-test';

type CleanupWithLogger = (
  request: APIRequestContext,
  account: { email: string; password: string },
  warn: (message: string) => void,
) => Promise<void>;

const cleanupWithLogger = cleanupAccount as CleanupWithLogger;
const account = {
  email: 'private-account@example.com',
  password: 'private-account-password',
};

test('cleanup warns generically and preserves an existing assertion failure', async () => {
  const warnings: string[] = [];
  const primaryError = new Error('primary assertion failure');
  const request = {
    delete: async () => {
      throw new Error(`cleanup rejected for ${account.email} using ${account.password}`);
    },
  } as unknown as APIRequestContext;
  let observedError: unknown;

  try {
    try {
      throw primaryError;
    } finally {
      await cleanupWithLogger(request, account, (message) => warnings.push(message));
    }
  } catch (error) {
    observedError = error;
  }

  expect(observedError).toBe(primaryError);
  expect(warnings).toHaveLength(1);
  expect(warnings[0]).toMatch(/cleanup could not be confirmed/i);
  expect(warnings[0]).not.toMatch(/private-account|example\.com|password|email/i);
});

test('cleanup warns when the API does not confirm account deletion', async () => {
  const warnings: string[] = [];
  const response = {
    status: () => 200,
    text: async () => JSON.stringify({ responseCode: 404, message: 'Account not found.' }),
  } as APIResponse;
  const request = {
    delete: async () => response,
  } as unknown as APIRequestContext;

  await cleanupWithLogger(request, account, (message) => warnings.push(message));

  expect(warnings).toHaveLength(1);
  expect(warnings[0]).toMatch(/cleanup could not be confirmed/i);
  expect(warnings[0]).not.toMatch(/private-account|example\.com|password|email/i);
});

test('UI cleanup rejects when the browser page is already closed', async ({ page }) => {
  await page.close();

  await expect(deleteDisposableAccount(page)).rejects.toThrow(
    /cleanup could not be confirmed/i
  );
});

test('UI cleanup rejects when the delete-account control is unavailable', async ({ page }) => {
  await page.setContent('<main>Account session without a delete control</main>');

  try {
    await expect(deleteDisposableAccount(page)).rejects.toThrow(
      /cleanup could not be confirmed/i
    );
  } finally {
    await page.close();
  }
});
