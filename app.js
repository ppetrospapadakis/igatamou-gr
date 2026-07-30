document.addEventListener('DOMContentLoaded', () => {
    // 1. Petting Counter & Interaction
    let count = parseInt(localStorage.getItem('igatamou_pet_count') || '0', 10);
    const petCountEl = document.getElementById('petCount');
    const petBtn = document.getElementById('petBtn');
    const mascotInteractive = document.getElementById('mascotInteractive');
    const purrStatusEl = document.getElementById('purrStatus');
    const mascotImg = document.getElementById('mascotImage');

    if (petCountEl) {
        petCountEl.textContent = count;
    }

    // Web Audio Synthesizer for Cat Meow / Purr Sound
    function playCatSound(type = 'meow') {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            if (type === 'meow') {
                // Synthesize cute high-pitched meow sound
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                
                const now = ctx.currentTime;
                // Pitch envelope: starts around 650Hz, sweeps up to 850Hz, drops to 500Hz
                osc.frequency.setValueAtTime(650, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
                osc.frequency.exponentialRampToValueAtTime(450, now + 0.45);

                // Volume envelope
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.48);
            } else if (type === 'purr') {
                // Synthesize soft rumbly purr
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const now = ctx.currentTime;

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(80, now);

                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.6);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.6);
            }
        } catch (e) {
            // Audio context fallback if blocked by browser policy
            console.log('Audio playback prevented or unsupported');
        }
    }

    // Create floating hearts particle effect
    function spawnFloatingHeart(e, emoji = '💖') {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = emoji;

        const x = e.clientX || window.innerWidth / 2;
        const y = e.clientY || window.innerHeight / 2;

        heart.style.left = `${x - 12}px`;
        heart.style.top = `${y - 12}px`;

        const randomTx = (Math.random() - 0.5) * 80;
        heart.style.setProperty('--tx', `${randomTx}px`);

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 1200);
    }

    function doPettingAction(e) {
        count++;
        if (petCountEl) petCountEl.textContent = count;
        localStorage.setItem('igatamou_pet_count', count.toString());

        // Play meow sound
        playCatSound('meow');

        // Spawn particles
        const emojis = ['💖', '🎀', '🐾', '🌸', '✨'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        spawnFloatingHeart(e, randomEmoji);

        // Mascot image animation wiggle
        if (mascotImg) {
            mascotImg.style.transform = 'scale(1.15) rotate(5deg)';
            setTimeout(() => {
                mascotImg.style.transform = 'scale(1) rotate(0deg)';
            }, 250);
        }

        // Purr status update
        if (purrStatusEl) {
            purrStatusEl.textContent = '😸 Νιάου! Η Μάγκας χαίρεται!';
            setTimeout(() => {
                purrStatusEl.textContent = '💤';
            }, 2500);
        }
    }

    if (petBtn) {
        petBtn.addEventListener('click', doPettingAction);
    }
    if (mascotInteractive) {
        mascotInteractive.addEventListener('click', doPettingAction);
    }

    // 2. Interactive Toys Action
    const btnBall = document.getElementById('btnBall');
    const btnYarn = document.getElementById('btnYarn');
    const btnTreat = document.getElementById('btnTreat');
    const toyFeedback = document.getElementById('toyFeedback');

    function playWithToy(toyName, responseText, emoji) {
        if (toyFeedback) {
            toyFeedback.textContent = `${emoji} ${responseText}`;
            toyFeedback.style.animation = 'none';
            toyFeedback.offsetHeight; // trigger reflow
            toyFeedback.style.animation = 'sparklePulse 0.5s ease-in-out';
        }
        playCatSound('meow');
    }

    if (btnBall) {
        btnBall.addEventListener('click', () => {
            playWithToy('Μπάλα', 'Η Μάγκας κυνηγάει τη μπάλα με ενθουσιασμό! ⚽🐾', '🐱');
        });
    }
    if (btnYarn) {
        btnYarn.addEventListener('click', () => {
            playWithToy('Κουβάρι', 'Η Μάγκας μπλέχτηκε στο ροζ κουβάρι! 🧶🎀', '😸');
        });
    }
    if (btnTreat) {
        btnTreat.addEventListener('click', () => {
            playWithToy('Ψαράκι', 'Μιαμ! Η Μάγκας έφαγε το λαχταριστό ψαράκι! 🐟✨', '😻');
        });
    }

    // 3. Email Subscription Form
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
            }
        });
    }
});
