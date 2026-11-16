import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = "http://localhost:4173" + (process.env.BASE_PATH ?? "/diamond");
const outDir = path.join(process.env.TEMP || ".", "diamond-qa");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const results = [];
const failures = [];
const record = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
const page = await context.newPage();
let ignoreExpected404 = false;
page.on("console", (msg) => {
  if (msg.type() === "error" && !(ignoreExpected404 && msg.text().includes("404"))) {
    failures.push(`console: ${msg.text()}`);
  }
});
page.on("pageerror", (err) => failures.push(`pageerror: ${err.message}`));
page.on("response", (res) => {
  if (
    res.status() >= 400 &&
    !(ignoreExpected404 && res.url().includes("does-not-exist"))
  ) {
    failures.push(`${res.status()} ${res.url()}`);
  }
});

// 1. Home
await page.goto(base + "/en/", { waitUntil: "networkidle" });
record("home renders", (await page.locator("h1").count()) === 1, await page.locator("h1").first().innerText());
await page.evaluate(() => {
  window.__noReload = "kept";
});

// 2. Catalog search + filter + card
await page.getByRole("link", { name: "Products", exact: true }).first().click();
await page.waitForURL("**/en/products/");
await page.waitForTimeout(400);
record("nav to products", page.url().endsWith("/en/products/"), page.url());

const cards = page.locator("main .product-tile");
record("six products", (await cards.count()) === 6, `${await cards.count()} cards`);

await page.getByRole("searchbox", { name: "Search products" }).fill("mop");
await page.waitForTimeout(200);
record("search narrows", (await cards.count()) === 1, `${await cards.count()} card(s)`);
await page.getByRole("button", { name: "Clear search" }).click();

await page.getByRole("button", { name: "Glass cleaning", exact: true }).click();
await page.waitForTimeout(200);
record("category filter", (await cards.count()) === 2, `${await cards.count()} card(s)`);
record("filter url param", page.url().includes("category=glass"), page.url());
await page.getByRole("button", { name: "All products", exact: true }).click();
await page.waitForTimeout(200);
record("all filter restores", (await cards.count()) === 6, `${await cards.count()} card(s)`);

// 3. Product sheet + add to wholesale
await cards.first().click();
await page.waitForTimeout(500);
const sheet = page.getByRole("dialog");
record("product sheet opens", await sheet.isVisible(), await sheet.getByRole("heading").first().innerText());
await sheet.getByRole("button", { name: /Add to wholesale enquiry/i }).click();
await page.waitForTimeout(700);
const drawer = page.getByRole("dialog");
record("wholesale drawer opens", await drawer.isVisible(), await drawer.getByRole("heading").first().innerText());
record("product added", (await drawer.getByText(/items in your enquiry/i).count()) > 0, "");

// quantity + remove
const qty = drawer.locator('input[type="number"]').first();
await qty.fill("3");
await page.waitForTimeout(200);
record("quantity changes", (await qty.inputValue()) === "3", await qty.inputValue());
const removeButton = drawer.getByRole("button", { name: /Remove product/i }).first();
await removeButton.click();
await page.waitForTimeout(200);
record("product removed", (await drawer.getByText("Your enquiry list is empty.").count()) > 0, "");

// 4. Validation + configured contact channels
await drawer.getByRole("button", { name: "Send via WhatsApp" }).click();
await page.waitForTimeout(300);
record(
  "empty validation shown",
  (await drawer.getByText("This field is required.").count()) >= 1 &&
    (await drawer.getByText("Add at least one product to your enquiry.").count()) === 1,
  "",
);

await drawer.getByLabel("Full name").fill("Test User");
await drawer.getByLabel("Company name").fill("Test GmbH");
await drawer.getByLabel("Phone number").fill("+49 151 1234567");
await drawer.getByLabel("Email address").fill("test@example.com");
await drawer.getByLabel("Business type").selectOption("distributor");
await drawer.getByLabel("Country").fill("Germany");
await drawer.getByRole("button", { name: "Close" }).click();
await page.waitForTimeout(400);

// Re-add a product before submitting (the previous one was removed)
await cards.first().click();
await page.waitForTimeout(500);
await page
  .getByRole("dialog")
  .getByRole("button", { name: /Add to wholesale enquiry/i })
  .click();
await page.waitForTimeout(700);
const drawer2 = page.getByRole("dialog");

// Mock window.open so we can assert the prepared WhatsApp URL
await page.evaluate(() => {
  window.__openedUrl = null;
  window.open = (url) => {
    window.__openedUrl = String(url);
    return null;
  };
});
await drawer2.getByRole("button", { name: "Send via WhatsApp" }).click();
await page.waitForTimeout(400);
const openedUrl = await page.evaluate(() => window.__openedUrl);
const openedText =
  typeof openedUrl === "string" && openedUrl.startsWith("https://wa.me/")
    ? new URL(openedUrl).searchParams.get("text") || ""
    : "";
record(
  "whatsapp uses configured number",
  typeof openedUrl === "string" && openedUrl.startsWith("https://wa.me/9647701211099?text="),
  typeof openedUrl === "string" ? openedUrl.slice(0, 68) : String(openedUrl),
);
record(
  "whatsapp message is prefilled",
  openedText.includes("Test GmbH") && openedText.includes("Test User"),
  openedText.split("\n").slice(0, 4).join(" | "),
);
record(
  "configured channel opens status",
  (await drawer2.getByText(/WhatsApp should open with the enquiry prepared/i).count()) >= 1,
  "",
);
await drawer2.getByRole("button", { name: "Close" }).click();
await page.waitForTimeout(400);

