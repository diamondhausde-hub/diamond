# DIAMOND — Corporate Website

Premium, editorial-style website for **DIAMOND** household cleaning products. Built with Next.js (static export), React, TypeScript, Tailwind CSS v4, Framer Motion and Radix Dialog.

- Six languages: English, Arabic (full RTL), German, French, Italian, Chinese
- Six-product catalogue with search, category filters and product detail sheets
- Interactive glass-cleaning before/after lab
- Wholesale enquiry list with quantities, WhatsApp/email hand-off
- Contact form, printable catalogue, branded 404, per-language SEO
- Mobile-first layout with safe-area-aware bottom navigation

---

## Prerequisites

- **Node.js 20.9+** (Node 22 LTS recommended)
- **npm 10+**

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Open <http://localhost:3000/diamond/>. The site is configured for the GitHub Pages project path `/diamond` (see `next.config.ts`). The root `/diamond/` is the language gateway; each language lives under its prefix, e.g. `/diamond/en/`, `/diamond/ar/`.

## Build

```bash
npm run build
```

This runs `next build` and then `scripts/postbuild.mjs`, which copies the branded multi-language `404.html` into the export. **Always use `npm run build`** rather than a bare `next build`.

The static site is written to `out/`.

## Preview the production build

```bash
npm run preview
```

Serves `out/` at <http://localhost:4173/diamond/>. `npm start` serves the same export on port 3000.

## Deploy

The output in `out/` is plain static files and can be hosted anywhere. The project is preconfigured for GitHub Pages at `https://diamondhausde-hub.github.io/diamond/`.

### GitHub Pages (current setup)

- `next.config.ts` sets `basePath: "/diamond"` and `assetPrefix: "/diamond/"`.
- `.github/workflows/deploy.yml` builds on every push to `main`, uploads `out/` and deploys it with the official Pages actions. It also sets `NEXT_PUBLIC_SITE_URL` for canonical URLs, hreflang and the sitemap.
- `scripts/postbuild.mjs` copies the branded `404.html` and a `.nojekyll` marker into `out/` (GitHub Pages uses the root `404.html` as its custom error page).
- In the repository, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. Then push to `main` and watch the Actions tab.
- If your default branch is `master` instead of `main`, change `branches: [main]` in the workflow.

### Apache (classic hosting)

