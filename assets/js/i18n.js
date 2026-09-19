export async function initI18n() {
    let currentLang = localStorage.getItem('lang') || 'de';
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('lang')) { currentLang = urlParams.get('lang'); localStorage.setItem('lang', currentLang); }
    document.documentElement.lang = currentLang;
    try {
        const res = await fetch('./data/' + currentLang + '.json');
        const translations = await res.json();
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                if (el.tagName === 'INPUT' && el.type === 'submit') el.value = translations[key];
                else if (el.placeholder) el.placeholder = translations[key];
                else el.textContent = translations[key];
            }
        });
        document.querySelectorAll('.lang-switcher button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === currentLang));
        window.translations = translations; window.currentLang = currentLang; document.dispatchEvent(new Event('i18nLoaded'));
    } catch (e) { console.error('Failed to load translations', e); }
}
export function setLang(lang) { localStorage.setItem('lang', lang); const url = new URL(window.location); url.searchParams.set('lang', lang); window.history.replaceState({}, '', url); initI18n(); if (window.renderProducts) window.renderProducts(); if (window.renderProductDetail) window.renderProductDetail(); if (window.renderCart) window.renderCart(); }