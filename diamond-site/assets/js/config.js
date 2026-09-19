/**
 * DIAMOND - Brand Configuration
 * Single source of truth for brand settings, colours, contact info, and legal placeholders.
 * Edit this file to customize the site without touching other code.
 */
const DIAMOND_CONFIG = {
    // Brand identity
    brand: {
        name: 'DIAMOND',
        tagline: {
            de: 'Gründlich. Zuverlässig. Sauber.',
            en: 'Thorough. Reliable. Clean.'
        },
        description: {
            de: 'Professionelle Reinigungsprodukte für höchste Ansprüche.',
            en: 'Professional cleaning products for the highest standards.'
        }
    },

    // Colour palette (CSS variables are defined in CSS, keep here for JS reference)
    colours: {
        primary: '#0B4F9E',      // Deep diamond blue
        accent: '#FFC800',       // Signal yellow
        background: '#FAFAFA',   // Very light grey
        surface: '#FFFFFF',      // White
        text: '#1A1A1A',         // Near-black
        textMuted: '#666666',    // Medium grey
        border: '#E0E0E0',       // Light grey
        focus: '#0B4F9E',        // Focus ring
        error: '#C00000',        // Error red
        success: '#2E7D32'       // Success green
    },

    // Typography
    fonts: {
        heading: '"Barlow Condensed", system-ui, Arial, sans-serif',
        body: '"Barlow", system-ui, Arial, sans-serif'
    },

    // Contact information
    contact: {
        company: 'DIAMOND Reinigungssysteme GmbH',
        street: 'Musterstraße 12',
        postalCode: '10115',
        city: 'Berlin',
        country: 'Deutschland',
        phone: '+49 30 1234 5678',
        email: 'info@diamond-cleaning.de',
        vatId: 'DE123456789',
        registerCourt: 'Amtsgericht Berlin Charlottenburg',
        registerNumber: 'HRB 123456',
        managingDirector: 'Max Mustermann'
    },

    // Social / external links (placeholders)
    social: {
        linkedin: 'https://linkedin.com/company/diamond-cleaning',
        instagram: 'https://instagram.com/diamondcleaning',
        youtube: 'https://youtube.com/@diamondcleaning'
    },

    // Legal placeholders - REPLACE BEFORE GOING LIVE
    legal: {
        impressum: {
            de: '[PLATZHALTER] Vollständiges Impressum gemäß § 5 TMG. Firma, Vertretungsberechtigte, Registergericht, Registernummer, USt-IdNr., Aufsichtsbehörde, Berufsbezeichnung, Kammer.',
            en: '[PLACEHOLDER] Complete legal notice per German law. Company, authorized representatives, register court, register number, VAT ID, supervisory authority, professional title, chamber.'
        },
        datenschutz: {
            de: '[PLATZHALTER] Datenschutzerklärung gemäß DSGVO. Verantwortlicher, Zwecke, Rechtsgrundlagen, Empfänger, Drittlandtransfer, Speicherdauer, Betroffenenrechte, Beschwerderecht, Cookies, Analytics, Social Media Plugins.',
            en: '[PLACEHOLDER] Privacy policy per GDPR. Controller, purposes, legal bases, recipients, third-country transfer, retention periods, data subject rights, right to complain, cookies, analytics, social media plugins.'
        },
        agb: {
            de: '[PLATZHALTER] Allgemeine Geschäftsbedingungen. Geltungsbereich, Vertragsschluss, Preise, Zahlung, Lieferung, Eigentumsvorbehalt, Gewährleistung, Haftung, Widerrufsrecht, Schlussbestimmungen.',
            en: '[PLACEHOLDER] General Terms and Conditions. Scope, contract formation, prices, payment, delivery, retention of title, warranty, liability, right of withdrawal, final provisions.'
        },
        widerruf: {
            de: '[PLATZHALTER] Widerrufsbelehrung für Verbraucher. Widerrufsrecht, Widerrufsform, Widerrufsfolgen, Muster-Widerrufsformular.',
            en: '[PLACEHOLDER] Right of withdrawal information for consumers. Right of withdrawal, form of withdrawal, consequences of withdrawal, model withdrawal form.'
        }
    },

    // Currency & formatting
    currency: {
        code: 'EUR',
        locale: {
            de: 'de-DE',
            en: 'en-GB'
        }
    },

    // Product categories (used for navigation and filtering)
    categories: [
        { id: 'glass', name: { de: 'Glas', en: 'Glass' }, icon: 'glass' },
        { id: 'floor', name: { de: 'Boden', en: 'Floor' }, icon: 'floor' },
        { id: 'mops-buckets', name: { de: 'Wischer & Eimer', en: 'Mops & Buckets' }, icon: 'mop' },
        { id: 'cloths-sponges', name: { de: 'Tücher & Schwämme', en: 'Cloths & Sponges' }, icon: 'cloth' },
        { id: 'brushes-squeegees', name: { de: 'Bürsten & Abzieher', en: 'Brushes & Squeegees' }, icon: 'brush' },
        { id: 'cleaners-sprays', name: { de: 'Reiniger & Sprays', en: 'Cleaners & Sprays' }, icon: 'spray' },
        { id: 'accessories', name: { de: 'Zubehör', en: 'Accessories' }, icon: 'accessory' }
    ],

    // Product types for filtering
    productTypes: [
        { id: 'wipes', name: { de: 'Tücher', en: 'Wipes' } },
        { id: 'mop', name: { de: 'Wischer', en: 'Mop' } },
        { id: 'bucket', name: { de: 'Eimer', en: 'Bucket' } },
        { id: 'cloth', name: { de: 'Tuch', en: 'Cloth' } },
        { id: 'sponge', name: { de: 'Schwamm', en: 'Sponge' } },
        { id: 'brush', name: { de: 'Bürste', en: 'Brush' } },
        { id: 'squeegee', name: { de: 'Abzieher', en: 'Squeegee' } },
        { id: 'spray', name: { de: 'Spray', en: 'Spray' } },
        { id: 'cleaner', name: { de: 'Reiniger', en: 'Cleaner' } },
        { id: 'gloves', name: { de: 'Handschuhe', en: 'Gloves' } },
        { id: 'set', name: { de: 'Set', en: 'Set' } }
    ],

    // Surfaces for filtering
    surfaces: [
        { id: 'glass', name: { de: 'Glas', en: 'Glass' } },
        { id: 'floor', name: { de: 'Boden', en: 'Floor' } },
        { id: 'tiles', name: { de: 'Fliesen', en: 'Tiles' } },
        { id: 'wood', name: { de: 'Holz', en: 'Wood' } },
        { id: 'kitchen', name: { de: 'Küche', en: 'Kitchen' } },
        { id: 'bathroom', name: { de: 'Bad', en: 'Bathroom' } },
        { id: 'multi', name: { de: 'Multi-Oberfläche', en: 'Multi-Surface' } }
    ],

    // Pack sizes for filtering
    packSizes: [
        { id: 'small', name: { de: 'Klein (1-10 Stk.)', en: 'Small (1-10 pcs)' } },
        { id: 'medium', name: { de: 'Mittel (11-50 Stk.)', en: 'Medium (11-50 pcs)' } },
        { id: 'large', name: { de: 'Groß (51+ Stk.)', en: 'Large (51+ pcs)' } }
    ],

    // Product lines
    productLines: [
        { id: 'professional', name: { de: 'Professional', en: 'Professional' } },
        { id: 'eco', name: { de: 'Eco Line', en: 'Eco Line' } },
        { id: 'classic', name: { de: 'Classic', en: 'Classic' } }
    ],

    // Badges
    badges: {
        new: { de: 'Neu', en: 'New' },
        bestseller: { de: 'Bestseller', en: 'Bestseller' },
        sale: { de: 'Angebot', en: 'Sale' },
        eco: { de: 'Ökologisch', en: 'Eco-Friendly' },
        lowStock: { de: 'Wenig auf Lager', en: 'Low Stock' },
        outOfStock: { de: 'Nicht verfügbar', en: 'Out of Stock' }
    },

    // Pagination
    productsPerPage: 12,
    loadMoreIncrement: 12,

    // Cookie consent
    cookieConsent: {
        necessary: 'necessary',
        analytics: 'analytics',
        marketing: 'marketing'
    },

    // SEO defaults
    seo: {
        defaultTitle: {
            de: 'DIAMOND – Professionelle Reinigungsprodukte',
            en: 'DIAMOND – Professional Cleaning Products'
        },
        defaultDescription: {
            de: 'Hochwertige Reinigungsprodukte für Glas, Boden & mehr. Made for professionals. Jetzt entdecken.',
            en: 'Premium cleaning products for glass, floor & more. Made for professionals. Discover now.'
        },
        ogImage: '/assets/img/og-default.svg',
        twitterHandle: '@diamondcleaning'
    },

    // Feature flags
    features: {
        enableCart: true,
        enableWishlist: false,
        enableCompare: false,
        enableReviews: false,
        enableNewsletter: true,
        enableCookieBanner: true
    }
};

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DIAMOND_CONFIG;
}