import { initI18n } from './i18n.js';
import { initCart } from './cart.js';
import { initUI, renderHeaderFooter } from './ui.js';
import { config } from './config.js';
document.addEventListener('DOMContentLoaded', async () => {
    renderHeaderFooter(); await initI18n(); initCart(); initUI();
    document.documentElement.style.setProperty('--color-primary', config.colors.primary);
    document.documentElement.style.setProperty('--color-accent', config.colors.accent);
    if (window.location.pathname.includes('shop.html')) { import('./shop.js').then(m => m.initShop()); }
    else if (window.location.pathname.includes('product.html')) { import('./product.js').then(m => m.initProduct()); }
    else if (window.location.pathname.includes('cart.html')) { import('./cart-page.js').then(m => m.initCartPage()); }
    else { import('./home.js').then(m => m.initHome()); }
});