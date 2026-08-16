import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import { writeCheckoutAddressEvidence } from '../../reporting/checkout-address-evidence';

test('AE-ORDER-004 evidence writer creates a self-contained branded HTML and PDF report', async () => {
  const outputDir = await mkdtemp(resolve(tmpdir(), 'ae-order-004-evidence-'));
  const screenshotPath = resolve(outputDir, 'checkout.png');
  const logoPath = resolve(outputDir, 'logo.png');
  const onePixelPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nWQAAAAASUVORK5CYII=',
    'base64'
  );
  await writeFile(screenshotPath, onePixelPng);
  await writeFile(logoPath, onePixelPng);

  const result = await writeCheckoutAddressEvidence({
    outputDir,
    screenshotPath,
    logoPath,
    executedAt: '2026-08-15T18:30:00.000Z',
    environment: 'Chromium / automationexercise.com',
    status: 'Passed',
    expectedAddressLines: ['Kevin Tester', '100 Quality Lane', 'Philadelphia PA 19103'],
    deliveryAddressLines: ['Kevin Tester', '100 Quality Lane', 'Philadelphia PA 19103'],
    billingAddressLines: ['Kevin Tester', '100 Quality Lane', 'Philadelphia PA 19103'],
    assertions: [
      { name: 'Delivery address matches registration', passed: true, details: 'All expected values visible.' },
      { name: 'Billing address matches registration', passed: true, details: 'All expected values visible.' },
    ],
  });

  const html = await readFile(result.htmlPath, 'utf8');
  const pdf = await readFile(result.pdfPath);

  expect(html).toContain('AEQA-23');
  expect(html).toContain('REQ-ORDER-004');
  expect(html).toContain('AEQA-115');
  expect(html).toContain('AE-ORDER-004');
  expect(html).toContain('data:image/png;base64,');
  expect(html).toContain('Delivery address matches registration');
  expect(html).toContain('Passed');
  expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
  expect(pdf.byteLength).toBeGreaterThan(1_000);
});
