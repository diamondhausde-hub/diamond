import { getProducts, formatPrice } from './products.js';
import { addToCart } from './cart.js';
export async function initShop() {
    const products = await getProducts();
    const grid = document.getElementById('product-grid');
    window.renderProducts = () => {
        if (!grid) return;
        grid.innerHTML = '';
        const categoryFilter = new URLSearchParams(window.location.search).get('category');
        const lang = window.currentLang;
        let filtered = categoryFilter ? products.filter(p => p.category === categoryFilter) : products;
        filtered.forEach(p => {
            const t = p.i18n[lang];
            const card = document.createElement('div'); card.className = 'product-card';
            card.innerHTML = '<a href="product.html?slug=' + p.slug + '"><img src="' + p.images[0] + '" alt="' + t.name + '"><div class="product-info"><h3>' + t.name + '</h3><p class="price">' + formatPrice(p.price, lang) + '</p></div></a><button class="add-to-cart-btn btn" data-id="' + p.id + '">' + (window.translations?.btn_add_to_cart || 'Add') + '</button>';
            grid.appendChild(card);
        });
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); addToCart(btn.dataset.id, 1); alert('Added to cart'); }));
    };
    document.querySelectorAll('.filter-category').forEach(el => el.addEventListener('change', (e) => { const url = new URL(window.location); if (e.target.value) url.searchParams.set('category', e.target.value); else url.searchParams.delete('category'); window.history.replaceState({}, '', url); window.renderProducts(); }));
    document.addEventListener('i18nLoaded', window.renderProducts); if (window.translations) window.renderProducts();
}