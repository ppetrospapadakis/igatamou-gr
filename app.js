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
                gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
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
                gain.gain.setValueAtTime(0.2, now);
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

    // Helper: Get center coordinates of an element
    function getCenterCoords(el) {
        if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const rect = el.getBoundingClientRect();
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

    // Helper: Spawn Floating Particles
    function spawnParticle(x, y, emoji = '💖') {
        const p = document.createElement('div');
        p.className = 'floating-heart';
        p.textContent = emoji;
        p.style.left = `${x - 14}px`;
        p.style.top = `${y - 14}px`;
        const randomTx = (Math.random() - 0.5) * 100;
        p.style.setProperty('--tx', `${randomTx}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1200);
    }

    // Helper: Spawn Action Pop Text (e.g., "ΓΚΟΛ!", "ΜΙΑΜ!", "PURRR!")
    function spawnPopText(x, y, text) {
        const pop = document.createElement('div');
        pop.className = 'action-pop-text';
        pop.textContent = text;
        pop.style.setProperty('--posX', `${x - 60}px`);
        pop.style.setProperty('--posY', `${y - 30}px`);
        document.body.appendChild(pop);
        setTimeout(() => pop.remove(), 1250);
    }

    // ----------------------------------------------------
    // 3. ACTION 1: PETTING HAND ANIMATION (🖐️ -> 🫳)
    // ----------------------------------------------------
    function triggerPettingAction(e) {
        count++;
        if (petCountEl) petCountEl.textContent = count;
        localStorage.setItem('igatamou_pet_count', count.toString());

        // Play Sound
        playCatSound('meow');

        // Cat Jump Animation
        triggerCatJump();

        // 1. Spawn Stroking Hand Overlay over Mascot
        if (mascotInteractive) {
            const hand = document.createElement('div');
            hand.className = 'anim-hand-stroke';
            hand.textContent = '🫳';
            mascotInteractive.appendChild(hand);
            setTimeout(() => hand.remove(), 1000);

            // 2. Spawn Purr Wave Text
            const purrText = document.createElement('div');
            purrText.className = 'purr-wave-text';
            purrText.textContent = '🎶 Purrr... ✨';
            mascotInteractive.appendChild(purrText);
            setTimeout(() => purrText.remove(), 1200);
        }

        // 3. Spawn Hearts & Sparkles around Cat
        const mascotCoords = getCenterCoords(mascotInteractive);
        const emojis = ['💖', '🎀', '🐾', '🌸', '✨', '😻'];
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                spawnParticle(mascotCoords.x + (Math.random() - 0.5) * 60, mascotCoords.y + (Math.random() - 0.5) * 60, randomEmoji);
            }, i * 150);
        }

        // Status update
        if (purrStatusEl) {
            purrStatusEl.textContent = '😸 Νιάου! Η Μάγκας λατρεύει τα χάδια!';
            setTimeout(() => {
                purrStatusEl.textContent = '💤';
            }, 3000);
        }
    }

    if (petBtn) petBtn.addEventListener('click', triggerPettingAction);
    if (mascotInteractive) mascotInteractive.addEventListener('click', triggerPettingAction);

    // ----------------------------------------------------
    // 4. ACTION 2: SOCCER BALL BOUNCE ANIMATION (⚽)
    // ----------------------------------------------------
    if (btnBall) {
        btnBall.addEventListener('click', (e) => {
            const start = getCenterCoords(btnBall);
            const target = getCenterCoords(mascotInteractive);

            // Create Flying Ball
            const ball = document.createElement('div');
            ball.className = 'anim-flying-ball';
            ball.textContent = '⚽';
            ball.style.setProperty('--startX', `${start.x}px`);
            ball.style.setProperty('--startY', `${start.y}px`);
            ball.style.setProperty('--targetX', `${target.x}px`);
            ball.style.setProperty('--targetY', `${target.y}px`);
            document.body.appendChild(ball);

            // Sound
            playCatSound('meow');

            // Trigger reaction midway
            setTimeout(() => {
                triggerCatJump();
                spawnPopText(target.x, target.y - 40, '⚽ ΓΚΟΛ! 🐾');
                for (let i = 0; i < 3; i++) {
                    spawnParticle(target.x + (Math.random() - 0.5) * 40, target.y, '⭐');
                }
            }, 500);

            if (toyFeedback) {
                toyFeedback.textContent = '⚽ Η Μάγκας έκανε φοβερό άλμα και έπιασε τη μπάλα! 🐾';
            }

            setTimeout(() => ball.remove(), 1400);
        });
    }

    // ----------------------------------------------------
    // 5. ACTION 3: YARN BALL ROLLING ANIMATION (🧶)
    // ----------------------------------------------------
    if (btnYarn) {
        btnYarn.addEventListener('click', (e) => {
            const start = getCenterCoords(btnYarn);
            const target = getCenterCoords(mascotInteractive);

            const yarn = document.createElement('div');
            yarn.className = 'anim-flying-yarn';
            yarn.textContent = '🧶';
            yarn.style.setProperty('--startX', `${start.x}px`);
            yarn.style.setProperty('--startY', `${start.y}px`);
            yarn.style.setProperty('--targetX', `${target.x}px`);
            yarn.style.setProperty('--targetY', `${target.y}px`);
            document.body.appendChild(yarn);

            playCatSound('meow');

            setTimeout(() => {
                triggerCatJump();
                spawnPopText(target.x, target.y - 40, '🧶 ΜΠΛΕΧΤΗΚΕ! 🎀');
                for (let i = 0; i < 3; i++) {
                    spawnParticle(target.x + (Math.random() - 0.5) * 50, target.y, '🎀');
                }
            }, 600);

            if (toyFeedback) {
                toyFeedback.textContent = '🧶 Η Μάγκας μπλέχτηκε στο ροζ κουβάρι και κάνει τούμπες! 🎀';
            }

            setTimeout(() => yarn.remove(), 1500);
        });
    }

    // ----------------------------------------------------
    // 6. ACTION 4: FISH TREAT ANIMATION (🐟)
    // ----------------------------------------------------
    if (btnTreat) {
        btnTreat.addEventListener('click', (e) => {
            const start = getCenterCoords(btnTreat);
            const target = getCenterCoords(mascotInteractive);

            const fish = document.createElement('div');
            fish.className = 'anim-flying-fish';
            fish.textContent = '🐟';
            fish.style.setProperty('--startX', `${start.x}px`);
            fish.style.setProperty('--startY', `${start.y}px`);
            fish.style.setProperty('--targetX', `${target.x}px`);
            fish.style.setProperty('--targetY', `${target.y}px`);
            document.body.appendChild(fish);

            playCatSound('meow');

            setTimeout(() => {
                triggerCatJump();
                spawnPopText(target.x, target.y - 40, '🐟 ΜΙΑΜ! ΝΑΜ ΝΑΜ! 😻');
                playCatSound('purr');
                for (let i = 0; i < 4; i++) {
                    spawnParticle(target.x + (Math.random() - 0.5) * 50, target.y, '✨');
                }
            }, 650);

            if (toyFeedback) {
                toyFeedback.textContent = '🐟 Μιαμ! Η Μάγκας έφαγε το λαχταριστό ψαράκι! 😻✨';
            }

            setTimeout(() => fish.remove(), 1300);
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
                notifyMessage.innerHTML = `🎉 Τέλεια! Το email <strong>${email}</strong> καταχωρήθηκε! Η Μάγκας και η 7χρονη Designer μας θα σε ειδοποιήσουν αμέσως μόλις ανοίξουμε! 🐾🎀`;
                notifyForm.reset();
                playCatSound('meow');
                triggerCatJump();
            }
        });
    }
});
