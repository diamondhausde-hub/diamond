import fs from "node:fs";

const read = (file) => fs.readFileSync(file, "utf8");
const home = read("out/en/index.html");
const arabic = read("out/ar/index.html");
const notFound = read("out/404.html");
const sitemap = read("out/sitemap.xml");
const robots = read("out/robots.txt");

const checks = [
  ["logo src has base path", home.includes('src="/diamond/brand/logo.svg"')],
  ["no unprefixed logo src", !home.includes('src="/brand/logo.svg"')],
  ["favicon has base path", home.includes('href="/diamond/icon.svg"')],
  ["internal links have base path", home.includes('href="/diamond/en/products/"')],
  ["no unprefixed internal links", !home.includes('href="/en/')],
  ["canonical uses Pages URL", home.includes('rel="canonical" href="https://diamondhausde-hub.github.io/diamond/en/"')],
  ["hreflang includes arabic", home.includes('hrefLang="ar"') && home.includes("https://diamondhausde-hub.github.io/diamond/ar/")],
  ["x-default hreflang", home.includes('hrefLang="x-default"')],
  ["og:image uses Pages URL", home.includes('og:image') && home.includes("https://diamondhausde-hub.github.io/diamond/og-diamond.png")],
  ["arabic dir/html lang", arabic.includes('<html lang="ar" dir="rtl"')],
  ["arabic canonical", arabic.includes('rel="canonical" href="https://diamondhausde-hub.github.io/diamond/ar/"')],
  ["404 logo prefix", notFound.includes('src="/diamond/brand/logo.svg"')],
  ["404 language links prefix", notFound.includes('href="/diamond/ar/"')],
  ["sitemap uses Pages URL", sitemap.includes("https://diamondhausde-hub.github.io/diamond/en/")],
  ["robots sitemap URL", robots.includes("https://diamondhausde-hub.github.io/diamond/sitemap.xml")],
  ["robots disallows admin", robots.includes("Disallow: /diamond/admin/")],
  ["sitemap excludes admin", !sitemap.includes("/admin/")],
  ["admin page exported", fs.existsSync("out/admin/index.html")],
  ["uploads folder exported", fs.existsSync("out/uploads/products/.gitkeep")],
  [".nojekyll exists", fs.existsSync("out/.nojekyll")],
];

for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
}
if (checks.some(([, ok]) => !ok)) process.exitCode = 1;
