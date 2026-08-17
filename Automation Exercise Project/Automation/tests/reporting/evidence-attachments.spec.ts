import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import { collectEvidenceAttachments } from '../../reporting/evidence-attachments';

test('keeps both named screenshots and removes duplicate screenshot paths', () => {
  const reportDir = resolve('test-results', 'qa-analytics');
  const preLoginScreenshot = resolve('Execution Evidence', 'AE-CART-004(1).png');
  const postLoginScreenshot = resolve('Execution Evidence', 'AE-CART-004(2).png');
  const attachments = [
    {
      name: 'AE-CART-004(1) pre-login filled cart',
      path: preLoginScreenshot,
      contentType: 'image/png',
    },
    {
      name: 'AE-CART-004(2) post-login retained cart',
      path: postLoginScreenshot,
      contentType: 'image/png',
    },
    {
      name: 'duplicate post-login',
      path: postLoginScreenshot,
      contentType: 'image/png',
    },
    {
      name: 'trace',
      path: resolve('test-results', 'trace.zip'),
      contentType: 'application/zip',
    },
    {
      name: 'screenshot',
      path: resolve('test-results', 'automatic-screenshot.png'),
      contentType: 'image/png',
    },
    {
      name: 'browser evidence',
      path: resolve('Execution Evidence', 'AE-CART-004.png'),
      contentType: 'image/png',
    },
  ];

  const evidence = collectEvidenceAttachments(attachments, reportDir, {
    name: 'AE-CART-004 final browser evidence',
    path: resolve('Execution Evidence', 'AE-CART-004.png'),
    contentType: 'image/png',
  });

  expect(evidence.map((item) => item.name)).toEqual([
    'AE-CART-004(1) pre-login filled cart',
    'AE-CART-004(2) post-login retained cart',
  ]);
  expect(evidence.every((item) => item.href.length > 0)).toBeTruthy();
});
