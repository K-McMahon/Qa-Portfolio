// grabs the browser and our report tools
const { chromium } = require("playwright");
const { openHtmlReport, writeHtmlReport } = require("./reporter");

// basic test settings
const HACKER_NEWS_NEWEST_URL = "https://news.ycombinator.com/newest";
const ARTICLE_COUNT = 100;
const MAX_NAVIGATION_ATTEMPTS = 3;

// opens a page and gives it a few tries if the site acts up
async function openArticlePage(page, url, pageNumber) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_NAVIGATION_ATTEMPTS; attempt += 1) {
    try {
      // waits for the page html to load
      const response = await page.goto(url, { waitUntil: "domcontentloaded" });

      // stops if the site sends back a bad response
      if (!response?.ok()) {
        throw new Error(`Hacker News returned HTTP ${response?.status()}.`);
      }

      // makes sure at least one article showed up
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

  // all three tries failed, so end the test
  throw new Error(
    `Could not load Hacker News page ${pageNumber}: ${lastError.message}`,
  );
}

// grabs articles until we have exactly 100
async function collectNewestArticles(page, count, runState) {
  const { articles } = runState;

  // keeps us from counting the same article twice
  const seenIds = new Set();
  let pageNumber = 1;

  await openArticlePage(page, HACKER_NEWS_NEWEST_URL, pageNumber);

  while (articles.length < count) {
    // reads every article row on the current page
    const pageArticles = await page.locator("tr.athing").evaluateAll((rows) =>
      rows.map((row) => {
        // the time sits in the row right under the title
        const subtextRow = row.nextElementSibling;
        const ageElement = subtextRow?.querySelector("span.age");
        const titleElement = row.querySelector("span.titleline > a");

        return {
          id: row.id,
          title: titleElement?.textContent?.trim() ?? "Untitled article",

          // uses the real time, not text like "5 minutes ago"
          timestamp: ageElement?.getAttribute("title")?.split(" ")[0] ?? null,
        };
      }),
    );

    for (const article of pageArticles) {
      // do not go past 100
      if (articles.length === count) break;

      // we need both of these to trust the result
      if (!article.id || !article.timestamp) {
        throw new Error(
          `Article data was incomplete on Hacker News page ${pageNumber}.`,
        );
      }

      // duplicate id means we already saw this one
      if (seenIds.has(article.id)) {
        throw new Error(`Duplicate article encountered: ${article.id}.`);
      }

      seenIds.add(article.id);
      articles.push({
        ...article,

        // converts time into something javascript can compare
        publishedAt: new Date(article.timestamp),
      });
    }

    console.log(
      `Collected ${articles.length} of ${count} articles ` +
        `(Hacker News page ${pageNumber}).`,
    );

    // saves the page count for the report
    runState.pagesInspected = pageNumber;

    // hacker news shows about 30 per page, so keep hitting more
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

      // makes a full link and opens the next page
      const nextPageUrl = new URL(nextPagePath, page.url()).href;
      await openArticlePage(page, nextPageUrl, pageNumber);
    }
  }

  return articles;
}

// checks the count and makes sure the times go newest to oldest
function validateNewestToOldest(articles) {
  if (articles.length !== ARTICLE_COUNT) {
    throw new Error(
      `Expected exactly ${ARTICLE_COUNT} articles, but collected ${articles.length}.`,
    );
  }

  // compares each article with the one right after it
  for (let index = 1; index < articles.length; index += 1) {
    const newerArticle = articles[index - 1];
    const olderArticle = articles[index];

    if (Number.isNaN(newerArticle.publishedAt.getTime())) {
      throw new Error(`Article ${index} has an invalid timestamp.`);
    }

    if (Number.isNaN(olderArticle.publishedAt.getTime())) {
      throw new Error(`Article ${index + 1} has an invalid timestamp.`);
    }

    // the top article should never be older than the one under it
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

// runs the whole thing from browser start to report
async function sortHackerNewsArticles() {
  const startedAt = new Date();
  const runState = { articles: [], pagesInspected: 0 };
  let runError = null;

  // --headed means we can watch the browser during the demo
  const headless =
    !process.argv.includes("--headed") && process.env.HEADLESS !== "false";
  const browser = await chromium.launch({ headless });

  try {
    // starts with a clean browser page
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
    // hangs onto the error so the report can show it
    runError = error;
  } finally {
    // closes the browser whether the test passes or fails
    await browser.close();
  }

  // makes the report even if something failed
  const reportPath = await writeHtmlReport({
    ...runState,
    error: runError,
    finishedAt: new Date(),
    startedAt,
  });

  console.log(`\nHTML report: ${reportPath}`);

  // opens the report after a visible demo run
  if (!headless) {
    await openHtmlReport(reportPath);
    console.log("Opened the HTML report in your default browser.");
  }

  if (runError) throw runError;
}

// kicks it off and makes failures clear in the terminal
sortHackerNewsArticles().catch((error) => {
  console.error("\nFAIL:", error.message);
  process.exitCode = 1;
});
