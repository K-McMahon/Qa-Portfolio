import { expect, test } from '@playwright/test';
import { createRegistrationData } from '../../data/registration-data';
import playwrightConfig from '../../playwright.config';

test('CI runs serially with two retries and isolated Playwright artifacts', () => {
  expect(playwrightConfig.workers).toBe(1);
  expect(playwrightConfig.retries).toBe(2);
  expect(playwrightConfig.outputDir).toBe('test-results/artifacts');
});

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
