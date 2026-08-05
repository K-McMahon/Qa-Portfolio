const fs = require("fs/promises");
const path = require("path");
const { spawn } = require("child_process");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDuration(milliseconds) {
  return `${(milliseconds / 1000).toFixed(2)} seconds`;
}

function getArticleStatus(articles, index) {
  const article = articles[index];

  if (Number.isNaN(article.publishedAt.getTime())) {
    return { label: "Invalid date", className: "status-fail" };
  }

  if (
    index > 0 &&
    articles[index - 1].publishedAt < article.publishedAt
  ) {
    return { label: "Order issue", className: "status-fail" };
  }

  return { label: "Verified", className: "status-pass" };
}

function buildArticleRows(articles) {
  if (articles.length === 0) {
    return `
      <tr>
        <td colspan="4" class="empty-state">No article evidence was collected.</td>
      </tr>`;
  }

  return articles
    .map((article, index) => {
      const status = getArticleStatus(articles, index);
      const itemUrl = `https://news.ycombinator.com/item?id=${encodeURIComponent(article.id)}`;

      return `
        <tr>
          <td class="position">${index + 1}</td>
          <td>
            <a href="${itemUrl}" target="_blank" rel="noreferrer">
              ${escapeHtml(article.title)}
            </a>
            <div class="article-id">ID ${escapeHtml(article.id)}</div>
          </td>
          <td class="timestamp">${escapeHtml(article.timestamp)}</td>
          <td><span class="row-status ${status.className}">${status.label}</span></td>
        </tr>`;
    })
    .join("");
}

