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
            }, i * 110);
        }
    }

    // Helper: Spawn Floating Flying Item from Button to Cat Target Image
    function animateFlyingItem(itemEmoji, fromBtn, toImg, animationClass = 'overlay-ball-fly', delayTargetAnimMs = 500) {
        const start = getElementCenter(fromBtn);
        const target = getElementCenter(toImg);

        const flyingEl = document.createElement('div');
        flyingEl.className = `screen-overlay-item ${animationClass}`;
        flyingEl.textContent = itemEmoji;
        flyingEl.style.left = `${start.x}px`;
        flyingEl.style.top = `${start.y}px`;
        flyingEl.style.setProperty('--targetX', `${target.x}px`);
        flyingEl.style.setProperty('--targetY', `${target.y}px`);
        document.body.appendChild(flyingEl);

        setTimeout(() => {
            if (toImg) {
                toImg.classList.remove('happy-jump');
                void toImg.offsetWidth;
                toImg.classList.add('happy-jump');
            }
        }, delayTargetAnimMs);

        setTimeout(() => flyingEl.remove(), 1500);
    }

    // ----------------------------------------------------
    // 1. FOOD ACTION: SPAGHETTI (🍝)
    // ----------------------------------------------------
    const btnActionFood = document.getElementById('btnActionFood');
    const imgFood = document.getElementById('imgFood');
    const speechFood = document.getElementById('speechFood');

    if (btnActionFood) {
        btnActionFood.addEventListener('click', () => {
            playCatSound('meow');
            animateFlyingItem('🍝', btnActionFood, imgFood, 'overlay-fish-swim', 550);

            setTimeout(() => {
                playCatSound('purr');
                if (speechFood) {
                    speechFood.textContent = '«Μιαμ μιαμ! Λαχταριστά σπαγγέτι! 😻🍝»';
                    speechFood.classList.add('speech-highlight');
                    setTimeout(() => speechFood.classList.remove('speech-highlight'), 2000);
                }
                spawnParticles(imgFood, ['🍝', '😋', '💖', '✨']);
            }, 600);
        });
    }

    // ----------------------------------------------------
    // 2. PLAY ACTION: SOFT BALL (🎾)
    // ----------------------------------------------------
    const btnActionPlay = document.getElementById('btnActionPlay');
    const imgPlay = document.getElementById('imgPlay');
    const speechPlay = document.getElementById('speechPlay');

    if (btnActionPlay) {
        btnActionPlay.addEventListener('click', () => {
            playCatSound('meow');
            animateFlyingItem('🎾', btnActionPlay, imgPlay, 'overlay-ball-fly', 500);

            setTimeout(() => {
                if (speechPlay) {
                    speechPlay.textContent = '«Γιούπι! Τέλειο μαλακό μπαλάκι για παιχνίδι! 🐱🎾»';
                    speechPlay.classList.add('speech-highlight');
                    setTimeout(() => speechPlay.classList.remove('speech-highlight'), 2000);
                }
                spawnParticles(imgPlay, ['🎾', '⭐', '✨', '🐾']);
            }, 550);
        });
    }

    // ----------------------------------------------------
    // 3. SLEEP ACTION: BOX & PILLOW (📦🛌)
    // ----------------------------------------------------
    const btnActionSleep = document.getElementById('btnActionSleep');
    const imgSleep = document.getElementById('imgSleep');
    const speechSleep = document.getElementById('speechSleep');

    if (btnActionSleep) {
        btnActionSleep.addEventListener('click', () => {
            playCatSound('purr');
            animateFlyingItem('📦', btnActionSleep, imgSleep, 'overlay-yarn-roll', 600);

            setTimeout(() => {
                if (speechSleep) {
                    speechSleep.textContent = '«Zzz... 😴 Τόσο μαλακά & ζεστά! 🛌💤»';
                    speechSleep.classList.add('speech-highlight');
                    setTimeout(() => speechSleep.classList.remove('speech-highlight'), 2000);
                }
                spawnParticles(imgSleep, ['💤', '🛌', '☁️', '✨']);
            }, 650);
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
            animateFlyingItem('🫳', btnActionPetting, imgPetting, 'overlay-hand-stroke', 450);

            setTimeout(() => {
                playCatSound('purr');
                if (speechPetting) {
                    speechPetting.textContent = '«Purrrrr... 🎶 Τα καλύτερα χάδια στο σαγονάκι! 💖»';
                    speechPetting.classList.add('speech-highlight');
                    setTimeout(() => speechPetting.classList.remove('speech-highlight'), 2000);
                }
                spawnParticles(imgPetting, ['💖', '🌸', '✨', '🐾']);
            }, 500);
        });
    }
});
