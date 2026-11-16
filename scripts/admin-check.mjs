import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const results = [];
const failures = [];
const record = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
};

const html = fs.readFileSync("public/admin/index.html", "utf8");
record("no innerHTML in admin", !html.includes("innerHTML"));
record("CSP meta present", html.includes("connect-src https://api.github.com"));
record("robots noindex", html.includes('name="robots" content="noindex,nofollow"'));

const repoFiles = {};
for (const file of [
  "data/products.json", "data/categories.json", "config/site.json",
  "messages/en.json", "messages/ar.json", "messages/de.json",
  "messages/fr.json", "messages/it.json", "messages/zh.json"
]) {
  repoFiles[file] = fs.readFileSync(file, "utf8");
}

const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
page.on("pageerror", (error) => failures.push("pageerror: " + error.message));
page.on("console", (msg) => {
  if (msg.type() === "error" && !msg.text().includes("401 (Unauthorized)")) {
    failures.push("console: " + msg.text());
  }
});

let refSha = "base-commit";
let blobCounter = 0;
let treeCounter = 0;
let commitCounter = 0;
const capturedBlobs = [];
let capturedCommit = null;
let capturedEntries = null;
let forceShaChange = false;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS"
};
const json = (data, status = 200) => ({ status, headers: { "content-type": "application/json", ...cors }, body: JSON.stringify(data) });

await page.route("https://api.github.com/**", async (route) => {
  const request = route.request();
  const url = new URL(request.url());
  const pathname = url.pathname;
  const method = request.method();
  const token = (request.headers()["authorization"] || "").replace("Bearer ", "");
  if (method === "OPTIONS") return route.fulfill({ status: 204, headers: cors });
  if (token === "bad") return route.fulfill(json({ message: "Bad credentials" }, 401));

  if (pathname === "/repos/diamondhausde-hub/diamond" && method === "GET") {
    return route.fulfill(json({ permissions: { push: token !== "readonly" } }));
  }
  const contentsMatch = pathname.match(/^\/repos\/diamondhausde-hub\/diamond\/contents\/(.+)$/);
  if (contentsMatch && method === "GET") {
    const filePath = decodeURIComponent(contentsMatch[1]);
    if (filePath.startsWith("public/uploads/products")) return route.fulfill(json([]));
    if (!(filePath in repoFiles)) return route.fulfill(json({ message: "Not Found" }, 404));
    return route.fulfill(json({
      name: path.basename(filePath),
      path: filePath,
      sha: forceShaChange && filePath === "data/products.json" ? "sha-changed" : "sha-" + filePath,
      content: Buffer.from(repoFiles[filePath], "utf8").toString("base64"),
      encoding: "base64"
    }));
  }
  if (pathname === "/repos/diamondhausde-hub/diamond/git/ref/heads/main" && method === "GET") {
    return route.fulfill(json({ object: { sha: refSha } }));
  }
  if (pathname.startsWith("/repos/diamondhausde-hub/diamond/git/commits/") && method === "GET") {
    return route.fulfill(json({ tree: { sha: "base-tree" } }));
  }
  if (pathname === "/repos/diamondhausde-hub/diamond/git/blobs" && method === "POST") {
    const body = JSON.parse(request.postData() || "{}");
    const sha = "blob-" + (++blobCounter);
    capturedBlobs.push({ sha, encoding: body.encoding, content: body.content });
    return route.fulfill(json({ sha }));
  }
  if (pathname === "/repos/diamondhausde-hub/diamond/git/trees" && method === "POST") {
    capturedEntries = JSON.parse(request.postData() || "{}").tree;
    return route.fulfill(json({ sha: "tree-" + (++treeCounter) }));
  }
  if (pathname === "/repos/diamondhausde-hub/diamond/git/commits" && method === "POST") {
    capturedCommit = JSON.parse(request.postData() || "{}");
    return route.fulfill(json({ sha: "commit-" + (++commitCounter) }));
  }
  if (pathname === "/repos/diamondhausde-hub/diamond/git/refs/heads/main" && method === "PATCH") {
    refSha = JSON.parse(request.postData() || "{}").sha;
    return route.fulfill(json({}));
  }
  if (pathname === "/repos/diamondhausde-hub/diamond/commits" && method === "GET") {
    return route.fulfill(json([{
      sha: "history-commit",
      html_url: "https://github.com/diamondhausde-hub/diamond/commit/history-commit",
      commit: { message: "History entry", author: { date: new Date().toISOString(), name: "Owner" } },
      author: { login: "diamondhausde-hub" }
    }]));
  }
  return route.fulfill(json({ message: "Unhandled mock: " + method + " " + pathname }, 404));
});

await page.goto("http://localhost:4173/diamond/admin/", { waitUntil: "networkidle" });
record("login screen visible", await page.getByPlaceholder("الصق التوكن هنا").isVisible());

