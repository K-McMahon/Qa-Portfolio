import { test, expect } from '@playwright/test';
import {
  apiBaseUrl,
  captureApiEvidence,
  readBody,
  verifyCodes,
  verifyMessage,
} from './api-helpers';

test('API-SEARCH-001 - Search Product', async ({ request, page }, testInfo) => {
  const response = await request.post(`${apiBaseUrl}/searchProduct`, {
    form: { search_product: 'top' },
  });
  const body = await readBody(response);
  await captureApiEvidence(page, testInfo, {
    method: 'POST',
    response,
    body,
    requestData: { search_product: 'top' },
  });

  verifyCodes(response, body, 200);
  expect(body.products).toBeInstanceOf(Array);
  expect(body.products?.length).toBeGreaterThan(0);

  for (const product of body.products ?? []) {
    expect.soft(product).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        category: expect.any(Object),
      })
    );
  }
});

test('API-SEARCH-002 - Search Without Parameter', async ({ request, page }, testInfo) => {
  const response = await request.post(`${apiBaseUrl}/searchProduct`);
  const body = await readBody(response);
  await captureApiEvidence(page, testInfo, { method: 'POST', response, body });

  verifyCodes(response, body, 400);
  verifyMessage(
    body,
    'Bad request, search_product parameter is missing in POST request.'
  );
});
