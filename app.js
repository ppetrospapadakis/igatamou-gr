document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Element References
    let count = parseInt(localStorage.getItem('igatamou_pet_count') || '0', 10);
    const petCountEl = document.getElementById('petCount');
    const petBtn = document.getElementById('petBtn');
    const mascotInteractive = document.getElementById('mascotInteractive');
    const purrStatusEl = document.getElementById('purrStatus');
    const mascotImg = document.getElementById('mascotImage');
    const toyFeedback = document.getElementById('toyFeedback');

    const btnBall = document.getElementById('btnBall');
    const btnYarn = document.getElementById('btnYarn');
    const btnTreat = document.getElementById('btnTreat');

    if (petCountEl) {
        petCountEl.textContent = count;
    }

    // 2. Web Audio Synthesizer (Realistic Cat Meow & Purr)
    function playCatSound(type = 'meow') {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            if (type === 'meow') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                const now = ctx.currentTime;
                osc.frequency.setValueAtTime(650, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
                osc.frequency.exponentialRampToValueAtTime(450, now + 0.45);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.48);
            } else if (type === 'purr') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const now = ctx.currentTime;
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(85, now);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.7);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.7);
            }
        } catch (e) {
            console.log('Audio playback prevented');
        }
    }

    // Helper: Get exact screen coordinates of mascot cat image
    function getCatCoords() {
        const target = mascotImg || mascotInteractive;
        if (!target) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const rect = target.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    // Helper: Trigger happy cat jump animation
    function triggerCatJump() {
        if (!mascotImg) return;
        mascotImg.classList.remove('happy-jump');
        void mascotImg.offsetWidth; // Force reflow
        mascotImg.classList.add('happy-jump');
    }

    // Helper: Spawn Screen-Wide Banner Overlay
    function spawnScreenBanner(text) {
        const banner = document.createElement('div');
        banner.className = 'screen-pop-banner';
        banner.textContent = text;
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), 1450);
    }

    // Helper: Spawn Floating Emoji Particles around Cat
    function spawnCatParticles(emojis = ['💖', '🎀', '🐾', '✨']) {
        const coords = getCatCoords();
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.className = 'floating-heart';
                p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                p.style.setProperty('--startX', `${coords.x + (Math.random() - 0.5) * 80}px`);
                p.style.setProperty('--startY', `${coords.y + (Math.random() - 0.5) * 80}px`);
                const randomTx = (Math.random() - 0.5) * 120;
                p.style.setProperty('--tx', `${randomTx}px`);
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 1250);
            }, i * 120);
        }
    }

    // ----------------------------------------------------
    // 3. ACTION 1: STROKING HAND OVERLAY & MEOW SEPARATION
    // ----------------------------------------------------
    // Clicking "💖 Δώσε ένα Χάδι!" button -> Triggers petting hand action
    function triggerPettingAction(e) {
        count++;
        if (petCountEl) petCountEl.textContent = count;
        localStorage.setItem('igatamou_pet_count', count.toString());

        playCatSound('meow');
        triggerCatJump();

        const coords = getCatCoords();

        // Spawn Big Hand Overlay
        const hand = document.createElement('div');
        hand.className = 'screen-overlay-item overlay-hand-stroke';
        hand.textContent = '🫳';
        hand.style.setProperty('--targetX', `${coords.x}px`);
        hand.style.setProperty('--targetY', `${coords.y}px`);
        document.body.appendChild(hand);
        setTimeout(() => hand.remove(), 1450);

        // Banner & Particles
        spawnScreenBanner('🎶 Purrrr... Χάδια! 💖');
        spawnCatParticles(['💖', '🎀', '🐾', '🌸', '✨']);

        if (purrStatusEl) {
            purrStatusEl.textContent = '😸 Νιάου! Η Μάγκας λατρεύει τα χάδια!';
            setTimeout(() => {
                purrStatusEl.textContent = '💤';
            }, 3000);
        }
    }

    if (petBtn) {
        petBtn.addEventListener('click', triggerPettingAction);
    }

    // Clicking "Πίεσε με για νιαούρισμα! 🐾" -> ONLY plays meow sound & cat jump!
    if (mascotInteractive) {
        mascotInteractive.addEventListener('click', () => {
            playCatSound('meow');
            triggerCatJump();
            if (purrStatusEl) {
                purrStatusEl.textContent = '😸 Νιάου! 🐾';
                setTimeout(() => {
                    purrStatusEl.textContent = '💤';
                }, 2500);
            }
        });
    }

    // ----------------------------------------------------
    // 4. ACTION 2: SOCCER BALL FLYING FROM LEFT OVERLAY (⚽)
    // ----------------------------------------------------
    if (btnBall) {
        btnBall.addEventListener('click', (e) => {
            const coords = getCatCoords();

            const ball = document.createElement('div');
            ball.className = 'screen-overlay-item overlay-ball-fly';
            ball.textContent = '⚽';
            ball.style.setProperty('--targetX', `${coords.x}px`);
            ball.style.setProperty('--targetY', `${coords.y}px`);
            document.body.appendChild(ball);

            playCatSound('meow');

            setTimeout(() => {
                triggerCatJump();
                spawnScreenBanner('⚽ ΓΚΟΛ! Η Μάγκας έπιασε τη μπάλα! 🐾');
                spawnCatParticles(['⭐', '⚽', '✨', '🐾']);
            }, 550);

            if (toyFeedback) {
                toyFeedback.textContent = '⚽ Η Μάγκας έκανε φοβερό άλμα και έπιασε τη μπάλα! 🐾';
            }

            setTimeout(() => ball.remove(), 1550);
        });
    }

    // ----------------------------------------------------
    // 5. ACTION 3: YARN BALL ROLLING FROM RIGHT OVERLAY (🧶)
    // ----------------------------------------------------
    if (btnYarn) {
        btnYarn.addEventListener('click', (e) => {
            const coords = getCatCoords();

            const yarn = document.createElement('div');
            yarn.className = 'screen-overlay-item overlay-yarn-roll';
            yarn.textContent = '🧶';
            yarn.style.setProperty('--targetX', `${coords.x}px`);
            yarn.style.setProperty('--targetY', `${coords.y}px`);
            document.body.appendChild(yarn);

            playCatSound('meow');

            setTimeout(() => {
                triggerCatJump();
                spawnScreenBanner('🧶 Μπλέχτηκε στο κουβάρι! 🎀');
                spawnCatParticles(['🎀', '🧶', '✨', '💖']);
            }, 600);

            if (toyFeedback) {
                toyFeedback.textContent = '🧶 Η Μάγκας μπλέχτηκε στο κουβάρι και κάνει τούμπες! 🎀';
            }

            setTimeout(() => yarn.remove(), 1650);
        });
    }

    // ----------------------------------------------------
    // 6. ACTION 4: FISH TREAT SWIMMING OVERLAY (🐟)
    // ----------------------------------------------------
    if (btnTreat) {
        btnTreat.addEventListener('click', (e) => {
            const coords = getCatCoords();

            const fish = document.createElement('div');
            fish.className = 'screen-overlay-item overlay-fish-swim';
            fish.textContent = '🐟';
            fish.style.setProperty('--targetX', `${coords.x}px`);
            fish.style.setProperty('--targetY', `${coords.y}px`);
            document.body.appendChild(fish);

            playCatSound('meow');

            setTimeout(() => {
                triggerCatJump();
                playCatSound('purr');
                spawnScreenBanner('🐟 ΜΙΑΜ! ΝΑΜ ΝΑΜ! 😻');
                spawnCatParticles(['🐟', '✨', '😻', '🦴']);
            }, 700);

            if (toyFeedback) {
                toyFeedback.textContent = '🐟 Μιαμ! Η Μάγκας έφαγε το λαχταριστό ψαράκι! 😻✨';
            }

            setTimeout(() => fish.remove(), 1550);
        });
    }

    // ----------------------------------------------------
    // 7. EMAIL FORM SUBMISSION
    // ----------------------------------------------------
    const notifyForm = document.getElementById('notifyForm');
    const notifyMessage = document.getElementById('notifyMessage');
    const emailInput = document.getElementById('emailInput');

    if (notifyForm) {
        notifyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput ? emailInput.value.trim() : '';
            if (email && notifyMessage) {
                notifyMessage.hidden = false;
                notifyMessage.innerHTML = `🎉 Τέλεια! Το email <strong>${email}</strong> καταχωρήθηκε! Η Μάγκας και η Αριάδνη θα σε ειδοποιήσουν αμέσως μόλις ανοίξουμε! 🐾🎀`;
                notifyForm.reset();
                playCatSound('meow');
                triggerCatJump();
                spawnScreenBanner('🚀 ΕΓΓΡΑΦΗΚΕΣ! 🐾');
                spawnCatParticles(['🚀', '💖', '✨', '🎀']);
            }
        });
    }
});