1. Set the real domain (see [Configuration](#configuration)).
2. Run `npm run build`.
3. Upload the **contents of `out/`** to your web root (the site expects to live at the domain root).
4. The included `.htaccess` enables:
   - `DirectoryIndex index.html`
   - custom `404` via `/404.html`
   - long-term caching for `/_next/static` assets, `no-cache` for HTML
   - gzip/deflate compression and correct SVG/WOFF2 MIME types

### Nginx

```nginx
root /var/www/diamond/out;
index index.html;
error_page 404 /404.html;

location /diamond/_next/static/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### Vercel / Netlify / Cloudflare Pages

- Build command: `npm run build`
- Output directory: `out`
- No server runtime is required.

> **Changing the base path:** if the site moves to a domain root, set `basePath`/`assetPrefix` back to empty in `next.config.ts`, update `BASE_PATH` in `lib/paths.ts`, set `NEXT_PUBLIC_SITE_URL` to the new root URL, and update the defaults in `static/404.html` and the QA scripts.

---

## Configuration

### 1. Site URL (canonical, hreflang, Open Graph, sitemap)

Create `.env.local` (or set the variable in your host's dashboard):

```bash
NEXT_PUBLIC_SITE_URL=https://diamondhausde-hub.github.io/diamond
```

No trailing slash; include the `/diamond` path. The deploy workflow sets this automatically. For a local override, put it in `.env.local` (see `.env.example`). Without it, canonical URLs fall back to `http://localhost:3000`, which is only suitable for local development. Rebuild after changing it.

### 2. Contact channels

Edit the editable values in `config/site.json` (`config/site.ts` only imports them):

```json
{
  "contact": {
    "whatsapp": "+9647701211099",
    "email": "diamondhaus.de@gmail.com",
    "phone": "+964 770 121 1099",
    "address": ""
  },
  "cataloguePdf": null
}
```

- WhatsApp and email submissions are **not** stored by the site. There is no backend; the visitor's WhatsApp or email app opens with a prepared message, which they review and send themselves.
- A channel left as an empty string is disabled. In that case the UI states that online sending is unavailable — it never shows a fake success.
- `phone` and `address` are display-only and appear only when non-empty.

### 3. Optional PDF catalogue

By default the catalogue page offers a print-optimized HTML catalogue (`window.print()`). To link a pre-made PDF instead, set `cataloguePdf` in `config/site.json`:

```json
"cataloguePdf": "/brand/diamond-catalogue.pdf"
```

Place the file in `public/brand/`.

### 4. Content and translations

| What | Where |
| --- | --- |
| Product list, IDs, categories, sizes | `data/products.json`, `data/categories.json` |
| Product names, descriptions, specs, UI copy | `messages/{en,ar,de,fr,it,zh}.json` |
| Editable contact/catalogue settings | `config/site.json` |
| Admin panel | `public/admin/index.html` |
| Locale list, native labels, direction | `i18n/config.ts` |
| Global design tokens and component CSS | `app/globals.css` |
| Site metadata helpers | `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts` |

Keep the key/array structure of every message file identical to `messages/en.json`. Arabic is automatically rendered RTL; Chinese uses the `zh-Hans` language tag.

---

## Admin panel

The owner can change all editable content from a phone or PC without touching code:

**`https://diamondhausde-hub.github.io/diamond/admin/`**

The page is publicly reachable, but it is **useless without a valid GitHub token**. Security comes from the token, not from hiding the URL. The page has `noindex,nofollow`, a strict CSP, and is excluded from `sitemap.xml` and disallowed in `robots.txt`.

### Create the token (one time)

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
2. **Generate new token** → **Only select repositories** → choose `diamond`.
3. Permissions: **Contents: Read and write**. **Metadata: Read** is automatic. Add nothing else.
4. Set an expiration (e.g. 90 days). Copy the token — GitHub only shows it once.
5. If it ever leaks, **revoke it immediately** in GitHub token settings.

### Log in

- First visit: paste the token, choose a local password (min. 10 characters), confirm it, and tick **Save encrypted on this device**. The token is encrypted with PBKDF2-SHA256 (600,000 iterations) + AES-GCM; only `{salt, iv, ciphertext}` is stored in `localStorage`. The plain token is never stored or logged.
- On later visits, enter only the local password (**Unlock**). Five wrong passwords trigger a 30-second lockout.
- **Use token once without saving** keeps it in memory only (lost on refresh/close).
- **Logout** clears the in-memory token; **Forget this device** deletes the encrypted copy too. The session auto-locks after 15 minutes of inactivity; unsaved edits stay in the draft.

After login, use the tabs: **Dashboard, Products, Categories, Texts, Images, Settings, Publish, History**.

### Publish

1. Make changes (products, 6-language texts, categories, images, settings).
2. Open **Publish** and review the change list. Validation blocks broken data (duplicate/invalid IDs, missing EN product text, mismatched message structure, bad settings, missing images).
3. Optionally edit the commit message, then press **نشر على GitHub**.
4. All files are written in **one atomic commit** via the Git Data API. The existing GitHub Actions workflow rebuilds and deploys automatically (~1 minute).
5. A conflict check re-reads remote SHAs before committing. If someone changed a file elsewhere, reload before publishing.

### Images

JPG/PNG/WebP up to 10 MB are accepted. They are resized to 1600 px max on the long side, converted to WebP (quality ~0.82, reduced further if needed), stripped of metadata, and saved as `public/uploads/products/<unique-name>.webp` with a timestamp so CDN caches never serve an old file. The site renders them through the `/diamond` base-path helper.

### Roll back

- Use the **History** tab to restore a previous version of `products.json` or any message file (this creates a new commit; it never rewrites history).
- Or from a terminal: `git revert <commit-sha>` on `main`.

### Known limits

- Each publish triggers a rebuild (~1 minute); changes are not instant.
- The admin edits **values only**. New page layouts or new text keys still require code.
- The token lives in the browser. Use a device you trust and set an expiration.
- Direct browser-to-GitHub calls are limited to 5,000 requests/hour per token — more than enough.

---

## Quality checks

With the production export running on port 4173:

```bash
node scripts/qa-check.mjs        # Playwright interaction, locale, a11y and network checks
node scripts/visual-check.mjs    # screenshots to %TEMP%/diamond-qa
node scripts/nav-check.mjs       # navigation/link crawl
node scripts/pages-check.mjs     # built HTML: base path, SEO, robots, admin export
node scripts/admin-check.mjs     # admin UI with a mocked GitHub API (no real token)
```

`qa-check.mjs` mocks `window.open` to assert the prepared WhatsApp URL and also verifies the configured email/phone links on the contact page. `admin-check.mjs` never uses a real token: it intercepts `api.github.com` and verifies encrypted token storage, login errors, publishing in a single commit, UTF-8 text, image compression and conflict detection.

---

## Project structure

```
app/
  (gateway)/            language selection at /
  (site)/[locale]/      home, products, glass-lab, about, wholesale, contact, catalog
  globals.css           design system + component styles
  sitemap.ts, robots.ts SEO endpoints
components/             header, footer, product, glass-lab, wholesale, contact UI
config/site.json        editable contact/catalogue settings
config/site.ts          imports JSON, keeps site URL + channel helpers
data/products.json      editable product data
data/categories.json    editable category list
data/products.ts        typed exports, filters hidden products, sorts by order
i18n/                   locale metadata and message loader
messages/               six translation dictionaries
public/brand/           DIAMOND logos and brand assets
public/admin/           single-file admin panel
public/uploads/products/ uploaded product photos
scripts/                postbuild, QA, visual, navigation, pages and admin checks
static/404.html         branded multi-language 404 page
.htaccess               Apache static-hosting configuration
```

---

## Notes

- The site is fully static; search, filters, the enquiry list and language switching run client-side. Language changes update the URL without a full page reload.
- Product illustrations are replaceable SVG placeholders. Add an `image` path to a product in `data/products.json` to use photography instead.
- No prices, certifications, or addresses are invented. Add verified details only.

---

## Changelog

### `admin-panel` branch

- Added the single-file browser admin panel with encrypted local token storage, six-language editing, product/category/image/settings management, one-click atomic publishing, history/restore and conflict detection.
- Converted products, categories and contact settings from TypeScript literals to JSON (`data/products.json`, `data/categories.json`, `config/site.json`); `data/products.ts` and `config/site.ts` keep their original exports.
- Product IDs standardised to lowercase kebab-case; product illustrations keep their original `visual` keys.
- All product images now use the `/diamond` base-path helper; uploaded WebP images render in cards, detail sheets and the printable catalogue.
- Sizes are stored once in `data/products.json` instead of being duplicated in all six translation files.
- `robots.txt` disallows `/diamond/admin/`; `sitemap.xml` excludes it.
- Added `scripts/admin-check.mjs`, `scripts/pages-check.mjs` and updated this README.
