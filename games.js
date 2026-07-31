document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. GAME DATA & QUESTION DATABASE
    // ----------------------------------------------------
    const gameDatabase = {
        math: [
            { q: "Πόσο κάνει 5 + 5;", opts: ["10", "8", "12", "15"], a: "10", helper: "🖐️ + 🖐️ = 🖐️🖐️" },
            { q: "Πόσο κάνει 12 + 8;", opts: ["20", "18", "22", "15"], a: "20", helper: "🔟 + 🔟" },
            { q: "Πόσο κάνει 30 - 10;", opts: ["20", "15", "25", "10"], a: "20" },
            { q: "Πόσο κάνει 5 × 5;", opts: ["25", "20", "30", "15"], a: "25" },
            { q: "Πόσο κάνει 7 × 6;", opts: ["42", "40", "36", "48"], a: "42" },
            { q: "Πόσο κάνει 20 ÷ 4;", opts: ["5", "4", "6", "10"], a: "5" },
            { q: "Πόσο κάνει 100 - 35;", opts: ["65", "55", "75", "70"], a: "65" },
            { q: "Πόσο κάνει 8 × 4;", opts: ["32", "30", "28", "36"], a: "32" },
            { q: "Πόσο κάνει 50 + 50;", opts: ["100", "90", "80", "110"], a: "100" }
        ],
        spelling: [
            { q: "Συμπλήρωσε το σωστό: Το μήλ...", opts: ["ο", "ω"], a: "ο", helper: "Το ουδέτερο λήγει σε -ο" },
            { q: "Συμπλήρωσε το σωστό: Εγώ τρέχ...", opts: ["ω", "ο"], a: "ω", helper: "Το ρήμα εγώ λήγει σε -ω" },
            { q: "Συμπλήρωσε το σωστό: Οι γάτ...", opts: ["ες", "ις"], a: "ες" },
            { q: "Συμπλήρωσε το σωστό: Η αυλ...", opts: ["ή", "ί"], a: "ή" },
            { q: "Συμπλήρωσε το σωστό: Το σπ...τι", opts: ["ί", "ύ"], a: "ί" },
            { q: "Συμπλήρωσε το σωστό: Εμείς παίζουμ...", opts: ["ε", "αι"], a: "ε" },
            { q: "Συμπλήρωσε το σωστό: Το δέντρ...", opts: ["ο", "ω"], a: "ο" },
            { q: "Συμπλήρωσε το σωστό: Εγώ διαβάζ...", opts: ["ω", "ο"], a: "ω" }
        ],
        english: [
            { q: "Τι σημαίνει η αγγλική λέξη: Cat;", opts: ["Γάτα", "Σκύλος", "Πουλί", "Ψάρι"], a: "Γάτα" },
            { q: "Τι σημαίνει: Hello!", opts: ["Γεια σου!", "Αντίο!", "Καληνύχτα", "Ευχαριστώ"], a: "Γεια σου!" },
            { q: "Πώς λέγεται το Κόκκινο στα Αγγλικά;", opts: ["Red", "Blue", "Green", "Yellow"], a: "Red" },
            { q: "Τι σημαίνει: I love cats!", opts: ["Αγαπώ τις γάτες!", "Έχω μια γάτα", "Η γάτα κοιμάται", "Γάτες και σκύλοι"], a: "Αγαπώ τις γάτες!" },
            { q: "Πώς λέγεται το Σχολείο στα Αγγλικά;", opts: ["School", "House", "Park", "Book"], a: "School" },
            { q: "Τι σημαίνει: Sun;", opts: ["Ήλιος", "Φεγγάρι", "Αστέρι", "Σύννεφο"], a: "Ήλιος" }
        ],
        riddles: [
            { q: "Έχει 4 πόδια, μουστακάκια και κάνει νιάου! Τι είναι;", opts: ["Γάτα 🐱", "Σκύλος 🐶", "Ελέφαντας 🐘", "Λιοντάρι 🦁"], a: "Γάτα 🐱" },
            { q: "Έχω δείκτες αλλά δεν έχω χέρια, μετράω την ώρα. Τι είμαι;", opts: ["Ρολόι ⏰", "Παιχνίδι 🧸", "Καρέκλα 🪑", "Βιβλίο 📖"], a: "Ρολόι ⏰" },
            { q: "Ποιο πράγμα γίνεται πιο μεγάλο όσο του αφαιρείς;", opts: ["Τρύπα 🕳️", "Βουνό ⛰️", "Μπαλόνι 🎈", "Ποτάμι 🌊"], a: "Τρύπα 🕳️" },
            { q: "Είμαι κόκκινο, γλυκό και έχω σποράκια απ' έξω! Τι είμαι;", opts: ["Φράουλα 🍓", "Μήλο 🍎", "Πορτοκάλι 🍊", "Μπανάνες 🍌"], a: "Φράουλα 🍓" }
        ],
        nature: [
            { q: "Ποιο από τα παρακάτω ζώα είναι ΘΗΛΑΣΤΙΚΟ;", opts: ["Δελφίνι 🐬", "Χελώνα 🐢", "Αετός 🦅", "Βάτραχος 🐸"], a: "Δελφίνι 🐬", helper: "Γεννάει μικρά και τα θηλάζει!" },
            { q: "Ποια τροφή είναι η πιο υγιεινή για τα παιδιά;", opts: ["Φρούτα & Λαχανικά 🍎", "Καραμέλες 🍬", "Πατατάκια 🍟", "Αναψυκτικά 🥤"], a: "Φρούτα & Λαχανικά 🍎" },
            { q: "Πού ζουν τα ψάρια;", opts: ["Στο νερό 🌊", "Στα δέντρα 🌳", "Στον αέρα ☁️", "Στην άμμο 🏜️"], a: "Στο νερό 🌊" },
            { q: "Τι χρειάζονται τα φυτά για να μεγαλώσουν;", opts: ["Ήλιο & Νερό ☀️💧", "Σοκολάτα 🍫", "Παιχνίδια 🧸", "Γάλα 🥛"], a: "Ήλιο & Νερό ☀️💧" }
        ],
        geography: [
            { q: "Ποια από τις παρακάτω πόλεις βρίσκεται σε ΝΗΣΙ;", opts: ["Ερμούπολη (Σύρος) 🏝️", "Λάρισα 🌾", "Τρίπολη ⛰️", "Ιωάννινα 🏞️"], a: "Ερμούπολη (Σύρος) 🏝️" },
            { q: "Σε ποια Ήπειρο ανήκει η Ελλάδα;", opts: ["Ευρώπη 🇪🇺", "Ασία 🌏", "Αφρική 🌍", "Αμερική 🌎"], a: "Ευρώπη 🇪🇺" },
            { q: "Ποιο είναι το μεγαλύτερο Νησί της Ελλάδας;", opts: ["Κρήτη 🏝️", "Ρόδος 🏖️", "Κέρκυρα 🏰", "Νάξος ⛵"], a: "Κρήτη 🏝️" },
            { q: "Σε ποια Ήπειρο βρίσκεται η Αίγυπτος;", opts: ["Αφρική 🌍", "Ευρώπη 🇪🇺", "Ασία 🌏", "Αυστραλία 🇦🇺"], a: "Αφρική 🌍" }
        ]
    };

    // Memory Game Emojis
    const memoryEmojis = ['🐱', '😸', '😻', '😽', '🐾', '🧶', '🐟', '🎀'];

    // ----------------------------------------------------
    // 2. STATE MANAGEMENT
    // ----------------------------------------------------
    let currentCategory = null;
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

    // Ensure Modal is hidden on load
    if (trophyModal) {
        trophyModal.hidden = true;
    }

    // Update Initial Score UI
    updateScoreUI();

    // ----------------------------------------------------
    // 3. EVENT LISTENERS
    // ----------------------------------------------------
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.getAttribute('data-category');
            startCategoryGame(cat);
        });
    });

    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', showCategoryMenu);
    }

    if (trophyBtn) {
        trophyBtn.addEventListener('click', () => {
            if (trophyModal) trophyModal.hidden = false;
        });
    }

    if (closeTrophyBtn) {
        closeTrophyBtn.addEventListener('click', () => {
            if (trophyModal) trophyModal.hidden = true;
        });
    }

    // ----------------------------------------------------
    // 4. GAME ENGINE LOGIC
    // ----------------------------------------------------
    function updateScoreUI() {
        if (scoreDisplay) scoreDisplay.textContent = score;
        if (streakCount) streakCount.textContent = streak;

        // Check Trophy Unlocks
        const t1 = document.getElementById('trophy1');
        const t2 = document.getElementById('trophy2');
        const t3 = document.getElementById('trophy3');
        const statusT1 = document.getElementById('statusT1');
        const statusT2 = document.getElementById('statusT2');
        const statusT3 = document.getElementById('statusT3');

        if (score < 50 && trophyBadgeName) {
            trophyBadgeName.textContent = 'Τα Κύπελλά σου';
        }

        // Trophy 1: 50 pts
        if (score >= 50 && t1) {
            t1.classList.add('unlocked');
            if (statusT1) statusT1.textContent = 'Ξεκλειδώθηκε! ✅';
            if (trophyBadgeName) trophyBadgeName.textContent = '🥉 Μικρός Γατο-Εξερευνητής';
        } else if (t1) {
            t1.classList.remove('unlocked');
            if (statusT1) statusT1.textContent = '🔒 50 Πόντοι';
        }

        // Trophy 2: 100 pts
        if (score >= 100 && t2) {
            t2.classList.add('unlocked');
            if (statusT2) statusT2.textContent = 'Ξεκλειδώθηκε! ✅';
            if (trophyBadgeName) trophyBadgeName.textContent = '🥈 Γατο-Σοφός';
        } else if (t2) {
            t2.classList.remove('unlocked');
            if (statusT2) statusT2.textContent = '🔒 100 Πόντοι';
        }

        // Trophy 3: 200 pts
        if (score >= 200 && t3) {
            t3.classList.add('unlocked');
            if (statusT3) statusT3.textContent = 'Ξεκλειδώθηκε! 👑';
            if (trophyBadgeName) trophyBadgeName.textContent = '🥇 Master Γατο-Επιστήμονας!';
            if (mascotCrown) mascotCrown.hidden = false;
        } else if (t3) {
            t3.classList.remove('unlocked');
            if (statusT3) statusT3.textContent = '🔒 200 Πόντοι';
            if (mascotCrown) mascotCrown.hidden = true;
        }
    }

    function clearArenaContainers() {
        if (questionCard) questionCard.hidden = false;
        if (optionsGrid) {
            optionsGrid.innerHTML = '';
            optionsGrid.hidden = true;
        }
        if (memoryBoard) {
            memoryBoard.innerHTML = '';
            memoryBoard.hidden = true;
        }
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
            setupMemoryGame();
        } else if (categoryKey === 'tictactoe') {
            if (questionCard) questionCard.hidden = true;
            if (tictactoeArena) tictactoeArena.hidden = false;
            setupTicTacToeGame();
        } else if (categoryKey === 'snake') {
            if (questionCard) questionCard.hidden = true;
            if (snakeArena) snakeArena.hidden = false;
            setupSnakeGame();
        } else if (categoryKey === 'tetris') {
            if (questionCard) questionCard.hidden = true;
            if (tetrisArena) tetrisArena.hidden = false;
            setupTetrisGame();
        } else if (categoryKey === 'whack') {
            if (questionCard) questionCard.hidden = true;
            if (whackArena) whackArena.hidden = false;
            setupWhackGame();
        } else if (categoryKey === 'bubbles') {
            if (questionCard) questionCard.hidden = true;
            if (bubblesArena) bubblesArena.hidden = false;
            setupBubblesGame();
        } else if (categoryKey === 'chess') {
            if (questionCard) questionCard.hidden = true;
            if (chessArena) chessArena.hidden = false;
            setupChessGame();
        } else if (categoryKey === 'solitaire') {
            if (questionCard) questionCard.hidden = true;
            if (solitaireArena) solitaireArena.hidden = false;
            setupSolitaireGame();
        } else {
            if (optionsGrid) optionsGrid.hidden = false;
            if (memoryBoard) memoryBoard.hidden = true;

            currentQuestions = [...(gameDatabase[categoryKey] || [])];
            currentQuestions.sort(() => Math.random() - 0.5);
            currentQIndex = 0;
            renderCurrentQuestion();
        }
    }

    // ----------------------------------------------------
    // MULTIPLE CHOICE QUIZ GAMES
    // ----------------------------------------------------
    function renderCurrentQuestion() {
        if (!currentQuestions || currentQIndex >= currentQuestions.length) {
            showCategoryCompleted();
            return;
        }

        const q = currentQuestions[currentQIndex];
        if (questionNumber) questionNumber.textContent = `Ερώτηση ${currentQIndex + 1} από ${currentQuestions.length}`;
        if (questionText) questionText.textContent = q.q;

        if (visualHelper) {
            visualHelper.textContent = q.helper || '';
        }

        if (optionsGrid) {
            optionsGrid.innerHTML = '';
            q.opts.forEach(optText => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option-btn';
                btn.textContent = optText;
                btn.addEventListener('click', () => checkQuizAnswer(optText, q.a, btn));
                optionsGrid.appendChild(btn);
            });
        }

        if (catSpeechBubble) {
            catSpeechBubble.textContent = `💬 "Διάλεξε τη σωστή απάντηση! 🐾"`;
        }
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
                if (b.textContent === correct) {
                    b.classList.add('correct');
                }
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
        replayBtn.textContent = '🔄 Παίξε Ξανά αυτή την κατηγορία!';
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

        if (catSpeechBubble) {
            catSpeechBubble.textContent = `💬 "Είμαι περήφανη για σένα! 🥳✨"`;
        }
    }

    // ----------------------------------------------------
    // MEMORY GAME LOGIC
    // ----------------------------------------------------
    function setupMemoryGame() {
        if (questionNumber) questionNumber.textContent = 'Γατο-Memory';
        if (questionText) questionText.textContent = 'Βρες τα 8 ζευγάρια με τις γατούλες!';
        if (visualHelper) visualHelper.textContent = '💡 Κάνε κλικ στις κάρτες για να τις γυρίσεις!';

        if (optionsGrid) optionsGrid.hidden = true;
        if (memoryBoard) memoryBoard.hidden = false;
        memoryBoard.innerHTML = '';

        const cardDeck = [...memoryEmojis, ...memoryEmojis];
        cardDeck.sort(() => Math.random() - 0.5);

        memoryFlippedCards = [];
        memoryMatchedPairs = 0;

        cardDeck.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card-tile';
            card.dataset.emoji = emoji;
            card.dataset.index = index;

            card.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-front"><span class="memory-paw">🐾</span></div>
                    <div class="memory-card-back"><span class="memory-emoji">${emoji}</span></div>
                </div>
            `;

            card.addEventListener('click', () => handleMemoryCardClick(card, emoji));
            memoryBoard.appendChild(card);
        });
    }

    function handleMemoryCardClick(card, emoji) {
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

                if (memoryMatchedPairs === memoryEmojis.length) {
                    setTimeout(() => {
                        showCategoryCompleted();
                    }, 800);
                }
            } else {
                triggerWrongAnswerReaction();
                setTimeout(() => {
                    c1.card.classList.remove('flipped');
                    c2.card.classList.remove('flipped');
                    memoryFlippedCards = [];
                }, 1100);
            }
        }
    }

    // ----------------------------------------------------
    // 8. TIC-TAC-TOE GAME LOGIC (Μάγκας 🐱 vs Ψαράκι 🐟)
    // ----------------------------------------------------
    let tttBoard = Array(9).fill(null);
    let tttPlayerTurn = true;
    let tttGameOver = false;

    function setupTicTacToeGame() {
        tttBoard = Array(9).fill(null);
        tttPlayerTurn = true;
        tttGameOver = false;

        if (tttStatusText) tttStatusText.textContent = 'Σειρά σου: 🐱 (Μάγκας)';
        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Bάλε τη Γατούλα 🐱 για να κερδίσεις το Ψαράκι 🐟!"`;

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

        if (checkTicTacToeWin('🐱')) {
            tttGameOver = true;
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
            if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Ισοπαλία! Καλή προσπάθεια! 🤝"`;
            return;
        }

        tttPlayerTurn = false;
        if (tttStatusText) tttStatusText.textContent = 'Σειρά της Μάγκας... 💭';

        setTimeout(() => {
            makeTicTacToeAIMove();
        }, 400);
    }

    function makeTicTacToeAIMove() {
        if (tttGameOver) return;

        const emptyIndices = tttBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (!emptyIndices.length) return;

        const aiChoice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        tttBoard[aiChoice] = '🐟';

        const cellEl = tttGrid.children[aiChoice];
        if (cellEl) cellEl.textContent = '🐟';

        if (checkTicTacToeWin('🐟')) {
            tttGameOver = true;
            if (tttStatusText) tttStatusText.textContent = '🐟 Κέρδισε το Ψαράκι!';
            if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Έχασες αυτή τη φορά! Δοκίμασε ξανά! 🐾"`;
            triggerWrongAnswerReaction();
            return;
        }

        if (tttBoard.every(cell => cell !== null)) {
            tttGameOver = true;
            if (tttStatusText) tttStatusText.textContent = '🤝 Ισοπαλία!';
            if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Ισοπαλία! Καλή προσπάθεια! 🤝"`;
            return;
        }

        tttPlayerTurn = true;
        if (tttStatusText) tttStatusText.textContent = 'Σειρά σου: 🐱 (Μάγκας)';
    }

    function checkTicTacToeWin(symbol) {
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
                return true;
            }
        }
        return false;
    }

    if (tttResetBtn) {
        tttResetBtn.addEventListener('click', setupTicTacToeGame);
    }

    // ----------------------------------------------------
    // 9. CAT SNAKE GAME LOGIC (🐍🐾 Γατο-Φιδάκι)
    // ----------------------------------------------------
    let snakeInterval = null;
    let snake = [];
    let snakeDir = 'RIGHT';
    let snakeFood = { x: 5, y: 5, icon: '🐟' };
    let snakePoints = 0;
    const foodIcons = ['🐟', '🥛', '🍗', '🧶', '🎀'];

    function setupSnakeGame() {
        stopSnakeGame();
        snakePoints = 0;
        if (snakeScore) snakeScore.textContent = '0';
        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Μάζεψε τις λιχουδιές με το Γατο-Φιδάκι! 🐟"`;

        snake = [
            { x: 7, y: 7 },
            { x: 6, y: 7 },
            { x: 5, y: 7 }
        ];
        snakeDir = 'RIGHT';
        spawnSnakeFood();

        drawSnakeCanvas();
        snakeInterval = setInterval(updateSnakeGame, 140);
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

        if (head.x < 0 || head.x >= 15 || head.y < 0 || head.y >= 15 || snake.some(s => s.x === head.x && s.y === head.y)) {
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
        const size = 20;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 300, 300);

        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(snakeFood.icon, snakeFood.x * size + size / 2, snakeFood.y * size + size / 2);

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
    // 10. CAT TETRIS GAME LOGIC (🧩🧱 Γατο-Τέτρις)
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
        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Φτιάξε γραμμές με τα τουβλάκια! 🧩"`;

        spawnTetrisPiece();
        drawTetrisCanvas();

        tetrisInterval = setInterval(updateTetrisGame, 450);
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
            icon: piece.icon,
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
        const size = 20;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, 240, 400);

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
    // 11. WHACK A FISH (🔨🐟 Πιάσε το Ψαράκι!)
    // ----------------------------------------------------
    let whackTimer = null;
    let whackLoop = null;
    let whackPoints = 0;

    function setupWhackGame() {
        stopWhackGame();
        whackPoints = 0;
        if (whackScore) whackScore.textContent = '0';
        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Πάτα τα ψαράκια πριν κρυφτούν! 🐟"`;

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

        whackLoop = setInterval(popRandomWhackItem, 700);

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
        const icons = ['🐟', '🐭', '🍗', '🐟', '🐟'];
        if (item) item.textContent = icons[Math.floor(Math.random() * icons.length)];

        randomHole.classList.add('up');
        setTimeout(() => {
            randomHole.classList.remove('up');
        }, 600);
    }

    function handleWhackClick(hole, item) {
        if (!hole.classList.contains('up')) return;
        hole.classList.remove('up');
        whackPoints++;
        if (whackScore) whackScore.textContent = whackPoints.toString();
        playCatSoundEffect('click');
        triggerCorrectAnswerReaction();
    }

    if (whackStartBtn) whackStartBtn.addEventListener('click', setupWhackGame);

    // ----------------------------------------------------
    // 12. BUBBLE POP GAME (🎈🐾 Γατο-Μπαλόνια)
    // ----------------------------------------------------
    let bubblesLoop = null;
    let bubblesPoints = 0;

    function setupBubblesGame() {
        stopBubblesGame();
        bubblesPoints = 0;
        if (bubblesScore) bubblesScore.textContent = '0';
        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Σκάσε τα μπαλόνια με τη γατούλα! 🎈"`;

        if (!bubblesBox) return;
        bubblesBox.innerHTML = '';

        bubblesLoop = setInterval(spawnBubble, 800);
    }

    function stopBubblesGame() {
        if (bubblesLoop) { clearInterval(bubblesLoop); bubblesLoop = null; }
    }

    function spawnBubble() {
        if (!bubblesBox) return;
        const bubble = document.createElement('div');
        bubble.className = 'floating-bubble';
        const icons = ['🎈', '🐱', '🧶', '🐟', '🎀'];
        bubble.textContent = icons[Math.floor(Math.random() * icons.length)];
        bubble.style.left = `${Math.floor(Math.random() * 230)}px`;

        bubble.addEventListener('click', () => {
            bubblesPoints++;
            score += 4;
            if (bubblesScore) bubblesScore.textContent = bubblesPoints.toString();
            localStorage.setItem('igatamou_game_score', score.toString());
            updateScoreUI();
            playCatSoundEffect('correct');
            bubble.remove();
        });

        bubblesBox.appendChild(bubble);
        setTimeout(() => {
            if (bubble.parentNode) bubble.remove();
        }, 3500);
    }

    if (bubblesStartBtn) bubblesStartBtn.addEventListener('click', setupBubblesGame);

    // ----------------------------------------------------
    // 13. MINI CAT CHESS (👑♟️ 🐱 vs 🐟)
    // ----------------------------------------------------
    let chessGrid = [
        ['🐟', '🐟', '🐟', '👑🐟'],
        [null, null, null, null],
        [null, null, null, null],
        ['🐱', '🐱', '🐱', '👑🐱']
    ];
    let chessSelectedSq = null;
    let chessPlayerTurn = true;

    function setupChessGame() {
        chessGrid = [
            ['🐟', '🐟', '🐟', '👑🐟'],
            [null, null, null, null],
            [null, null, null, null],
            ['🐱', '🐱', '🐱', '👑🐱']
        ];
        chessSelectedSq = null;
        chessPlayerTurn = true;

        if (chessStatusText) chessStatusText.textContent = 'Σειρά σου: 🐱 (Γατούλες)';
        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Μετακίνησε τις γατούλες 🐱 μπροστά!"`;

        renderChessBoard();
    }

    function renderChessBoard() {
        if (!chessBoard) return;
        chessBoard.innerHTML = '';

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const sq = document.createElement('div');
                const isLight = (r + c) % 2 === 0;
                sq.className = `chess-square ${isLight ? 'light' : 'dark'}`;
                const piece = chessGrid[r][c];
                if (piece) sq.textContent = piece.includes('👑') ? '👑' : piece;

                if (chessSelectedSq && chessSelectedSq.r === r && chessSelectedSq.c === c) {
                    sq.classList.add('selected-sq');
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
            // Move selected piece
            const fromR = chessSelectedSq.r;
            const fromC = chessSelectedSq.c;

            if (isValidChessMove(fromR, fromC, r, c)) {
                const captured = chessGrid[r][c];
                chessGrid[r][c] = chessGrid[fromR][fromC];
                chessGrid[fromR][fromC] = null;
                chessSelectedSq = null;
                renderChessBoard();

                if (captured && captured.includes('👑')) {
                    if (chessStatusText) chessStatusText.textContent = '🎉 Νίκησες το Ψαράκι! 🥳';
                    score += 25;
                    localStorage.setItem('igatamou_game_score', score.toString());
                    updateScoreUI();
                    playCatSoundEffect('correct');
                    return;
                }

                chessPlayerTurn = false;
                if (chessStatusText) chessStatusText.textContent = 'Σειρά της Μάγκας... 💭';

                setTimeout(makeChessAIMove, 500);
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

        // Pawns move forward 1 row
        if (fromR - 1 === toR && fromC === toC && !chessGrid[toR][toC]) return true;
        // Pawns capture diagonally
        if (fromR - 1 === toR && Math.abs(fromC - toC) === 1 && chessGrid[toR][toC] && chessGrid[toR][toC].includes('🐟')) return true;

        return false;
    }

    function makeChessAIMove() {
        const moves = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (chessGrid[r][c] && chessGrid[r][c].includes('🐟')) {
                    if (r + 1 < 4 && !chessGrid[r + 1][c]) moves.push({ fromR: r, fromC: c, toR: r + 1, toC: c });
                    if (r + 1 < 4 && c - 1 >= 0 && chessGrid[r + 1][c - 1] && chessGrid[r + 1][c - 1].includes('🐱')) moves.push({ fromR: r, fromC: c, toR: r + 1, toC: c - 1 });
                    if (r + 1 < 4 && c + 1 < 4 && chessGrid[r + 1][c + 1] && chessGrid[r + 1][c + 1].includes('🐱')) moves.push({ fromR: r, fromC: c, toR: r + 1, toC: c + 1 });
                }
            }
        }

        if (moves.length) {
            const m = moves[Math.floor(Math.random() * moves.length)];
            chessGrid[m.toR][m.toC] = chessGrid[m.fromR][m.fromC];
            chessGrid[m.fromR][m.fromC] = null;
        }

        chessPlayerTurn = true;
        if (chessStatusText) chessStatusText.textContent = 'Σειρά σου: 🐱 (Γατούλες)';
        renderChessBoard();
    }

    if (chessResetBtn) chessResetBtn.addEventListener('click', setupChessGame);

    // ----------------------------------------------------
    // 14. CAT SOLITAIRE (🂠🐱 Γατο-Πασιέντζα)
    // ----------------------------------------------------
    let solitaireCards = [];
    let solitaireSelectedCard = null;

    function setupSolitaireGame() {
        solitaireCards = [
            { id: 1, text: '🐟', color: 'red' },
            { id: 2, text: '🐱', color: 'blue' },
            { id: 3, text: '🧶', color: 'gold' },
            { id: 4, text: '🥛', color: 'red' },
            { id: 5, text: '🎀', color: 'blue' },
            { id: 6, text: '🍗', color: 'gold' }
        ];
        solitaireCards.sort(() => Math.random() - 0.5);
        solitaireSelectedCard = null;

        if (solitaireStatusText) solitaireStatusText.textContent = 'Βάλε τις κάρτες στα σωστά γατο-καλάθια!';
        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Διάλεξε μια κάρτα & πάτα το σωστό καλάθι! 🧺"`;

        renderSolitaireBoard();
    }

    function renderSolitaireBoard() {
        if (!solitaireBoard) return;
        solitaireBoard.innerHTML = `
            <div class="solitaire-baskets-row">
                <div class="solitaire-basket basket-red" data-color="red">
                    <span>🔴 Κόκκινο</span>
                    <small>Καλάθι 1</small>
                </div>
                <div class="solitaire-basket basket-blue" data-color="blue">
                    <span>🟢 Πράσινο</span>
                    <small>Καλάθι 2</small>
                </div>
                <div class="solitaire-basket basket-gold" data-color="gold">
                    <span>🟡 Χρυσό</span>
                    <small>Καλάθι 3</small>
                </div>
            </div>
            <div class="solitaire-cards-deck"></div>
        `;

        const deck = solitaireBoard.querySelector('.solitaire-cards-deck');
        solitaireCards.forEach(c => {
            const tile = document.createElement('div');
            tile.className = `solitaire-card-tile ${solitaireSelectedCard && solitaireSelectedCard.id === c.id ? 'selected-card' : ''}`;
            tile.textContent = c.text;

            tile.addEventListener('click', () => {
                solitaireSelectedCard = c;
                renderSolitaireBoard();
            });
            deck.appendChild(tile);
        });

        solitaireBoard.querySelectorAll('.solitaire-basket').forEach(basket => {
            basket.addEventListener('click', () => {
                const targetColor = basket.getAttribute('data-color');
                if (solitaireSelectedCard && solitaireSelectedCard.color === targetColor) {
                    solitaireCards = solitaireCards.filter(c => c.id !== solitaireSelectedCard.id);
                    solitaireSelectedCard = null;
                    score += 8;
                    localStorage.setItem('igatamou_game_score', score.toString());
                    updateScoreUI();
                    playCatSoundEffect('correct');
                    triggerCorrectAnswerReaction();

                    if (solitaireCards.length === 0) {
                        if (solitaireStatusText) solitaireStatusText.textContent = '🎉 Μπράβο! Ταξινόμησες όλες τις κάρτες!';
                        if (catSpeechBubble) catSpeechBubble.textContent = `💬 "Είσαι αστέρι! 🌟 +20 Πόντοι!"`;
                    }
                    renderSolitaireBoard();
                } else if (solitaireSelectedCard) {
                    playCatSoundEffect('wrong');
                    triggerWrongAnswerReaction();
                }
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
