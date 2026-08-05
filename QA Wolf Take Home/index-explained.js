/* study copy with quick notes */

// grabs the browser and report tools
const { chromium } = require("playwright");
const { openHtmlReport, writeHtmlReport } = require("./reporter");

// main test settings
const HACKER_NEWS_NEWEST_URL = "https://news.ycombinator.com/newest";
const ARTICLE_COUNT = 100;
const MAX_NAVIGATION_ATTEMPTS = 3;

// opens a page and retries if the site acts up
async function openArticlePage(page, url, pageNumber) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_NAVIGATION_ATTEMPTS; attempt += 1) {
    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded" });

      // stops on a bad site response
      if (!response?.ok()) {
        throw new Error(`Hacker News returned HTTP ${response?.status()}.`);
      }

      // makes sure an article actually loaded
      await page.locator("tr.athing").first().waitFor({ timeout: 10_000 });
      return;
    } catch (error) {
      lastError = error;
      console.warn(
        `Navigation attempt ${attempt} of ${MAX_NAVIGATION_ATTEMPTS} ` +
          `failed for Hacker News page ${pageNumber}.`,
      );
    }
  }

  throw new Error(
    `Could not load Hacker News page ${pageNumber}: ${lastError.message}`,
  );
}

// collects articles until we have exactly 100
async function collectNewestArticles(page, count, runState) {
  const { articles } = runState;

  // tracks ids so nothing gets counted twice
  const seenIds = new Set();
  let pageNumber = 1;

  await openArticlePage(page, HACKER_NEWS_NEWEST_URL, pageNumber);

  while (articles.length < count) {
    // reads every article on the current page
    const pageArticles = await page.locator("tr.athing").evaluateAll((rows) =>
      rows.map((row) => {
        const subtextRow = row.nextElementSibling;
        const ageElement = subtextRow?.querySelector("span.age");
        const titleElement = row.querySelector("span.titleline > a");

        return {
          id: row.id,
          title: titleElement?.textContent?.trim() ?? "Untitled article",

          // grabs the real time instead of text like "5 minutes ago"
          timestamp: ageElement?.getAttribute("title")?.split(" ")[0] ?? null,
        };
      }),
    );

    for (const article of pageArticles) {
      // stops right at 100
      if (articles.length === count) break;

      if (!article.id || !article.timestamp) {
        throw new Error(
          `Article data was incomplete on Hacker News page ${pageNumber}.`,
        );
      }

      // fails if we already saw this id
      if (seenIds.has(article.id)) {
        throw new Error(`Duplicate article encountered: ${article.id}.`);
      }

      seenIds.add(article.id);
      articles.push({
        ...article,

        // turns the time into something javascript can compare
        publishedAt: new Date(article.timestamp),
      });
    }

    console.log(
      `Collected ${articles.length} of ${count} articles ` +
        `(Hacker News page ${pageNumber}).`,
    );

    runState.pagesInspected = pageNumber;

    // follows the more link if we still need articles
    if (articles.length < count) {
      const moreLink = page.locator("a.morelink");

      if ((await moreLink.count()) !== 1) {
        throw new Error(
          `Could not find the next page after collecting ${articles.length} articles.`,
        );
      }

      pageNumber += 1;
      const nextPagePath = await moreLink.getAttribute("href");

      if (!nextPagePath) {
        throw new Error(`The next-page link on page ${pageNumber - 1} is invalid.`);
      }

      const nextPageUrl = new URL(nextPagePath, page.url()).href;
      await openArticlePage(page, nextPageUrl, pageNumber);
    }
  }

  return articles;
}

// checks the count and the newest to oldest order
function validateNewestToOldest(articles) {
  if (articles.length !== ARTICLE_COUNT) {
    throw new Error(
      `Expected exactly ${ARTICLE_COUNT} articles, but collected ${articles.length}.`,
    );
  }

  // compares each article with the one under it
  for (let index = 1; index < articles.length; index += 1) {
    const newerArticle = articles[index - 1];
    const olderArticle = articles[index];

    if (Number.isNaN(newerArticle.publishedAt.getTime())) {
      throw new Error(`Article ${index} has an invalid timestamp.`);
    }

    if (Number.isNaN(olderArticle.publishedAt.getTime())) {
      throw new Error(`Article ${index + 1} has an invalid timestamp.`);
    }

    // the top one should never be older than the one below it
    if (newerArticle.publishedAt < olderArticle.publishedAt) {
      throw new Error(
        [
          `Sorting failed between articles ${index} and ${index + 1}:`,
          `  ${index}. ${newerArticle.title} (${newerArticle.timestamp})`,
          `  ${index + 1}. ${olderArticle.title} (${olderArticle.timestamp})`,
        ].join("\n"),
      );
    }
  }
}

// runs the browser, test, and report
async function sortHackerNewsArticles() {
  const startedAt = new Date();
  const runState = { articles: [], pagesInspected: 0 };
  let runError = null;

  // --headed lets us watch the browser
  const headless =
    !process.argv.includes("--headed") && process.env.HEADLESS !== "false";
  const browser = await chromium.launch({ headless });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const articles = await collectNewestArticles(
      page,
      ARTICLE_COUNT,
      runState,
    );

    validateNewestToOldest(articles);

    console.log("\nPASS: Exactly 100 articles are sorted newest to oldest.");
    console.log(`Newest: ${articles[0].timestamp} | ${articles[0].title}`);
    console.log(
      `Oldest: ${articles[articles.length - 1].timestamp} | ` +
        articles[articles.length - 1].title,
    );
  } catch (error) {
    // saves the error for the report
    runError = error;
  } finally {
    // always closes the browser
    await browser.close();
  }

  // makes a report for passes and failures
  const reportPath = await writeHtmlReport({
    ...runState,
    error: runError,
    finishedAt: new Date(),
    startedAt,
  });

  console.log(`\nHTML report: ${reportPath}`);

  // opens the report after a visible run
  if (!headless) {
    await openHtmlReport(reportPath);
    console.log("Opened the HTML report in your default browser.");
  }

  if (runError) throw runError;
}

// starts the test and makes failures clear
sortHackerNewsArticles().catch((error) => {
  console.error("\nFAIL:", error.message);
  process.exitCode = 1;
});
