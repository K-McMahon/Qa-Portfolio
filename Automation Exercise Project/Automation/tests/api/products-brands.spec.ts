import { test, expect } from '@playwright/test';
import {
  apiBaseUrl,
  captureApiEvidence,
  readBody,
  verifyCodes,
  verifyMessage,
} from './api-helpers';

test('API-PRODUCT-001 - Get All Products List', async ({ request, page }, testInfo) => {
  const response = await request.get(`${apiBaseUrl}/productsList`);
  const body = await readBody(response);
  await captureApiEvidence(page, testInfo, { method: 'GET', response, body });

  verifyCodes(response, body, 200);
  expect(body.products).toBeInstanceOf(Array);
  expect(body.products?.length).toBeGreaterThan(0);

  for (const product of body.products ?? []) {
    expect.soft(product).toEqual(
      expect.objectContaining({ id: expect.any(Number), name: expect.any(String) })
    );
  }
});

test('API-PRODUCT-002 - POST to All Products List', async ({ request, page }, testInfo) => {
  const response = await request.post(`${apiBaseUrl}/productsList`);
  const body = await readBody(response);
  await captureApiEvidence(page, testInfo, { method: 'POST', response, body });

  verifyCodes(response, body, 405);
  verifyMessage(body, 'This request method is not supported.');
});

test('API-BRAND-001 - Get All Brands List', async ({ request, page }, testInfo) => {
  const response = await request.get(`${apiBaseUrl}/brandsList`);
  const body = await readBody(response);
  await captureApiEvidence(page, testInfo, { method: 'GET', response, body });

  verifyCodes(response, body, 200);
  expect(body.brands).toBeInstanceOf(Array);
  expect(body.brands?.length).toBeGreaterThan(0);

  for (const brand of body.brands ?? []) {
    expect.soft(brand).toEqual(
      expect.objectContaining({ id: expect.any(Number), brand: expect.any(String) })
    );
  }
});

test('API-BRAND-002 - PUT to All Brands List', async ({ request, page }, testInfo) => {
  const response = await request.put(`${apiBaseUrl}/brandsList`);
  const body = await readBody(response);
  await captureApiEvidence(page, testInfo, { method: 'PUT', response, body });

  verifyCodes(response, body, 405);
  verifyMessage(body, 'This request method is not supported.');
});
