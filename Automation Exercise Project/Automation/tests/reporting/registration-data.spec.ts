import { expect, test } from '@playwright/test';
import { createRegistrationData } from '../../data/registration-data';

test('registration data is synthetic, complete, unique, and opts into both selections', () => {
  const first = createRegistrationData();
  const second = createRegistrationData();

  expect(first.email).not.toBe(second.email);
  expect(first.email).toMatch(/@example\.com$/);
  expect(first.name).toBeTruthy();
  expect(first.password).toBeTruthy();
  expect(first.address1).toBeTruthy();
  expect(first.mobileNumber).toBeTruthy();
  expect(first.newsletter).toBe(true);
  expect(first.partnerOffers).toBe(true);
});