function buildHtmlReport({
  articles,
  error,
  finishedAt,
  pagesInspected,
  startedAt,
}) {
  const passed = !error;
  const statusLabel = passed ? "PASS" : "FAIL";
  const uniqueArticleCount = new Set(articles.map((article) => article.id)).size;
  const duration = finishedAt.getTime() - startedAt.getTime();
  const newest = articles.at(0);
  const oldest = articles.at(-1);
  const errorPanel = error
    ? `
      <section class="failure-panel" aria-labelledby="failure-heading">
        <div class="eyebrow">Failure details</div>
        <h2 id="failure-heading">The validation found a problem</h2>
        <pre>${escapeHtml(error.message)}</pre>
      </section>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>QA Wolf Take-Home | Hacker News Validation Report</title>
  <style>
    :root {
      --wolf-blue: #3b3bef;
      --wolf-blue-dark: #2b2bb9;
      --wolf-lavender: #94a5f7;
      --wolf-mint: #0df2cc;
      --wolf-pink: #ffb8f5;
      --ink: #050505;
      --muted: #606072;
      --paper: #ffffff;
      --soft: #f4f5ff;
      --line: #dfe1ff;
      --danger: #b42318;
      --danger-soft: #fff0ee;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      color: var(--ink);
      background:
        linear-gradient(rgba(255,255,255,.94), rgba(255,255,255,.94)),
        repeating-linear-gradient(0deg, transparent 0 31px, var(--line) 31px 32px),
        repeating-linear-gradient(90deg, transparent 0 31px, var(--line) 31px 32px);
      font-family: Barlow, Inter, "Segoe UI", Arial, sans-serif;
      line-height: 1.5;
    }

    a { color: var(--wolf-blue-dark); font-weight: 700; text-decoration-thickness: 2px; }
    a:hover { color: var(--ink); }

    .hero {
      position: relative;
      overflow: hidden;
      padding: 52px max(24px, calc((100vw - 1180px) / 2));
      color: white;
      background: var(--wolf-blue);
      border-bottom: 8px solid var(--ink);
    }

    .hero::after {
      content: "// RUN EVIDENCE // RUN EVIDENCE // RUN EVIDENCE";
      position: absolute;
      right: -28px;
      bottom: 12px;
      color: rgba(255,255,255,.14);
      font: 900 34px/1 monospace;
      transform: rotate(-5deg);
      white-space: nowrap;
    }

    .brand-row { display: flex; align-items: center; gap: 18px; }
    .brand-logo {
      display: block;
      width: min(300px, 62vw);
      height: auto;
    }

    .brand-name { font-size: 14px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; }
    .eyebrow { font: 800 12px/1.2 monospace; letter-spacing: .12em; text-transform: uppercase; }

    h1 {
      position: relative;
      z-index: 1;
      max-width: 850px;
      margin: 30px 0 12px;
      font-size: clamp(42px, 7vw, 84px);
      line-height: .92;
      letter-spacing: -.045em;
      text-transform: uppercase;
    }

    .subtitle { position: relative; z-index: 1; max-width: 700px; margin: 0; font-size: 18px; }

    main { width: min(1180px, calc(100% - 32px)); margin: 36px auto 72px; }

    .run-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 24px;
      padding: 24px;
      background: ${passed ? "var(--wolf-mint)" : "var(--wolf-pink)"};
      border: 3px solid var(--ink);
      box-shadow: 8px 8px 0 var(--ink);
    }

    .run-banner h2 { margin: 3px 0 0; font-size: clamp(24px, 4vw, 42px); line-height: 1; text-transform: uppercase; }
    .result-stamp { font: 900 clamp(36px, 7vw, 72px)/1 monospace; letter-spacing: -.08em; }

    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 32px 0; }
    .metric {
      min-height: 142px;
      padding: 22px;
      background: var(--paper);
      border: 2px solid var(--ink);
    }
    .metric:nth-child(2) { background: var(--soft); }
    .metric:nth-child(3) { background: #effffb; }
    .metric:nth-child(4) { background: #fff3fd; }
    .metric-value { margin-top: 20px; font-size: clamp(28px, 4vw, 46px); font-weight: 900; line-height: 1; }
    .metric-detail { margin-top: 8px; color: var(--muted); font-size: 13px; }

    .failure-panel {
      margin: 30px 0;
      padding: 26px;
      background: var(--danger-soft);
      border: 3px solid var(--danger);
    }
    .failure-panel h2 { margin: 8px 0 14px; }
    pre { overflow: auto; margin: 0; padding: 16px; color: white; background: var(--ink); white-space: pre-wrap; }

    .assumptions {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 28px;
      margin: 38px 0;
      padding: 26px;
      background: var(--ink);
      color: white;
    }
    .assumptions h2 { margin: 6px 0 0; font-size: 25px; text-transform: uppercase; }
    .assumptions ul { margin: 0; padding-left: 20px; }
    .assumptions li + li { margin-top: 8px; }

    .evidence-header { display: flex; justify-content: space-between; gap: 20px; align-items: end; margin: 46px 0 14px; }
    .evidence-header h2 { margin: 6px 0 0; font-size: 32px; text-transform: uppercase; }
    .evidence-header p { max-width: 520px; margin: 0; color: var(--muted); }

    .table-shell { overflow-x: auto; background: var(--paper); border: 2px solid var(--ink); }
    table { width: 100%; border-collapse: collapse; }
    th {
      padding: 15px 14px;
      color: white;
      background: var(--wolf-blue-dark);
      font: 800 12px/1.2 monospace;
      letter-spacing: .08em;
      text-align: left;
      text-transform: uppercase;
    }
    td { padding: 16px 14px; border-bottom: 1px solid var(--line); vertical-align: top; }
    tbody tr:hover { background: var(--soft); }
    tbody tr:last-child td { border-bottom: 0; }
    .position { width: 70px; font: 900 18px/1 monospace; }
    .timestamp { min-width: 205px; font: 600 13px/1.4 monospace; }
    .article-id { margin-top: 5px; color: var(--muted); font: 11px/1.2 monospace; }
    .row-status { display: inline-block; padding: 5px 8px; border: 1px solid currentColor; font: 800 11px/1 monospace; text-transform: uppercase; white-space: nowrap; }
    .status-pass { color: #006b59; background: #e7fffb; }
    .status-fail { color: var(--danger); background: var(--danger-soft); }
    .empty-state { padding: 40px; color: var(--muted); text-align: center; }

    footer {
      padding: 30px max(24px, calc((100vw - 1180px) / 2));
      color: white;
      background: var(--ink);
      font: 12px/1.5 monospace;
    }

    @media (max-width: 800px) {
      .metrics { grid-template-columns: repeat(2, 1fr); }
      .assumptions { grid-template-columns: 1fr; }
      .evidence-header { display: block; }
      .evidence-header p { margin-top: 10px; }
    }

    @media (max-width: 520px) {
      .metrics { grid-template-columns: 1fr; }
      .run-banner { align-items: flex-start; flex-direction: column; }
    }

    @media print {
      body { background: white; }
      .hero { padding: 28px; }
      main { width: 100%; margin: 20px 0; }
      .run-banner { box-shadow: none; }
      .table-shell { overflow: visible; }
      a { color: inherit; text-decoration: none; }
      tr { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header class="hero">
    <div class="brand-row">
      <img
        class="brand-logo"
        src="../assets/qa-wolf-logo.png"
        alt="QA Wolf"
        width="348"
        height="116"
      />
      <div>
        <div class="brand-name">Take-Home Assignment</div>
        <div class="eyebrow">Automated test evidence</div>
      </div>
    </div>
    <h1>Fast, fearless validation.</h1>
    <p class="subtitle">A Playwright audit of the first 100 articles on Hacker News Newest.</p>
  </header>

  <main>
    <section class="run-banner" aria-label="Test result">
      <div>
        <div class="eyebrow">Execution result</div>
        <h2>${passed ? "Sorted newest to oldest" : "Validation needs attention"}</h2>
      </div>
      <div class="result-stamp">${statusLabel}</div>
    </section>

    <section class="metrics" aria-label="Run metrics">
      <article class="metric">
        <div class="eyebrow">Articles collected</div>
        <div class="metric-value">${articles.length} / 100</div>
        <div class="metric-detail">Exactly 100 required</div>
      </article>
      <article class="metric">
        <div class="eyebrow">Unique IDs</div>
        <div class="metric-value">${uniqueArticleCount}</div>
        <div class="metric-detail">Duplicate protection enabled</div>
      </article>
      <article class="metric">
        <div class="eyebrow">Pages inspected</div>
        <div class="metric-value">${pagesInspected}</div>
        <div class="metric-detail">Pagination followed automatically</div>
      </article>
      <article class="metric">
        <div class="eyebrow">Run duration</div>
        <div class="metric-value">${formatDuration(duration)}</div>
        <div class="metric-detail">Started ${escapeHtml(startedAt.toLocaleString())}</div>
      </article>
    </section>

    ${errorPanel}

    <section class="assumptions">
      <div>
        <div class="eyebrow">Test interpretation</div>
        <h2>What “sorted” means</h2>
      </div>
      <ul>
        <li>The first 100 visible article rows are collected across Hacker News pagination.</li>
        <li>Exact machine-readable timestamps are used instead of relative labels such as “5 minutes ago.”</li>
        <li>Each timestamp must be greater than or equal to the timestamp that follows it.</li>
        <li>Equal timestamps are valid, while missing timestamps and duplicate IDs fail the run.</li>
      </ul>
    </section>

    <section aria-labelledby="evidence-heading">
      <div class="evidence-header">
        <div>
          <div class="eyebrow">Traceable results</div>
          <h2 id="evidence-heading">Article evidence</h2>
        </div>
        <p>Every row links to its Hacker News item and records the exact timestamp used by the ordering assertion.</p>
      </div>
      <div class="table-shell">
        <table>
          <thead>
            <tr>
              <th scope="col">Position</th>
              <th scope="col">Article</th>
              <th scope="col">Published at</th>
              <th scope="col">Check</th>
            </tr>
          </thead>
          <tbody>${buildArticleRows(articles)}</tbody>
        </table>
      </div>
    </section>
  </main>

  <footer>
    Generated ${escapeHtml(finishedAt.toLocaleString())} · Source: https://news.ycombinator.com/newest<br />
    Newest: ${escapeHtml(newest?.timestamp ?? "Unavailable")} · Oldest: ${escapeHtml(oldest?.timestamp ?? "Unavailable")}
  </footer>
</body>
</html>`;
}

async function writeHtmlReport(runData) {
  const reportsDirectory = path.join(__dirname, "reports");
  const reportPath = path.join(
    reportsDirectory,
    "qa-wolf-hacker-news-report.html",
  );

  await fs.mkdir(reportsDirectory, { recursive: true });
  await fs.writeFile(reportPath, buildHtmlReport(runData), "utf8");

  return reportPath;
}

async function openHtmlReport(reportPath) {
  const openCommand =
    process.platform === "win32"
      ? { command: "explorer.exe", args: [reportPath] }
      : process.platform === "darwin"
        ? { command: "open", args: [reportPath] }
        : { command: "xdg-open", args: [reportPath] };

  await new Promise((resolve, reject) => {
    const child = spawn(openCommand.command, openCommand.args, {
      detached: true,
      stdio: "ignore",
    });

    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      resolve();
    });
  });
}

module.exports = { openHtmlReport, writeHtmlReport };
