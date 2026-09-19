const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'diamond-vanilla');

const dirs = [
    'assets/css',
    'assets/js',
    'assets/img',
    'assets/img/products',
    'assets/fonts',
    'data',
    'legal'
];

fs.mkdirSync(baseDir, { recursive: true });
dirs.forEach(d => fs.mkdirSync(path.join(baseDir, d), { recursive: true }));

const configJs = `export const config = {
    brandName: "DIAMOND",
    colors: { primary: "#0B4F9E", accent: "#FFC800" },
    contact: { email: "info@diamond.com", phone: "+49123456789" }
};`;
fs.writeFileSync(path.join(baseDir, 'assets/js/config.js'), configJs);

const products = [{
    id: "p1", slug: "product-1", category: "glass", price: 14.99, stock: 42,
    images: ["assets/img/products/placeholder.svg"],
    i18n: {
        de: { name: "Glasreinigungstücher 40 Stk.", description: "Gründlich. Zuverlässig.", specs: {"Größe":"Standard"}, usage: "Nach Bedarf." },
        en: { name: "Glass Cleaning Wipes 40 pcs", description: "Thorough. Reliable.", specs: {"Size":"Standard"}, usage: "As needed." }
    }
}];
fs.writeFileSync(path.join(baseDir, 'data/products.json'), JSON.stringify(products, null, 2));

const deJson = {
    nav_home: "Startseite", nav_shop: "Shop", nav_cart: "Warenkorb",
    hero_title: "Gründlich. Zuverlässig. Sauber.",
    btn_shop_now: "Jetzt einkaufen", btn_add_to_cart: "In den Warenkorb"
};
fs.writeFileSync(path.join(baseDir, 'data/de.json'), JSON.stringify(deJson, null, 2));

const enJson = {
    nav_home: "Home", nav_shop: "Shop", nav_cart: "Cart",
    hero_title: "Thorough. Reliable. Clean.",
    btn_shop_now: "Shop Now", btn_add_to_cart: "Add to Cart"
};
fs.writeFileSync(path.join(baseDir, 'data/en.json'), JSON.stringify(enJson, null, 2));

const cssVars = `:root {
    --color-primary: #0B4F9E;
    --color-accent: #FFC800;
    --color-bg: #FFFFFF;
    --font-body: 'Barlow', sans-serif;
}
body { font-family: var(--font-body); margin: 0; padding: 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 1rem; }
.btn { background: var(--color-primary); color: white; padding: 0.5rem 1rem; border: none; cursor: pointer; }
.btn-accent { background: var(--color-accent); color: black; }
.grid { display: grid; gap: 1rem; }
`;
fs.writeFileSync(path.join(baseDir, 'assets/css/style.css'), cssVars);

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50">
    <text x="10" y="35" font-family="sans-serif" font-size="32" font-weight="bold">DIAMOND</text>
</svg>`;
fs.writeFileSync(path.join(baseDir, 'assets/img/logo.svg'), logoSvg);

const productSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#f5f5f5" />
    <text x="200" y="200" font-family="sans-serif" font-size="20" fill="#999" text-anchor="middle">Product</text>
</svg>`;
fs.writeFileSync(path.join(baseDir, 'assets/img/products/placeholder.svg'), productSvg);

const jsFiles = {
    'i18n.js': `export async function initI18n() {
    let lang = localStorage.getItem('lang') || 'de';
    document.documentElement.lang = lang;
    const res = await fetch(\`./data/\${lang}.json\`);
    const translations = await res.json();
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = translations[el.getAttribute('data-i18n')] || el.textContent;
    });
    window.translations = translations;
    window.currentLang = lang;
    document.dispatchEvent(new Event('i18nLoaded'));
}`,
    'main.js': `import { initI18n } from './i18n.js';
document.addEventListener('DOMContentLoaded', async () => {
    await initI18n();
});`
};

for (const [filename, content] of Object.entries(jsFiles)) {
    fs.writeFileSync(path.join(baseDir, 'assets/js', filename), content);
}

const htmlFiles = {
    'index.html': `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>DIAMOND Cleaning</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="container">
        <h1 data-i18n="hero_title">DIAMOND</h1>
        <button class="btn btn-accent" data-i18n="btn_shop_now">Shop</button>
    </div>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>`
};

for (const [filename, content] of Object.entries(htmlFiles)) {
    fs.writeFileSync(path.join(baseDir, filename), content);
}

console.log('Project rebuilt in diamond-vanilla.');
