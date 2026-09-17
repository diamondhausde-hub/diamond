# DIAMOND — Links Page

A branded link-hub page (like Linktree) for DIAMOND cleaning company.

## Files
- `index.html` — the page structure
- `assets/logo.svg` / `assets/logo.png` — company logo
- `assets/styles.css` — brand theme (navy `#0a1e3e`, gold `#f6c321`, green `#2f9e44`)

## How to edit links
Open `index.html` and edit the `<a class="link-card" href="#">` blocks:

```html
<a class="link-card" href="https://your-link.com">
  <span class="icon">🌐</span>
  <span class="text">
    <strong>Our Website</strong>
    <small>your-website.com</small>
  </span>
  <span class="arrow">→</span>
</a>
```

## How to publish on GitHub Pages
1. Create a new repository on GitHub (e.g. `diamond-links`).
2. Upload these files: `index.html`, `README.md`, and the `assets/` folder (all 4 files).
3. Go to **Settings → Pages → Source** and select `main` branch, `/ (root)` folder.
4. Your page will be live at `https://<username>.github.io/diamond-links/`
