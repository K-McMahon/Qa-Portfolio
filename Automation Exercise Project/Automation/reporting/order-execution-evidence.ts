import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

type EvidenceAssertion = { name: string; passed: boolean; details: string };

export type OrderExecutionEvidenceInput = {
  outputDir: string;
  screenshotPath: string;
  logoPath: string;
  executedAt: string;
  environment: string;
  status: 'Passed' | 'Failed';
  assertions: EvidenceAssertion[];
  failureDetails?: string;
};

const traceability = {
  requirement: 'AEQA-14 / REQ-ORDER-001',
  requirementName: 'Place Order: Register while Checkout',
  testCase: 'AEQA-107 / AE-ORDER-001',
  testCaseName: 'Verify an order can be placed after registering during checkout',
  automationTask: 'AEQA-89',
};

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

async function imageDataUrl(path: string) {
  return `data:image/png;base64,${(await readFile(path)).toString('base64')}`;
}

export async function writeOrderExecutionEvidence(input: OrderExecutionEvidenceInput) {
  await mkdir(input.outputDir, { recursive: true });
  const htmlPath = resolve(input.outputDir, 'AE-ORDER-001-evidence.html');
  const pdfPath = resolve(input.outputDir, 'AE-ORDER-001-evidence.pdf');
  const [logo, screenshot] = await Promise.all([imageDataUrl(input.logoPath), imageDataUrl(input.screenshotPath)]);
  const executionDate = new Date(input.executedAt).toLocaleString('en-US', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/New_York',
  });
  const statusClass = input.status.toLowerCase();
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AE-ORDER-001 Execution Evidence</title>
<style>
:root{--navy:#14213d;--blue:#2463a8;--green:#18794e;--red:#b42318;--ink:#1f2937;--muted:#5b6472;--line:#d9e0e8;--wash:#f4f7fb}*{box-sizing:border-box}body{margin:0;background:var(--wash);color:var(--ink);font:14px/1.45 Arial,Helvetica,sans-serif}main{max-width:1120px;margin:24px auto;background:#fff;padding:30px 36px 36px;box-shadow:0 8px 28px rgba(20,33,61,.12)}header{display:flex;justify-content:space-between;gap:28px;align-items:center;border-bottom:4px solid var(--blue);padding-bottom:20px}.logo{width:360px;max-height:110px;object-fit:contain;object-position:left center}h1{margin:0;color:var(--navy);font-size:28px;line-height:1.15}h2{color:var(--navy);font-size:19px;margin:26px 0 10px;border-bottom:1px solid var(--line);padding-bottom:6px;break-after:avoid-page}.subtitle{color:var(--muted);margin-top:7px}.status{display:inline-block;margin-top:12px;padding:6px 14px;border-radius:999px;color:#fff;font-weight:700;font-size:15px}.passed{background:var(--green)}.failed{background:var(--red)}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 22px}.field{border-left:4px solid #c8d5e5;padding:8px 10px;background:#f9fbfd}.label{display:block;color:var(--muted);font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}table{width:100%;border-collapse:collapse}th,td{border:1px solid var(--line);padding:9px 10px;text-align:left;vertical-align:top}th{background:#edf3f9;color:var(--navy)}.pass{color:var(--green);font-weight:700}.fail{color:var(--red);font-weight:700}.screenshot{width:100%;max-height:650px;object-fit:contain;object-position:top center;border:1px solid var(--line);border-radius:7px;background:#f8fafc}.failure{border-left:5px solid var(--red);background:#fff2f0;padding:12px;white-space:pre-wrap}footer{margin-top:22px;color:var(--muted);font-size:11px;text-align:center}@media print{body{background:#fff}main{max-width:none;margin:0;padding:0;box-shadow:none}h2,table,.screenshot{break-inside:avoid}}
</style></head><body><main>
<header><img class="logo" src="${logo}" alt="The McMahon Standard logo"><div><h1>Automated Test Execution Evidence</h1><div class="subtitle">Automation Exercise QA Portfolio</div><span class="status ${statusClass}">${escapeHtml(input.status)}</span></div></header>
<h2>Traceability</h2><div class="grid">
<div class="field"><span class="label">Requirement</span>${traceability.requirement}<br>${traceability.requirementName}</div>
<div class="field"><span class="label">Test Case</span>${traceability.testCase}<br>${traceability.testCaseName}</div>
<div class="field"><span class="label">Automation Task</span>${traceability.automationTask}</div>
<div class="field"><span class="label">Execution</span>${escapeHtml(executionDate)}<br>${escapeHtml(input.environment)}</div></div>
<h2>Scenario</h2><p><strong>Expected result:</strong> A logged-out visitor adds a product, registers during checkout, completes payment with synthetic test data, and receives the order confirmation.</p>
<ol><li>Add an in-stock product while logged out.</li><li>Proceed to checkout and select Register / Login.</li><li>Create a disposable account and return to checkout.</li><li>Verify address and order details.</li><li>Place the order and submit synthetic payment data.</li><li>Verify confirmation and delete the disposable account.</li></ol>
<h2>Assertion Results</h2><table><thead><tr><th>Assertion</th><th>Status</th><th>Details</th></tr></thead><tbody>${input.assertions.map((item) => `<tr><td>${escapeHtml(item.name)}</td><td class="${item.passed ? 'pass' : 'fail'}">${item.passed ? 'PASS' : 'FAIL'}</td><td>${escapeHtml(item.details)}</td></tr>`).join('')}</tbody></table>
${input.failureDetails ? `<h2>Failure Details</h2><div class="failure">${escapeHtml(input.failureDetails)}</div>` : ''}
<h2>Order Confirmation Screenshot</h2><img class="screenshot" src="${screenshot}" alt="Order confirmation evidence">
<footer>The McMahon Standard - QA execution evidence - AE-ORDER-001</footer>
</main></body></html>`;
  await writeFile(htmlPath, html, 'utf8');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({ path: pdfPath, format: 'A4', landscape: true, printBackground: true, margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' } });
  } finally { await browser.close(); }
  return { htmlPath, pdfPath };
}
