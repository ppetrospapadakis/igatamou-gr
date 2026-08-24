/**
 * site-config.js
 * Central configuration for multi-site support (igatamou.gr + oskilosmou.gr).
 * Detects domain or ?site= query parameter.
 */
const SITE_CONFIG = (() => {
    const host = window.location.hostname;
    const urlParams = new URLSearchParams(window.location.search);
    const siteParam = urlParams.get('site');

    // IMPORTANT: domain check uses 'oskilosmou'
    const isDog = host.includes('oskilosmou') || siteParam === 'oskilosmou' || siteParam === 'dog';

    if (isDog) {
        return {
            domain: 'oskilosmou',
            siteName: 'oskilosmou.gr',
            siteTitle: 'Ο Σκύλος Μου!',
            prefix: 'Σκύλο',
            animal: 'σκύλος',
            animalCapital: 'Σκύλος',
            animalPlural: 'σκύλοι',
            animalGenitiv: 'σκύλου',
            animalAccusative: 'σκύλο',
            animalEmoji: '🐶',
            pawEmoji: '🐾',
            logoSrc: 'dog_logo.png',
            logoAlt: 'oskilosmou.gr',
            mascotName: 'Φίλος',
            localStoragePrefix: 'oskilosmou',
            themeColorPrimary: '#0284c7', // Bright friendly light-blue
            themeColorAccent: '#0369a1',
            themeColorLight: '#e0f2fe',
            navLinks: {
                gallery:  '📸 Σκύλο-Άλμπουμ 🐾',
                drawings: '🎨 Σκύλο-Ζωγραφιές 🐾',
                stories:  '📖 Σκύλο-Ιστορίες 🐾',
                likes:    '💡 Σκύλο-Συμβουλές 🐾',
                games:    '🎮 Σκύλο-Παιχνίδια 🐾'
            }
        };
    } else {
        return {
            domain: 'igatamou',
            siteName: 'igatamou.gr',
            siteTitle: 'igatamou.gr!',
            prefix: 'Γατο',
            animal: 'γάτα',
            animalCapital: 'Γάτα',
            animalPlural: 'γάτες',
            animalGenitiv: 'γάτας',
            animalAccusative: 'γάτα',
            animalEmoji: '🐱',
            pawEmoji: '🐾',
            logoSrc: 'magkas_logo.png',
            logoAlt: 'igatamou.gr',
            mascotName: 'Μάγκας',
            localStoragePrefix: 'igatamou',
            themeColorPrimary: '#7c2d12',
            themeColorAccent: '#831843',
            themeColorLight: '#fef3c7',
            navLinks: {
                gallery:  '📸 Γατο-Άλμπουμ 🐾',
                drawings: '🎨 Γατο-Ζωγραφιές 🐾',
                stories:  '📖 Γατο-Ιστορίες 🐾',
                likes:    '💡 Γατο-Συμβουλές 🐾',
                games:    '🎮 Γατο-Παιχνίδια 🐾'
            }
        };
    }
})();

// Auto-inject CSS Theme variables and dog styling if on oskilosmou.gr
(function applyTheme() {
    if (SITE_CONFIG.domain === 'oskilosmou') {
        const style = document.createElement('style');
        style.id = 'oskilosmou-theme-overrides';
        style.textContent = `
            :root {
                --primary-color: #0284c7 !important;
                --primary-hover: #0369a1 !important;
                --bg-gradient-start: #f0f9ff !important;
                --bg-gradient-end: #e0f2fe !important;
            }
            body {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%) !important;
            }
            .header-nav .nav-btn:nth-child(1), .category-card:nth-child(1) { --accent: #0ea5e9; }
            .header-nav .nav-btn:nth-child(2), .category-card:nth-child(2) { --accent: #38bdf8; }
            .header-nav .nav-btn:nth-child(3), .category-card:nth-child(3) { --accent: #0284c7; }
            .header-nav .nav-btn:nth-child(4), .category-card:nth-child(4) { --accent: #2563eb; }
            .header-nav .nav-btn:nth-child(5), .category-card:nth-child(5) { --accent: #4f46e5; }
        `;
        document.head.appendChild(style);
    }
})();

// Auto DOM Localization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    if (SITE_CONFIG.domain !== 'oskilosmou') return;

    // 1. Update Title tag
    if (document.title) {
        document.title = document.title
            .replace(/igatamou\.gr/gi, 'oskilosmou.gr')
            .replace(/γατ\w+/gi, 'σκύλο')
            .replace(/Γατ\w+/gi, 'Σκύλο')
            .replace(/🐱/g, '🐶');
    }

    // 2. Update Nav Buttons
    const navLinks = document.querySelectorAll('.header-nav a.nav-btn, .nav-container a.nav-btn, nav a.nav-btn');
    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.includes('gallery.html')) link.textContent = SITE_CONFIG.navLinks.gallery;
        else if (href.includes('drawings-gallery.html') || href.includes('draw.html')) link.textContent = SITE_CONFIG.navLinks.drawings;
        else if (href.includes('stories.html') || href.includes('story-editor.html')) link.textContent = SITE_CONFIG.navLinks.stories;
        else if (href.includes('cat-likes.html')) link.textContent = SITE_CONFIG.navLinks.likes;
        else if (href.includes('games.html')) link.textContent = SITE_CONFIG.navLinks.games;
    });

    // 3. Update Logo Image and Text
    const logoImgs = document.querySelectorAll('img.logo-img, .header-logo img, .site-logo img');
    logoImgs.forEach(img => {
        img.src = SITE_CONFIG.logoSrc;
        img.alt = SITE_CONFIG.logoAlt;
    });

    const logoTexts = document.querySelectorAll('.logo-text, .site-title, .header-title');
    logoTexts.forEach(el => {
        el.innerHTML = el.innerHTML.replace(/igatamou\.gr/gi, '<strong>oskilosmou.gr</strong>');
    });

    // 4. Update Footer Text
    const footers = document.querySelectorAll('footer p, .footer p');
    footers.forEach(f => {
        f.innerHTML = f.innerHTML.replace(/igatamou\.gr/gi, 'oskilosmou.gr');
    });

    // 5. Update Floating Paw Emojis
    const floatingPaws = document.querySelectorAll('.floating-paw');
    floatingPaws.forEach(paw => {
        if (paw.textContent.includes('🐱')) {
            paw.textContent = '🐶';
        }
    });
});