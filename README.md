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

Open <http://localhost:3000>. The root `/` is the language gateway; each language lives under its prefix, e.g. `/en/`, `/ar/`, `/de/`.

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

Serves `out/` at <http://localhost:4173>. `npm start` serves the same export on port 3000.

## Deploy

The output in `out/` is plain static files and can be hosted anywhere.

### Apache (recommended for classic hosting)

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

location /_next/static/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

### Vercel / Netlify / Cloudflare Pages

- Build command: `npm run build`
- Output directory: `out`
- No server runtime is required.

> **Sub-path hosting:** the configuration assumes the domain root. If the site must live under a sub-path, set `basePath`/`assetPrefix` in `next.config.ts` and adjust `.htaccess` / the 404 path accordingly.

---

## Configuration

### 1. Site URL (canonical, hreflang, Open Graph, sitemap)

Create `.env.local` (or set the variable in your host's dashboard):

```bash
NEXT_PUBLIC_SITE_URL=https://www.your-domain.com
```

No trailing slash. Without it, canonical URLs fall back to `http://localhost:3000`, which is only suitable for local development. Rebuild after changing it.

### 2. Contact channels

Edit `config/site.ts`:

```ts
contact: {
  whatsapp: "+9647701211099",      // international format, digits or +digits
  email: "diamondhaus.de@gmail.com",
  phone: "+964 770 121 1099",      // shown on the contact page only
  address: "",
},
```

- WhatsApp and email submissions are **not** stored by the site. There is no backend; the visitor's WhatsApp or email app opens with a prepared message, which they review and send themselves.
- A channel left as an empty string is disabled. In that case the UI states that online sending is unavailable — it never shows a fake success.
- `phone` and `address` are display-only and appear only when non-empty.

### 3. Optional PDF catalogue

By default the catalogue page offers a print-optimized HTML catalogue (`window.print()`). To link a pre-made PDF instead, set:

```ts
cataloguePdf: "/brand/diamond-catalogue.pdf",
```

Place the file in `public/brand/`.

### 4. Content and translations

| What | Where |
| --- | --- |
| Product list, IDs, categories, sizes | `data/products.ts` |
| Product names, descriptions, specs, UI copy | `messages/{en,ar,de,fr,it,zh}.json` |
| Locale list, native labels, direction | `i18n/config.ts` |
| Global design tokens and component CSS | `app/globals.css` |
| Site metadata helpers | `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts` |

Keep the key/array structure of every message file identical to `messages/en.json`. Arabic is automatically rendered RTL; Chinese uses the `zh-Hans` language tag.

---

## Quality checks

With the production export running on port 4173:

```bash
node scripts/qa-check.mjs        # Playwright interaction, locale, a11y and network checks
node scripts/visual-check.mjs    # screenshots to %TEMP%/diamond-qa
node scripts/nav-check.mjs       # navigation/link crawl
```

`qa-check.mjs` mocks `window.open` to assert the prepared WhatsApp URL and also verifies the configured email/phone links on the contact page.

---

## Project structure

```
app/
  (gateway)/            language selection at /
  (site)/[locale]/      home, products, glass-lab, about, wholesale, contact, catalog
  globals.css           design system + component styles
  sitemap.ts, robots.ts SEO endpoints
components/             header, footer, product, glass-lab, wholesale, contact UI
config/site.ts          contact channels, site URL, catalogue options
data/products.ts        canonical product data
i18n/                   locale metadata and message loader
messages/               six translation dictionaries
public/brand/           DIAMOND logos and brand assets
scripts/                postbuild, QA, visual and navigation checks
static/404.html         branded multi-language 404 page
.htaccess               Apache static-hosting configuration
```

---

## Notes

- The site is fully static; search, filters, the enquiry list and language switching run client-side. Language changes update the URL without a full page reload.
- Product illustrations are replaceable SVG placeholders. Add an `image` path to a product in `data/products.ts` to use photography instead.
- No prices, certifications, or addresses are invented. Add verified details only.
