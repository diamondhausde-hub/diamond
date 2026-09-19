import { getProducts, formatPrice } from './products.js';
import { updateQuantity, removeFromCart } from './cart.js';
export async function initCartPage() {
    const products = await getProducts();
    window.renderCart = () => {
        const container = document.getElementById('cart-items');
        const lang = window.currentLang;
        let total = 0;
        if (window.cart.length === 0) { container.innerHTML = '<p>' + (window.translations?.cart_empty || 'Empty') + '</p>'; document.getElementById('cart-total').textContent = formatPrice(0, lang); return; }
        container.innerHTML = '';
        window.cart.forEach(item => {
            const p = products.find(prod => prod.id === item.id);
            if (!p) return;
            const t = p.i18n[lang];
            const itemTotal = p.price * item.quantity;
            total += itemTotal;
            const div = document.createElement('div'); div.className = 'cart-item';
            div.innerHTML = '<div style="display:flex; gap:1rem; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--color-border); padding-bottom:1rem;"><img src="' + p.images[0] + '" width="50"><div style="flex:1;"><h4>' + t.name + '</h4><div>' + formatPrice(p.price, lang) + '</div></div><div><input type="number" min="1" value="' + item.quantity + '" class="qty-input" data-id="' + p.id + '" style="width:60px;"></div><div>' + formatPrice(itemTotal, lang) + '</div><button class="remove-btn btn" data-id="' + p.id + '">X</button></div>';
            container.appendChild(div);
        });
        document.getElementById('cart-total').textContent = formatPrice(total, lang);
        document.querySelectorAll('.qty-input').forEach(input => input.addEventListener('change', (e) => updateQuantity(e.target.dataset.id, e.target.value)));
        document.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', (e) => removeFromCart(e.target.dataset.id)));
    };
    document.addEventListener('i18nLoaded', window.renderCart); if (window.translations) window.renderCart();
}