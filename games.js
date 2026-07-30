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
        if (optionsGrid) {
            optionsGrid.innerHTML = '';
            optionsGrid.hidden = true;
        }
        if (memoryBoard) {
            memoryBoard.innerHTML = '';
            memoryBoard.hidden = true;
        }
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
            memory: "🧩 Γατο-Memory"
        };
        if (arenaCategoryTitle) arenaCategoryTitle.textContent = catTitles[categoryKey] || "Παιχνίδι";

        if (categoryKey === 'memory') {
            setupMemoryGame();
        } else {
            if (optionsGrid) optionsGrid.hidden = false;
            if (memoryBoard) memoryBoard.hidden = true;

            currentQuestions = [...(gameDatabase[categoryKey] || [])];
            currentQuestions.sort(() => Math.random() - 0.5);
            currentQIndex = 0;
            renderCurrentQuestion();
        }
    }

    function renderCurrentQuestion() {
        if (currentQIndex >= currentQuestions.length) {
            showCategoryCompleted();
            return;
        }

        if (memoryBoard) memoryBoard.hidden = true;
        if (optionsGrid) optionsGrid.hidden = false;

        const qData = currentQuestions[currentQIndex];
        if (questionNumber) questionNumber.textContent = `Ερώτηση ${currentQIndex + 1} από ${currentQuestions.length}`;
        if (questionText) questionText.textContent = qData.q;
        if (visualHelper) visualHelper.textContent = qData.helper || '';

        if (optionsGrid) {
            optionsGrid.innerHTML = '';
            const opts = [...qData.opts].sort(() => Math.random() - 0.5);
            opts.forEach(optText => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = optText;
                btn.addEventListener('click', () => handleOptionClick(btn, optText, qData.a));
                optionsGrid.appendChild(btn);
            });
        }

        if (catSpeechBubble) {
            catSpeechBubble.className = 'cat-speech-bubble';
            catSpeechBubble.textContent = `💬 "Σκέψου καλά και πάτα τη σωστή απάντηση! 🐾"`;
        }
    }

    function handleOptionClick(btn, selectedOption, correctAnswer) {
        const allBtns = document.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.disabled = true);

        if (selectedOption === correctAnswer) {
            btn.classList.add('correct-pop');
            streak++;
            score += 10;
            localStorage.setItem('igatamou_game_score', score.toString());
            updateScoreUI();
            triggerRightAnswerReaction();

            setTimeout(() => {
                currentQIndex++;
                renderCurrentQuestion();
            }, 1500);

        } else {
            btn.classList.add('wrong-pop');
            streak = 0;
            updateScoreUI();
            triggerWrongAnswerReaction();

            setTimeout(() => {
                allBtns.forEach(b => b.disabled = false);
                btn.classList.remove('wrong-pop');
            }, 1400);
        }
    }

    // ----------------------------------------------------
    // RICH GRAPHICAL MASCOT REACTIONS FOR ALL GAMES
    // ----------------------------------------------------
    function triggerRightAnswerReaction() {
        playCatSoundEffect('correct');

        // Joyful Cat Avatar Animations
        if (companionCatImg) {
            companionCatImg.className = 'companion-cat-img happy-cat-jump';
        }
        if (companionCatFrame) {
            companionCatFrame.className = 'companion-cat-frame cat-halo-correct';
        }

        // Speech Bubble styling & joyful meow phrases
        const happyPhrases = [
            '🎉 "ΜΠΡΑΒΟ! Είσαι αστέρι! 😻✨"',
            '😻 "ΝΙΑΟΥ! Τέλεια απάντηση! 🐟"',
            '✨ "ΣΩΣΤΑ! Κέρδισες +10 Γατο-Νομίσματα! 🪙"',
            '💖 "ΕΞΑΙΡΕΤΙΚΑ! Η Αριάδνη και εγώ σε χειροκροτούμε! 👏"'
        ];
        if (catSpeechBubble) {
            catSpeechBubble.className = 'cat-speech-bubble bubble-correct';
            catSpeechBubble.textContent = happyPhrases[Math.floor(Math.random() * happyPhrases.length)];
        }

        // Spawn Floating Celebration Emojis around Cat Avatar Frame
        spawnCatCompanionParticles(['🎉', '✨', '⭐', '😻', '💖', '🐟'], true);

        // Screen-wide Banner
        const banners = ['🌟 ΣΩΣΤΟ! +10 ΠΟΝΤΟΙ! 🪙', '😻 ΜΠΡΑΒΟ! ΤΕΛΕΙΑ! ✨', '🎉 ΕΙΣΑΙ ΦΟΒΕΡΟΣ/Η! 🐾'];
        const bannerText = banners[Math.floor(Math.random() * banners.length)];

        const banner = document.createElement('div');
        banner.className = 'screen-pop-banner';
        banner.textContent = bannerText;
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 1400);
    }

    function triggerWrongAnswerReaction() {
        playCatSoundEffect('wrong');

        // Sad/Confused Cat Avatar Animations
        if (companionCatImg) {
            companionCatImg.className = 'companion-cat-img sad-cat-wiggle';
        }
        if (companionCatFrame) {
            companionCatFrame.className = 'companion-cat-frame cat-halo-wrong';
        }

        // Speech Bubble styling & encouraging phrases
        const encouragePhrases = [
            '🐾 "Δεν πειράζει! Δοκίμασε ξανά, πιστεύω σε σένα! 💖"',
            '🌸 "Σχεδόν το βρήκες! Ξαναπροσπάθησε! ✨"',
            '🤗 "Μην ανησυχείς! Μέσα από τα λάθη μαθαίνουμε! 🌟"'
        ];
        if (catSpeechBubble) {
            catSpeechBubble.className = 'cat-speech-bubble bubble-wrong';
            catSpeechBubble.textContent = encouragePhrases[Math.floor(Math.random() * encouragePhrases.length)];
        }

        // Spawn Puzzled Sweatdrop/Sad Emojis around Cat Avatar Frame
        spawnCatCompanionParticles(['💧', '🤔', '❓', '😿', '💭'], false);
    }

    function spawnCatCompanionParticles(emojis, isCorrect) {
        if (!companionCatFrame) return;
        const rect = companionCatFrame.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.className = `companion-particle ${isCorrect ? 'particle-correct' : 'particle-wrong'}`;
                p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                
                const offsetX = (Math.random() - 0.5) * 70;
                const offsetY = (Math.random() - 0.5) * 70;
                p.style.left = `${centerX + offsetX}px`;
                p.style.top = `${centerY + offsetY}px`;
                
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 1200);
            }, i * 100);
        }
    }

    function showCategoryCompleted() {
        if (questionNumber) questionNumber.textContent = "ΟΛΟΚΛΗΡΩΣΗ!";
        if (questionText) questionText.textContent = "🎉 Συγχαρητήρια! Ολοκλήρωσες όλες τις ερωτήσεις!";
        if (visualHelper) visualHelper.textContent = "🏆 Μάζεψες πολλούς πόντους & έκανες τη Μάγκα πανευτυχή!";
        if (optionsGrid) {
            optionsGrid.innerHTML = '';
            optionsGrid.hidden = false;
        }
        if (memoryBoard) memoryBoard.hidden = true;

        const restartBtn = document.createElement('button');
        restartBtn.className = 'btn btn-games-cta';
        restartBtn.textContent = '🔄 Παίξε Ξανά αυτή την Κατηγορία!';
        restartBtn.addEventListener('click', () => startCategoryGame(currentCategory));
        optionsGrid.appendChild(restartBtn);

        if (catSpeechBubble) {
            catSpeechBubble.className = 'cat-speech-bubble bubble-correct';
            catSpeechBubble.textContent = '👑 "Είσαι αληθινός/ή Master! Πάμε να παίξουμε κι άλλα παιχνίδια! 🐾"';
        }
    }

    // ----------------------------------------------------
    // 5. MEMORY GAME ENGINE (🧩) - PRETTY 3D TILES
    // ----------------------------------------------------
    function setupMemoryGame() {
        if (optionsGrid) {
            optionsGrid.innerHTML = '';
            optionsGrid.hidden = true;
        }
        if (memoryBoard) {
            memoryBoard.innerHTML = '';
            memoryBoard.hidden = false;
        }

        if (questionNumber) questionNumber.textContent = "Γατο-Memory";
        if (questionText) questionText.textContent = "🧩 Βρες όλα τα ζευγάρια με τις γατούλες!";
        if (visualHelper) visualHelper.textContent = "";

        memoryFlippedCards = [];
        memoryMatchedPairs = 0;

        const deck = [...memoryEmojis, ...memoryEmojis].sort(() => Math.random() - 0.5);

        deck.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card-tile';
            card.setAttribute('data-emoji', emoji);
            card.setAttribute('data-index', index);

            card.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-front">
                        <span class="memory-emoji">${emoji}</span>
                    </div>
                    <div class="memory-card-back">
                        <span class="memory-paw">🐾</span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => handleMemoryCardClick(card, emoji));
            memoryBoard.appendChild(card);
        });

        if (catSpeechBubble) {
            catSpeechBubble.className = 'cat-speech-bubble';
            catSpeechBubble.textContent = '🧩 "Άνοιξε τις κάρτες και βρες τα όμοια ζευγάρια! 🐾"';
        }
    }

    function handleMemoryCardClick(card, emoji) {
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        if (memoryFlippedCards.length >= 2) return;

        playCatSoundEffect('click');

        card.classList.add('flipped');
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
                    setTimeout(() => {
                        showCategoryCompleted();
                    }, 1200);
                }
            } else {
                // NO MATCH
                triggerWrongAnswerReaction();
                setTimeout(() => {
                    c1.card.classList.remove('flipped');
                    c2.card.classList.remove('flipped');
                    memoryFlippedCards = [];
                }, 1100);
            }
        }
    }

    // Sound FX Helper
    function playCatSoundEffect(type) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            if (type === 'correct') {
                // Joyful Meow + Chime
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
                // Sad Gentle Meow
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
