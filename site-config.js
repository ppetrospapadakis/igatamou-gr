/**
 * site-config.js
 * Central configuration for multi-site support.
 * Detects domain and exports SITE_CONFIG for use in all JS files.
 * IMPORTANT: domain is oskilosmou.gr (not osklilosmou)
 */
const SITE_CONFIG = (() => {
    const host = window.location.hostname;
    const isDog = host.includes('oskilosmou');

    if (isDog) {
        return {
            domain: 'oskilosmou',
            siteName: 'oskilosmou.gr',
            siteTitle: '\u039f \u03a3\u03ba\u03cd\u03bb\u03bf\u03c2 \u039c\u03bf\u03c5!',
            prefix: '\u03a3\u03ba\u03cd\u03bb\u03bf',
            animal: '\u03c3\u03ba\u03cd\u03bb\u03bf\u03c2',
            animalCapital: '\u03a3\u03ba\u03cd\u03bb\u03bf\u03c2',
            animalPlural: '\u03c3\u03ba\u03cd\u03bb\u03bf\u03b9',
            animalGenitiv: '\u03c3\u03ba\u03cd\u03bb\u03bf\u03c5',
            animalEmoji: '\ud83d\udc36',
            pawEmoji: '\ud83d\udc3e',
            logoSrc: 'dog_logo.png',
            logoAlt: 'oskilosmou.gr',
            mascotName: '\u03a6\u03af\u03bb\u03bf\u03c2',
            localStoragePrefix: 'oskilosmou',
            themeColorPrimary: '#0284c7',
            themeColorAccent: '#0ea5e9',
            themeColorLight: '#e0f2fe',
            navLinks: {
                gallery:  '\ud83d\udcf8 \u03a3\u03ba\u03cd\u03bb\u03bf-\u0386\u03bb\u03bc\u03c0\u03bf\u03c5\u03bc \ud83d\udc3e',
                drawings: '\ud83c\udfa8 \u03a3\u03ba\u03cd\u03bb\u03bf-\u0396\u03c9\u03b3\u03c1\u03b1\u03c6\u03b9\u03ad\u03c2 \ud83d\udc3e',
                stories:  '\ud83d\udcd6 \u03a3\u03ba\u03cd\u03bb\u03bf-\u0399\u03c3\u03c4\u03bf\u03c1\u03af\u03b5\u03c2 \ud83d\udc3e',
                likes:    '\ud83d\udca1 \u03a3\u03ba\u03cd\u03bb\u03bf-\u03a3\u03c5\u03bc\u03b2\u03bf\u03c5\u03bb\u03ad\u03c2 \ud83d\udc3e',
                games:    '\ud83c\udfae \u03a3\u03ba\u03cd\u03bb\u03bf-\u03a0\u03b1\u03b9\u03c7\u03bd\u03af\u03b4\u03b9\u03b1 \ud83d\udc3e'
            }
        };
    } else {
        return {
            domain: 'igatamou',
            siteName: 'igatamou.gr',
            siteTitle: 'igatamou.gr!',
            prefix: '\u0393\u03b1\u03c4\u03bf',
            animal: '\u03b3\u03ac\u03c4\u03b1',
            animalCapital: '\u0393\u03ac\u03c4\u03b1',
            animalPlural: '\u03b3\u03ac\u03c4\u03b5\u03c2',
            animalGenitiv: '\u03b3\u03ac\u03c4\u03b1\u03c2',
            animalEmoji: '\ud83d\udc31',
            pawEmoji: '\ud83d\udc3e',
            logoSrc: 'magkas_logo.png',
            logoAlt: 'igatamou.gr',
            mascotName: '\u039c\u03ac\u03b3\u03ba\u03b1\u03c2',
            localStoragePrefix: 'igatamou',
            themeColorPrimary: '#7c2d12',
            themeColorAccent: '#831843',
            themeColorLight: '#fef3c7',
            navLinks: {
                gallery:  '\ud83d\udcf8 \u0393\u03b1\u03c4\u03bf-\u0386\u03bb\u03bc\u03c0\u03bf\u03c5\u03bc \ud83d\udc3e',
                drawings: '\ud83c\udfa8 \u0393\u03b1\u03c4\u03bf-\u0396\u03c9\u03b3\u03c1\u03b1\u03c6\u03b9\u03ad\u03c2 \ud83d\udc3e',
                stories:  '\ud83d\udcd6 \u0393\u03b1\u03c4\u03bf-\u0399\u03c3\u03c4\u03bf\u03c1\u03af\u03b5\u03c2 \ud83d\udc3e',
                likes:    '\ud83d\udca1 \u0393\u03b1\u03c4\u03bf-\u03a3\u03c5\u03bc\u03b2\u03bf\u03c5\u03bb\u03ad\u03c2 \ud83d\udc3e',
                games:    '\ud83c\udfae \u0393\u03b1\u03c4\u03bf-\u03a0\u03b1\u03b9\u03c7\u03bd\u03af\u03b4\u03b9\u03b1 \ud83d\udc3e'
            }
        };
    }
})();

// Apply CSS theme variables immediately (before DOM load to avoid flash)
(function applyTheme() {
    const root = document.documentElement;
    root.style.setProperty('--site-color-primary', SITE_CONFIG.themeColorPrimary);
    root.style.setProperty('--site-color-accent', SITE_CONFIG.themeColorAccent);
    root.style.setProperty('--site-color-light', SITE_CONFIG.themeColorLight);
})();