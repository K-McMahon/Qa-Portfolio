import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, relative, resolve } from 'node:path';
import { collectEvidenceAttachments } from './evidence-attachments';

type ResultStatus = 'passed' | 'failed' | 'flaky' | 'skipped' | 'timed out' | 'interrupted';

type TestAttempt = {
  status: TestResult['status'];
  duration: number;
  retry: number;
  errors: string[];
  attachments: { name: string; path?: string; contentType: string }[];
};

type TestRecord = {
  id: string;
  testId: string;
  title: string;
  suite: string;
  file: string;
  line: number;
  project: string;
  expectedStatus: string;
  attempts: TestAttempt[];
};

// store each test and all retry attempts
export default class QaAnalyticsReporter implements Reporter {
  private config?: FullConfig;
  private startedAt = new Date();
  private records = new Map<string, TestRecord>();
  private reportDir = resolve('test-results', 'qa-analytics');

  // save run settings before tests start
  onBegin(config: FullConfig, suite: Suite) {
    this.config = config;
    this.startedAt = new Date();

    for (const test of suite.allTests()) {
      this.records.set(test.id, this.createRecord(test));
    }
  }

  // add one result attempt to its test record
  onTestEnd(test: TestCase, result: TestResult) {
    const record = this.records.get(test.id) ?? this.createRecord(test);
    record.attempts.push({
      status: result.status,
      duration: result.duration,
      retry: result.retry,
      errors: result.errors.map((error) => error.message || error.value || 'unknown error'),
      attachments: result.attachments.map((attachment) => ({
        name: attachment.name,
        path: attachment.path,
        contentType: attachment.contentType,
      })),
    });
    this.records.set(test.id, record);
  }

  // write both human and machine readable reports
  async onEnd(result: FullResult) {
    // keep test discovery from replacing the latest run
    if (![...this.records.values()].some((record) => record.attempts.length > 0)) {
      return;
    }

    const finishedAt = new Date();
    const tests = [...this.records.values()].map((record) => this.summarizeRecord(record));
    const summary = this.buildSummary(tests, result, finishedAt);

    mkdirSync(this.reportDir, { recursive: true });
    writeFileSync(
      resolve(this.reportDir, 'run-summary.json'),
      JSON.stringify({ summary, tests }, null, 2),
      'utf8'
    );
    writeFileSync(resolve(this.reportDir, 'index.html'), this.buildHtml(summary, tests), 'utf8');

    console.log(`\nqa analytics report: ${resolve(this.reportDir, 'index.html')}`);

    if (!process.env.CI && process.env.QA_REPORT_OPEN !== 'false') {
      this.openReport(resolve(this.reportDir, 'index.html'));
    }
  }

  // create a stable record before results arrive
  private createRecord(test: TestCase): TestRecord {
    const titlePath = test.titlePath();
    const testId = test.title.match(/\b[A-Z]+(?:-[A-Z]+)*-\d{3}\b/)?.[0] ?? 'unmapped';
    return {
      id: test.id,
      testId,
      title: test.title,
      suite: titlePath.slice(1, -1).join(' > ') || 'root suite',
      file: relative(process.cwd(), test.location.file).replace(/\\/g, '/'),
      line: test.location.line,
      project: test.parent.project()?.name || 'default',
      expectedStatus: test.expectedStatus,
      attempts: [],
    };
  }

