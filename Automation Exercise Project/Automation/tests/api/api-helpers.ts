import {
  expect,
  type APIRequestContext,
  type APIResponse,
  type Page,
  type TestInfo,
} from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createSyntheticIdentity } from '../../data/synthetic-identity';

export const apiBaseUrl = 'https://automationexercise.com/api';

export type ApiBody = {
  responseCode?: number;
  message?: string;
  products?: Array<Record<string, unknown>>;
  brands?: Array<Record<string, unknown>>;
  user?: Record<string, unknown>;
};

export type AccountData = ReturnType<typeof makeAccount>;

type EvidenceDetails = {
  method: string;
  response: APIResponse;
  body: ApiBody;
  requestData?: Record<string, unknown>;
};

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function hideSecrets(data: Record<string, unknown> = {}) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      /password|token|secret/i.test(key) ? '[redacted]' : value,
    ])
  );
}

export async function captureApiEvidence(
  page: Page,
  testInfo: TestInfo,
  details: EvidenceDetails
) {
  // save one readable browser image for the api result
  const testId = testInfo.title.match(/\bAPI-[A-Z]+-\d{3}\b/)?.[0] ?? 'API-UNMAPPED-000';
  const evidencePath = resolve(
    '..',
    'API Testing',
    'Execution Results',
    'Screenshots',
    `${testId}.png`
  );
  const requestText = JSON.stringify(hideSecrets(details.requestData), null, 2);
  const responseText = JSON.stringify(details.body, null, 2);
  const responsePreview =
    responseText.length > 9000
      ? `${responseText.slice(0, 9000)}\n... response shortened for screenshot`
      : responseText;

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.setContent(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(testId)} api evidence</title>
        <style>
          :root { color-scheme: dark; --navy:#071b3c; --blue:#0d4f9f; --gold:#f0c94c; --line:#29466f; --text:#edf4ff; --muted:#a9b9d1; --green:#2dd4a0; }
          * { box-sizing:border-box; }
          body { margin:0; background:#07111f; color:var(--text); font:16px/1.45 "Segoe UI",Arial,sans-serif; }
          header { padding:26px 34px; background:linear-gradient(135deg,var(--navy),var(--blue)); border-bottom:4px solid var(--gold); }
          .eyebrow { color:var(--gold); font-size:13px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; }
          h1 { margin:5px 0 0; font-size:30px; }
          main { padding:26px 34px 38px; }
          .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:18px; }
          .card,.panel { background:#0d1d32; border:1px solid var(--line); border-radius:14px; box-shadow:0 10px 26px #0005; }
          .card { padding:16px; }
          .card span { display:block; color:var(--muted); font-size:12px; font-weight:700; text-transform:uppercase; }
          .card strong { display:block; margin-top:5px; font-size:19px; color:var(--green); overflow-wrap:anywhere; }
          .panel { padding:18px 20px; margin-top:16px; }
          h2 { margin:0 0 12px; font-size:18px; color:var(--gold); }
          pre { margin:0; max-height:480px; overflow:auto; white-space:pre-wrap; overflow-wrap:anywhere; color:#d9e8ff; font:13px/1.42 Consolas,monospace; }
          footer { padding:0 34px 24px; color:var(--muted); font-size:12px; }
        </style>
      </head>
      <body>
        <header><div class="eyebrow">the mcmahon standard | api execution evidence</div><h1>${escapeHtml(testInfo.title)}</h1></header>
        <main>
          <section class="grid">
            <div class="card"><span>method</span><strong>${escapeHtml(details.method)}</strong></div>
            <div class="card"><span>http status</span><strong>${details.response.status()}</strong></div>
            <div class="card"><span>business code</span><strong>${escapeHtml(details.body.responseCode ?? 'not returned')}</strong></div>
            <div class="card"><span>executed</span><strong>${escapeHtml(new Date().toLocaleString())}</strong></div>
          </section>
          <section class="panel"><h2>endpoint</h2><pre>${escapeHtml(details.response.url())}</pre></section>
          <section class="panel"><h2>request data</h2><pre>${escapeHtml(requestText || '{}')}</pre></section>
          <section class="panel"><h2>actual response</h2><pre>${escapeHtml(responsePreview)}</pre></section>
        </main>
        <footer>generated from the actual playwright api response | secrets are redacted</footer>
      </body>
    </html>`);

  await mkdir(dirname(evidencePath), { recursive: true });
  await page.screenshot({ path: evidencePath, fullPage: true });
  await testInfo.attach(`${testId}.png`, {
    path: evidencePath,
    contentType: 'image/png',
  });
}

export async function readBody(response: APIResponse): Promise<ApiBody> {
  const text = await response.text();

  try {
    return JSON.parse(text) as ApiBody;
  } catch {
    throw new Error(`response was not valid json: ${text.slice(0, 200)}`);
  }
}

export function verifyCodes(
  response: APIResponse,
  body: ApiBody,
  expectedBusinessCode: number
) {
  // check the transport and documented api codes
  expect.soft(response.status(), 'http status code').toBe(200);
  expect.soft(body.responseCode, 'business response code').toBe(
    expectedBusinessCode
  );
}

export function verifyMessage(body: ApiBody, expectedMessage: string) {
  expect.soft(body.message, 'response message').toBe(expectedMessage);
}

export function makeAccount(label: string) {
  const { email } = createSyntheticIdentity(label);

  return {
    name: `qa ${label}`,
    email,
    password: 'QaPortfolio123!',
    title: 'Mr',
    birth_date: '1',
    birth_month: 'January',
    birth_year: '1990',
    firstname: 'Kevin',
    lastname: 'Tester',
    company: 'QA Portfolio',
    address1: '123 Test Street',
    address2: 'Suite 1',
    country: 'United States',
    zipcode: '10001',
    state: 'New York',
    city: 'New York',
    mobile_number: '5550101000',
  };
}

export async function createAccount(
  request: APIRequestContext,
  account: AccountData
) {
  const response = await request.post(`${apiBaseUrl}/createAccount`, {
    form: account,
  });
  const body = await readBody(response);

  expect(response.status(), 'account setup http status').toBe(200);
  expect(body.responseCode, 'account setup response code').toBe(201);
  return { response, body };
}

export async function deleteAccount(
  request: APIRequestContext,
  account: Pick<AccountData, 'email' | 'password'>
) {
  return request.delete(`${apiBaseUrl}/deleteAccount`, {
    form: {
      email: account.email,
      password: account.password,
    },
  });
}

export async function cleanupAccount(
  request: APIRequestContext,
  account: Pick<AccountData, 'email' | 'password'>
) {
  // keep cleanup from hiding the main test result
  await deleteAccount(request, account).catch(() => undefined);
}
