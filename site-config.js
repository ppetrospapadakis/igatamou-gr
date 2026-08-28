/**
 * site-config.js
 * Central configuration & automatic dynamic localization for multi-site support.
 * Supports: igatamou.gr (Cats) & oskilosmou.gr (Dogs)
 */

// Prevent flash of igatamou content on oskilosmou.gr:
// Hide the body immediately (synchronously, before render) and reveal after localization runs.
// Also fix the tab title and favicon immediately to prevent flash of cat content.
(function() {
    const h = window.location.hostname.toLowerCase();
    const sp = (new URLSearchParams(window.location.search).get('site') || '').toLowerCase();
    const _isDog = h.includes('oskilosmou') || h.includes('osklilosmou') || sp === 'oskilosmou' || sp === 'dog' || sp === 'skilos';
    if (_isDog) {
        // 1. Hide body until localization is applied
        const s = document.createElement('style');
        s.id = '_fouc_guard';
        s.textContent = 'body { visibility: hidden !important; }';
        document.head.appendChild(s);

        // 2. Fix tab title immediately (synchronous — runs while <head> is still parsing)
        if (document.title) {
            document.title = document.title
                .replace(/igatamou\.gr/gi, 'oskilosmou.gr')
                .replace(/Γατο-/gi, 'Σκύλο-')
                .replace(/γατο-/gi, 'σκύλο-')
                .replace(/γατ(ούλ|ίσι|ών|ά|ες|α)\w*/gi, 'σκύλος')
                .replace(/Γατ(ούλ|ίσι|ών|ά|ες|α)\w*/gi, 'Σκύλος')
                .replace(/Γατ\w+/gi, 'Σκύλος')
                .replace(/γατ\w+/gi, 'σκύλος')
                .replace(/🐱/g, '🐶');
        }

        // 3. Fix favicon immediately
        const existingIcon = document.querySelector('link[rel*="icon"]');
        if (existingIcon) {
            existingIcon.href = 'dog_logo.png';
        } else {
            const icon = document.createElement('link');
            icon.rel = 'icon';
            icon.type = 'image/png';
            icon.href = 'dog_logo.png';
            document.head.appendChild(icon);
        }
    }
})();

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
            mascotPhoto: 'dog_mascot.jpg',
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
            mascotPhoto: 'magkas.jpg',
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
                --primary: #0284c7 !important;
                --primary-color: #0284c7 !important;
                --primary-hover: #0369a1 !important;
                --accent-color: #0ea5e9 !important;
                --bg-pink: #f0f9ff !important;
                --bg-cream: #f8fafc !important;
                --bg-gradient-start: #f0f9ff !important;
                --bg-gradient-end: #e0f2fe !important;
            }
            body {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%) !important;
            }
            .logo-text {
                color: #0284c7 !important;
            }
            .logo-text .highlight {
                color: #0369a1 !important;
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
            .btn-pet {
                background: linear-gradient(135deg, #0284c7, #0ea5e9) !important;
                box-shadow: 0 8px 20px rgba(2, 132, 199, 0.35) !important;
            }
            .btn-pet:hover {
                background: linear-gradient(135deg, #0369a1, #0284c7) !important;
            }
        `;
        document.head.appendChild(style);
    }
})();

// Comprehensive DOM Text & Attribute Replacer for oskilosmou.gr
function applyDogLocalization() {
    if (SITE_CONFIG.domain !== 'oskilosmou') return;

    // 1. Update Document Title
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

    // 2. Replacements Dictionary for Text Nodes (Longest / Most Specific First)
    const replacements = [
        // Exact Full Sentences & Headers
        [/Ανέβασε τη φωτογραφία της δικής σου γατούλας!/gi, 'Ανέβασε τη φωτογραφία του δικού σου σκύλου!'],
        [/Δείξε μας τη γατούλα σου, μάζεψε χάδια & δες όλες τις γατούλες της παρέας μας!/gi, 'Δείξε μας τον σκύλο σου, μάζεψε χάδια & δες όλους τους σκύλους της παρέας μας!'],
        [/Δες όλες τις γατούλες της παρέας μας & δώσε τους ένα γατο-χάδι!/gi, 'Δες όλους τους σκύλους της παρέας μας & δώσε τους ένα σκυλο-χάδι!'],
        [/Δες όλες τις υπέροχες ζωγραφιές που έφτιαξαν τα παιδιά & δώσε τους ένα γατο-χάδι!/gi, 'Δες όλες τις υπέροχες ζωγραφιές που έφτιαξαν τα παιδιά & δώσε τους ένα σκυλο-χάδι!'],
        [/Ζωγράφισε τη δική σου Γατούλα & Χρωμάτισε Έτοιμα Σχέδια!/gi, 'Ζωγράφισε τον δικό σου Σκύλο & Χρωμάτισε Έτοιμα Σχέδια!'],
        [/Στείλε τη στη Μάγκα για να μπει στο Άλμπουμ!/gi, 'Στείλε τη στον Φίλο για να μπει στο Άλμπουμ!'],
        [/Δες τις Γατο-Ζωγραφιές & Φτιάξε τη δική σου!/gi, 'Δες τις Σκύλο-Ζωγραφιές & Φτιάξε τη δική σου!'],
        [/Διάβασε & Γράψε τις δικές σου Γατο-Ιστορίες!/gi, 'Διάβασε & Γράψε τις δικές σου Σκύλο-Ιστορίες!'],
        [/Μπες στις Γατο-Ιστορίες & Γράψε τη δική σου!/gi, 'Μπες στις Σκύλο-Ιστορίες & Γράψε τη δική σου!'],
        [/Μπες στο Γατο-Άλμπουμ & Ανέβασε Φωτογραφία!/gi, 'Μπες στο Σκύλο-Άλμπουμ & Ανέβασε Φωτογραφία!'],
        [/Μάθε τι αρέσει στη Γάτα σου!/gi, 'Μάθε τι αρέσει στον Σκύλο σου!'],
        [/Μάθε τι αρέσει στη γάτα σου!/gi, 'Μάθε τι αρέσει στον σκύλο σου!'],
        [/Έλα να Παίξουμε & να Μάθουμε με τη Μάγκα!/gi, 'Έλα να Παίξουμε & να Μάθουμε με τον Φίλο!'],
        [/Γράψου στο Γατο-Newsletter & μάθαινε πρώτος\/η για νέα παιχνίδια & εκπλήξεις!/gi, 'Γράψου στο Σκυλο-Newsletter & μάθαινε πρώτος/η για νέα παιχνίδια & εκπλήξεις!'],
        [/Η Μάγκας είναι μια γλυκύτατη, ναζιάρα θηλυκή γατούλα/gi, 'Ο Φίλος είναι ένας γλυκύτατος, πιστός και παιχνιδιάρης σκυλάκος'],
        [/Η Μάγκας φέρνει τις ιστορίες\.\.\./gi, 'Ο Φίλος φέρνει τις ιστορίες...'],
        [/Γίνε ο πρώτος που θα γράψει μια ιστορία για τη γατούλα του!/gi, 'Γίνε ο πρώτος που θα γράψει μια ιστορία για τον σκύλο του!'],
        [/Δεν υπάρχουν ακόμα εγκεκριμένες ιστορίες\./gi, 'Δεν υπάρχουν ακόμα ιστορίες για σκύλους.'],
        [/Ανέβασε τη Φωτογραφία της Γατούλας σου!/gi, 'Ανέβασε τη Φωτογραφία του Σκύλου σου!'],
        [/Ανέβασε τη Γατούλα σου!/gi, 'Ανέβασε τον Σκύλο σου!'],
        [/Γατο-Άλμπουμ: Οι Γατούλες μας!/gi, 'Σκύλο-Άλμπουμ: Οι Σκύλοι μας!'],
        [/Άλμπουμ Ζωγραφιών: Οι Ζωγραφιές μας!/gi, 'Σκύλο-Ζωγραφιές: Οι Ζωγραφιές μας!'],
        [/Γατο-Ιστορίες: Το Βιβλίο των Ιστοριών μας!/gi, 'Σκύλο-Ιστορίες: Το Βιβλίο των Ιστοριών μας!'],
        [/Καλώς ήρθατε στο πιο Γατίσιο & Παιχνιδιάρικο Site!/gi, 'Καλώς ήρθατε στο πιο Σκυλίσιο & Παιχνιδιάρικο Site!'],
        [/Η Γατούλα μας: "Μάγκας"/gi, 'Ο Σκύλος μας: "Φίλος"'],
        [/Η Γατούλα μας: "Μάγκα"/gi, 'Ο Σκύλος μας: "Φίλος"'],
        [/Η Γατούλα μας/gi, 'Ο Σκύλος μας'],
        [/η Γατούλα μας/gi, 'ο Σκύλος μας'],
        [/η γατούλα μας/gi, 'ο σκύλος μας'],
        [/Οι Γατούλες μας/gi, 'Οι Σκύλοι μας'],
        [/οι γατούλες μας/gi, 'οι σκύλοι μας'],

        // Grammatical Prepositions & Articles
        [/της δικής σου γατούλας/gi, 'του δικού σου σκύλου'],
        [/τη δική σου γατούλα/gi, 'τον δικό σου σκύλο'],
        [/τη δική σου Γατούλα/gi, 'τον δικό σου Σκύλο'],
        [/τη γατούλα σου/gi, 'τον σκύλο σου'],
        [/τη Γατούλα σου/gi, 'τον Σκύλο σου'],
        [/τη γατούλα του/gi, 'τον σκύλο του'],
        [/τη Γατούλα του/gi, 'τον Σκύλο του'],
        [/της γατούλας σου/gi, 'του σκύλου σου'],
        [/της Γατούλας σου/gi, 'του Σκύλου σου'],
        [/της γατούλας του/gi, 'του σκύλου του'],
        [/της Γατούλας του/gi, 'του Σκύλου του'],
        [/της γατούλας/gi, 'του σκύλου'],
        [/της Γατούλας/gi, 'του Σκύλου'],
        [/τη γατούλα/gi, 'τον σκύλο'],
        [/τη Γατούλα/gi, 'τον Σκύλο'],
        [/τη γάτα σου/gi, 'τον σκύλο σου'],
        [/τη Γάτα σου/gi, 'τον Σκύλο σου'],
        [/τη γάτα του/gi, 'τον σκύλο του'],
        [/τη Γάτα του/gi, 'τον Σκύλο του'],
        [/τη γάτα/gi, 'τον σκύλο'],
        [/τη Γάτα/gi, 'τον Σκύλο'],
        [/στη γάτα σου/gi, 'στον σκύλο σου'],
        [/στη Γάτα σου/gi, 'στον Σκύλο σου'],
        [/στη γάτα του/gi, 'στον σκύλο του'],
        [/στη Γάτα του/gi, 'στον Σκύλο του'],
        [/στη γάτα/gi, 'στον σκύλο'],
        [/στη Γάτα/gi, 'στον Σκύλο'],
        [/στη γατούλα σου/gi, 'στον σκύλο σου'],
        [/στη Γατούλα σου/gi, 'στον Σκύλο σου'],
        [/στη γατούλα/gi, 'στον σκύλο'],
        [/στη Γατούλα/gi, 'στον Σκύλο'],
        [/για τη γάτα σου/gi, 'για τον σκύλο σου'],
        [/για τη Γάτα σου/gi, 'για τον Σκύλο σου'],
        [/για τη γατούλα σου/gi, 'για τον σκύλο σου'],
        [/για τη Γατούλα σου/gi, 'για τον Σκύλο σου'],
        [/για τη γάτα/gi, 'για τον σκύλο'],
        [/για τη Γάτα/gi, 'για τον Σκύλο'],
        [/για τη γατούλα/gi, 'για τον σκύλο'],
        [/για τη Γατούλα/gi, 'για τον Σκύλο'],
        [/για γάτες/gi, 'για σκύλους'],
        [/για Γάτες/gi, 'για Σκύλους'],
        [/όλες τις γατούλες της παρέας μας/gi, 'όλους τους σκύλους της παρέας μας'],
        [/όλες τις γατούλες/gi, 'όλους τους σκύλους'],
        [/όλες τις γάτες/gi, 'όλους τους σκύλους'],
        [/των γατών/gi, 'των σκύλων'],
        [/των γατούλων/gi, 'των σκύλων'],

        // Mascot Actions & Names
        [/Χάδεψε τη Μάγκα!/gi, 'Χάδεψε τον Φίλο!'],
        [/Χάδεψε τη Μάγκα/gi, 'Χάδεψε τον Φίλο'],
        [/Χάδεψες τη Μάγκα/gi, 'Χάδεψες τον Φίλο'],
        [/στη Μάγκα!/gi, 'στον Φίλο!'],
        [/στη Μάγκα/gi, 'στον Φίλο'],
        [/με τη Μάγκα!/gi, 'με τον Φίλο!'],
        [/με τη Μάγκα/gi, 'με τον Φίλο'],
        [/για τη Μάγκα/gi, 'για τον Φίλο'],
        [/από τη Μάγκα/gi, 'από τον Φίλο'],
        [/τη Μάγκα/gi, 'τον Φίλο'],
        [/Η Μάγκας/gi, 'Ο Φίλος'],
        [/η Μάγκας/gi, 'ο Φίλος'],
        [/Μάγκας/gi, 'Φίλος'],
        [/Μάγκα/gi, 'Φίλο'],

        // Site Names, Categories & Compounds
        [/igatamou\.gr/gi, 'oskilosmou.gr'],
        [/igatamou/gi, 'oskilosmou'],
        [/Γατο-Άλμπουμ/gi, 'Σκύλο-Άλμπουμ'],
        [/Γατο-Ζωγραφιές/gi, 'Σκύλο-Ζωγραφιές'],
        [/Γατο-Ιστορίες/gi, 'Σκύλο-Ιστορίες'],
        [/Γατο-Ιστορία/gi, 'Σκύλο-Ιστορία'],
        [/Γατο-Συμβουλές/gi, 'Σκύλο-Συμβουλές'],
        [/Γατο-Παιχνίδια/gi, 'Σκύλο-Παιχνίδια'],
        [/Γατο-Σχολείο/gi, 'Σκυλο-Σχολείο'],
        [/Γατο-Newsletter/gi, 'Σκυλο-Newsletter'],
        [/γατο-χάδια/gi, 'σκυλο-χάδια'],
        [/Γατο-Χάδια/gi, 'Σκυλο-Χάδια'],
        [/γατο-χάδι/gi, 'σκυλο-χάδι'],
        [/Γατο-Χάδι/gi, 'Σκυλο-Χάδι'],
        [/γατο-παιχνίδια/gi, 'σκυλο-παιχνίδια'],
        [/γατο-νιαουρίσματα/gi, 'σκυλο-γαυγίσματα'],
        [/γατο-αγάπη/gi, 'σκυλο-αγάπη'],
        [/Γατίσιο & Παιχνιδιάρικο/gi, 'Σκυλίσιο & Παιχνιδιάρικο'],
        [/Γατίσιο/gi, 'Σκυλίσιο'],
        [/γατίσιο/gi, 'σκυλίσιο'],
        [/νιαουρίσματα/gi, 'γαυγίσματα'],
        [/νιαούρισμα/gi, 'γαύγισμα'],
        [/νιαουρίσματος/gi, 'γαυγίσματος'],
        [/Ψαράκι/gi, 'Κοκκαλάκι'],
        [/ψαράκι/gi, 'κοκκαλάκι'],
        [/Κουβάρι/gi, 'Μπαλάκι'],
        [/κουβάρι/gi, 'μπαλάκι'],

        // General nouns with Greek word boundaries
        [/(^|\s)γατούλες(\s|[.,!?;]|$)/gi, '$1σκύλοι$2'],
        [/(^|\s)Γατούλες(\s|[.,!?;]|$)/gi, '$1Σκύλοι$2'],
        [/(^|\s)γατούλα(\s|[.,!?;]|$)/gi, '$1σκύλος$2'],
        [/(^|\s)Γατούλα(\s|[.,!?;]|$)/gi, '$1Σκύλος$2'],
        [/(^|\s)γατούλας(\s|[.,!?;]|$)/gi, '$1σκύλου$2'],
        [/(^|\s)Γατούλας(\s|[.,!?;]|$)/gi, '$1Σκύλου$2'],
        [/(^|\s)γάτες(\s|[.,!?;]|$)/gi, '$1σκύλοι$2'],
        [/(^|\s)Γάτες(\s|[.,!?;]|$)/gi, '$1Σκύλοι$2'],
        [/(^|\s)γάτας(\s|[.,!?;]|$)/gi, '$1σκύλου$2'],
        [/(^|\s)Γάτας(\s|[.,!?;]|$)/gi, '$1Σκύλου$2'],
        [/(^|\s)γάτα(\s|[.,!?;]|$)/gi, '$1σκύλος$2'],
        [/(^|\s)Γάτα(\s|[.,!?;]|$)/gi, '$1Σκύλος$2'],
        [/(^|\s)γατών(\s|[.,!?;]|$)/gi, '$1σκύλων$2'],
        [/(^|\s)Γατών(\s|[.,!?;]|$)/gi, '$1Σκύλων$2'],

        // Emojis
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

    // 3. Images: replace magkas avatars and logos with dog logo / photo
    document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || '';
        if (src.includes('magkas_logo') || src.includes('magkas_avatar')) {
            img.src = 'dog_logo.png';
            img.alt = 'Σκυλάκος 🐶';
        } else if (src.includes('magkas.jpg') || src.includes('magkas_')) {
            img.src = 'dog_mascot.jpg';
            img.alt = 'Ο σκύλος Φίλος 🐶';
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
        noticeText.innerHTML = '<strong>Προσοχή!</strong> Ο Φίλος είναι ένας γλυκύτατος, πιστός και παιχνιδιάρης σκυλάκος 🐾';
    }

    // 6. Interactive toys on index.html
    const btnTreat = document.getElementById('btnTreat');
    if (btnTreat) btnTreat.innerHTML = '🦴 Δώσε Κοκκαλάκι';
    const btnYarn = document.getElementById('btnYarn');
    if (btnYarn) btnYarn.innerHTML = '🎾 Ρίξε Μπαλάκι';

    // Remove the FOUC guard — reveal the page now that dog content is applied
    const guard = document.getElementById('_fouc_guard');
    if (guard) guard.remove();
}

// Run immediately and on DOM load events
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDogLocalization);
} else {
    applyDogLocalization();
}
// Fallback: ensure guard is removed even if applyDogLocalization didn't run (non-dog sites)
window.addEventListener('load', function() {
    applyDogLocalization();
    const guard = document.getElementById('_fouc_guard');
    if (guard) guard.remove();
});