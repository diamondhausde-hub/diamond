import { getProducts, formatPrice } from './products.js';
import { addToCart } from './cart.js';
export async function initProduct() {
    const products = await getProducts();
    const slug = new URLSearchParams(window.location.search).get('slug');
    const product = products.find(p => p.slug === slug);
    if (!product) { document.querySelector('main').innerHTML = '<div class="container py-xl"><h1>Product not found</h1></div>'; return; }
    window.renderProductDetail = () => {
        const lang = window.currentLang;
        const t = product.i18n[lang];
        document.getElementById('product-image').src = product.images[0];
        document.getElementById('product-name').textContent = t.name;
        document.getElementById('product-price').textContent = formatPrice(product.price, lang);
        document.getElementById('product-desc').textContent = t.description;
        document.getElementById('product-usage').textContent = t.usage;
        document.getElementById('product-specs').innerHTML = Object.entries(t.specs).map(([k, v]) => '<tr><td>' + k + '</td><td>' + v + '</td></tr>').join('');
        const btn = document.getElementById('add-to-cart');
        if (btn) { btn.textContent = window.translations?.btn_add_to_cart || 'Add to Cart'; btn.onclick = () => { addToCart(product.id, parseInt(document.getElementById('qty').value) || 1); alert('Added to cart'); }; }
    };
    document.addEventListener('i18nLoaded', window.renderProductDetail); if (window.translations) window.renderProductDetail();
}