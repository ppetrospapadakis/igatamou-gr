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
    const questionNumber = document.getElementById('questionNumber');
    const questionText = document.getElementById('questionText');
    const visualHelper = document.getElementById('visualHelper');
    const optionsGrid = document.getElementById('optionsGrid');
    const memoryBoard = document.getElementById('memoryBoard');
    const companionCatImg = document.getElementById('companionCatImg');
    const catSpeechBubble = document.getElementById('catSpeechBubble');
    const mascotCrown = document.getElementById('mascotCrown');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const streakCount = document.getElementById('streakCount');
    const trophyBtn = document.getElementById('trophyBtn');
    const trophyBadgeName = document.getElementById('trophyBadgeName');
    const trophyModal = document.getElementById('trophyModal');
    const closeTrophyBtn = document.getElementById('closeTrophyBtn');

    // Update Initial Score UI
    updateScoreUI();

    // ----------------------------------------------------
    // 3. EVENT LISTENERS
    // ----------------------------------------------------

    // Category Card Clicks
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const catKey = card.getAttribute('data-category');
            startCategoryGame(catKey);
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
    // 4. GAME FLOW CONTROLLER
    // ----------------------------------------------------

    function updateScoreUI() {
        if (scoreDisplay) scoreDisplay.textContent = score;
        if (streakCount) streakCount.textContent = streak;

        // Update Trophies Progress
        checkTrophies();
    }

    function checkTrophies() {
        const t1 = document.getElementById('trophy1');
        const t2 = document.getElementById('trophy2');
        const t3 = document.getElementById('trophy3');
        const statusT2 = document.getElementById('statusT2');
        const statusT3 = document.getElementById('statusT3');

        // Trophy 1: 50 pts
        if (score >= 50 && t1) {
            t1.classList.add('unlocked');
            if (trophyBadgeName) trophyBadgeName.textContent = '🥉 Μικρός Γατο-Εξερευνητής';
        }
        // Trophy 2: 100 pts
        if (score >= 100 && t2) {
            t2.classList.add('unlocked');
            if (statusT2) statusT2.textContent = 'Ξεκλειδώθηκε! ✅';
            if (trophyBadgeName) trophyBadgeName.textContent = '🥈 Γατο-Σοφός';
        }
        // Trophy 3: 200 pts
        if (score >= 200 && t3) {
            t3.classList.add('unlocked');
            if (statusT3) statusT3.textContent = 'Ξεκλειδώθηκε! 👑';
            if (trophyBadgeName) trophyBadgeName.textContent = '🥇 Master Γατο-Επιστήμονας!';
            if (mascotCrown) mascotCrown.hidden = false;
        }
    }

    function showCategoryMenu() {
        if (gameArena) gameArena.hidden = true;
        if (categoryMenu) categoryMenu.hidden = false;
        currentCategory = null;
    }

    function startCategoryGame(categoryKey) {
        currentCategory = categoryKey;
        if (categoryMenu) categoryMenu.hidden = true;
        if (gameArena) gameArena.hidden = false;

        // Set Title
        const catTitles = {
            math: "🧮 Μαθηματικά",
            spelling: "✏️ Ορθογραφία",
            english: "🇬🇧 Αγγλικά (English Cats)",
            riddles: "💡 Γρίφοι & Σκέψη",
            nature: "🌿 Γνώσεις & Φύση",
            geography: "🗺️ Γεωγραφία",
            memory: "🧩 Γατο-Memory"
        };
        if (arenaCategoryTitle) arenaCategoryTitle.textContent = catTitles[categoryKey] || "Παιχνίδι";

        if (categoryKey === 'memory') {
            setupMemoryGame();
        } else {
            // Standard Multiple Choice Games
            if (optionsGrid) optionsGrid.hidden = false;
            if (memoryBoard) memoryBoard.hidden = true;

            currentQuestions = [...(gameDatabase[categoryKey] || [])];
            // Shuffle questions
            currentQuestions.sort(() => Math.random() - 0.5);
            currentQIndex = 0;
            renderCurrentQuestion();
        }
    }

    function renderCurrentQuestion() {
        if (currentQIndex >= currentQuestions.length) {
            // Completed category round!
            showCategoryCompleted();
            return;
        }

        const qData = currentQuestions[currentQIndex];
        if (questionNumber) questionNumber.textContent = `Ερώτηση ${currentQIndex + 1} από ${currentQuestions.length}`;
        if (questionText) questionText.textContent = qData.q;
        if (visualHelper) visualHelper.textContent = qData.helper || '';

        // Options
        if (optionsGrid) {
            optionsGrid.innerHTML = '';
            // Shuffle options
            const opts = [...qData.opts].sort(() => Math.random() - 0.5);
            opts.forEach(optText => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = optText;
                btn.addEventListener('click', () => handleOptionClick(btn, optText, qData.a));
                optionsGrid.appendChild(btn);
            });
        }

        // Reset Cat Speech
        if (catSpeechBubble) {
            catSpeechBubble.textContent = `💬 "Σκέψου καλά και πάτα τη σωστή απάντηση! 🐾"`;
        }
    }

    function handleOptionClick(btn, selectedOption, correctAnswer) {
        // Disable all options during feedback
        const allBtns = document.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.disabled = true);

        if (selectedOption === correctAnswer) {
            // CORRECT ANSWER
            btn.classList.add('correct-choice');
            streak++;
            score += 10;
            localStorage.setItem('igatamou_game_score', score.toString());
            updateScoreUI();

            // Reaction Trigger
            triggerRightAnswerReaction();

            setTimeout(() => {
                currentQIndex++;
                renderCurrentQuestion();
            }, 1500);

        } else {
            // INCORRECT ANSWER (Pedagogical Encouraging Feedback)
            btn.classList.add('wrong-choice');
            streak = 0;
            updateScoreUI();

            // Reaction Trigger for Incorrect
            triggerWrongAnswerReaction();

            setTimeout(() => {
                allBtns.forEach(b => b.disabled = false);
                btn.classList.remove('wrong-choice');
            }, 1400);
        }
    }

    function triggerRightAnswerReaction() {
        // Audio
        playCatSoundEffect('correct');

        // Cat Jump Animation
        if (companionCatImg) {
            companionCatImg.classList.remove('happy-jump');
            void companionCatImg.offsetWidth;
            companionCatImg.classList.add('happy-jump');
        }

        // Cat Speech Bubble
        const happyPhrases = [
            '🎉 "ΜΠΡΑΒΟ! Είσαι φοβερός/ή! 🌟"',
            '😻 "ΤΕΛΕΙΑ! Έφαγα λαχταριστό ψαράκι! 🐟"',
            '✨ "ΣΩΣΤΑ! Κέρδισες +10 Γατο-Νομίσματα! 🪙"',
            '💖 "ΕΞΑΙΡΕΤΙΚΑ! Η Αριάδνη και εγώ σε χειροκροτούμε! 👏"'
        ];
        if (catSpeechBubble) {
            catSpeechBubble.textContent = happyPhrases[Math.floor(Math.random() * happyPhrases.length)];
        }

        // Spawn Flying Treat Screen Banner
        const banners = ['🌟 ΣΩΣΤΟ! +10 ΠΟΝΤΟΙ! 🪙', '😻 ΜΠΡΑΒΟ! ΤΕΛΕΙΑ! ✨', '🎉 ΕΙΣΑΙ ΦΟΒΕΡΟΣ/Η! 🐾'];
        const bannerText = banners[Math.floor(Math.random() * banners.length)];
        
        const banner = document.createElement('div');
        banner.className = 'screen-pop-banner';
        banner.textContent = bannerText;
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 1400);
    }

    function triggerWrongAnswerReaction() {
        // Audio
        playCatSoundEffect('wrong');

        // Encourage Speech
        const encouragePhrases = [
            '🐾 "Δεν πειράζει! Δοκίμασε ξανά, πιστεύω σε σένα! 💖"',
            '🌸 "Σχεδόν το βρήκες! Ξαναπροσπάθησε! ✨"',
            '🤗 "Μην ανησυχείς! Μέσα από τα λάθη μαθαίνουμε! 🌟"'
        ];
        if (catSpeechBubble) {
            catSpeechBubble.textContent = encouragePhrases[Math.floor(Math.random() * encouragePhrases.length)];
        }
    }

    function showCategoryCompleted() {
        if (questionNumber) questionNumber.textContent = "ΟΛΟΚΛΗΡΩΣΗ!";
        if (questionText) questionText.textContent = "🎉 Συγχαρητήρια! Ολοκλήρωσες όλες τις ερωτήσεις!";
        if (visualHelper) visualHelper.textContent = "🏆 Μάζεψες πολλούς πόντους & έκανες τη Μάγκα πανευτυχή!";
        if (optionsGrid) optionsGrid.innerHTML = '';

        const restartBtn = document.createElement('button');
        restartBtn.className = 'btn btn-games-cta';
        restartBtn.textContent = '🔄 Παίξε Ξανά αυτή την Κατηγορία!';
        restartBtn.addEventListener('click', () => startCategoryGame(currentCategory));
        optionsGrid.appendChild(restartBtn);

        if (catSpeechBubble) {
            catSpeechBubble.textContent = '👑 "Είσαι αληθινός/ή Master! Πάμε να παίξουμε κι άλλα παιχνίδια! 🐾"';
        }
    }

    // ----------------------------------------------------
    // 5. MEMORY GAME ENGINE (🧩)
    // ----------------------------------------------------
    function setupMemoryGame() {
        if (optionsGrid) optionsGrid.hidden = true;
        if (memoryBoard) memoryBoard.hidden = false;

        if (questionNumber) questionNumber.textContent = "Γατο-Memory";
        if (questionText) questionText.textContent = "🧩 Βρες όλα τα ζευγάρια με τις γατούλες!";
        if (visualHelper) visualHelper.textContent = "";

        memoryBoard.innerHTML = '';
        memoryFlippedCards = [];
        memoryMatchedPairs = 0;

        // Duplicate and shuffle cards
        const deck = [...memoryEmojis, ...memoryEmojis].sort(() => Math.random() - 0.5);

        deck.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card-item';
            card.setAttribute('data-emoji', emoji);
            card.setAttribute('data-index', index);
            card.textContent = '❓';

            card.addEventListener('click', () => handleMemoryCardClick(card, emoji));
            memoryBoard.appendChild(card);
        });

        if (catSpeechBubble) {
            catSpeechBubble.textContent = '🧩 "Άνοιξε τις κάρτες και βρες τα όμοια ζευγάρια! 🐾"';
        }
    }

    function handleMemoryCardClick(card, emoji) {
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (memoryFlippedCards.length >= 2) return;

        // Flip card
        card.classList.add('flipped');
        card.textContent = emoji;
        memoryFlippedCards.push({ card, emoji });

        if (memoryFlippedCards.length === 2) {
            const [c1, c2] = memoryFlippedCards;

            if (c1.emoji === c2.emoji) {
                // MATCH!
                c1.card.classList.add('matched');
                c2.card.classList.add('matched');
                memoryMatchedPairs++;
                score += 15;
                localStorage.setItem('igatamou_game_score', score.toString());
                updateScoreUI();
                triggerRightAnswerReaction();

                memoryFlippedCards = [];

                if (memoryMatchedPairs === memoryEmojis.length) {
                    setTimeout(showCategoryCompleted, 1000);
                }
            } else {
                // NO MATCH
                setTimeout(() => {
                    c1.card.classList.remove('flipped');
                    c2.card.classList.remove('flipped');
                    c1.card.textContent = '❓';
                    c2.card.textContent = '❓';
                    memoryFlippedCards = [];
                }, 1000);
            }
        }
    }

    // ----------------------------------------------------
    // 6. AUDIO SYNTHESIZER FOR GAME EFFECTS
    // ----------------------------------------------------
    function playCatSoundEffect(type) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const now = ctx.currentTime;

            if (type === 'correct') {
                // Cheerful chime: C5 -> E5 -> G5 -> C6
                const freqs = [523.25, 659.25, 783.99, 1046.50];
                freqs.forEach((f, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now + i * 0.08);
                    gain.gain.setValueAtTime(0, now + i * 0.08);
                    gain.gain.linearRampToValueAtTime(0.25, now + i * 0.08 + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + i * 0.08);
                    osc.stop(now + i * 0.08 + 0.28);
                });
            } else if (type === 'wrong') {
                // Gentle low meow sound (non-jarring)
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(450, now);
                osc.frequency.exponentialRampToValueAtTime(350, now + 0.3);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.38);
            }
        } catch (e) {
            console.log('Game audio error');
        }
    }
});