  // reduce retry attempts into one qa result
  private summarizeRecord(record: TestRecord) {
    const latest = record.attempts.at(-1);
    const rawStatus = latest?.status ?? 'skipped';
    const status: ResultStatus =
      rawStatus === 'passed' && record.attempts.length > 1
        ? 'flaky'
        : rawStatus === 'timedOut'
          ? 'timed out'
          : rawStatus;
    const duration = record.attempts.reduce((total, attempt) => total + attempt.duration, 0);
    const errors = record.attempts.flatMap((attempt) => attempt.errors);
    const attachments = record.attempts.flatMap((attempt) =>
      attempt.attachments.map((attachment) => ({
        ...attachment,
        href: attachment.path
          ? encodeURI(relative(this.reportDir, attachment.path).replace(/\\/g, '/'))
          : undefined,
      }))
    );
    const screenshot = record.attempts
      .flatMap((attempt) => attempt.attachments)
      .filter((attachment) => attachment.path && attachment.contentType === 'image/png')
      .at(-1);
    const evidenceName =
      record.testId === 'unmapped'
        ? `${record.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'unmapped-test'}.png`
        : `${record.testId}.png`;
    const evidencePath = resolve('Execution Evidence', evidenceName);

    if (status !== 'skipped' && screenshot?.path) {
      mkdirSync(dirname(evidencePath), { recursive: true });
      if (resolve(screenshot.path) !== evidencePath) {
        copyFileSync(screenshot.path, evidencePath);
      }
    }

    const evidenceAttachments =
      status === 'skipped'
        ? []
        : collectEvidenceAttachments(
            record.attempts.flatMap((attempt) => attempt.attachments),
            this.reportDir,
            existsSync(evidencePath)
              ? {
                  name: `${record.testId} final browser evidence`,
                  path: evidencePath,
                  contentType: 'image/png',
                }
              : undefined
          );
    const traceabilityHref =
      record.testId === 'unmapped'
        ? undefined
        : this.excelUrl(
            resolve(
              '..',
              'Test Plan',
              'Automation Exercise Requirements Traceability Matrix.xlsx'
            )
          );
    const repositoryHref =
      record.testId === 'unmapped'
        ? undefined
        : record.testId.startsWith('API-')
          ? this.excelUrl(
              resolve(
                '..',
                'API Testing',
                'Documentation',
                'Automation Exercise API Test Cases.xlsx'
              )
            )
          : this.excelUrl(
              resolve(
                '..',
                'Test Cases',
                'Automation Exercise - Test Case Repository.xlsx'
              )
            );

    return {
      ...record,
      status,
      duration,
      retries: Math.max(0, record.attempts.length - 1),
      errors,
      attachments:
        status === 'skipped'
          ? []
          : evidenceAttachments.length
            ? evidenceAttachments
            : attachments,
      traceabilityHref,
      repositoryHref,
      attempts: record.attempts.length,
    };
  }

  // calculate run metrics used by qa review
  private buildSummary(tests: ReturnType<QaAnalyticsReporter['summarizeRecord']>[], result: FullResult, finishedAt: Date) {
    const count = (status: ResultStatus) => tests.filter((test) => test.status === status).length;
    const total = tests.length;
    const passed = count('passed');
    const flaky = count('flaky');
    const failed = count('failed') + count('timed out') + count('interrupted');
    const skipped = count('skipped');
    const completed = total - skipped;
    const passRate = completed ? ((passed + flaky) / completed) * 100 : 0;
    const mapped = tests.filter((test) => test.testId !== 'unmapped').length;
    const projects = [...new Set(tests.map((test) => test.project))];
    const baseUrls = [
      ...new Set(
        (this.config?.projects ?? [])
          .map((project) => project.use.baseURL)
          .filter((value): value is string => typeof value === 'string')
      ),
    ];

    return {
      runId: `ae-${this.startedAt.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`,
      outcome: result.status,
      startedAt: this.startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      duration: finishedAt.getTime() - this.startedAt.getTime(),
      total,
      passed,
      failed,
      flaky,
      skipped,
      passRate,
      mapped,
      traceabilityRate: total ? (mapped / total) * 100 : 0,
      projects,
      baseUrls,
      environment: process.env.QA_ENVIRONMENT || 'qa',
      platform: `${process.platform} ${process.arch}`,
      nodeVersion: process.version,
    };
  }

  // make the report portable by placing the logo inside the html
  private logoDataUrl() {
    const logoPath = resolve('reporting', 'assets', 'the-mcmahon-standard-logo.png');
    if (!existsSync(logoPath)) return '';
    return `data:image/png;base64,${readFileSync(logoPath).toString('base64')}`;
  }

  // make an absolute local file link for saved evidence
  private fileUrl(filePath: string) {
    return encodeURI(`file:///${resolve(filePath).replace(/\\/g, '/')}`);
  }

  // ask the installed excel application to open the local workbook
  private excelUrl(filePath: string) {
    return `ms-excel:ofe|u|${this.fileUrl(filePath)}`;
  }

