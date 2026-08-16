import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import { writeOrderExecutionEvidence } from '../../reporting/order-execution-evidence';

test('AE-ORDER-001 evidence writer creates a professional self-contained HTML and PDF', async () => {
  const outputDir = await mkdtemp(resolve(tmpdir(), 'ae-order-001-evidence-'));
  const screenshotPath = resolve(outputDir, 'order-confirmation.png');
  const logoPath = resolve(outputDir, 'logo.png');
  const onePixelPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nWQAAAAASUVORK5CYII=',
    'base64'
  );
  await writeFile(screenshotPath, onePixelPng);
  await writeFile(logoPath, onePixelPng);

  const result = await writeOrderExecutionEvidence({
    outputDir,
    screenshotPath,
    logoPath,
    executedAt: '2026-08-15T18:30:00.000Z',
    environment: 'Chromium / automationexercise.com',
    status: 'Passed',
    assertions: [
      { name: 'Registration completed during checkout', passed: true, details: 'Disposable account created.' },
      { name: 'Order confirmation displayed', passed: true, details: 'Confirmation message visible.' },
    ],
  });

  const html = await readFile(result.htmlPath, 'utf8');
  const pdf = await readFile(result.pdfPath);
  expect(html).toContain('AEQA-14');
  expect(html).toContain('REQ-ORDER-001');
  expect(html).toContain('AEQA-107');
  expect(html).toContain('AE-ORDER-001');
  expect(html).toContain('AEQA-89');
  expect(html).toContain('data:image/png;base64,');
  expect(html).not.toContain('analyst review and release decisions');
  expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
  expect(pdf.byteLength).toBeGreaterThan(1_000);
});
