document.addEventListener('DOMContentLoaded', () => {
    // Universal Domain Check
    const isDog = typeof checkIsDogDomain === 'function' 
        ? checkIsDogDomain() 
        : ((window.SITE_CONFIG && window.SITE_CONFIG.domain === 'oskilosmou') || window.location.hostname.includes('oskilosmou') || (new URLSearchParams(window.location.search).get('site') || '').includes('oskilosmou') || (new URLSearchParams(window.location.search).get('site') || '').includes('dog'));
    const domainKey = isDog ? 'oskilosmou' : 'igatamou';

    // 1. DOM Element References
    let count = parseInt(localStorage.getItem(domainKey + '_pet_count') || '0', 10);
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

    // 2. Web Audio Synthesizer (Realistic Cat Meow & Purr / Dog Bark & Pant)
    function playCatSound(type = 'meow') {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            if (isDog) {
                if (type === 'meow') {
                    // Puppy bark / woof
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    const now = ctx.currentTime;
                    osc.frequency.setValueAtTime(320, now);
                    osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
                    osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);

                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.4, now + 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.26);
                } else if (type === 'purr') {
                    // Puppy happy pant / yip
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const now = ctx.currentTime;
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(450, now);
                    osc.frequency.exponentialRampToValueAtTime(650, now + 0.12);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.linearRampToValueAtTime(0, now + 0.3);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.32);
                }
                return;
            }

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
        localStorage.setItem(domainKey + '_pet_count', count.toString());

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
        spawnScreenBanner(isDog ? '🎶 Γαβ γαβ! Χάδια! 💖' : '🎶 Purrrr... Χάδια! 💖');
        spawnCatParticles(['💖', '🎀', '🐾', '🌸', '✨']);

        if (purrStatusEl) {
            purrStatusEl.textContent = isDog ? '🐶 Γαβ! Ο Φίλος λατρεύει τα χάδια!' : '😸 Νιάου! Η Μάγκας λατρεύει τα χάδια!';
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
                purrStatusEl.textContent = isDog ? '🐶 Γαβ! 🐾' : '😸 Νιάου! 🐾';
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
                spawnScreenBanner(isDog ? '⚽ ΓΚΟΛ! Ο Φίλος έπιασε τη μπάλα! 🐾' : '⚽ ΓΚΟΛ! Η Μάγκας έπιασε τη μπάλα! 🐾');
                spawnCatParticles(['⭐', '⚽', '✨', '🐾']);
            }, 550);

            if (toyFeedback) {
                toyFeedback.textContent = isDog ? '⚽ Ο Φίλος έκανε φοβερό άλμα και έπιασε τη μπάλα! 🐾' : '⚽ Η Μάγκας έκανε φοβερό άλμα και έπιασε τη μπάλα! 🐾';
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
            yarn.textContent = isDog ? '🎾' : '🧶';
            yarn.style.setProperty('--targetX', `${coords.x}px`);
            yarn.style.setProperty('--targetY', `${coords.y}px`);
            document.body.appendChild(yarn);

            playCatSound('meow');

            setTimeout(() => {
                triggerCatJump();
                spawnScreenBanner(isDog ? '🎾 Ο Φίλος έπιασε το μπαλάκι! 🐾' : '🧶 Μπλέχτηκε στο κουβάρι! 🎀');
                spawnCatParticles(isDog ? ['🎾', '⭐', '✨', '🐾', '🐶'] : ['🎀', '🧶', '✨', '💖']);
            }, 600);

            if (toyFeedback) {
                toyFeedback.textContent = isDog ? '🎾 Ο Φίλος κυνήγησε το μπαλάκι και κουνάει την ουρίτσα του! 🐶' : '🧶 Η Μάγκας μπλέχτηκε στο κουβάρι και κάνει τούμπες! 🎀';
            }

            setTimeout(() => yarn.remove(), 1650);
        });
    }

    // ----------------------------------------------------
    // 6. ACTION 4: TREAT (🦴 or 🐟)
    // ----------------------------------------------------
    if (btnTreat) {
        btnTreat.addEventListener('click', (e) => {
            const coords = getCatCoords();

            const treat = document.createElement('div');
            treat.className = isDog
                ? 'screen-overlay-item overlay-bone-toss'
                : 'screen-overlay-item overlay-fish-swim';
            treat.textContent = isDog ? '🦴' : '🐟';
            treat.style.setProperty('--targetX', `${coords.x}px`);
            treat.style.setProperty('--targetY', `${coords.y}px`);
            document.body.appendChild(treat);

            playCatSound('meow');

            setTimeout(() => {
                triggerCatJump();
                playCatSound('purr');
                spawnScreenBanner(isDog ? '🦴 ΜΙΑΜ! ΝΑΜ ΝΑΜ! 🐶' : '🐟 ΜΙΑΜ! ΝΑΜ ΝΑΜ! 😻');
                spawnCatParticles(isDog ? ['🦴', '✨', '🐶', '💖'] : ['🐟', '✨', '😻', '🦴']);
            }, 700);

            if (toyFeedback) {
                toyFeedback.textContent = isDog ? '🦴 Μιαμ! Ο Φίλος έφαγε το λαχταριστό κοκκαλάκι! 🐶✨' : '🐟 Μιαμ! Η Μάγκας έφαγε το λαχταριστό ψαράκι! 😻✨';
            }

            setTimeout(() => treat.remove(), 1550);
        });
    }

    // ----------------------------------------------------
    // 7. EMAIL FORM SUBMISSION (PERSISTED)
    // ----------------------------------------------------
    const notifyForm = document.getElementById('notifyForm');
    const notifyMessage = document.getElementById('notifyMessage');
    const emailInput = document.getElementById('emailInput');

    const SUPABASE_URL = 'https://hqabeqlvnqdvipnspjog.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYWJlcWx2bnFkdmlwbnNwam9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDQzNDMsImV4cCI6MjEwMDk4MDM0M30.nmB5WOUN-WFQRhRxS14yCLK7X5I8OqJbWk-lRtR0yDg';

    if (notifyForm) {
        notifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput ? emailInput.value.trim() : '';
            if (email) {
                // 1. Save to Local Storage
                const SUBSCRIBERS_KEY = 'igatamou_newsletter_subscribers';
                let subs = [];
                try {
                    subs = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]');
                } catch(err) {
                    subs = [];
                }

                const existing = subs.find(s => s.email.toLowerCase() === email.toLowerCase());
                if (!existing) {
                    const now = new Date();
                    const formattedDate = now.toLocaleDateString('el-GR') + ' ' + now.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });
                    const newSub = {
                        id: 'sub_' + Date.now(),
                        email: email,
                        date: formattedDate,
                        timestamp: Date.now()
                    };
                    subs.unshift(newSub);
                    localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subs));
                }

                // 2. Save to Supabase 'subscribers' table if available
                if (window.supabase && window.supabase.createClient) {
                    try {
                        const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                        await sb.from('subscribers').insert([{ email: email, created_at: new Date().toISOString() }]);
                    } catch (err) {
                        console.log('Supabase subscriber notice:', err);
                    }
                }

                if (notifyMessage) {
                    notifyMessage.hidden = false;
                    notifyMessage.innerHTML = isDog
                        ? `🎉 Τέλεια! Το email <strong>${email}</strong> καταχωρήθηκε! Ο Φίλος και η Αριάδνη θα σε ειδοποιήσουν αμέσως μόλις είμαστε έτοιμοι! 🐾🦴`
                        : `🎉 Τέλεια! Το email <strong>${email}</strong> καταχωρήθηκε! Η Μάγκας και η Αριάδνη θα σε ειδοποιήσουν αμέσως μόλις είμαστε έτοιμοι! 🐾🎀`;
                }
                notifyForm.reset();
                playCatSound('meow');
                triggerCatJump();
                spawnScreenBanner('🚀 ΕΓΓΡΑΦΗΚΕΣ! 🐾');
                spawnCatParticles(['🚀', '💖', '✨', '🎀']);
            }
        });
    }
});