// Wrong token
await page.getByPlaceholder("الصق التوكن هنا").fill("bad");
const password = page.getByPlaceholder("10 أحرف على الأقل");
await password.fill("StrongPass123");
await page.getByPlaceholder("أعد كلمة المرور").fill("StrongPass123");
await page.getByRole("button", { name: "دخول", exact: true }).click();
await page.waitForTimeout(500);
record("wrong token error", (await page.getByText(/التوكن غير صالح/).count()) > 0);

// Read-only token
await page.getByPlaceholder("الصق التوكن هنا").fill("readonly");
await password.fill("StrongPass123");
await page.getByPlaceholder("أعد كلمة المرور").fill("StrongPass123");
await page.getByRole("button", { name: "دخول", exact: true }).click();
await page.waitForTimeout(500);
record("read-only token error", (await page.getByText(/ما عنده صلاحية الكتابة/).count()) > 0);

// Valid token, encrypted save
await page.getByPlaceholder("الصق التوكن هنا").fill("goodtoken");
await password.fill("StrongPass123");
await page.getByPlaceholder("أعد كلمة المرور").fill("StrongPass123");
await page.getByText("حفظ التوكن مشفّراً على هذا الجهاز").click();
await page.getByRole("button", { name: "دخول", exact: true }).click();
await page.waitForSelector("#screen-dashboard:not(.hidden)", { timeout: 20000 });
record("dashboard loads", (await page.getByText("منتج ظاهر").count()) === 1, await page.locator(".stat b").first().innerText());

const storage = await page.evaluate(() => ({
  keys: Object.keys(localStorage),
  raw: localStorage.getItem("diamond.admin.encrypted") || "",
  draft: sessionStorage.getItem("diamond.admin.draft") || ""
}));
record("only encrypted token stored", storage.keys.length === 1 && storage.keys[0] === "diamond.admin.encrypted", storage.keys.join(","));
record("plain token not in storage", !storage.raw.includes("goodtoken") && !storage.draft.includes("goodtoken"));

// Logout + unlock with correct / wrong password
await page.getByRole("button", { name: "خروج", exact: true }).click();
record("logout shows unlock screen", await page.getByPlaceholder("كلمة المرور المحلية").isVisible());
await page.getByPlaceholder("كلمة المرور المحلية").fill("WrongPass123");
await page.getByRole("button", { name: "فتح القفل" }).click();
await page.waitForTimeout(1200);
record("wrong password message", (await page.getByText(/كلمة المرور غير صحيحة/).count()) > 0);
await page.getByPlaceholder("كلمة المرور المحلية").fill("StrongPass123");
await page.getByRole("button", { name: "فتح القفل" }).click();
await page.waitForSelector("#screen-dashboard:not(.hidden)", { timeout: 20000 });
record("correct password unlocks", true);

// Products: add product
await page.locator("#sideNav button").filter({ hasText: "المنتجات" }).click();
await page.waitForTimeout(300);
record("six products listed", (await page.locator("#screen-products .list-row").count()) === 6, String(await page.locator("#screen-products .list-row").count()));
await page.getByRole("button", { name: "+ منتج جديد" }).click();
await page.locator(".modal .field").filter({ hasText: "المعرّف" }).locator("input").fill("test-product");
await page.locator(".modal .field").filter({ hasText: "الاسم" }).locator("textarea").fill("منتج الاختبار");
await page.locator(".modal .field").filter({ hasText: "وصف قصير" }).locator("textarea").fill("وصف قصير للاختبار");
await page.locator(".modal .field").filter({ hasText: "وصف تفصيلي" }).locator("textarea").fill("وصف تفصيلي للاختبار");
await page.locator(".modal input[placeholder='مثلاً 45 cm']").fill("S");
await page.locator(".modal input[placeholder='مثلاً 45 cm']").press("Enter");
await page.getByRole("button", { name: "حفظ", exact: true }).click();
await page.waitForTimeout(500);
record("new product added", (await page.getByText("منتج الاختبار").count()) > 0);

// Texts: Arabic + Chinese special characters
await page.locator("#sideNav button").filter({ hasText: "النصوص" }).click();
await page.locator("#screen-texts input[type=search]").fill("meta.pages.home.title");
await page.locator("#screen-texts select").selectOption("ar");
const arLeaf = page.locator(".leaf").filter({ hasText: "meta.pages.home.title" }).locator("textarea");
await arLeaf.fill("اختبار —Diomond ✓");
await page.locator("#screen-texts select").selectOption("zh");
const zhLeaf = page.locator(".leaf").filter({ hasText: "meta.pages.home.title" }).locator("textarea");
await zhLeaf.fill("中文测试 — DIAMOND ✓");
record("special text edits applied", true);

// Images: upload conversion (small PNG)
await page.locator("#sideNav button").filter({ hasText: "الصور" }).click();
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
await page.locator("#screen-images input[type=file]").setInputFiles({
  name: "phone.jpg",
  mimeType: "image/png",
  buffer: Buffer.from(pngBase64, "base64")
});
await page.waitForTimeout(1200);
record("image converted to webp", await page.locator(".images img[src^='data:image/webp']").count() > 0);

