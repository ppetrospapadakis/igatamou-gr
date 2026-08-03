document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. GAME DATA & QUESTION DATABASE (~100 QUESTIONS, SHUFFLED OPTIONS)
    // ----------------------------------------------------
    const gameDatabase = {
        math: {
            easy: [
                { q: "Πόσο κάνει 2 + 2;", opts: ["4", "3", "5", "6"], a: "4", helper: "✌️ + ✌️ = 🖐️" },
                { q: "Πόσο κάνει 5 + 5;", opts: ["10", "8", "12", "15"], a: "10", helper: "🖐️ + 🖐️ = 🖐️🖐️" },
                { q: "Πόσο κάνει 10 - 4;", opts: ["6", "5", "7", "4"], a: "6" },
                { q: "Πόσο κάνει 3 + 4;", opts: ["7", "6", "8", "5"], a: "7" },
                { q: "Πόσο κάνει 6 + 4;", opts: ["10", "9", "11", "8"], a: "10" },
                { q: "Πόσο κάνει 8 - 3;", opts: ["5", "4", "6", "3"], a: "5" },
                { q: "Πόσο κάνει 1 + 9;", opts: ["10", "9", "11", "8"], a: "10" },
                { q: "Πόσο κάνει 4 + 4;", opts: ["8", "7", "9", "6"], a: "8" }
            ],
            medium: [
                { q: "Πόσο κάνει 12 + 8;", opts: ["20", "18", "22", "15"], a: "20", helper: "🔟 + 🔟" },
                { q: "Πόσο κάνει 30 - 10;", opts: ["20", "15", "25", "10"], a: "20" },
                { q: "Πόσο κάνει 5 × 5;", opts: ["25", "20", "30", "15"], a: "25" },
                { q: "Πόσο κάνει 20 ÷ 4;", opts: ["5", "4", "6", "10"], a: "5" },
                { q: "Πόσο κάνει 15 + 15;", opts: ["30", "25", "35", "40"], a: "30" },
                { q: "Πόσο κάνει 40 - 15;", opts: ["25", "20", "30", "35"], a: "25" },
                { q: "Πόσο κάνει 6 × 4;", opts: ["24", "20", "28", "18"], a: "24" },
                { q: "Πόσο κάνει 18 ÷ 2;", opts: ["9", "8", "10", "7"], a: "9" }
            ],
            hard: [
                { q: "Πόσο κάνει 7 × 6;", opts: ["42", "40", "36", "48"], a: "42" },
                { q: "Πόσο κάνει 100 - 35;", opts: ["65", "55", "75", "70"], a: "65" },
                { q: "Πόσο κάνει 8 × 4;", opts: ["32", "30", "28", "36"], a: "32" },
                { q: "Πόσο κάνει 50 + 50;", opts: ["100", "90", "80", "110"], a: "100" },
                { q: "Πόσο κάνει 81 ÷ 9;", opts: ["9", "8", "7", "10"], a: "9" },
                { q: "Πόσο κάνει 12 × 3;", opts: ["36", "32", "40", "30"], a: "36" },
                { q: "Πόσο κάνει 75 - 25;", opts: ["50", "45", "55", "60"], a: "50" },
                { q: "Πόσο κάνει 9 × 7;", opts: ["63", "56", "72", "64"], a: "63" }
            ]
        },
        spelling: {
            easy: [
                { q: "Συμπλήρωσε το σωστό: Το μήλ...", opts: ["ο", "ω"], a: "ο", helper: "Το ουδέτερο λήγει σε -ο" },
                { q: "Συμπλήρωσε το σωστό: Η αυλ...", opts: ["ή", "ί"], a: "ή" },
                { q: "Συμπλήρωσε το σωστό: Το δέντρ...", opts: ["ο", "ω"], a: "ο" },
                { q: "Συμπλήρωσε το σωστό: Το παιδ...", opts: ["ί", "ύ"], a: "ί" },
                { q: "Συμπλήρωσε το σωστό: Η μητέρ...", opts: ["α", "αα"], a: "α" },
                { q: "Συμπλήρωσε το σωστό: Το ψάρ...", opts: ["ι", "υ"], a: "ι" }
            ],
            medium: [
                { q: "Συμπλήρωσε το σωστό: Εγώ τρέχ...", opts: ["ω", "ο"], a: "ω", helper: "Το ρήμα εγώ λήγει σε -ω" },
                { q: "Συμπλήρωσε το σωστό: Οι γάτ...", opts: ["ες", "ις"], a: "ες" },
                { q: "Συμπλήρωσε το σωστό: Το σπ...τι", opts: ["ί", "ύ"], a: "ί" },
                { q: "Συμπλήρωσε το σωστό: Εγώ παίζ...", opts: ["ω", "ο"], a: "ω" },
                { q: "Συμπλήρωσε το σωστό: Το βιβλ...", opts: ["ίο", "ύο"], a: "ίο" },
                { q: "Συμπλήρωσε το σωστό: Η άνοιξ...", opts: ["η", "ι"], a: "η" }
            ],
            hard: [
                { q: "Συμπλήρωσε το σωστό: Εμείς παίζουμ...", opts: ["ε", "αι"], a: "ε" },
                { q: "Συμπλήρωσε το σωστό: Εγώ διαβάζ...", opts: ["ω", "ο"], a: "ω" },
                { q: "Συμπλήρωσε το σωστό: Ο άνθρωπ...", opts: ["ος", "ως"], a: "ος" },
                { q: "Συμπλήρωσε το σωστό: Η θάλασσ...", opts: ["α", "αα"], a: "α" },
                { q: "Συμπλήρωσε το σωστό: Το σχολ...", opts: ["είο", "ίο"], a: "είο" },
                { q: "Συμπλήρωσε το σωστό: Η γειτον...", opts: ["ιά", "ειά"], a: "ιά" }
            ]
        },
        english: {
            easy: [
                { q: "Τι σημαίνει η αγγλική λέξη: Cat;", opts: ["Γάτα", "Σκύλος", "Ψάρι", "Πουλί"], a: "Γάτα" },
                { q: "Τι σημαίνει: Dog;", opts: ["Σκύλος", "Γάτα", "Ψάρι", "Ποντίκι"], a: "Σκύλος" },
                { q: "Τι σημαίνει: Fish;", opts: ["Ψάρι", "Γάτα", "Πουλί", "Σκύλος"], a: "Ψάρι" },
                { q: "Τι σημαίνει: Hello!", opts: ["Γεια σου!", "Αντίο!", "Καληνύχτα", "Ευχαριστώ"], a: "Γεια σου!" },
                { q: "Πώς λέγεται το Κόκκινο στα Αγγλικά;", opts: ["Red", "Blue", "Green", "Yellow"], a: "Red" },
                { q: "Τι σημαίνει: Milk;", opts: ["Γάλα", "Νερό", "Χυμός", "Τσάι"], a: "Γάλα" }
            ],
            medium: [
                { q: "Τι σημαίνει: I love cats!", opts: ["Αγαπώ τις γάτες!", "Έχω μια γάτα", "Η γάτα κοιμάται", "Γάτες και σκύλοι"], a: "Αγαπώ τις γάτες!" },
                { q: "Πώς λέγεται το Πράσινο στα Αγγλικά;", opts: ["Green", "Blue", "Red", "Yellow"], a: "Green" },
                { q: "Πώς λέγεται το Σχολείο στα Αγγλικά;", opts: ["School", "House", "Park", "Book"], a: "School" },
                { q: "Τι σημαίνει: Water;", opts: ["Νερό", "Γάλα", "Χυμός", "Φαγητό"], a: "Νερό" },
                { q: "Τι σημαίνει: Bird;", opts: ["Πουλί", "Ψάρι", "Γάτα", "Σκύλος"], a: "Πουλί" },
                { q: "Τι σημαίνει: Book;", opts: ["Βιβλίο", "Τετράδιο", "Μολύβι", "Τσάντα"], a: "Βιβλίο" }
            ],
            hard: [
                { q: "Τι σημαίνει: Sun;", opts: ["Ήλιος", "Φεγγάρι", "Αστέρι", "Σύννεφο"], a: "Ήλιος" },
                { q: "Τι σημαίνει: Butterfly;", opts: ["Πεταλούδα", "Μέλισσα", "Πουλί", "Αράχνη"], a: "Πεταλούδα" },
                { q: "Τι σημαίνει: Rainbow;", opts: ["Ουράνιο Τόξο", "Βροχή", "Ήλιος", "Σύννεφο"], a: "Ουράνιο Τόξο" },
                { q: "Τι σημαίνει: Moon;", opts: ["Φεγγάρι", "Ήλιος", "Αστέρι", "Ουρανός"], a: "Φεγγάρι" },
                { q: "Τι σημαίνει: Friend;", opts: ["Φίλος", "Αδερφός", "Μαθητής", "Δάσκαλος"], a: "Φίλος" },
                { q: "Τι σημαίνει: Summer;", opts: ["Καλοκαίρι", "Χειμώνας", "Άνοιξη", "Φθινόπωρο"], a: "Καλοκαίρι" }
            ]
        },
        riddles: {
            easy: [
                { q: "Έχει 4 πόδια, μουστακάκια και κάνει νιάου! Τι είναι;", opts: ["Γάτα 🐱", "Σκύλος 🐶", "Ελέφαντας 🐘", "Λιοντάρι 🦁"], a: "Γάτα 🐱" },
                { q: "Είμαι κόκκινο, γλυκό και έχω σποράκια απ' έξω! Τι είμαι;", opts: ["Φράουλα 🍓", "Μήλο 🍎", "Πορτοκάλι 🍊", "Μπανάνες 🍌"], a: "Φράουλα 🍓" }
            ],
            medium: [
                { q: "Έχω δείκτες αλλά δεν έχω χέρια, μετράω την ώρα. Τι είμαι;", opts: ["Ρολόι ⏰", "Παιχνίδι 🧸", "Καρέκλα 🪑", "Βιβλίο 📖"], a: "Ρολόι ⏰" },
                { q: "Όταν βρέχει βγαίνω έξω για να σε προστατέψω από το νερό! Τι είμαι;", opts: ["Ομπρέλα ☂️", "Καπέλο 🧢", "Ζακέτα 🧥", "Παπούτσι 👟"], a: "Ομπρέλα ☂️" }
            ],
            hard: [
                { q: "Ποιο πράγμα γίνεται πιο μεγάλο όσο του αφαιρείς;", opts: ["Τρύπα 🕳️", "Βουνό ⛰️", "Μπαλόνι 🎈", "Ποτάμι 🌊"], a: "Τρύπα 🕳️" },
                { q: "Έχει κλειδιά αλλά δεν ανοίγει καμία πόρτα, βγάζει όμως μουσική! Τι είναι;", opts: ["Πιάνο 🎹", "Κλειδαριά 🔐", "Κουτί 📦", "Βιβλίο 📖"], a: "Πιάνο 🎹" }
            ]
        },
        nature: {
            easy: [
                { q: "Πού ζουν τα ψάρια;", opts: ["Στο νερό 🌊", "Στα δέντρα 🌳", "Στον αέρα ☁️", "Στην άμμο 🏜️"], a: "Στο νερό 🌊" },
                { q: "Ποια τροφή είναι η πιο υγιεινή για τα παιδιά;", opts: ["Φρούτα & Λαχανικά 🍎", "Καραμέλες 🍬", "Πατατάκια 🍟", "Αναψυκτικά 🥤"], a: "Φρούτα & Λαχανικά 🍎" }
            ],
            medium: [
                { q: "Ποιο από τα παρακάτω ζώα είναι ΘΗΛΑΣΤΙΚΟ;", opts: ["Δελφίνι 🐬", "Χελώνα 🐢", "Αετός 🦅", "Βάτραχος 🐸"], a: "Δελφίνι 🐬" },
                { q: "Πώς λέγεται η διαδικασία που τα φυτά φτιάχνουν τροφή με τον Ήλιο;", opts: ["Φωτοσύνθεση 🌿", "Αναπνοή 💨", "Πότισμα 💧", "Βλάστηση 🌱"], a: "Φωτοσύνθεση 🌿" }
            ],
            hard: [
                { q: "Τι χρειάζονται τα φυτά για να μεγαλώσουν;", opts: ["Ήλιο & Νερό ☀️💧", "Σοκολάτα 🍫", "Παιχνίδια 🧸", "Γάλα 🥛"], a: "Ήλιο & Νερό ☀️💧" },
                { q: "Ποιος είναι ο μεγαλύτερος ωκεανός της Γης;", opts: ["Ειρηνικός Ωκεανός 🌊", "Ατλαντικός 🌊", "Ινδικός 🌊", "Αρκτικός ❄️"], a: "Ειρηνικός Ωκεανός 🌊" }
            ]
        },
        geography: {
            easy: [
                { q: "Σε ποια Ήπειρο ανήκει η Ελλάδα;", opts: ["Ευρώπη 🇪🇺", "Ασία 🌏", "Αφρική 🌍", "Αμερική 🌎"], a: "Ευρώπη 🇪🇺" },
                { q: "Ποια είναι η πρωτεύουσα της Ελλάδας;", opts: ["Αθήνα 🏛️", "Θεσσαλονίκη 🏰", "Πάτρα 🚢", "Ηράκλειο 🏝️"], a: "Αθήνα 🏛️" }
            ],
            medium: [
                { q: "Ποιο είναι το μεγαλύτερο Νησί της Ελλάδας;", opts: ["Κρήτη 🏝️", "Ρόδος 🏖️", "Κέρκυρα 🏰", "Νάξος ⛵"], a: "Κρήτη 🏝️" },
                { q: "Ποιο είναι το ψηλότερο βουνό της Ελλάδας;", opts: ["Όλυμπος ⛰️", "Πάρνηθα 🌲", "Ταΰγετος 🏔️", "Πίνδος ⛰️"], a: "Όλυμπος ⛰️" }
            ],
            hard: [
                { q: "Ποια από τις παρακάτω πόλεις βρίσκεται σε ΝΗΣΙ;", opts: ["Ερμούπολη (Σύρος) 🏝️", "Λάρισα 🌾", "Τρίπολη ⛰️", "Ιωάννινα 🏞️"], a: "Ερμούπολη (Σύρος) 🏝️" },
                { q: "Σε ποια Ήπειρο βρίσκεται η Αίγυπτος;", opts: ["Αφρική 🌍", "Ευρώπη 🇪🇺", "Ασία 🌏", "Αυστραλία 🇦🇺"], a: "Αφρική 🌍" }
            ]
        }
    };

    const memoryEmojis = {
        easy: ['🐱', '😸', '😻', '🐾'],
        medium: ['🐱', '😸', '😻', '😽', '🐾', '🧶'],
        hard: ['🐱', '😸', '😻', '😽', '🐾', '🧶', '🐟', '🎀']
    };

    // ----------------------------------------------------
    // 2. STATE MANAGEMENT
    // ----------------------------------------------------
    let currentCategory = null;
    let currentDifficulty = 'easy'; // 'easy', 'medium', 'hard'
    let currentQuestions = [];
    let currentQIndex = 0;
    let score = parseInt(localStorage.getItem('igatamou_game_score') || '0', 10);
    let streak = 0;
    let memoryFlippedCards = [];
    let memoryMatchedPairs = 0;

    // DOM Elements
    const categoryMenu = document.getElementById('categoryMenu');
    const gameArena = document.getElementById('gameArena');
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    const arenaCategoryTitle = document.getElementById('arenaCategoryTitle');
    const questionCard = document.getElementById('questionCard');
    const questionNumber = document.getElementById('questionNumber');
    const questionText = document.getElementById('questionText');
    const visualHelper = document.getElementById('visualHelper');
    const optionsGrid = document.getElementById('optionsGrid');
    const memoryBoard = document.getElementById('memoryBoard');
    const companionCatFrame = document.getElementById('companionCatFrame');
    const companionCatImg = document.getElementById('companionCatImg');
    const catSpeechBubble = document.getElementById('catSpeechBubble');
    const mascotCrown = document.getElementById('mascotCrown');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const streakCount = document.getElementById('streakCount');
    const trophyBtn = document.getElementById('trophyBtn');
    const trophyBadgeName = document.getElementById('trophyBadgeName');
    const trophyModal = document.getElementById('trophyModal');
    const closeTrophyBtn = document.getElementById('closeTrophyBtn');
    const difficultyBar = document.getElementById('difficultyBar');

    // Arcade Game Elements
    const tictactoeArena = document.getElementById('tictactoeArena');
    const tttGrid = document.getElementById('tttGrid');
    const tttStatusText = document.getElementById('tttStatusText');
    const tttResetBtn = document.getElementById('tttResetBtn');

    const snakeArena = document.getElementById('snakeArena');
    const snakeCanvas = document.getElementById('snakeCanvas');
    const snakeScore = document.getElementById('snakeScore');
    const snakeStartBtn = document.getElementById('snakeStartBtn');
    const dpadUp = document.getElementById('dpadUp');
    const dpadLeft = document.getElementById('dpadLeft');
    const dpadDown = document.getElementById('dpadDown');
    const dpadRight = document.getElementById('dpadRight');

    const tetrisArena = document.getElementById('tetrisArena');
    const tetrisCanvas = document.getElementById('tetrisCanvas');
    const tetrisLines = document.getElementById('tetrisLines');
    const tetrisStartBtn = document.getElementById('tetrisStartBtn');
    const tetrisLeft = document.getElementById('tetrisLeft');
    const tetrisRotate = document.getElementById('tetrisRotate');
    const tetrisRight = document.getElementById('tetrisRight');
    const tetrisDown = document.getElementById('tetrisDown');

    const whackArena = document.getElementById('whackArena');
    const whackGrid = document.getElementById('whackGrid');
    const whackScore = document.getElementById('whackScore');
    const whackStartBtn = document.getElementById('whackStartBtn');

    const bubblesArena = document.getElementById('bubblesArena');
    const bubblesBox = document.getElementById('bubblesBox');
    const bubblesScore = document.getElementById('bubblesScore');
    const bubblesStartBtn = document.getElementById('bubblesStartBtn');

    const chessArena = document.getElementById('chessArena');
    const chessBoard = document.getElementById('chessBoard');
    const chessStatusText = document.getElementById('chessStatusText');
    const chessResetBtn = document.getElementById('chessResetBtn');

    const solitaireArena = document.getElementById('solitaireArena');
    const solitaireBoard = document.getElementById('solitaireBoard');
    const solitaireStatusText = document.getElementById('solitaireStatusText');
    const solitaireResetBtn = document.getElementById('solitaireResetBtn');

    if (trophyModal) trophyModal.hidden = true;
    updateScoreUI();

    // ----------------------------------------------------
    // 3. DIFFICULTY & EVENT LISTENERS
    // ----------------------------------------------------
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.getAttribute('data-category');
            startCategoryGame(cat);
        });
    });

    if (backToMenuBtn) backToMenuBtn.addEventListener('click', showCategoryMenu);
    if (trophyBtn) trophyBtn.addEventListener('click', () => { if (trophyModal) trophyModal.hidden = false; });
    if (closeTrophyBtn) closeTrophyBtn.addEventListener('click', () => { if (trophyModal) trophyModal.hidden = true; });

    // Difficulty Bar Buttons
    if (difficultyBar) {
        difficultyBar.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyBar.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentDifficulty = btn.getAttribute('data-diff') || 'easy';
                if (currentCategory) {
                    startCategoryGame(currentCategory);
                }
            });
        });
    }

    // ----------------------------------------------------
    // 4. GAME ENGINE LOGIC
    // ----------------------------------------------------
    function updateScoreUI() {
        if (scoreDisplay) scoreDisplay.textContent = score;
        if (streakCount) streakCount.textContent = streak;

        const t1 = document.getElementById('trophy1');
        const t2 = document.getElementById('trophy2');
        const t3 = document.getElementById('trophy3');
        const statusT1 = document.getElementById('statusT1');
        const statusT2 = document.getElementById('statusT2');
        const statusT3 = document.getElementById('statusT3');

        if (score >= 50 && t1) {
            t1.classList.add('unlocked');
            if (statusT1) statusT1.textContent = 'Ξεκλειδώθηκε! ✅';
            if (trophyBadgeName) trophyBadgeName.textContent = '🥉 Μικρός Γατο-Εξερευνητής';
        }
        if (score >= 100 && t2) {
            t2.classList.add('unlocked');
            if (statusT2) statusT2.textContent = 'Ξεκλειδώθηκε! ✅';
            if (trophyBadgeName) trophyBadgeName.textContent = '🥈 Γατο-Σοφός';
        }
        if (score >= 200 && t3) {
            t3.classList.add('unlocked');
            if (statusT3) statusT3.textContent = 'Ξεκλειδώθηκε! 👑';
            if (trophyBadgeName) trophyBadgeName.textContent = '🥇 Master Γατο-Επιστήμονας!';
            if (mascotCrown) mascotCrown.hidden = false;
        }
    }

    function clearArenaContainers() {
        if (questionCard) questionCard.hidden = true;
        if (optionsGrid) { optionsGrid.innerHTML = ''; optionsGrid.hidden = true; }
        if (memoryBoard) { memoryBoard.innerHTML = ''; memoryBoard.hidden = true; }
        if (tictactoeArena) tictactoeArena.hidden = true;
        if (snakeArena) snakeArena.hidden = true;
        if (tetrisArena) tetrisArena.hidden = true;
        if (whackArena) whackArena.hidden = true;
        if (bubblesArena) bubblesArena.hidden = true;
        if (chessArena) chessArena.hidden = true;
        if (solitaireArena) solitaireArena.hidden = true;

        stopSnakeGame();
        stopTetrisGame();
        stopWhackGame();
        stopBubblesGame();

        memoryFlippedCards = [];
        memoryMatchedPairs = 0;
    }

    function showCategoryMenu() {
        if (gameArena) gameArena.hidden = true;
        if (categoryMenu) categoryMenu.hidden = false;
        currentCategory = null;
        clearArenaContainers();
    }

    function startCategoryGame(categoryKey) {
        currentCategory = categoryKey;
        if (categoryMenu) categoryMenu.hidden = true;
        if (gameArena) gameArena.hidden = false;

        clearArenaContainers();

        const catTitles = {
            math: "🧮 Μαθηματικά",
            spelling: "✏️ Ορθογραφία",
            english: "🇬🇧 Αγγλικά (English Cats)",
            riddles: "💡 Γρίφοι & Σκέψη",
            nature: "🌿 Γνώσεις & Φύση",
            geography: "🗺️ Γεωγραφία",
            memory: "🧩 Γατο-Memory",
            tictactoe: "❌⭕ Γατο-Τρίλιζα",
            snake: "🐍🐾 Γατο-Φιδάκι",
            tetris: "🧩🧱 Γατο-Τέτρις",
            whack: "🔨🐟 Πιάσε το Ψαράκι!",
            bubbles: "🎈🐾 Γατο-Μπαλόνια",
            chess: "👑♟️ Μίνι Γατο-Σκάκι",
            solitaire: "🂠🐱 Γατο-Πασιέντζα"
        };
        if (arenaCategoryTitle) arenaCategoryTitle.textContent = catTitles[categoryKey] || "Παιχνίδι";

        if (categoryKey === 'memory') {
            if (questionCard) questionCard.hidden = false;
            setupMemoryGame();
        } else if (categoryKey === 'tictactoe') {
            if (tictactoeArena) tictactoeArena.hidden = false;
            setupTicTacToeGame();
        } else if (categoryKey === 'snake') {
            if (snakeArena) snakeArena.hidden = false;
            setupSnakeGame();
        } else if (categoryKey === 'tetris') {
            if (tetrisArena) tetrisArena.hidden = false;
            setupTetrisGame();
        } else if (categoryKey === 'whack') {
            if (whackArena) whackArena.hidden = false;
            setupWhackGame();
        } else if (categoryKey === 'bubbles') {
            if (bubblesArena) bubblesArena.hidden = false;
            setupBubblesGame();
        } else if (categoryKey === 'chess') {
            if (chessArena) chessArena.hidden = false;
            setupChessGame();
        } else if (categoryKey === 'solitaire') {
            if (solitaireArena) solitaireArena.hidden = false;
            setupSolitaireGame();
        } else {
            if (questionCard) questionCard.hidden = false;
            if (optionsGrid) optionsGrid.hidden = false;
            if (memoryBoard) memoryBoard.hidden = true;

            const pool = gameDatabase[categoryKey] ? (gameDatabase[categoryKey][currentDifficulty] || gameDatabase[categoryKey].easy) : [];
            currentQuestions = [...pool];
            currentQuestions.sort(() => Math.random() - 0.5); // Shuffle questions
            currentQIndex = 0;
            renderCurrentQuestion();
        }
    }

    // ----------------------------------------------------
    // MULTIPLE CHOICE QUIZ GAMES (WITH SHUFFLED OPTIONS!)
    // ----------------------------------------------------
    function renderCurrentQuestion() {
        if (!currentQuestions || currentQIndex >= currentQuestions.length) {
            showCategoryCompleted();
            return;
        }

        const q = currentQuestions[currentQIndex];
        if (questionNumber) questionNumber.textContent = `Ερώτηση ${currentQIndex + 1} από ${currentQuestions.length}`;
        if (questionText) questionText.textContent = q.q;
        if (visualHelper) visualHelper.textContent = q.helper || '';

        if (optionsGrid) {
            optionsGrid.innerHTML = '';
            // Randomize/Shuffle Options order for every question!
            const shuffledOpts = [...q.opts].sort(() => Math.random() - 0.5);
            shuffledOpts.forEach(optText => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option-btn';
                btn.textContent = optText;
                btn.addEventListener('click', () => checkQuizAnswer(optText, q.a, btn));
                optionsGrid.appendChild(btn);
            });
        }

        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Διάλεξε τη σωστή απάντηση! 🐾"`;
    }

    function checkQuizAnswer(selected, correct, btnEl) {
        document.querySelectorAll('.quiz-option-btn').forEach(b => b.disabled = true);

        if (selected === correct) {
            btnEl.classList.add('correct');
            score += 10;
            streak++;
            localStorage.setItem('igatamou_game_score', score.toString());
            updateScoreUI();
            playCatSoundEffect('correct');
            triggerCorrectAnswerReaction();

            setTimeout(() => {
                currentQIndex++;
                renderCurrentQuestion();
            }, 1200);
        } else {
            btnEl.classList.add('wrong');
            streak = 0;
            updateScoreUI();
            playCatSoundEffect('wrong');
            triggerWrongAnswerReaction();

            document.querySelectorAll('.quiz-option-btn').forEach(b => {
                if (b.textContent === correct) b.classList.add('correct');
            });

            setTimeout(() => {
                currentQIndex++;
                renderCurrentQuestion();
            }, 1800);
        }
    }

    function showCategoryCompleted() {
        if (questionNumber) questionNumber.textContent = '🎉 Μπράβο!';
        if (questionText) questionText.textContent = 'Ολοκλήρωσες όλες τις ερωτήσεις αυτής της κατηγορίας!';
        if (visualHelper) visualHelper.textContent = '✨ Κέρδισες επιπλέον +20 Γατο-Πόντους!';
        if (optionsGrid) optionsGrid.innerHTML = '';

        score += 20;
        localStorage.setItem('igatamou_game_score', score.toString());
        updateScoreUI();

        const replayBtn = document.createElement('button');
        replayBtn.className = 'btn btn-games-cta';
        replayBtn.textContent = '🔄 Παίξε Ξανά!';
        replayBtn.addEventListener('click', () => startCategoryGame(currentCategory));

        const menuBtn = document.createElement('button');
        menuBtn.className = 'btn btn-back-menu';
        menuBtn.style.marginTop = '10px';
        menuBtn.textContent = '📜 Επιστροφή στο Μενού';
        menuBtn.addEventListener('click', showCategoryMenu);

        if (optionsGrid) {
            optionsGrid.appendChild(replayBtn);
            optionsGrid.appendChild(menuBtn);
        }

        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Είμαι περήφανη για σένα! 🥳✨"`;
    }

    // ----------------------------------------------------
    // MEMORY GAME LOGIC (EASY / MEDIUM / HARD)
    // ----------------------------------------------------
    function setupMemoryGame() {
        if (questionNumber) questionNumber.textContent = `Γατο-Memory (${currentDifficulty.toUpperCase()})`;
        if (questionText) questionText.textContent = 'Βρες τα ζευγάρια με τις γατούλες!';
        if (visualHelper) visualHelper.textContent = '💡 Κάνε κλικ στις κάρτες για να τις γυρίσεις!';

        if (optionsGrid) optionsGrid.hidden = true;
        if (memoryBoard) memoryBoard.hidden = false;
        memoryBoard.innerHTML = '';

        const emojiPool = memoryEmojis[currentDifficulty] || memoryEmojis.easy;
        const cardDeck = [...emojiPool, ...emojiPool];
        cardDeck.sort(() => Math.random() - 0.5);

        memoryFlippedCards = [];
        memoryMatchedPairs = 0;

        cardDeck.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card-tile';
            card.dataset.emoji = emoji;

            card.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-front"><span class="memory-paw">🐾</span></div>
                    <div class="memory-card-back"><span class="memory-emoji">${emoji}</span></div>
                </div>
            `;

            card.addEventListener('click', () => handleMemoryCardClick(card, emoji, emojiPool.length));
            memoryBoard.appendChild(card);
        });
    }

    function handleMemoryCardClick(card, emoji, totalPairs) {
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (memoryFlippedCards.length >= 2) return;

        card.classList.add('flipped');
        memoryFlippedCards.push({ card, emoji });

        if (memoryFlippedCards.length === 2) {
            const [c1, c2] = memoryFlippedCards;
            if (c1.emoji === c2.emoji) {
                c1.card.classList.add('matched');
                c2.card.classList.add('matched');
                memoryFlippedCards = [];
                memoryMatchedPairs++;

                score += 15;
                streak++;
                localStorage.setItem('igatamou_game_score', score.toString());
                updateScoreUI();
                playCatSoundEffect('correct');
                triggerCorrectAnswerReaction();

                if (memoryMatchedPairs === totalPairs) {
                    setTimeout(showCategoryCompleted, 800);
                }
            } else {
                triggerWrongAnswerReaction();
                setTimeout(() => {
                    c1.card.classList.remove('flipped');
                    c2.card.classList.remove('flipped');
                    memoryFlippedCards = [];
                }, 1000);
            }
        }
    }

    // ----------------------------------------------------
    // 8. TIC-TAC-TOE GAME LOGIC (EASY / SMART MEDIUM / UNBEATABLE MINIMAX HARD AI)
    // ----------------------------------------------------
    let tttBoard = Array(9).fill(null);
    let tttPlayerTurn = true;
    let tttGameOver = false;

    function setupTicTacToeGame() {
        tttBoard = Array(9).fill(null);
        tttPlayerTurn = true;
        tttGameOver = false;

        if (tttStatusText) tttStatusText.textContent = `Σειρά σου: 🐱 (${currentDifficulty.toUpperCase()})`;
        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Bάλε τη Γατούλα 🐱 για να νικήσεις το Ψαράκι 🐟!"`;

        if (!tttGrid) return;
        tttGrid.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'ttt-cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => handleTicTacToeCellClick(i, cell));
            tttGrid.appendChild(cell);
        }
    }

    function handleTicTacToeCellClick(index, cellEl) {
        if (tttBoard[index] || !tttPlayerTurn || tttGameOver) return;

        tttBoard[index] = '🐱';
        cellEl.textContent = '🐱';
        playCatSoundEffect('click');

        if (checkBoardWin(tttBoard, '🐱')) {
            tttGameOver = true;
            highlightWinningCombo('🐱');
            if (tttStatusText) tttStatusText.textContent = '🎉 Νίκησες! 🥳';
            if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Μπράβο! Νίκησες τη Μάγκας! +10 Πόντοι! 🎉"`;
            score += 10;
            streak++;
            localStorage.setItem('igatamou_game_score', score.toString());
            updateScoreUI();
            playCatSoundEffect('correct');
            triggerCorrectAnswerReaction();
            return;
        }

        if (tttBoard.every(cell => cell !== null)) {
            tttGameOver = true;
            if (tttStatusText) tttStatusText.textContent = '🤝 Ισοπαλία!';
            if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Ισοπαλία! Δοκίμασε ξανά! 🤝"`;
            return;
        }

        tttPlayerTurn = false;
        if (tttStatusText) tttStatusText.textContent = 'Σειρά της Μάγκας... 💭';

        setTimeout(makeTicTacToeAIMove, 400);
    }

    function makeTicTacToeAIMove() {
        if (tttGameOver) return;

        const emptyIndices = tttBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (!emptyIndices.length) return;

        let aiChoice = null;

        if (currentDifficulty === 'easy') {
            // Easy AI: Pure random choice
            aiChoice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        } else if (currentDifficulty === 'medium') {
            // Medium AI: Win > Block > Center > Random
            aiChoice = findWinningTicTacToeMove('🐟') || findWinningTicTacToeMove('🐱') || (tttBoard[4] === null ? 4 : emptyIndices[Math.floor(Math.random() * emptyIndices.length)]);
        } else {
            // Hard AI: Unbeatable Minimax Algorithm!
            const best = minimaxTicTacToe(tttBoard, 0, true);
            aiChoice = best.move !== undefined ? best.move : emptyIndices[0];
        }

        tttBoard[aiChoice] = '🐟';
        const cellEl = tttGrid.children[aiChoice];
        if (cellEl) cellEl.textContent = '🐟';

        if (checkBoardWin(tttBoard, '🐟')) {
            tttGameOver = true;
            highlightWinningCombo('🐟');
            if (tttStatusText) tttStatusText.textContent = '🐟 Κέρδισε το Ψαράκι!';
            if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Έχασες! Δοκίμασε ξανά! 🐾"`;
            triggerWrongAnswerReaction();
            return;
        }

        if (tttBoard.every(cell => cell !== null)) {
            tttGameOver = true;
            if (tttStatusText) tttStatusText.textContent = '🤝 Ισοπαλία!';
            return;
        }

        tttPlayerTurn = true;
        if (tttStatusText) tttStatusText.textContent = `Σειρά σου: 🐱 (${currentDifficulty.toUpperCase()})`;
    }

    function findWinningTicTacToeMove(symbol) {
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let combo of wins) {
            const [a, b, c] = combo;
            const vals = [tttBoard[a], tttBoard[b], tttBoard[c]];
            if (vals.filter(v => v === symbol).length === 2 && vals.includes(null)) {
                return combo[vals.indexOf(null)];
            }
        }
        return null;
    }

    function checkBoardWin(board, symbol) {
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return wins.some(([a, b, c]) => board[a] === symbol && board[b] === symbol && board[c] === symbol);
    }

    function highlightWinningCombo(symbol) {
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let combo of wins) {
            const [a, b, c] = combo;
            if (tttBoard[a] === symbol && tttBoard[b] === symbol && tttBoard[c] === symbol) {
                if (tttGrid) {
                    tttGrid.children[a].classList.add('winning-cell');
                    tttGrid.children[b].classList.add('winning-cell');
                    tttGrid.children[c].classList.add('winning-cell');
                }
                break;
            }
        }
    }

    // Minimax Algorithm for Unbeatable Hard AI
    function minimaxTicTacToe(board, depth, isMaximizing) {
        if (checkBoardWin(board, '🐟')) return { score: 10 - depth };
        if (checkBoardWin(board, '🐱')) return { score: depth - 10 };

        const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (!emptyIndices.length) return { score: 0 };

        if (isMaximizing) {
            let bestScore = -Infinity;
            let bestMove = null;
            for (let idx of emptyIndices) {
                board[idx] = '🐟';
                let result = minimaxTicTacToe(board, depth + 1, false);
                board[idx] = null;
                if (result.score > bestScore) {
                    bestScore = result.score;
                    bestMove = idx;
                }
            }
            return { score: bestScore, move: bestMove };
        } else {
            let bestScore = Infinity;
            let bestMove = null;
            for (let idx of emptyIndices) {
                board[idx] = '🐱';
                let result = minimaxTicTacToe(board, depth + 1, true);
                board[idx] = null;
                if (result.score < bestScore) {
                    bestScore = result.score;
                    bestMove = idx;
                }
            }
            return { score: bestScore, move: bestMove };
        }
    }

    if (tttResetBtn) tttResetBtn.addEventListener('click', setupTicTacToeGame);

    // ----------------------------------------------------
    // 9. CAT SNAKE GAME LOGIC (SLOW LEVEL 1 + SWIPE GESTURES)
    // ----------------------------------------------------
    let snakeInterval = null;
    let snake = [];
    let snakeDir = 'RIGHT';
    let snakeFood = { x: 5, y: 5, icon: '🐟' };
    let snakeObstacles = [];
    let snakePoints = 0;
    const foodIcons = ['🐟', '🥛', '🍗', '🧶', '🎀'];

    function setupSnakeGame() {
        stopSnakeGame();
        snakePoints = 0;
        if (snakeScore) snakeScore.textContent = '0';

        let speedMs = 240;
        if (currentDifficulty === 'medium') speedMs = 160;
        if (currentDifficulty === 'hard') speedMs = 100;

        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Μάζεψε λιχουδιές! (Σούρε το δάχτυλο ή χρησιμοποίησε κουμπιά) 🐟"`;

        snake = [
            { x: 7, y: 7 },
            { x: 6, y: 7 },
            { x: 5, y: 7 }
        ];
        snakeDir = 'RIGHT';

        snakeObstacles = [];
        if (currentDifficulty === 'hard') {
            snakeObstacles = [
                { x: 3, y: 3 }, { x: 3, y: 4 },
                { x: 11, y: 10 }, { x: 11, y: 11 }
            ];
        }

        spawnSnakeFood();
        drawSnakeCanvas();
        snakeInterval = setInterval(updateSnakeGame, speedMs);
    }

    function stopSnakeGame() {
        if (snakeInterval) {
            clearInterval(snakeInterval);
            snakeInterval = null;
        }
    }

    function spawnSnakeFood() {
        snakeFood = {
            x: Math.floor(Math.random() * 14) + 1,
            y: Math.floor(Math.random() * 14) + 1,
            icon: foodIcons[Math.floor(Math.random() * foodIcons.length)]
        };
    }

    function updateSnakeGame() {
        if (!snakeCanvas) return;
        const head = { ...snake[0] };

        if (snakeDir === 'RIGHT') head.x++;
        if (snakeDir === 'LEFT') head.x--;
        if (snakeDir === 'UP') head.y--;
        if (snakeDir === 'DOWN') head.y++;

        const hitObstacle = snakeObstacles.some(o => o.x === head.x && o.y === head.y);

        if (head.x < 0 || head.x >= 15 || head.y < 0 || head.y >= 15 || hitObstacle || snake.some(s => s.x === head.x && s.y === head.y)) {
            stopSnakeGame();
            if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Ουπς! 💥 Έκανες ${snakePoints} λιχουδιές!"`;
            triggerWrongAnswerReaction();
            return;
        }

        snake.unshift(head);

        if (head.x === snakeFood.x && head.y === snakeFood.y) {
            snakePoints += 5;
            score += 5;
            if (snakeScore) snakeScore.textContent = snakePoints.toString();
            localStorage.setItem('igatamou_game_score', score.toString());
            updateScoreUI();
            playCatSoundEffect('correct');
            spawnSnakeFood();
        } else {
            snake.pop();
        }

        drawSnakeCanvas();
    }

    function drawSnakeCanvas() {
        if (!snakeCanvas) return;
        const ctx = snakeCanvas.getContext('2d');
        const isDesktop = window.innerWidth >= 900;
        const scale = isDesktop ? 1.5 : 1.0;
        const dim = 300 * scale;
        const size = 20 * scale;

        if (snakeCanvas.width !== dim) {
            snakeCanvas.width = dim;
            snakeCanvas.height = dim;
        }

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, dim, dim);

        ctx.font = `${Math.floor(16 * scale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(snakeFood.icon, snakeFood.x * size + size / 2, snakeFood.y * size + size / 2);

        snakeObstacles.forEach(o => {
            ctx.fillText('🧱', o.x * size + size / 2, o.y * size + size / 2);
        });

        snake.forEach((segment, index) => {
            if (index === 0) {
                ctx.fillText('🐱', segment.x * size + size / 2, segment.y * size + size / 2);
            } else {
                ctx.fillStyle = '#ff5e7e';
                ctx.beginPath();
                ctx.arc(segment.x * size + size / 2, segment.y * size + size / 2, size / 2 - 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    let touchStartX = 0;
    let touchStartY = 0;
    if (snakeArena) {
        snakeArena.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        snakeArena.addEventListener('touchend', (e) => {
            if (currentCategory !== 'snake') return;
            const diffX = e.changedTouches[0].screenX - touchStartX;
            const diffY = e.changedTouches[0].screenY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 25 && snakeDir !== 'LEFT') snakeDir = 'RIGHT';
                else if (diffX < -25 && snakeDir !== 'RIGHT') snakeDir = 'LEFT';
            } else {
                if (diffY > 25 && snakeDir !== 'UP') snakeDir = 'DOWN';
                else if (diffY < -25 && snakeDir !== 'DOWN') snakeDir = 'UP';
            }
        }, { passive: true });
    }

    window.addEventListener('keydown', (e) => {
        if (currentCategory === 'snake') {
            if ((e.key === 'ArrowUp' || e.key === 'w') && snakeDir !== 'DOWN') snakeDir = 'UP';
            if ((e.key === 'ArrowDown' || e.key === 's') && snakeDir !== 'UP') snakeDir = 'DOWN';
            if ((e.key === 'ArrowLeft' || e.key === 'a') && snakeDir !== 'RIGHT') snakeDir = 'LEFT';
            if ((e.key === 'ArrowRight' || e.key === 'd') && snakeDir !== 'LEFT') snakeDir = 'RIGHT';
        }
    });

    if (dpadUp) dpadUp.addEventListener('click', () => { if (snakeDir !== 'DOWN') snakeDir = 'UP'; });
    if (dpadDown) dpadDown.addEventListener('click', () => { if (snakeDir !== 'UP') snakeDir = 'DOWN'; });
    if (dpadLeft) dpadLeft.addEventListener('click', () => { if (snakeDir !== 'RIGHT') snakeDir = 'LEFT'; });
    if (dpadRight) dpadRight.addEventListener('click', () => { if (snakeDir !== 'LEFT') snakeDir = 'RIGHT'; });
    if (snakeStartBtn) snakeStartBtn.addEventListener('click', setupSnakeGame);

    // ----------------------------------------------------
    // 10. CAT TETRIS GAME LOGIC
    // ----------------------------------------------------
    let tetrisInterval = null;
    let tetrisGrid = Array(20).fill(null).map(() => Array(12).fill(0));
    let tetrisLinesCleared = 0;
    let currentPiece = null;

    const tetrisPieces = [
        { shape: [[1, 1, 1, 1]], color: '#ff5e7e', icon: '🧶' },
        { shape: [[1, 1], [1, 1]], color: '#ffb703', icon: '🐟' },
        { shape: [[0, 1, 0], [1, 1, 1]], color: '#3a86ff', icon: '🐾' },
        { shape: [[1, 0, 0], [1, 1, 1]], color: '#8338ec', icon: '🥛' },
        { shape: [[0, 0, 1], [1, 1, 1]], color: '#fb5607', icon: '🎀' }
    ];

    function setupTetrisGame() {
        stopTetrisGame();
        tetrisGrid = Array(20).fill(null).map(() => Array(12).fill(0));
        tetrisLinesCleared = 0;
        if (tetrisLines) tetrisLines.textContent = '0';

        let dropSpeed = 550;
        if (currentDifficulty === 'medium') dropSpeed = 380;
        if (currentDifficulty === 'hard') dropSpeed = 220;

        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Φτιάξε γραμμές με τα τουβλάκια! 🧩"`;

        spawnTetrisPiece();
        drawTetrisCanvas();
        tetrisInterval = setInterval(updateTetrisGame, dropSpeed);
    }

    function stopTetrisGame() {
        if (tetrisInterval) {
            clearInterval(tetrisInterval);
            tetrisInterval = null;
        }
    }

    function spawnTetrisPiece() {
        const piece = tetrisPieces[Math.floor(Math.random() * tetrisPieces.length)];
        currentPiece = {
            shape: piece.shape,
            color: piece.color,
            x: 4,
            y: 0
        };

        if (checkTetrisCollision(0, 0)) {
            stopTetrisGame();
            if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Game Over! 💥 Έκανες ${tetrisLinesCleared} γραμμές!"`;
            triggerWrongAnswerReaction();
        }
    }

    function updateTetrisGame() {
        if (!currentPiece) return;

        if (!checkTetrisCollision(0, 1)) {
            currentPiece.y++;
        } else {
            lockTetrisPiece();
            clearTetrisLines();
            spawnTetrisPiece();
        }
        drawTetrisCanvas();
    }

    function checkTetrisCollision(offsetX, offsetY, shape = currentPiece.shape) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (shape[r][c]) {
                    const newX = currentPiece.x + c + offsetX;
                    const newY = currentPiece.y + r + offsetY;

                    if (newX < 0 || newX >= 12 || newY >= 20) return true;
                    if (newY >= 0 && tetrisGrid[newY][newX]) return true;
                }
            }
        }
        return false;
    }

    function lockTetrisPiece() {
        for (let r = 0; r < currentPiece.shape.length; r++) {
            for (let c = 0; c < currentPiece.shape[r].length; c++) {
                if (currentPiece.shape[r][c]) {
                    const y = currentPiece.y + r;
                    const x = currentPiece.x + c;
                    if (y >= 0 && y < 20) {
                        tetrisGrid[y][x] = currentPiece.color;
                    }
                }
            }
        }
    }

    function clearTetrisLines() {
        let linesCount = 0;
        for (let r = 19; r >= 0; r--) {
            if (tetrisGrid[r].every(cell => cell !== 0)) {
                tetrisGrid.splice(r, 1);
                tetrisGrid.unshift(Array(12).fill(0));
                linesCount++;
                r++;
            }
        }

        if (linesCount > 0) {
            tetrisLinesCleared += linesCount;
            score += linesCount * 15;
            if (tetrisLines) tetrisLines.textContent = tetrisLinesCleared.toString();
            localStorage.setItem('igatamou_game_score', score.toString());
            updateScoreUI();
            playCatSoundEffect('correct');
            triggerCorrectAnswerReaction();
        }
    }

    function drawTetrisCanvas() {
        if (!tetrisCanvas) return;
        const ctx = tetrisCanvas.getContext('2d');
        const isDesktop = window.innerWidth >= 900;
        const scale = isDesktop ? 1.5 : 1.0;
        const canvasW = 240 * scale;
        const canvasH = 400 * scale;
        const size = 20 * scale;

        if (tetrisCanvas.width !== canvasW) {
            tetrisCanvas.width = canvasW;
            tetrisCanvas.height = canvasH;
        }

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvasW, canvasH);

        for (let r = 0; r < 20; r++) {
            for (let c = 0; c < 12; c++) {
                if (tetrisGrid[r][c]) {
                    ctx.fillStyle = tetrisGrid[r][c];
                    ctx.fillRect(c * size, r * size, size - 1, size - 1);
                }
            }
        }

        if (currentPiece) {
            ctx.fillStyle = currentPiece.color;
            for (let r = 0; r < currentPiece.shape.length; r++) {
                for (let c = 0; c < currentPiece.shape[r].length; c++) {
                    if (currentPiece.shape[r][c]) {
                        ctx.fillRect((currentPiece.x + c) * size, (currentPiece.y + r) * size, size - 1, size - 1);
                    }
                }
            }
        }
    }

    function rotateTetrisPiece() {
        if (!currentPiece) return;
        const shape = currentPiece.shape;
        const newShape = shape[0].map((_, index) => shape.map(row => row[index]).reverse());
        if (!checkTetrisCollision(0, 0, newShape)) {
            currentPiece.shape = newShape;
            drawTetrisCanvas();
        }
    }

    window.addEventListener('keydown', (e) => {
        if (currentCategory === 'tetris' && currentPiece) {
            if (e.key === 'ArrowLeft' && !checkTetrisCollision(-1, 0)) { currentPiece.x--; drawTetrisCanvas(); }
            if (e.key === 'ArrowRight' && !checkTetrisCollision(1, 0)) { currentPiece.x++; drawTetrisCanvas(); }
            if (e.key === 'ArrowDown') { updateTetrisGame(); }
            if (e.key === 'ArrowUp') { rotateTetrisPiece(); }
        }
    });

    if (tetrisLeft) tetrisLeft.addEventListener('click', () => { if (currentPiece && !checkTetrisCollision(-1, 0)) { currentPiece.x--; drawTetrisCanvas(); } });
    if (tetrisRight) tetrisRight.addEventListener('click', () => { if (currentPiece && !checkTetrisCollision(1, 0)) { currentPiece.x++; drawTetrisCanvas(); } });
    if (tetrisRotate) tetrisRotate.addEventListener('click', rotateTetrisPiece);
    if (tetrisDown) tetrisDown.addEventListener('click', updateTetrisGame);
    if (tetrisStartBtn) tetrisStartBtn.addEventListener('click', setupTetrisGame);

    // ----------------------------------------------------
    // 11. WHACK A FISH
    // ----------------------------------------------------
    let whackTimer = null;
    let whackLoop = null;
    let whackPoints = 0;

    function setupWhackGame() {
        stopWhackGame();
        whackPoints = 0;
        if (whackScore) whackScore.textContent = '0';

        let popRate = 900;
        if (currentDifficulty === 'medium') popRate = 650;
        if (currentDifficulty === 'hard') popRate = 450;

        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Πάτα τα ψαράκια! (Απόφυγε τις βόμβες 💣 στο δύσκολο!)"`;

        if (!whackGrid) return;
        whackGrid.innerHTML = '';

        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'whack-hole';
            const item = document.createElement('div');
            item.className = 'whack-item';
            item.textContent = '🐟';
            item.addEventListener('click', () => handleWhackClick(hole, item));
            hole.appendChild(item);
            whackGrid.appendChild(hole);
        }

        whackLoop = setInterval(popRandomWhackItem, popRate);

        let timeLeft = 20;
        whackTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                stopWhackGame();
                if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Τέλος χρόνου! ⏱️ Έπιασες ${whackPoints} ψαράκια!"`;
                score += whackPoints * 3;
                localStorage.setItem('igatamou_game_score', score.toString());
                updateScoreUI();
            }
        }, 1000);
    }

    function stopWhackGame() {
        if (whackLoop) { clearInterval(whackLoop); whackLoop = null; }
        if (whackTimer) { clearInterval(whackTimer); whackTimer = null; }
    }

    function popRandomWhackItem() {
        if (!whackGrid) return;
        const holes = Array.from(whackGrid.children);
        holes.forEach(h => h.classList.remove('up'));

        const randomHole = holes[Math.floor(Math.random() * holes.length)];
        const item = randomHole.querySelector('.whack-item');
        const icons = ['🐟', '🐭', '🍗', '🐟'];
        if (currentDifficulty === 'hard') icons.push('💣');

        if (item) item.textContent = icons[Math.floor(Math.random() * icons.length)];

        randomHole.classList.add('up');
        setTimeout(() => { randomHole.classList.remove('up'); }, 550);
    }

    function handleWhackClick(hole, item) {
        if (!hole.classList.contains('up')) return;
        hole.classList.remove('up');

        if (item.textContent === '💣') {
            whackPoints = Math.max(0, whackPoints - 3);
            playCatSoundEffect('wrong');
            triggerWrongAnswerReaction();
        } else {
            whackPoints++;
            playCatSoundEffect('click');
            triggerCorrectAnswerReaction();
        }
        if (whackScore) whackScore.textContent = whackPoints.toString();
    }

    if (whackStartBtn) whackStartBtn.addEventListener('click', setupWhackGame);

    // ----------------------------------------------------
    // 12. BUBBLE POP GAME
    // ----------------------------------------------------
    let bubblesLoop = null;
    let bubblesPoints = 0;

    function setupBubblesGame() {
        stopBubblesGame();
        bubblesPoints = 0;
        if (bubblesScore) bubblesScore.textContent = '0';

        let spawnRate = 900;
        if (currentDifficulty === 'medium') spawnRate = 650;
        if (currentDifficulty === 'hard') spawnRate = 450;

        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Σκάσε τα μπαλόνια με τη γατούλα! 🎈"`;

        if (!bubblesBox) return;
        bubblesBox.innerHTML = '';

        bubblesLoop = setInterval(spawnBubble, spawnRate);
    }

    function stopBubblesGame() {
        if (bubblesLoop) { clearInterval(bubblesLoop); bubblesLoop = null; }
    }

    function spawnBubble() {
        if (!bubblesBox) return;
        const bubble = document.createElement('div');
        bubble.className = 'floating-bubble';

        const icons = ['🎈', '🐱', '🧶', '🐟', '🎀'];
        if (currentDifficulty === 'hard') icons.push('💣');

        const chosenIcon = icons[Math.floor(Math.random() * icons.length)];
        bubble.textContent = chosenIcon;

        const maxLeft = (bubblesBox.clientWidth || 300) - 80;
        bubble.style.left = `${Math.floor(Math.random() * Math.max(10, maxLeft))}px`;

        bubble.addEventListener('click', () => {
            if (chosenIcon === '💣') {
                bubblesPoints = Math.max(0, bubblesPoints - 2);
                playCatSoundEffect('wrong');
                triggerWrongAnswerReaction();
            } else {
                bubblesPoints++;
                score += 4;
                playCatSoundEffect('correct');
            }
            if (bubblesScore) bubblesScore.textContent = bubblesPoints.toString();
            localStorage.setItem('igatamou_game_score', score.toString());
            updateScoreUI();
            bubble.remove();
        });

        bubblesBox.appendChild(bubble);
        setTimeout(() => { if (bubble.parentNode) bubble.remove(); }, 3500);
    }

    if (bubblesStartBtn) bubblesStartBtn.addEventListener('click', setupBubblesGame);

    // ----------------------------------------------------
    // 13. MINI CAT CHESS
    // ----------------------------------------------------
    let chessGrid = [];
    let chessBoardSize = 4;
    let chessSelectedSq = null;
    let chessPlayerTurn = true;

    function setupChessGame() {
        if (currentDifficulty === 'hard') {
            chessBoardSize = 5;
            if (chessBoard) chessBoard.classList.add('grid-5x5');
            chessGrid = [
                ['🏰🐟', '🐴🐟', '🐟', '🐟', '👑🐟'],
                [null, null, null, null, null],
                [null, null, null, null, null],
                [null, null, null, null, null],
                ['🏰🐱', '🐴🐱', '🐱', '🐱', '👑🐱']
            ];
        } else if (currentDifficulty === 'medium') {
            chessBoardSize = 4;
            if (chessBoard) chessBoard.classList.remove('grid-5x5');
            chessGrid = [
                ['🐟', '🐴🐟', '🐟', '👑🐟'],
                [null, null, null, null],
                [null, null, null, null],
                ['🐱', '🐴🐱', '🐱', '👑🐱']
            ];
        } else {
            chessBoardSize = 4;
            if (chessBoard) chessBoard.classList.remove('grid-5x5');
            chessGrid = [
                ['🐟', '🐟', '🐟', '👑🐟'],
                [null, null, null, null],
                [null, null, null, null],
                ['🐱', '🐱', '🐱', '👑🐱']
            ];
        }

        chessSelectedSq = null;
        chessPlayerTurn = true;

        if (chessStatusText) chessStatusText.textContent = `Σειρά σου: 🐱 (${currentDifficulty.toUpperCase()})`;
        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Μετακίνησε τις γατούλες 🐱! (Πάτα κομμάτι ➔ πάτα πράσινο τετράγωνο)"`;

        renderChessBoard();
    }

    function renderChessBoard() {
        if (!chessBoard) return;
        chessBoard.innerHTML = '';

        for (let r = 0; r < chessBoardSize; r++) {
            for (let c = 0; c < chessBoardSize; c++) {
                const sq = document.createElement('div');
                const isLight = (r + c) % 2 === 0;
                sq.className = `chess-square ${isLight ? 'light' : 'dark'}`;
                const piece = chessGrid[r][c];

                if (piece) {
                    const isCat = piece.includes('🐱');
                    let displayContent = '';

                    if (piece.includes('👑')) {
                        displayContent = isCat ? '👑🐱' : '👑🐟';
                    } else if (piece.includes('🐴')) {
                        displayContent = isCat ? '🐴🐱' : '🐴🐟';
                    } else if (piece.includes('🏰')) {
                        displayContent = isCat ? '🏰🐱' : '🏰🐟';
                    } else {
                        displayContent = isCat ? '🐱' : '🐟';
                    }

                    const pieceTeamClass = isCat ? 'cat-piece' : 'fish-piece';
                    sq.innerHTML = `<span class="chess-piece-wrapper ${pieceTeamClass}">${displayContent}</span>`;
                }

                if (chessSelectedSq && chessSelectedSq.r === r && chessSelectedSq.c === c) {
                    sq.classList.add('selected-sq');
                }

                if (chessSelectedSq && isValidChessMove(chessSelectedSq.r, chessSelectedSq.c, r, c)) {
                    sq.classList.add('valid-move');
                }

                sq.addEventListener('click', () => handleChessSquareClick(r, c));
                chessBoard.appendChild(sq);
            }
        }
    }

    function handleChessSquareClick(r, c) {
        if (!chessPlayerTurn) return;
        const piece = chessGrid[r][c];

        if (chessSelectedSq) {
            const fromR = chessSelectedSq.r;
            const fromC = chessSelectedSq.c;

            if (isValidChessMove(fromR, fromC, r, c)) {
                const captured = chessGrid[r][c];
                chessGrid[r][c] = chessGrid[fromR][fromC];
                chessGrid[fromR][fromC] = null;
                chessSelectedSq = null;
                renderChessBoard();

                if (captured && captured.includes('👑')) {
                    if (chessStatusText) chessStatusText.textContent = '🎉 Νίκησες τον Βασιλιά! 🥳';
                    score += 25;
                    localStorage.setItem('igatamou_game_score', score.toString());
                    updateScoreUI();
                    playCatSoundEffect('correct');
                    return;
                }

                chessPlayerTurn = false;
                if (chessStatusText) chessStatusText.textContent = 'Σειρά της Μάγκας... 💭';

                setTimeout(makeChessAIMove, 450);
                return;
            }
        }

        if (piece && piece.includes('🐱')) {
            chessSelectedSq = { r, c };
            renderChessBoard();
        } else {
            chessSelectedSq = null;
            renderChessBoard();
        }
    }

    function isValidChessMove(fromR, fromC, toR, toC) {
        const piece = chessGrid[fromR][fromC];
        if (!piece) return false;
        if (toR < 0 || toR >= chessBoardSize || toC < 0 || toC >= chessBoardSize) return false;

        const target = chessGrid[toR][toC];
        const isCat = piece.includes('🐱');

        if (target && ((isCat && target.includes('🐱')) || (!isCat && target.includes('🐟')))) return false;

        if (piece.startsWith('🐱') || piece.startsWith('🐟')) {
            const dir = isCat ? -1 : 1;
            if (fromR + dir === toR && fromC === toC && !target) return true;
            if (fromR + dir === toR && Math.abs(fromC - toC) === 1 && target) return true;
            return false;
        }

        if (piece.includes('👑')) {
            return Math.abs(fromR - toR) <= 1 && Math.abs(fromC - toC) <= 1;
        }

        if (piece.includes('🐴')) {
            const rDiff = Math.abs(fromR - toR);
            const cDiff = Math.abs(fromC - toC);
            return (rDiff === 2 && cDiff === 1) || (rDiff === 1 && cDiff === 2);
        }

        if (piece.includes('🏰')) {
            if (fromR !== toR && fromC !== toC) return false;
            const rDir = Math.sign(toR - fromR);
            const cDir = Math.sign(toC - fromC);
            let currR = fromR + rDir;
            let currC = fromC + cDir;
            while (currR !== toR || currC !== toC) {
                if (chessGrid[currR][currC] !== null) return false;
                currR += rDir;
                currC += cDir;
            }
            return true;
        }

        return false;
    }

    function makeChessAIMove() {
        const moves = [];
        for (let r = 0; r < chessBoardSize; r++) {
            for (let c = 0; c < chessBoardSize; c++) {
                if (chessGrid[r][c] && chessGrid[r][c].includes('🐟')) {
                    for (let tr = 0; tr < chessBoardSize; tr++) {
                        for (let tc = 0; tc < chessBoardSize; tc++) {
                            if (isValidChessMove(r, c, tr, tc)) {
                                moves.push({ fromR: r, fromC: c, toR: tr, toC: tc });
                            }
                        }
                    }
                }
            }
        }

        if (!moves.length) {
            if (chessStatusText) chessStatusText.textContent = '🤝 Ισοπαλία! Δεν υπάρχουν άλλες κινήσεις!';
            if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Δεν υπάρχουν άλλες κινήσεις! Πάτα Νέος Γύρος! 🔄"`;
            chessPlayerTurn = true;
            return;
        }

        const captureMoves = moves.filter(m => chessGrid[m.toR][m.toC] !== null);
        const m = captureMoves.length ? captureMoves[Math.floor(Math.random() * captureMoves.length)] : moves[Math.floor(Math.random() * moves.length)];

        chessGrid[m.toR][m.toC] = chessGrid[m.fromR][m.fromC];
        chessGrid[m.fromR][m.fromC] = null;

        chessPlayerTurn = true;
        if (chessStatusText) chessStatusText.textContent = `Σειρά σου: 🐱 (${currentDifficulty.toUpperCase()})`;
        renderChessBoard();
    }

    if (chessResetBtn) chessResetBtn.addEventListener('click', setupChessGame);

    // ----------------------------------------------------
    // 14. CAT SOLITAIRE
    // ----------------------------------------------------
    let solitaireFoundations = { cat: [], fish: [], yarn: [] };
    let solitaireColumns = [[], [], []];
    let solitaireSelected = null;

    function setupSolitaireGame() {
        let maxVal = 2;
        if (currentDifficulty === 'medium') maxVal = 3;
        if (currentDifficulty === 'hard') maxVal = 4;

        const deck = [];
        ['cat', 'fish', 'yarn'].forEach(suit => {
            const icon = suit === 'cat' ? '🐱' : (suit === 'fish' ? '🐟' : '🧶');
            for (let v = 1; v <= maxVal; v++) {
                deck.push({ suit, icon, val: v });
            }
        });

        deck.sort(() => Math.random() - 0.5);

        solitaireFoundations = { cat: [], fish: [], yarn: [] };
        solitaireColumns = [[], [], []];
        solitaireSelected = null;

        deck.forEach((card, index) => {
            solitaireColumns[index % 3].push(card);
        });

        if (solitaireStatusText) solitaireStatusText.textContent = `Βάλε τους αριθμούς (1 ➔ ${maxVal}) στα καλάθια!`;
        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Πάτα κάρτα & μετά το σωστό καλάθι (1 ➔ ${maxVal})! 🧺"`;

        renderSolitaireBoard();
    }

    function renderSolitaireBoard() {
        if (!solitaireBoard) return;

        const catTop = solitaireFoundations.cat.length ? solitaireFoundations.cat[solitaireFoundations.cat.length - 1] : null;
        const fishTop = solitaireFoundations.fish.length ? solitaireFoundations.fish[solitaireFoundations.fish.length - 1] : null;
        const yarnTop = solitaireFoundations.yarn.length ? solitaireFoundations.yarn[solitaireFoundations.yarn.length - 1] : null;

        solitaireBoard.innerHTML = `
            <div class="solitaire-foundations-row">
                <div class="solitaire-foundation-basket" data-suit="cat">
                    <small>🧺 Γατούλες</small>
                    ${catTop ? `
                        <div class="solitaire-card-item">
                            <span class="card-suit">🐱</span>
                            <span class="card-val">${catTop.val}</span>
                        </div>
                    ` : '<span style="font-size: 1.4rem; opacity: 0.4;">🐱 1</span>'}
                </div>

                <div class="solitaire-foundation-basket" data-suit="fish">
                    <small>🧺 Ψαράκια</small>
                    ${fishTop ? `
                        <div class="solitaire-card-item">
                            <span class="card-suit">🐟</span>
                            <span class="card-val">${fishTop.val}</span>
                        </div>
                    ` : '<span style="font-size: 1.4rem; opacity: 0.4;">🐟 1</span>'}
                </div>

                <div class="solitaire-foundation-basket" data-suit="yarn">
                    <small>🧺 Κουβάρια</small>
                    ${yarnTop ? `
                        <div class="solitaire-card-item">
                            <span class="card-suit">🧶</span>
                            <span class="card-val">${yarnTop.val}</span>
                        </div>
                    ` : '<span style="font-size: 1.4rem; opacity: 0.4;">🧶 1</span>'}
                </div>
            </div>

            <div class="solitaire-columns-row">
                ${[0, 1, 2].map(colIdx => `
                    <div class="solitaire-column-stack" data-col="${colIdx}">
                        ${solitaireColumns[colIdx].map((card, cardIdx) => {
                            const isSelected = solitaireSelected && solitaireSelected.colIndex === colIdx && solitaireSelected.cardIndex === cardIdx;
                            return `
                                <div class="solitaire-card-item ${isSelected ? 'selected-card' : ''}" 
                                     data-col="${colIdx}" data-idx="${cardIdx}">
                                    <span class="card-suit">${card.icon}</span>
                                    <span class="card-val">${card.val}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `).join('')}
            </div>

            <button id="reshuffleSolitaireBtn" class="btn btn-back-menu" style="margin-top: 10px;">
                🔀 Ανακάτεμα Καρτών
            </button>
        `;

        const reshuffleBtn = solitaireBoard.querySelector('#reshuffleSolitaireBtn');
        if (reshuffleBtn) {
            reshuffleBtn.addEventListener('click', () => {
                const remainingCards = [];
                solitaireColumns.forEach(col => {
                    remainingCards.push(...col);
                    col.length = 0;
                });
                remainingCards.sort(() => Math.random() - 0.5);
                remainingCards.forEach((c, idx) => {
                    solitaireColumns[idx % 3].push(c);
                });
                solitaireSelected = null;
                renderSolitaireBoard();
            });
        }

        solitaireBoard.querySelectorAll('.solitaire-card-item[data-col]').forEach(cardEl => {
            cardEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const colIdx = parseInt(cardEl.getAttribute('data-col'), 10);
                const cardIdx = parseInt(cardEl.getAttribute('data-idx'), 10);
                const isTop = cardIdx === solitaireColumns[colIdx].length - 1;

                if (!isTop) return;
                const card = solitaireColumns[colIdx][cardIdx];

                if (solitaireSelected && solitaireSelected.colIndex === colIdx && solitaireSelected.cardIndex === cardIdx) {
                    solitaireSelected = null;
                } else {
                    solitaireSelected = { colIndex: colIdx, cardIndex: cardIdx, card };
                    playCatSoundEffect('click');
                }
                renderSolitaireBoard();
            });
        });

        solitaireBoard.querySelectorAll('.solitaire-foundation-basket').forEach(basketEl => {
            basketEl.addEventListener('click', () => {
                if (!solitaireSelected) return;

                const targetSuit = basketEl.getAttribute('data-suit');
                const card = solitaireSelected.card;

                if (card.suit === targetSuit) {
                    const currentPile = solitaireFoundations[targetSuit];
                    const expectedVal = currentPile.length + 1;

                    if (card.val === expectedVal) {
                        currentPile.push(card);
                        solitaireColumns[solitaireSelected.colIndex].pop();
                        solitaireSelected = null;

                        score += 10;
                        localStorage.setItem('igatamou_game_score', score.toString());
                        updateScoreUI();
                        playCatSoundEffect('correct');
                        triggerCorrectAnswerReaction();

                        let maxVal = 2;
                        if (currentDifficulty === 'medium') maxVal = 3;
                        if (currentDifficulty === 'hard') maxVal = 4;

                        if (solitaireFoundations.cat.length === maxVal && solitaireFoundations.fish.length === maxVal && solitaireFoundations.yarn.length === maxVal) {
                            if (solitaireStatusText) solitaireStatusText.textContent = '🎉 Μπράβο! Κέρδισες τη Γατο-Πασιέντζα! 🥳';
                            if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Φανταστικά! Συμπλήρωσες όλα τα καλάθια! 🌟 +30 Πόντοι!"`;
                            score += 30;
                            updateScoreUI();
                        }
                    } else {
                        playCatSoundEffect('wrong');
                        triggerWrongAnswerReaction();
                    }
                } else {
                    playCatSoundEffect('wrong');
                    triggerWrongAnswerReaction();
                }
                renderSolitaireBoard();
            });
        });

        solitaireBoard.querySelectorAll('.solitaire-column-stack').forEach(colEl => {
            colEl.addEventListener('click', () => {
                if (!solitaireSelected) return;
                const targetColIdx = parseInt(colEl.getAttribute('data-col'), 10);
                if (targetColIdx === solitaireSelected.colIndex) return;

                const card = solitaireSelected.card;
                solitaireColumns[solitaireSelected.colIndex].pop();
                solitaireColumns[targetColIdx].push(card);
                solitaireSelected = null;
                playCatSoundEffect('click');
                renderSolitaireBoard();
            });
        });
    }

    if (solitaireResetBtn) solitaireResetBtn.addEventListener('click', setupSolitaireGame);

    // Mascot Reactions
    function triggerCorrectAnswerReaction() {
        if (companionCatFrame) {
            companionCatFrame.classList.remove('cat-halo-correct', 'cat-halo-wrong');
            void companionCatFrame.offsetWidth;
            companionCatFrame.classList.add('cat-halo-correct');
        }
    }

    function triggerWrongAnswerReaction() {
        if (companionCatFrame) {
            companionCatFrame.classList.remove('cat-halo-correct', 'cat-halo-wrong');
            void companionCatFrame.offsetWidth;
            companionCatFrame.classList.add('cat-halo-wrong');
        }
    }

    // Sound FX Helper
    function playCatSoundEffect(type) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            if (type === 'correct') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const now = ctx.currentTime;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(650, now);
                osc.frequency.exponentialRampToValueAtTime(950, now + 0.15);
                osc.frequency.exponentialRampToValueAtTime(500, now + 0.4);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.45);
            } else if (type === 'wrong') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const now = ctx.currentTime;
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(450, now);
                osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.4);
            } else if (type === 'click') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const now = ctx.currentTime;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            }
        } catch (e) {
            console.log('Audio Context error');
        }
    }
});
