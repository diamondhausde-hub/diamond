import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const base = "http://localhost:4173";
const outDir = path.join(process.env.TEMP || ".", "diamond-qa");
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const failures = [];
page.on("response", (response) => {
  if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
});
page.on("pageerror", (error) => failures.push(`pageerror ${error.message}`));

await page.goto(base + "/en/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
console.log("Failures on home:", [...new Set(failures)].slice(0, 20));

// language gateway
await page.goto(base + "/?lang=en", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "gateway-desktop.png") });
const control = page.locator(".language-control").first();
const box = await control.boundingBox();
if (box) {
  await page.screenshot({
    path: path.join(outDir, "gateway-select-crop.png"),
    clip: { x: box.x - 24, y: box.y - 24, width: box.width + 48, height: box.height + 48 },
  });
  // switch the gateway language to Arabic and capture the mirrored layout
  await control.locator("select").selectOption("ar");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, "gateway-ar-desktop.png") });
}
await page.goto(base + "/en/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

// scroll through home and capture sections in viewport
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
});
await page.waitForTimeout(1000);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "desktop-home-scrolled.png"), fullPage: true });

await page.goto(base + "/en/products/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(outDir, "desktop-products.png"), fullPage: true });

await page.goto(base + "/en/glass-lab/", { waitUntil: "networkidle" });await page.waitForTimeout(600);
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 100));
  }
});
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(outDir, "desktop-glasslab.png"), fullPage: true });

await page.goto(base + "/en/contact/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outDir, "desktop-contact.png"), fullPage: true });

await page.goto(base + "/ar/products/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(outDir, "desktop-ar-products.png"), fullPage: true });

await page.goto(base + "/ar/contact/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outDir, "desktop-ar-contact.png"), fullPage: true });

// mobile with scroll
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const mp = await mobile.newPage();
await mp.goto(base + "/en/", { waitUntil: "networkidle" });
await mp.waitForTimeout(500);
await mp.screenshot({ path: path.join(outDir, "mobile-home-top.png") });
await mp.evaluate(async () => {
  const step = window.innerHeight * 0.7;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
});
await mp.waitForTimeout(900);
await mp.screenshot({ path: path.join(outDir, "mobile-home-scrolled.png"), fullPage: true });

await mp.goto(base + "/en/products/", { waitUntil: "networkidle" });
await mp.waitForTimeout(500);
await mp.screenshot({ path: path.join(outDir, "mobile-products.png"), fullPage: true });

await mp.goto(base + "/?lang=en", { waitUntil: "networkidle" });
await mp.waitForTimeout(500);
await mp.screenshot({ path: path.join(outDir, "gateway-mobile.png") });

await mp.goto(base + "/?lang=ar", { waitUntil: "networkidle" });
await mp.waitForTimeout(500);
await mp.screenshot({ path: path.join(outDir, "gateway-mobile-ar.png") });

await mp.goto(base + "/en/contact/", { waitUntil: "networkidle" });
await mp.waitForTimeout(500);
await mp.screenshot({ path: path.join(outDir, "mobile-contact.png"), fullPage: true });

await browser.close();
fs.writeFileSync(path.join(outDir, "failures.json"), JSON.stringify([...new Set(failures)], null, 2));
console.log("done");
