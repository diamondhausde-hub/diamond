import { getProducts, formatPrice } from './products.js';
export async function initHome() {
    const products = await getProducts();
    const grid = document.getElementById('bestseller-grid');
    window.renderHomeProducts = () => {
        if (!grid) return;
        grid.innerHTML = '';
        const lang = window.currentLang;
        products.slice(0, 4).forEach(p => {
            const t = p.i18n[lang];
            const card = document.createElement('div'); card.className = 'product-card';
            card.innerHTML = '<a href="product.html?slug=' + p.slug + '"><img src="' + p.images[0] + '" alt="' + t.name + '"><div class="product-info"><h3>' + t.name + '</h3><p class="price">' + formatPrice(p.price, lang) + '</p></div></a>';
            grid.appendChild(card);
        });
    };
    document.addEventListener('i18nLoaded', window.renderHomeProducts); if (window.translations) window.renderHomeProducts();
}