// 5. Glass lab slider
await page.goto(base + "/en/glass-lab/", { waitUntil: "networkidle" });
const slider = page.getByRole("slider");
const before = await slider.getAttribute("aria-valuenow");
await slider.focus();
await page.keyboard.press("ArrowRight");
await page.keyboard.press("ArrowRight");
const after = await slider.getAttribute("aria-valuenow");
record("compare slider keyboard", Number(after) > Number(before), `${before} → ${after}`);
const clip = await page.locator(".compare__after").evaluate((el) => getComputedStyle(el).clipPath);
record("compare slider renders", clip.includes("inset"), clip);

// 6. Language switch without reload
await page.goto(base + "/en/products/", { waitUntil: "networkidle" });
await page.evaluate(() => {
  window.__noReload = "kept";
});
await page.locator("header select").selectOption("de");
await page.waitForURL("**/de/products/");
await page.waitForTimeout(700);
record("language switch resolves", page.url().endsWith("/de/products/"), page.url());
record("language switch is client-side", (await page.evaluate(() => window.__noReload)) === "kept", "");
record("html lang de", (await page.locator("html").getAttribute("lang")) === "de", "");
record(
  "german copy",
  (await page.locator("h1").first().innerText()).includes("Produkte"),
  await page.locator("h1").first().innerText(),
);

// 7. Arabic RTL
await page.goto(base + "/ar/products/", { waitUntil: "networkidle" });
record("html dir rtl", (await page.locator("html").getAttribute("dir")) === "rtl", "");
record(
  "arabic copy",
  (await page.locator("h1").first().innerText()).includes("منتجات"),
  await page.locator("h1").first().innerText(),
);
const bodyDir = await page.evaluate(() => getComputedStyle(document.body).direction);
record("rtl computed", bodyDir === "rtl", bodyDir);
await page.screenshot({ path: path.join(outDir, "desktop-ar-products.png"), fullPage: true });

await page.goto(base + "/ar/", { waitUntil: "networkidle" });
await page.screenshot({ path: path.join(outDir, "desktop-ar-home.png"), fullPage: true });

// 8. Preview dialog
await page.goto(base + "/en/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Mobile preview" }).click();
await page.waitForTimeout(500);
record("mobile preview opens", await page.locator("iframe").first().isVisible(), "");
await page.getByRole("button", { name: "Close mobile preview" }).click();

// 9. Contact validation + configured channels
await page.goto(base + "/en/contact/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Send message" }).click();
await page.waitForTimeout(200);
record(
  "contact validation",
  (await page.getByText("This field is required.").count()) >= 2,
  "",
);
record(
  "contact email link",
  (await page.locator('a[href="mailto:diamondhaus.de@gmail.com"]').count()) >= 1,
  "",
);
record(
  "contact phone link",
  (await page.locator('a[href="tel:+9647701211099"]').count()) >= 1,
  "",
);
record(
  "contact configured note",
  (await page
    .getByText("This opens your email app with your message prepared. Please review and send it.")
    .count()) >= 1,
  "",
);

// 10. Catalogue page
await page.goto(base + "/en/catalog/", { waitUntil: "networkidle" });
record("catalogue has print action", (await page.getByRole("button", { name: /Print/i }).count()) === 1, "");

// 11. All locales + page health
const locales = ["en", "ar", "de", "fr", "it", "zh"];
for (const locale of locales) {
  const res = await page.goto(`${base}/${locale}/`, { waitUntil: "networkidle" });
  const h1 = await page.locator("h1").first().innerText();
  record(`${locale} home loads`, res.status() === 200 && h1.length > 3, h1.slice(0, 40));
}

// 12. Mobile behavior
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const mp = await mobile.newPage();
mp.on("pageerror", (err) => failures.push(`mobile pageerror: ${err.message}`));
mp.on("console", (msg) => {
  if (msg.type() === "error") failures.push(`mobile console: ${msg.text()}`);
});
await mp.goto(base + "/en/", { waitUntil: "networkidle" });
record("mobile bottom nav", await mp.locator(".bottom-nav").isVisible(), "");
record(
  "mobile wholesale header button hidden",
  !(await mp.getByRole("link", { name: "Wholesale", exact: true }).first().isVisible().catch(() => false)) ||
    (await mp.locator(".site-header").getByRole("link", { name: "Wholesale", exact: true }).count()) === 0,
  "",
);
await mp.locator(".bottom-nav").getByRole("link", { name: "Products" }).click();
await mp.waitForURL("**/en/products/");
await mp.waitForTimeout(400);
await mp.locator("main .product-tile").first().click();
await mp.waitForTimeout(600);
record("mobile product sheet", await mp.getByRole("dialog").isVisible(), "");
await mp.screenshot({ path: path.join(outDir, "mobile-product-sheet.png") });
await mp.getByRole("button", { name: "Close product details" }).click();
await mp.waitForTimeout(400);
await mp.goto(base + "/ar/", { waitUntil: "networkidle" });
await mp.screenshot({ path: path.join(outDir, "mobile-ar-home.png"), fullPage: true });

// 13. 404
ignoreExpected404 = true;
const notFound = await page.goto(base + "/en/does-not-exist/", { waitUntil: "domcontentloaded" });
record("404 returns 404", notFound.status() === 404, String(notFound.status()));
record("404 branded", (await page.locator("h1").first().innerText()).includes("not found"), await page.locator("h1").first().innerText());

await browser.close();

const uniqueFailures = [...new Set(failures)];
fs.writeFileSync(path.join(outDir, "qa-results.json"), JSON.stringify({ results, failures: uniqueFailures }, null, 2));
console.log("\nConsole/network failures:", uniqueFailures.length);
if (uniqueFailures.length) console.log(uniqueFailures.slice(0, 25).join("\n"));
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exitCode = failed.length || uniqueFailures.length ? 1 : 0;