// Reject >10MB
await page.locator("#screen-images input[type=file]").setInputFiles({
  name: "huge.jpg",
  mimeType: "image/jpeg",
  buffer: Buffer.alloc(11 * 1024 * 1024, 1)
});
await page.waitForTimeout(300);
record("oversized image rejected", (await page.getByText(/أكبر من 10MB/).count()) > 0);

// Large noisy photo → resized and compressed under 500KB
const bigBase64 = await page.evaluate(() => {
  const canvas = document.createElement("canvas");
  canvas.width = 2200;
  canvas.height = 2200;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(2200, 2200);
  for (let i = 0; i < image.data.length; i += 4) {
    const value = Math.floor(Math.random() * 256);
    image.data[i] = value;
    image.data[i + 1] = Math.floor(Math.random() * 256);
    image.data[i + 2] = Math.floor(Math.random() * 256);
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png").split(",")[1];
});
const bigBuffer = Buffer.from(bigBase64, "base64");
record("source photo over 5MB", bigBuffer.length > 5 * 1024 * 1024, Math.round(bigBuffer.length / 1024) + " KB");
await page.locator("#screen-images input[type=file]").setInputFiles({
  name: "large-phone-photo.png",
  mimeType: "image/png",
  buffer: bigBuffer
});
await page.waitForTimeout(4000);
const uploadSizes = await page.evaluate(() => {
  const draft = JSON.parse(sessionStorage.getItem("diamond.admin.draft") || "{}");
  return (draft.uploads || []).map((u) => Math.round(u.base64.length * 3 / 4));
});
record("large photo compressed below 500KB", uploadSizes.some((size) => size > 0 && size < 500 * 1024), uploadSizes.map((s) => Math.round(s / 1024) + "KB").join(", "));

// Publish
await page.locator("#sideNav button").filter({ hasText: "النشر" }).click();
await page.waitForTimeout(300);
record("changes listed", (await page.locator("#screen-publish .list-row").count()) >= 4, String(await page.locator("#screen-publish .list-row").count()));
await page.getByRole("button", { name: "نشر على GitHub" }).click();
await page.waitForTimeout(1500);
if (commitCounter === 0) {
  console.log("PUBLISH DEBUG:", (await page.locator("#screen-publish .notice.error").allTextContents()).join(" | "));
}
record("single commit created", commitCounter === 1, String(commitCounter));
record("publish success shown", (await page.getByText("تم النشر بنجاح").count()) > 0);
const blobTexts = capturedBlobs.map((b) => b.encoding === "base64" ? b.content : Buffer.from(b.content, "utf8").toString("utf8"));
record("arabic text committed intact", blobTexts.some((t) => t.includes("اختبار —Diomond ✓")));
record("chinese text committed intact", blobTexts.some((t) => t.includes("中文测试 — DIAMOND ✓")));
record("image blob committed", capturedBlobs.some((b) => b.encoding === "base64"));
record("deletions use null sha", capturedEntries === null || capturedEntries.every((e) => e.sha !== undefined));

// Conflict detection
await page.getByRole("button", { name: "حسناً" }).click();
await page.locator("#sideNav button").filter({ hasText: "المنتجات" }).click();
await page.locator("#screen-products .list-row").first().locator("input[type=checkbox]").click();
await page.locator("#sideNav button").filter({ hasText: "النشر" }).click();
forceShaChange = true;
await page.getByRole("button", { name: "نشر على GitHub" }).click();
await page.waitForTimeout(700);
record("conflict detected before publish", (await page.getByText(/تعارض في الملفات/).count()) > 0, String(commitCounter));
record("conflict did not create commit", commitCounter === 1, String(commitCounter));
await page.locator(".modal-foot button").filter({ hasText: "إغلاق" }).click();
forceShaChange = false;

// Mobile check
await page.setViewportSize({ width: 375, height: 812 });
await page.waitForTimeout(300);
record("mobile bottom nav visible", await page.locator("#bottomNav").isVisible());
await page.locator("#bottomNav button").filter({ hasText: "المنتجات" }).click();
record("mobile products reachable", await page.locator("#screen-products:not(.hidden)").isVisible());

// Auto-lock after 15 minutes of inactivity
await page.evaluate(() => {
  const real = Date.now.bind(Date);
  Date.now = () => real() + 16 * 60 * 1000;
});
await page.waitForTimeout(16000);
record("auto-lock after inactivity", await page.getByPlaceholder("كلمة المرور المحلية").isVisible());

await browser.close();
console.log("\nRuntime failures:", [...new Set(failures)].length);
if (failures.length) console.log([...new Set(failures)].slice(0, 10).join("\n"));
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length || failures.length) process.exitCode = 1;
