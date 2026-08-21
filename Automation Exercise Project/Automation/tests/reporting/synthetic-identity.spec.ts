import { expect, test } from '@playwright/test';
import { createSyntheticIdentity } from '../../data/synthetic-identity';

test('creates distinct example.com identities for repeated calls', () => {
  const first = createSyntheticIdentity('registration', { GITHUB_RUN_ID: '451' });
  const second = createSyntheticIdentity('registration', { GITHUB_RUN_ID: '451' });
  expect(first.email).not.toBe(second.email);
  expect(first.email).toMatch(/^qa-registration-[a-z0-9-]+@example\.com$/);
  expect(first.email).not.toContain('undefined');
});

test('removes unsafe label characters', () => {
  const identity = createSyntheticIdentity('Order 004 / UI', { GITHUB_RUN_ID: '451' });
  expect(identity.email).toMatch(/^qa-order-004-ui-[a-z0-9-]+@example\.com$/);
});
