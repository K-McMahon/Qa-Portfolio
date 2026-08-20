import { expect, test } from '@playwright/test';
import {
  hasLoginCredentials,
  hasPaymentData,
} from '../ui/support/credential-availability';

test('login credentials are available only when all existing-account values are present', () => {
  expect(
    hasLoginCredentials({
      AE_EMAIL: 'qa@example.com',
      AE_PASSWORD: 'private-password',
      AE_USERNAME: 'QA User',
    })
  ).toBe(true);

  expect(
    hasLoginCredentials({
      AE_EMAIL: 'qa@example.com',
      AE_PASSWORD: '',
      AE_USERNAME: 'QA User',
    })
  ).toBe(false);
});

test('payment data is available only when all five payment values are present', () => {
  expect(
    hasPaymentData({
      AE_CARD_NAME: 'QA User',
      AE_CARD_NUMBER: '4111111111111111',
      AE_CARD_CVC: '123',
      AE_CARD_EXPIRY_MONTH: '12',
      AE_CARD_EXPIRY_YEAR: '2030',
    })
  ).toBe(true);

  expect(
    hasPaymentData({
      AE_CARD_NAME: 'QA User',
      AE_CARD_NUMBER: '4111111111111111',
      AE_CARD_CVC: '123',
      AE_CARD_EXPIRY_MONTH: '12',
    })
  ).toBe(false);
});