  // open the finished report with the default browser
  private openReport(reportPath: string) {
    const command =
      process.platform === 'win32'
        ? ['cmd', ['/c', 'start', '', reportPath]]
        : process.platform === 'darwin'
          ? ['open', [reportPath]]
          : ['xdg-open', [reportPath]];
    const child = spawn(command[0], command[1], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    });
    child.unref();
  }

  // escape live test text before placing it in html
  private escape(value: unknown) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // format milliseconds for quick review
  private formatDuration(milliseconds: number) {
    if (milliseconds < 1000) return `${milliseconds} ms`;
    if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)} s`;
    return `${Math.floor(milliseconds / 60000)}m ${Math.round((milliseconds % 60000) / 1000)}s`;
  }

  // build a self contained analytics page
  private buildHtml(
    summary: ReturnType<QaAnalyticsReporter['buildSummary']>,
    tests: ReturnType<QaAnalyticsReporter['summarizeRecord']>[]
  ) {
    const e = (value: unknown) => this.escape(value);
    const logo = this.logoDataUrl();
    const chartStops = [
      `#1fc98a 0 ${(summary.passed / Math.max(summary.total, 1)) * 100}%`,
      `#f0c94c 0 ${((summary.passed + summary.flaky) / Math.max(summary.total, 1)) * 100}%`,
      `#ef6b72 0 ${((summary.passed + summary.flaky + summary.failed) / Math.max(summary.total, 1)) * 100}%`,
      '#667085 0 100%',
    ].join(',');
    const reviewState = summary.failed > 0 ? 'action required' : summary.flaky > 0 ? 'review flaky tests' : 'ready for review';
    const testRows = tests
      .map((test) => {
        const attachmentLinks = test.attachments
          .filter((attachment) => attachment.href)
          .map((attachment) => `<a href="${attachment.href}" target="_blank">${e(attachment.name)}</a>`)
          .join('');
        const error = test.errors[0]
          ? `<details><summary>failure detail</summary><pre>${e(test.errors[0])}</pre></details>`
          : '<span class="muted">none</span>';
        const testTitle = test.traceabilityHref
          ? `<a class="test-link" href="${test.traceabilityHref}" title="open the requirements traceability matrix">${e(test.title)}</a>`
          : `<span>${e(test.title)}</span>`;
        const repositoryLink = test.repositoryHref
          ? `<a class="document-link" href="${test.repositoryHref}" title="open the test case repository">test repository</a>`
          : '';
        return `<tr data-status="${e(test.status)}" data-search="${e(`${test.testId} ${test.title} ${test.file} ${test.project}`.toLowerCase())}">
          <td><strong>${e(test.testId)}</strong>${testTitle}${repositoryLink}</td>
          <td><span class="status status-${e(test.status.replace(' ', '-'))}">${e(test.status)}</span></td>
          <td>${e(test.project)}</td>
          <td>${e(this.formatDuration(test.duration))}</td>
          <td>${e(test.retries)}</td>
          <td><code>${e(test.file)}:${e(test.line)}</code></td>
          <td><div class="evidence">${attachmentLinks || '<span class="muted">none</span>'}</div></td>
          <td>${error}</td>
        </tr>`;
      })
      .join('');
    const failures = tests.filter((test) => ['failed', 'timed out', 'interrupted'].includes(test.status));
    const nextActions = failures.length
      ? failures.map((test) => `<li>review ${e(test.testId)} and its saved evidence before defect triage</li>`).join('')
      : '<li>archive this run as execution evidence</li><li>review skipped or flaky coverage before release sign-off</li>';

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>qa analytics | ${e(summary.runId)}</title>
  <style>
    :root { --navy:#061b3b; --navy-2:#0a2d63; --gold:#f0c94c; --ink:#162033; --muted:#667085; --line:#dfe5ef; --surface:#fff; --bg:#f3f6fb; --pass:#087f5b; --fail:#c92a3b; --skip:#667085; --flaky:#9a6700; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--ink); font:14px/1.5 Inter,Segoe UI,Arial,sans-serif; }
    header { background:linear-gradient(135deg,var(--navy),var(--navy-2)); color:white; padding:26px 34px; box-shadow:0 14px 34px #061b3b30; }
    .header-inner,.page { max-width:1500px; margin:auto; }
    .brand { display:flex; align-items:center; justify-content:space-between; gap:28px; }
    .brand img { width:310px; max-height:116px; object-fit:contain; background:#ffffffee; border-radius:16px; padding:10px 16px; }
    .eyebrow { color:var(--gold); font-weight:800; letter-spacing:.16em; text-transform:uppercase; }
    h1 { margin:5px 0 2px; font-size:34px; letter-spacing:-.03em; }
    header p { margin:0; color:#d9e4f5; }
    .run-state { min-width:210px; padding:15px 18px; border:1px solid #ffffff33; border-radius:14px; background:#ffffff12; }
    .run-state strong { display:block; margin-top:4px; font-size:18px; color:var(--gold); }
    .page { padding:26px 28px 48px; }
    .grid { display:grid; grid-template-columns:repeat(6,minmax(140px,1fr)); gap:14px; }
    .card,.panel { background:var(--surface); border:1px solid var(--line); border-radius:16px; box-shadow:0 8px 22px #061b3b0b; }
    .metric { padding:18px; border-top:4px solid var(--navy-2); }
    .metric span { display:block; color:var(--muted); font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; }
    .metric strong { display:block; margin-top:6px; font-size:28px; }
    .metric.pass { border-color:var(--pass); } .metric.fail { border-color:var(--fail); } .metric.gold { border-color:var(--gold); }
    .overview { display:grid; grid-template-columns:320px 1fr; gap:18px; margin-top:18px; }
    .panel { padding:22px; }
    .donut { width:190px; height:190px; margin:4px auto 14px; border-radius:50%; background:conic-gradient(${chartStops}); position:relative; }
    .donut:after { content:'${summary.total} tests'; position:absolute; inset:30px; display:grid; place-items:center; border-radius:50%; background:white; font-size:20px; font-weight:800; }
    .legend { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
    .legend span:before { content:''; display:inline-block; width:9px; height:9px; margin-right:7px; border-radius:50%; background:var(--dot); }
    .run-info { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
    .info { padding:13px; background:#f7f9fc; border-radius:11px; }
    .info b { display:block; margin-bottom:3px; color:var(--muted); font-size:11px; text-transform:uppercase; }
    h2 { margin:0 0 16px; font-size:20px; }
    .review { margin-top:18px; display:grid; grid-template-columns:1.5fr 1fr; gap:18px; }
    .review ul { margin:8px 0 0 18px; padding:0; }
    .review-badge { display:inline-block; padding:7px 12px; border-radius:999px; color:white; background:${summary.failed ? 'var(--fail)' : 'var(--pass)'}; font-weight:800; text-transform:uppercase; letter-spacing:.05em; }
    .results { margin-top:18px; padding:0; overflow:hidden; }
    .toolbar { display:flex; flex-wrap:wrap; gap:10px; align-items:center; padding:18px 20px; border-bottom:1px solid var(--line); }
    .toolbar h2 { margin:0 auto 0 0; }
    input,select { min-height:38px; border:1px solid #cbd3df; border-radius:9px; padding:8px 11px; background:white; color:var(--ink); }
    input { min-width:280px; }
    .table-wrap { overflow:auto; }
    table { width:100%; border-collapse:collapse; min-width:1180px; }
    th { padding:11px 13px; background:#f7f9fc; color:#475467; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.05em; }
    td { padding:13px; border-top:1px solid var(--line); vertical-align:top; }
    td strong,td span { display:block; } td strong { margin-bottom:3px; }
    code { font:12px Consolas,monospace; color:#344054; }
    .status { display:inline-block; width:max-content; padding:4px 9px; border-radius:999px; font-size:11px; font-weight:800; text-transform:uppercase; }
    .status-passed { color:var(--pass); background:#dff7ed; } .status-failed,.status-timed-out,.status-interrupted { color:var(--fail); background:#ffe4e7; }
    .status-flaky { color:var(--flaky); background:#fff2c7; } .status-skipped { color:var(--skip); background:#edf0f5; }
    .evidence { display:flex; flex-direction:column; gap:5px; } a { color:#0756b3; font-weight:700; }
    .test-link { display:block; text-decoration:none; } .test-link:hover { text-decoration:underline; }
    .document-link { display:inline-block; margin-top:5px; color:var(--muted); font-size:11px; font-weight:600; }
    details { max-width:420px; } summary { cursor:pointer; color:var(--fail); font-weight:700; } pre { max-height:190px; overflow:auto; white-space:pre-wrap; font:11px/1.45 Consolas,monospace; background:#fff4f5; padding:10px; border-radius:8px; }
    .muted { color:var(--muted); } footer { max-width:1500px; margin:auto; padding:0 28px 30px; color:var(--muted); font-size:12px; }
    @media (max-width:1000px) { .grid { grid-template-columns:repeat(2,1fr); } .overview,.review { grid-template-columns:1fr; } .brand { align-items:flex-start; flex-direction:column; } .run-info { grid-template-columns:1fr 1fr; } }
    @media print { header { background:white; color:var(--ink); box-shadow:none; } header p { color:var(--muted); } .toolbar input,.toolbar select { display:none; } .page { padding:12px; } }
  </style>
</head>
<body>
  <header>
    <div class="header-inner brand">
      <div>${logo ? `<img src="${logo}" alt="the mcmahon standard">` : ''}</div>
      <div style="flex:1"><div class="eyebrow">quality assurance execution intelligence</div><h1>automation exercise analytics</h1></div>
      <div class="run-state"><span>review state</span><strong>${e(reviewState)}</strong><small>${e(summary.runId)}</small></div>
    </div>
  </header>
  <main class="page">
    <section class="grid">
      <div class="card metric"><span>total tests</span><strong>${summary.total}</strong></div>
      <div class="card metric pass"><span>passed</span><strong>${summary.passed}</strong></div>
      <div class="card metric fail"><span>failed</span><strong>${summary.failed}</strong></div>
      <div class="card metric gold"><span>flaky</span><strong>${summary.flaky}</strong></div>
      <div class="card metric"><span>skipped</span><strong>${summary.skipped}</strong></div>
      <div class="card metric pass"><span>pass rate</span><strong>${summary.passRate.toFixed(1)}%</strong></div>
    </section>
    <section class="overview">
      <article class="panel"><h2>status distribution</h2><div class="donut"></div><div class="legend"><span style="--dot:#1fc98a">passed ${summary.passed}</span><span style="--dot:#ef6b72">failed ${summary.failed}</span><span style="--dot:#f0c94c">flaky ${summary.flaky}</span><span style="--dot:#667085">skipped ${summary.skipped}</span></div></article>
      <article class="panel"><h2>execution context</h2><div class="run-info">
        <div class="info"><b>environment</b>${e(summary.environment)}</div><div class="info"><b>base url</b>${e(summary.baseUrls.join(', ') || 'not set')}</div><div class="info"><b>browser projects</b>${e(summary.projects.join(', '))}</div>
        <div class="info"><b>started</b>${e(new Date(summary.startedAt).toLocaleString())}</div><div class="info"><b>duration</b>${e(this.formatDuration(summary.duration))}</div><div class="info"><b>runner</b>${e(summary.platform)}</div>
        <div class="info"><b>traceability</b>${summary.mapped}/${summary.total} mapped (${summary.traceabilityRate.toFixed(1)}%)</div><div class="info"><b>node</b>${e(summary.nodeVersion)}</div><div class="info"><b>run outcome</b>${e(summary.outcome)}</div>
      </div></article>
    </section>
    <section class="review">
      <article class="panel"><h2>qa assessment</h2><span class="review-badge">${e(reviewState)}</span><p>${summary.failed ? `${summary.failed} test result(s) need failure analysis and possible defect triage.` : 'the automated scope completed without a blocking failure.'}</p><p class="muted">pass rate excludes skipped tests. flaky tests pass after at least one retry and still need investigation.</p></article>
      <article class="panel"><h2>recommended next actions</h2><ul>${nextActions}</ul></article>
    </section>
    <section class="panel results">
      <div class="toolbar"><h2>test execution detail</h2><input id="search" type="search" placeholder="search id, title, file, or browser"><select id="status"><option value="all">all statuses</option><option>passed</option><option>failed</option><option>flaky</option><option>skipped</option><option>timed out</option><option>interrupted</option></select></div>
      <div class="table-wrap"><table><thead><tr><th>test case</th><th>status</th><th>browser</th><th>duration</th><th>retries</th><th>source</th><th>evidence</th><th>analysis</th></tr></thead><tbody id="results">${testRows}</tbody></table></div>
    </section>
  </main>
  <footer>generated locally by the mcmahon standard qa analytics reporter. credentials and request secrets are not included. use the standard playwright report for traces and deep diagnostics.</footer>
  <script>
    const search = document.querySelector('#search');
    const status = document.querySelector('#status');
    const rows = [...document.querySelectorAll('#results tr')];
    const filter = () => rows.forEach((row) => { const textMatch = row.dataset.search.includes(search.value.toLowerCase()); const statusMatch = status.value === 'all' || row.dataset.status === status.value; row.hidden = !(textMatch && statusMatch); });
    search.addEventListener('input', filter);
    status.addEventListener('change', filter);
  </script>
</body>
</html>`;
  }
}
