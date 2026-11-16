import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const logs = [];
page.on("console", (msg) => {
  if (msg.type() === "error") logs.push("console: " + msg.text());
});
page.on("pageerror", (err) => logs.push("pageerror: " + err.message));
page.on("response", (res) => {
  if (res.status() >= 400) logs.push(res.status() + " " + res.url());
});

await page.goto(
  "http://localhost:4173" + (process.env.BASE_PATH ?? "/diamond") + "/en/",
  { waitUntil: "networkidle" },
);
await page.waitForTimeout(800);
logs.length = 0;
await page.getByRole("link", { name: "Products", exact: true }).first().click();
await page.waitForTimeout(1500);
console.log("URL after click:", page.url());
console.log("H1:", await page.locator("h1").first().textContent());
console.log("Logs:", logs);

// navigate language
await page.selectOption('header select', "de");
await page.waitForTimeout(1200);
console.log("URL after lang:", page.url());
console.log("H1 de:", await page.locator("h1").first().textContent());
console.log("html lang:", await page.locator("html").getAttribute("lang"));
console.log("Logs2:", logs);

await browser.close();
