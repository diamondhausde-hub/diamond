# DIAMOND Cleaning Solutions — Catalog Storefront

Bilingual (de/en) cleaning product catalog built with **Next.js App Router**, TypeScript, Tailwind CSS, and static HTML export for GitHub Pages deployment.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with `output: 'export'` for static hosting
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data**: Local JSON catalog (`src/data/products.json`, `src/data/de.json`, `src/data/en.json`)
- **No backend required** — all pages pre-rendered at build time

## Live Site

- German (default): `/de`
- English: `/en`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/de`. For a production build:

```bash
npm run build
npm start
```

## Project Structure

- `src/app/[locale]/` — localized routes: home, shop, categories, product detail, about, contact, FAQ, legal pages, and inquiry cart
- `src/components/` — header, footer, product grid, and client-side forms (CartForm, ContactForm, FaqForm, ProductDetailActions)
- `src/data/` — product catalog and bilingual interface copy
- `src/lib/config.ts` — brand colors, categories, legal slugs, contact placeholders
- `public/products/` — neutral SVG product placeholders
- `public/index.html` — root redirect to `/de`

## GitHub Pages Deployment

1. Set the GitHub Pages source to the `fix/asset-paths-and-design` branch (or merge to `main`)
2. The `out/` folder is generated after `npm run build` — push it or configure CI to deploy automatically
3. No database, payment provider, or tracking script is required

## Add a Product

Add an object to `src/data/products.json` with the existing shape (`id`, `slug`, `category`, `type`, `surface`, `sizes`, `price`, `stock`, `badges`, `images`, `name`, `description`, `specs`, `usage`, `safety`). Put its image in `public/products` and reference it as `/products/file.svg`.

## Add a Language

Create another translation file beside `de.json` and `en.json`, then add the locale to the language links in `src/components/Header.tsx`.

## Before Going Live

1. Replace `public/diamond-logo.svg` with final artwork if needed
2. Replace neutral SVG product images with approved product photography
3. Update `src/lib/config.ts` with the real legal entity, address, phone, and email
4. Replace the legal placeholders under `/legal/*` with reviewed German legal texts
5. Connect the inquiry form to an email/API route
6. Review every product claim, material, availability, and eco label before publication

## License

Internal project — DIAMOND Cleaning Solutions.
