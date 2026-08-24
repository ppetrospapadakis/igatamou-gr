document.addEventListener('DOMContentLoaded', () => {
    // Audio Synthesizer (Realistic Cat Meow & Purr)
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
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.85);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.85);
            }
        } catch (e) {
            console.log('Audio context prevented');
        }
    }

    // Helper: Get element center coordinates
    function getElementCenter(el) {
        if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const rect = el.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    // Helper: Spawn Floating Emoji Particles around target
    function spawnParticles(targetEl, emojis = ['✨', '💖', '🐾']) {
        const coords = getElementCenter(targetEl);
        for (let i = 0; i < 6; i++) {
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

    // Helper: Spawn Floating Flying Item from Button to Cat Target Image (SLOW FLIGHT ~2.0s)
    function animateFlyingItem(itemEmoji, fromBtn, toImg, onReachCallback) {
        const start = getElementCenter(fromBtn);
        const target = getElementCenter(toImg);

        const flyingEl = document.createElement('div');
        flyingEl.className = 'cat-likes-item-fly';
        flyingEl.textContent = itemEmoji;
        flyingEl.style.left = `${start.x}px`;
        flyingEl.style.top = `${start.y}px`;
        flyingEl.style.setProperty('--startX', `${start.x}px`);
        flyingEl.style.setProperty('--startY', `${start.y}px`);
        flyingEl.style.setProperty('--targetX', `${target.x}px`);
        flyingEl.style.setProperty('--targetY', `${target.y}px`);
        document.body.appendChild(flyingEl);

        // When item reaches the cat photo (after ~1.7s)
        setTimeout(() => {
            if (toImg) {
                toImg.classList.remove('happy-jump');
                void toImg.offsetWidth;
                toImg.classList.add('happy-jump');
            }
            if (onReachCallback) onReachCallback();
        }, 1700);

        setTimeout(() => flyingEl.remove(), 2200);
    }

    const isDog = window.SITE_CONFIG ? (SITE_CONFIG.domain === 'oskilosmou') : false;

    // ----------------------------------------------------
    // 1. FOOD ACTION: SPAGHETTI (🍜)
    // ----------------------------------------------------
    const btnActionFood = document.getElementById('btnActionFood');
    const imgFood = document.getElementById('imgFood');
    const speechFood = document.getElementById('speechFood');

    if (btnActionFood) {
        btnActionFood.addEventListener('click', () => {
            playCatSound('meow');
            animateFlyingItem(isDog ? '🍖' : '🍜', btnActionFood, imgFood, () => {
                playCatSound('purr');
                if (speechFood) {
                    speechFood.textContent = isDog ? '«Μιαμ μιαμ! Λαχταριστή λιχουδιά! 🐶🍖»' : '«Μιαμ μιαμ! Λαχταριστά σπαγγέτι! 😻🍜»';
                    speechFood.classList.add('speech-highlight');
                    setTimeout(() => speechFood.classList.remove('speech-highlight'), 2500);
                }
                spawnParticles(imgFood, [isDog ? '🍖' : '🍜', '😋', '💖', '✨']);
            });
        });
    }

    // ----------------------------------------------------
    // 2. PLAY ACTION: TENNIS BALL (🎾)
    // ----------------------------------------------------
    const btnActionPlay = document.getElementById('btnActionPlay');
    const imgPlay = document.getElementById('imgPlay');
    const speechPlay = document.getElementById('speechPlay');

    if (btnActionPlay) {
        btnActionPlay.addEventListener('click', () => {
            playCatSound('meow');
            animateFlyingItem('🎾', btnActionPlay, imgPlay, () => {
                if (speechPlay) {
                    speechPlay.textContent = isDog ? '«Γιούπι! Τέλειο μπαλάκι για τρέξιμο! 🐶🎾»' : '«Γιούπι! Τέλειο μπαλάκι τένις για παιχνίδι! 🐱🎾»';
                    speechPlay.classList.add('speech-highlight');
                    setTimeout(() => speechPlay.classList.remove('speech-highlight'), 2500);
                }
                spawnParticles(imgPlay, ['🎾', '⭐', '✨', '🐾']);
            });
        });
    }

    // ----------------------------------------------------
    // 3. SLEEP ACTION: SOFT PILLOW (☁️)
    // ----------------------------------------------------
    const btnActionSleep = document.getElementById('btnActionSleep');
    const imgSleep = document.getElementById('imgSleep');
    const speechSleep = document.getElementById('speechSleep');

    if (btnActionSleep) {
        btnActionSleep.addEventListener('click', () => {
            playCatSound('purr');
            animateFlyingItem('☁️', btnActionSleep, imgSleep, () => {
                if (speechSleep) {
                    speechSleep.textContent = '«Zzz... 😴 Τόσο μαλακά & ζεστά! ☁️💤»';
                    speechSleep.classList.add('speech-highlight');
                    setTimeout(() => speechSleep.classList.remove('speech-highlight'), 2500);
                }
                spawnParticles(imgSleep, ['💤', '☁️', '✨']);
            });
        });
    }

    // ----------------------------------------------------
    // 4. PETTING ACTION: HAND (🫳)
    // ----------------------------------------------------
    const btnActionPetting = document.getElementById('btnActionPetting');
    const imgPetting = document.getElementById('imgPetting');
    const speechPetting = document.getElementById('speechPetting');

    if (btnActionPetting) {
        btnActionPetting.addEventListener('click', () => {
            playCatSound('meow');
            animateFlyingItem('🫳', btnActionPetting, imgPetting, () => {
                playCatSound('purr');
                if (speechPetting) {
                    speechPetting.textContent = isDog ? '«Γαβ γαβ! 🎶 Τα καλύτερα χάδια στην κοιλίτσα! 🐶💖»' : '«Purrrrr... 🎶 Τα καλύτερα χάδια στο σαγονάκι! 💖»';
                    speechPetting.classList.add('speech-highlight');
                    setTimeout(() => speechPetting.classList.remove('speech-highlight'), 2500);
                }
                spawnParticles(imgPetting, ['💖', '✨', '🐾', '🥰']);
            });
        });
    }
});
