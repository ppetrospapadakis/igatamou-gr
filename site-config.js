/**
 * site-config.js
 * Central configuration & automatic dynamic localization for multi-site support.
 * Supports: igatamou.gr (Cats) & oskilosmou.gr (Dogs)
 */
const SITE_CONFIG = (() => {
    const host = window.location.hostname.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const siteParam = (urlParams.get('site') || '').toLowerCase();

    // Check domain or testing query parameter
    const isDog = host.includes('oskilosmou') || host.includes('osklilosmou') || siteParam === 'oskilosmou' || siteParam === 'dog' || siteParam === 'skilos';

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
            themeColorPrimary: '#0284c7',
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
                --accent-color: #0ea5e9 !important;
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
            .gender-notice {
                background: #f0f9ff !important;
                border-color: #38bdf8 !important;
            }
            .gender-notice strong {
                color: #0369a1 !important;
            }
        `;
        document.head.appendChild(style);
    }
})();

// Comprehensive DOM Text & Attribute Replacer for oskilosmou.gr
function applyDogLocalization() {
    if (SITE_CONFIG.domain !== 'oskilosmou') return;

    // 1. Update Title
    if (document.title) {
        document.title = document.title
            .replace(/igatamou\.gr/gi, 'oskilosmou.gr')
            .replace(/Γατο-Άλμπουμ/gi, 'Σκύλο-Άλμπουμ')
            .replace(/Γατο-Ζωγραφιές/gi, 'Σκύλο-Ζωγραφιές')
            .replace(/Γατο-Ιστορίες/gi, 'Σκύλο-Ιστορίες')
            .replace(/Γατο-Συμβουλές/gi, 'Σκύλο-Συμβουλές')
            .replace(/Γατο-Παιχνίδια/gi, 'Σκύλο-Παιχνίδια')
            .replace(/γατ\w+/gi, 'σκύλο')
            .replace(/Γατ\w+/gi, 'Σκύλο')
            .replace(/🐱/g, '🐶');
    }

    // 2. Replacements Dictionary for Text Nodes
    const replacements = [
        [/igatamou\.gr/gi, 'oskilosmou.gr'],
        [/igatamou/gi, 'oskilosmou'],
        [/Γατο-Άλμπουμ/gi, 'Σκύλο-Άλμπουμ'],
        [/Γατο-Ζωγραφιές/gi, 'Σκύλο-Ζωγραφιές'],
        [/Γατο-Ιστορίες/gi, 'Σκύλο-Ιστορίες'],
        [/Γατο-Συμβουλές/gi, 'Σκύλο-Συμβουλές'],
        [/Γατο-Παιχνίδια/gi, 'Σκύλο-Παιχνίδια'],
        [/Γατο-Σχολείο/gi, 'Σκυλο-Σχολείο'],
        [/Γατο-Newsletter/gi, 'Σκυλο-Newsletter'],
        [/γατο-χάδι/gi, 'σκυλο-χάδι'],
        [/γατο-παιχνίδια/gi, 'σκυλο-παιχνίδια'],
        [/γατο-νιαουρίσματα/gi, 'σκυλο-γαυγίσματα'],
        [/γατο-αγάπη/gi, 'σκυλο-αγάπη'],
        [/Γατίσιο & Παιχνιδιάρικο/g, 'Σκυλίσιο & Παιχνιδιάρικο'],
        [/Γατίσιο/g, 'Σκυλίσιο'],
        [/γατίσιο/g, 'σκυλίσιο'],
        [/Γατούλες μας/g, 'Σκύλοι μας'],
        [/Γατούλες/g, 'Σκυλάκια'],
        [/γατούλες/g, 'σκυλάκια'],
        [/Η Γατούλα μας: "Μάγκας"/g, 'Ο Σκύλος μας: "Φίλος"'],
        [/Η Γατούλα μας/g, 'Ο Σκύλος μας'],
        [/Γατούλα μας/g, 'Σκύλος μας'],
        [/Γατούλα σου/g, 'Σκύλο σου'],
        [/γατούλα σου/g, 'σκύλο σου'],
        [/Γατούλα/g, 'Σκύλος'],
        [/γατούλα/g, 'σκύλος'],
        [/γατούλας/g, 'σκύλου'],
        [/γατών/g, 'σκύλων'],
        [/Γάτες/g, 'Σκύλοι'],
        [/γάτες/g, 'σκύλοι'],
        [/Γάτα σου/g, 'Σκύλο σου'],
        [/γάτα σου/g, 'σκύλο σου'],
        [/Γάτα/g, 'Σκύλος'],
        [/γάτα/g, 'σκύλος'],
        [/γάτας/g, 'σκύλου'],
        [/Χάδεψε τη Μάγκα/g, 'Χάδεψε τον Φίλο'],
        [/Χάδεψες τη Μάγκα/g, 'Χάδεψες τον Φίλο'],
        [/στη Μάγκα/g, 'στον Φίλο'],
        [/με τη Μάγκα/g, 'με τον Φίλο'],
        [/Η Μάγκας/g, 'Ο Φίλος'],
        [/τη Μάγκας/g, 'τον Φίλο'],
        [/Μάγκας/g, 'Φίλος'],
        [/Μάγκα/g, 'Φίλο'],
        [/νιαούρισμα/gi, 'γαύγισμα'],
        [/νιαουρίσματα/gi, 'γαυγίσματα'],
        [/νιαουρίσματος/gi, 'γαυγίσματος'],
        [/Ψαράκι/gi, 'Κοκκαλάκι'],
        [/ψαράκι/gi, 'κοκκαλάκι'],
        [/Κουβάρι/gi, 'Μπαλάκι'],
        [/κουβάρι/gi, 'μπαλάκι'],
        [/🐱/g, '🐶'],
        [/🐈/g, '🐕'],
        [/🐟/g, '🦴'],
        [/🧶/g, '🎾']
    ];

    // Walk all text nodes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
        if (node.parentElement && (node.parentElement.tagName === 'SCRIPT' || node.parentElement.tagName === 'STYLE')) {
            continue;
        }
        let text = node.nodeValue;
        let modified = false;
        for (const [regex, replacement] of replacements) {
            if (regex.test(text)) {
                text = text.replace(regex, replacement);
                modified = true;
            }
        }
        if (modified) {
            node.nodeValue = text;
        }
    }

    // 3. Images: replace magkas avatars and logos with dog logo
    document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || '';
        if (src.includes('magkas_logo') || src.includes('magkas.jpg') || src.includes('magkas_avatar') || src.includes('magkas_')) {
            img.src = 'dog_logo.png';
            img.alt = 'Σκυλάκος 🐶';
        }
    });

    // 4. Update Placeholders and Input Labels
    document.querySelectorAll('input, textarea').forEach(input => {
        const ph = input.getAttribute('placeholder') || '';
        if (ph) {
            let newPh = ph;
            for (const [regex, replacement] of replacements) {
                newPh = newPh.replace(regex, replacement);
            }
            input.setAttribute('placeholder', newPh);
        }
    });

    // 5. Gender notice on index.html
    const noticeText = document.querySelector('.notice-text');
    if (noticeText) {
        noticeText.innerHTML = '<strong>Προσοχή!</strong> Ο Φίλος είναι ένας γλυκύτατος, παιχνιδιάρης και πιστός σκυλάκος 🐾';
    }

    // 6. Interactive toys on index.html
    const btnTreat = document.getElementById('btnTreat');
    if (btnTreat) btnTreat.innerHTML = '🦴 Δώσε Κοκκαλάκι';
    const btnYarn = document.getElementById('btnYarn');
    if (btnYarn) btnYarn.innerHTML = '🎾 Ρίξε Μπαλάκι';
}

// Run immediately and on DOM load events
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDogLocalization);
} else {
    applyDogLocalization();
}
window.addEventListener('load', applyDogLocalization);