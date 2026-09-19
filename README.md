# DIAMOND Cleaning Catalog

Production-ready bilingual catalog storefront for DIAMOND cleaning supplies. Built with Next.js App Router, TypeScript, Tailwind CSS and local JSON catalog data. German is the default language; English is available at `/en/...`.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/de`. For a production check use `npm run build && npm start`.

## Project map

- `src/app/[locale]` – localized routes: home, shop, categories, product detail, about, contact, FAQ, legal pages and inquiry cart.
- `src/components` – header, footer, cookie notice and reusable catalog/product UI.
- `src/data/products.json` – 32 sample products with bilingual names, descriptions, specifications, usage and safety copy.
- `src/data/de.json`, `src/data/en.json` – all interface copy and legal-page labels.
- `src/lib/config.ts` – brand colour, contact placeholders and category registry.
- `public/products` – neutral SVG product placeholders that can be replaced one-for-one.

## Add a product

Add an object to `src/data/products.json` with the existing shape (`id`, `slug`, `category`, `type`, `surface`, `sizes`, `price`, `stock`, `badges`, `images`, `name`, `description`, `specs`, `usage`, `safety`). Put its image in `public/products` and reference it as `/products/file.svg` (or replace with an optimized image URL when moving to a CMS).

## Add a language

Create another translation file beside `de.json` and `en.json`, then add the locale to the language links in `src/components/Header.tsx`. Product objects use the same locale keys for names, descriptions, specifications, usage and safety. Add the locale to any static generation strategy if you later enable full static export.

## Deploy

Deploy the repository to Vercel or Netlify with Node.js 18+. No database, payment provider or tracking script is required. The inquiry form is intentionally front-end only; connect it to an email/API route before accepting live requests.

## Before going live

1. Replace `public/diamond-logo.svg` only if the supplied logo is not the final artwork; the current file is the provided DIAMOND logo.
2. Replace the neutral SVG product images with approved product photography and update alt text/product facts.
3. Update `src/lib/config.ts` with the real legal entity, address, phone, email and brand colours.
4. Replace the clearly marked legal placeholders under `/legal/*` with reviewed German legal texts.
5. Replace the sample domain in `src/app/sitemap.ts` and add a real form/email integration.
6. Review every product claim, material, availability and eco label before publication. No certification or “Made in Germany” claim is made by default.
