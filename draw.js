document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. SUPABASE CLIENT & DATA STORAGE INITIALIZATION
    // ----------------------------------------------------
    const SUPABASE_URL = 'https://hqabeqlvnqdvipnspjog.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYWJlcWx2bnFkdmlwbnNwam9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDQzNDMsImV4cCI6MjEwMDk4MDM0M30.nmB5WOUN-WFQRhRxS14yCLK7X5I8OqJbWk-lRtR0yDg';
    let supabase = null;
    if (window.supabase && window.supabase.createClient) {
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } catch (e) {
            console.log('Supabase client init error in draw.js:', e);
        }
    }

    // ----------------------------------------------------
    // 2. CANVAS & STUDIO STATE
    // ----------------------------------------------------
    const canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let isDrawing = false;
    let currentColor = '#ff5e7e';
    let isRainbow = false;
    let rainbowHue = 0;
    let currentSize = 4;
    let currentTool = 'brush'; // 'brush', 'bucket', 'eraser'
    let undoStack = [];
    const MAX_UNDO = 15;

    // Initialize Canvas Dimensions & Background
    function initCanvas() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
    }

    function saveState() {
        if (undoStack.length >= MAX_UNDO) {
            undoStack.shift();
        }
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    function undo() {
        if (undoStack.length > 1) {
            undoStack.pop(); // Remove current state
            const previousState = undoStack[undoStack.length - 1];
            ctx.putImageData(previousState, 0, 0);
        }
    }

    function clearCanvas() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
    }

    // Get Coordinates accounting for Canvas Scaling
    function getCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    // Start Drawing / Action
    function startDrawing(e) {
        e.preventDefault();
        const coords = getCoords(e);

        if (currentTool === 'bucket') {
            saveState();
            floodFill(Math.round(coords.x), Math.round(coords.y), isRainbow ? '#ff5e7e' : (currentTool === 'eraser' ? '#ffffff' : currentColor));
            return;
        }

        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        draw(e);
    }

    // Continue Drawing
    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const coords = getCoords(e);

        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (currentTool === 'eraser') {
            ctx.strokeStyle = '#ffffff';
        } else if (isRainbow) {
            rainbowHue = (rainbowHue + 4) % 360;
            ctx.strokeStyle = `hsl(${rainbowHue}, 100%, 60%)`;
        } else {
            ctx.strokeStyle = currentColor;
        }

        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
    }

    // Stop Drawing
    function stopDrawing(e) {
        if (isDrawing) {
            isDrawing = false;
            ctx.closePath();
            saveState();
        }
    }

    // Mouse & Touch Listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    // ----------------------------------------------------
    // 3. FLOOD FILL (COLOR BUCKET) ALGORITHM
    // ----------------------------------------------------
    function floodFill(startX, startY, fillColorHex) {
        if (startX < 0 || startX >= canvas.width || startY < 0 || startY >= canvas.height) return;

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const fillRgb = hexToRgb(fillColorHex);
        const targetPos = (startY * canvas.width + startX) * 4;
        const targetR = data[targetPos];
        const targetG = data[targetPos + 1];
        const targetB = data[targetPos + 2];
        const targetA = data[targetPos + 3];

        if (targetR === fillRgb.r && targetG === fillRgb.g && targetB === fillRgb.b) return;

        const queue = [[startX, startY]];
        const visited = new Uint8Array(canvas.width * canvas.height);

        while (queue.length > 0) {
            const [x, y] = queue.pop();
            const pos = (y * canvas.width + x) * 4;
            const visitedIdx = y * canvas.width + x;

            if (visited[visitedIdx]) continue;
            visited[visitedIdx] = 1;

            const r = data[pos];
            const g = data[pos + 1];
            const b = data[pos + 2];

            if (colorMatch(r, g, b, targetR, targetG, targetB)) {
                data[pos] = fillRgb.r;
                data[pos + 1] = fillRgb.g;
                data[pos + 2] = fillRgb.b;
                data[pos + 3] = 255;

                if (x > 0) queue.push([x - 1, y]);
                if (x < canvas.width - 1) queue.push([x + 1, y]);
                if (y > 0) queue.push([x, y - 1]);
                if (y < canvas.height - 1) queue.push([x, y + 1]);
            }
        }

        ctx.putImageData(imgData, 0, 0);
    }

    function colorMatch(r1, g1, b1, r2, g2, b2) {
        return Math.abs(r1 - r2) < 30 && Math.abs(g1 - g2) < 30 && Math.abs(b1 - b2) < 30;
    }

    function hexToRgb(hex) {
        let cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(c => c + c).join('');
        }
        const num = parseInt(cleanHex, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    }

    // ----------------------------------------------------
    // 4. COLOR PALETTE & TOOLBOX CONTROLS
    // ----------------------------------------------------
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');

            const colorVal = swatch.getAttribute('data-color');
            if (colorVal === 'rainbow') {
                isRainbow = true;
            } else {
                isRainbow = false;
                currentColor = colorVal;
            }

            if (currentTool === 'eraser') {
                setTool('brush');
            }
        });
    });

    // Tool Buttons
    const btnBrush = document.getElementById('btnBrush');
    const btnBucket = document.getElementById('btnBucket');
    const btnEraser = document.getElementById('btnEraser');
    const btnUndo = document.getElementById('btnUndo');
    const btnClear = document.getElementById('btnClear');

    function setTool(toolName) {
        currentTool = toolName;
        [btnBrush, btnBucket, btnEraser].forEach(b => b && b.classList.remove('active'));

        if (toolName === 'brush' && btnBrush) btnBrush.classList.add('active');
        if (toolName === 'bucket' && btnBucket) btnBucket.classList.add('active');
        if (toolName === 'eraser' && btnEraser) btnEraser.classList.add('active');
    }

    if (btnBrush) btnBrush.addEventListener('click', () => setTool('brush'));
    if (btnBucket) btnBucket.addEventListener('click', () => setTool('bucket'));
    if (btnEraser) btnEraser.addEventListener('click', () => setTool('eraser'));
    if (btnUndo) btnUndo.addEventListener('click', undo);
    if (btnClear) btnClear.addEventListener('click', clearCanvas);

    // Size Buttons
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSize = parseInt(btn.getAttribute('data-size')) || 4;
        });
    });

    // ----------------------------------------------------
    // 5. STENCILS & OUTLINES (COLORING BOOK MODE)
    // ----------------------------------------------------
    const stencilBtns = document.querySelectorAll('.stencil-btn');
    stencilBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            stencilBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const stencilType = btn.getAttribute('data-stencil');
            drawStencil(stencilType);
        });
    });

    function drawStencil(stencilType) {
        clearCanvas();
        if (stencilType === 'blank') return;

        ctx.save();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (stencilType === 'cat_bow') {
            // Cute Cat Head with Ribbon Bow
            ctx.beginPath();
            // Cat Head
            ctx.arc(400, 320, 160, 0, Math.PI * 2);
            // Left Ear
            ctx.moveTo(270, 230);
            ctx.lineTo(240, 100);
            ctx.lineTo(340, 170);
            // Right Ear
            ctx.moveTo(530, 230);
            ctx.lineTo(560, 100);
            ctx.lineTo(460, 170);
            ctx.stroke();

            // Eyes
            ctx.beginPath();
            ctx.arc(330, 280, 18, 0, Math.PI * 2);
            ctx.arc(470, 280, 18, 0, Math.PI * 2);
            ctx.fillStyle = '#0f172a';
            ctx.fill();

            // Nose & Mouth
            ctx.beginPath();
            ctx.arc(400, 320, 10, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(400, 330);
            ctx.lineTo(400, 345);
            ctx.arc(385, 345, 15, 0, Math.PI, false);
            ctx.moveTo(400, 345);
            ctx.arc(415, 345, 15, 0, Math.PI, false);
            ctx.stroke();

            // Whiskers
            ctx.beginPath();
            ctx.moveTo(310, 320); ctx.lineTo(200, 300);
            ctx.moveTo(310, 335); ctx.lineTo(200, 340);
            ctx.moveTo(490, 320); ctx.lineTo(600, 300);
            ctx.moveTo(490, 335); ctx.lineTo(600, 340);
            ctx.stroke();

            // Bow Ribbon on Ear
            ctx.beginPath();
            ctx.arc(260, 130, 16, 0, Math.PI * 2);
            ctx.moveTo(260, 130); ctx.lineTo(220, 100); ctx.lineTo(220, 160); ctx.closePath();
            ctx.moveTo(260, 130); ctx.lineTo(300, 100); ctx.lineTo(300, 160); ctx.closePath();
            ctx.stroke();

        } else if (stencilType === 'cat_fish') {
            // Cat next to Fish
            ctx.beginPath();
            // Cat Face
            ctx.arc(300, 300, 120, 0, Math.PI * 2);
            // Left Ear
            ctx.moveTo(200, 230); ctx.lineTo(170, 120); ctx.lineTo(250, 190);
            // Right Ear
            ctx.moveTo(400, 230); ctx.lineTo(430, 120); ctx.lineTo(350, 190);
            ctx.stroke();

            // Cat Eyes & Nose
            ctx.beginPath();
            ctx.arc(250, 280, 12, 0, Math.PI * 2);
            ctx.arc(350, 280, 12, 0, Math.PI * 2);
            ctx.fill();

            // Fish Outline
            ctx.beginPath();
            ctx.ellipse(580, 320, 70, 45, 0, 0, Math.PI * 2);
            ctx.moveTo(645, 320); ctx.lineTo(710, 270); ctx.lineTo(710, 370); ctx.closePath();
            ctx.arc(540, 310, 6, 0, Math.PI * 2);
            ctx.stroke();

        } else if (stencilType === 'cat_paws') {
            // Authentic Cat Paw Prints Trail (6 paws walking diagonally)
            function drawSingleCatPaw(cx, cy, scale, angle = 0) {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(angle);

                // Main Pad (Kidney/Heart-like smooth pad)
                ctx.beginPath();
                ctx.moveTo(0, 5 * scale);
                ctx.bezierCurveTo(-25 * scale, 10 * scale, -30 * scale, -15 * scale, -12 * scale, -22 * scale);
                ctx.bezierCurveTo(0, -12 * scale, 0, -12 * scale, 12 * scale, -22 * scale);
                ctx.bezierCurveTo(30 * scale, -15 * scale, 25 * scale, 10 * scale, 0, 5 * scale);
                ctx.closePath();
                ctx.stroke();

                // 4 Toe Pads (Arranged in an arc above the main pad)
                const toes = [
                    { x: -26 * scale, y: -34 * scale, rx: 7 * scale, ry: 10 * scale, rot: -0.4 },
                    { x: -10 * scale, y: -44 * scale, rx: 8 * scale, ry: 12 * scale, rot: -0.15 },
                    { x: 10 * scale,  y: -44 * scale, rx: 8 * scale, ry: 12 * scale, rot: 0.15 },
                    { x: 26 * scale,  y: -34 * scale, rx: 7 * scale, ry: 10 * scale, rot: 0.4 }
                ];

                toes.forEach(t => {
                    ctx.beginPath();
                    ctx.ellipse(t.x, t.y, t.rx, t.ry, t.rot, 0, Math.PI * 2);
                    ctx.stroke();
                });

                ctx.restore();
            }

            // Draw a trail of 6 paw prints walking diagonally across the canvas
            drawSingleCatPaw(180, 500, 1.2, -0.2);
            drawSingleCatPaw(290, 410, 1.2, -0.1);
            drawSingleCatPaw(370, 310, 1.3, -0.2);
            drawSingleCatPaw(480, 220, 1.3, -0.15);
            drawSingleCatPaw(570, 130, 1.2, -0.2);
            drawSingleCatPaw(670, 60, 1.1, -0.1);

        } else if (stencilType === 'cat_sleeping') {
            // Full Body Curled Up Sleeping Cat with Legs, Paws & Tail
            ctx.beginPath();
            // Sleeping Body (Curled Oval)
            ctx.ellipse(400, 360, 180, 130, 0, 0, Math.PI * 2);
            // Cat Head
            ctx.arc(280, 300, 85, 0, Math.PI * 2);
            // Ears
            ctx.moveTo(220, 240); ctx.lineTo(190, 150); ctx.lineTo(260, 210);
            ctx.moveTo(320, 230); ctx.lineTo(350, 150); ctx.lineTo(340, 220);
            ctx.stroke();

            // Sleeping Eyes (Curved arcs)
            ctx.beginPath();
            ctx.arc(245, 290, 14, 0, Math.PI);
            ctx.arc(305, 290, 14, 0, Math.PI);
            // Nose
            ctx.moveTo(275, 315); ctx.arc(275, 315, 6, 0, Math.PI * 2);
            ctx.stroke();

            // Paws tucked under
            ctx.beginPath();
            ctx.arc(320, 380, 25, 0, Math.PI * 2); // Front paw
            ctx.arc(370, 420, 30, 0, Math.PI * 2); // Back paw
            ctx.stroke();

            // Fluffy Tail wrapped around the body
            ctx.beginPath();
            ctx.moveTo(580, 360);
            ctx.quadraticCurveTo(590, 480, 440, 485);
            ctx.quadraticCurveTo(240, 490, 220, 410);
            ctx.stroke();

            // Zzz Floating
            ctx.font = "bold 44px Fredoka, sans-serif";
            ctx.fillStyle = "#0f172a";
            ctx.fillText("Z z z...", 480, 180);

        } else if (stencilType === 'cat_yarn') {
            // Full Body Cat Playing with Yarn Ball (Head, Body, 4 Legs, Paws, Tail)
            ctx.beginPath();
            // Cat Head
            ctx.arc(260, 240, 80, 0, Math.PI * 2);
            // Ears
            ctx.moveTo(200, 180); ctx.lineTo(170, 90); ctx.lineTo(240, 160);
            ctx.moveTo(310, 180); ctx.lineTo(340, 90); ctx.lineTo(310, 170);
            // Eyes & Nose
            ctx.arc(230, 230, 12, 0, Math.PI * 2);
            ctx.arc(290, 230, 12, 0, Math.PI * 2);
            ctx.stroke();

            // Body
            ctx.beginPath();
            ctx.ellipse(220, 360, 80, 110, 0.2, 0, Math.PI * 2);
            ctx.stroke();

            // Front Legs & Paws reaching towards Yarn
            ctx.beginPath();
            // Right Front Arm extended
            ctx.moveTo(270, 320); ctx.lineTo(400, 340); ctx.arc(410, 340, 18, 0, Math.PI * 2);
            // Left Front Arm extended
            ctx.moveTo(260, 350); ctx.lineTo(380, 380); ctx.arc(390, 380, 18, 0, Math.PI * 2);
            // Back Legs & Paws
            ctx.moveTo(170, 410); ctx.lineTo(150, 490); ctx.arc(155, 500, 20, 0, Math.PI * 2);
            ctx.moveTo(230, 430); ctx.lineTo(230, 500); ctx.arc(235, 510, 20, 0, Math.PI * 2);
            ctx.stroke();

            // Curving Wavy Tail
            ctx.beginPath();
            ctx.moveTo(140, 340);
            ctx.quadraticCurveTo(60, 300, 90, 180);
            ctx.quadraticCurveTo(110, 120, 130, 160);
            ctx.stroke();

            // Ball of Yarn
            ctx.beginPath();
            ctx.arc(520, 380, 65, 0, Math.PI * 2);
            ctx.stroke();
            // Yarn lines
            ctx.beginPath();
            ctx.arc(510, 380, 45, 0.5, 3.5);
            ctx.arc(530, 370, 45, 2, 5);
            ctx.moveTo(460, 400); ctx.quadraticCurveTo(410, 420, 390, 390);
            ctx.stroke();

        } else if (stencilType === 'cat_fish') {
            // Full Body Cat Sitting next to Fish (Head, Body, 4 Legs, Tail)
            ctx.beginPath();
            // Head
            ctx.arc(280, 220, 75, 0, Math.PI * 2);
            // Ears
            ctx.moveTo(225, 165); ctx.lineTo(195, 85); ctx.lineTo(265, 145);
            ctx.moveTo(335, 165); ctx.lineTo(365, 85); ctx.lineTo(335, 155);
            // Eyes
            ctx.arc(250, 210, 10, 0, Math.PI * 2);
            ctx.arc(310, 210, 10, 0, Math.PI * 2);
            ctx.stroke();

            // Body
            ctx.beginPath();
            ctx.ellipse(260, 360, 75, 110, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Front Legs & Paws
            ctx.beginPath();
            ctx.moveTo(240, 350); ctx.lineTo(240, 470); ctx.arc(245, 480, 16, 0, Math.PI * 2);
            ctx.moveTo(280, 350); ctx.lineTo(280, 470); ctx.arc(285, 480, 16, 0, Math.PI * 2);
            // Back Leg & Paw
            ctx.moveTo(195, 410); ctx.ellipse(195, 440, 30, 45, 0.4, 0, Math.PI * 2);
            ctx.stroke();

            // Tail curving up
            ctx.beginPath();
            ctx.moveTo(185, 410);
            ctx.quadraticCurveTo(100, 360, 120, 240);
            ctx.quadraticCurveTo(130, 180, 150, 220);
            ctx.stroke();

            // Big Fish on Plate
            ctx.beginPath();
            // Plate
            ctx.ellipse(560, 470, 130, 30, 0, 0, Math.PI * 2);
            // Fish Body & Tail
            ctx.ellipse(550, 430, 75, 45, 0, 0, Math.PI * 2);
            ctx.moveTo(620, 430); ctx.lineTo(690, 380); ctx.lineTo(690, 480); ctx.closePath();
            ctx.arc(500, 420, 6, 0, Math.PI * 2); // Fish Eye
            ctx.stroke();

        } else if (stencilType === 'cat_crown') {
            // Royal Cat with Crown (Full Body)
            ctx.beginPath();
            ctx.arc(400, 260, 95, 0, Math.PI * 2); // Head
            // Ears
            ctx.moveTo(320, 200); ctx.lineTo(290, 100); ctx.lineTo(365, 175);
            ctx.moveTo(480, 200); ctx.lineTo(510, 100); ctx.lineTo(435, 175);
            // Eyes
            ctx.arc(360, 250, 12, 0, Math.PI * 2);
            ctx.arc(440, 250, 12, 0, Math.PI * 2);
            ctx.stroke();

            // Crown
            ctx.beginPath();
            ctx.moveTo(350, 170); ctx.lineTo(340, 90); ctx.lineTo(375, 130); ctx.lineTo(400, 70); ctx.lineTo(425, 130); ctx.lineTo(460, 90); ctx.lineTo(450, 170); ctx.closePath();
            ctx.stroke();

            // Body & Legs
            ctx.beginPath();
            ctx.ellipse(400, 410, 85, 110, 0, 0, Math.PI * 2);
            ctx.moveTo(360, 420); ctx.lineTo(360, 520); ctx.arc(365, 530, 16, 0, Math.PI * 2);
            ctx.moveTo(440, 420); ctx.lineTo(440, 520); ctx.arc(445, 530, 16, 0, Math.PI * 2);
            // Tail
            ctx.moveTo(475, 450); ctx.quadraticCurveTo(590, 450, 560, 310);
            ctx.stroke();

        } else if (stencilType === 'cat_astro') {
            // Astronaut Cat in Space Suit (Full Body)
            ctx.beginPath();
            ctx.arc(400, 230, 110, 0, Math.PI * 2); // Space Helmet
            ctx.arc(400, 235, 80, 0, Math.PI * 2);  // Cat Head inside
            // Ears inside helmet
            ctx.moveTo(340, 180); ctx.lineTo(325, 130); ctx.lineTo(370, 160);
            ctx.moveTo(460, 180); ctx.lineTo(475, 130); ctx.lineTo(430, 160);
            ctx.stroke();

            // Space Suit Body
            ctx.beginPath();
            ctx.rect(320, 330, 160, 140);
            // Space Boots (Legs)
            ctx.rect(330, 470, 50, 50);
            ctx.rect(420, 470, 50, 50);
            // Space Arms
            ctx.rect(260, 340, 60, 45); ctx.rect(480, 340, 60, 45);
            // Space Tail
            ctx.moveTo(480, 430); ctx.quadraticCurveTo(600, 450, 580, 330);
            ctx.stroke();

            // Moon
            ctx.beginPath();
            ctx.arc(140, 140, 45, 0.5, 4.5);
            ctx.stroke();

        } else if (stencilType === 'cat_birthday') {
            // Full Body Birthday Cat & Birthday Cake
            ctx.beginPath();
            ctx.arc(280, 240, 80, 0, Math.PI * 2); // Head
            // Party Hat
            ctx.moveTo(230, 170); ctx.lineTo(280, 60); ctx.lineTo(330, 170); ctx.closePath();
            ctx.stroke();

            // Body & Legs
            ctx.beginPath();
            ctx.ellipse(270, 380, 75, 100, 0, 0, Math.PI * 2);
            ctx.moveTo(240, 400); ctx.lineTo(240, 500); ctx.arc(245, 510, 16, 0, Math.PI * 2);
            ctx.moveTo(290, 400); ctx.lineTo(290, 500); ctx.arc(295, 510, 16, 0, Math.PI * 2);
            // Tail
            ctx.moveTo(200, 420); ctx.quadraticCurveTo(120, 400, 140, 280);
            ctx.stroke();

            // Cake
            ctx.beginPath();
            ctx.rect(480, 360, 180, 120);
            ctx.rect(500, 290, 140, 70);
            ctx.rect(560, 230, 20, 60); // Candle
            ctx.arc(570, 215, 10, 0, Math.PI * 2); // Flame
            ctx.stroke();

        } else if (stencilType === 'cat_cool') {
            // Full Body Cool Cat with Sunglasses
            ctx.beginPath();
            ctx.arc(400, 240, 95, 0, Math.PI * 2); // Head
            // Ears
            ctx.moveTo(320, 180); ctx.lineTo(290, 80); ctx.lineTo(365, 155);
            ctx.moveTo(480, 180); ctx.lineTo(510, 80); ctx.lineTo(435, 155);
            ctx.stroke();

            // Sunglasses
            ctx.beginPath();
            ctx.rect(320, 200, 70, 50);
            ctx.rect(410, 200, 70, 50);
            ctx.moveTo(390, 220); ctx.lineTo(410, 220);
            ctx.fillStyle = '#0f172a';
            ctx.fill();

            // Body & Legs
            ctx.beginPath();
            ctx.ellipse(400, 390, 80, 110, 0, 0, Math.PI * 2);
            ctx.moveTo(360, 420); ctx.lineTo(360, 510); ctx.arc(365, 520, 16, 0, Math.PI * 2);
            ctx.moveTo(440, 420); ctx.lineTo(440, 510); ctx.arc(445, 520, 16, 0, Math.PI * 2);
            // Tail
            ctx.moveTo(475, 430); ctx.quadraticCurveTo(580, 410, 550, 290);
            ctx.stroke();

        } else if (stencilType === 'cat_house') {
            // Full Body Cat Sitting in Front of Cat House
            ctx.beginPath();
            // House Roof
            ctx.moveTo(100, 240); ctx.lineTo(280, 100); ctx.lineTo(460, 240); ctx.closePath();
            // House Base
            ctx.rect(130, 240, 300, 240);
            // Doorway
            ctx.arc(280, 480, 70, Math.PI, 0);
            ctx.stroke();

            // Full Body Cat sitting in doorway
            ctx.beginPath();
            ctx.arc(580, 300, 70, 0, Math.PI * 2); // Cat Head
            ctx.moveTo(530, 250); ctx.lineTo(500, 170); ctx.lineTo(560, 230);
            ctx.moveTo(630, 250); ctx.lineTo(660, 170); ctx.lineTo(630, 230);
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(580, 420, 65, 90, 0, 0, Math.PI * 2); // Body
            ctx.moveTo(550, 440); ctx.lineTo(550, 500); ctx.arc(555, 510, 14, 0, Math.PI * 2);
            ctx.moveTo(610, 440); ctx.lineTo(610, 500); ctx.arc(615, 510, 14, 0, Math.PI * 2);
            // Tail
            ctx.moveTo(640, 440); ctx.quadraticCurveTo(730, 440, 710, 320);
            ctx.stroke();

            // Sun
            ctx.beginPath();
            ctx.arc(680, 110, 45, 0, Math.PI * 2);
            ctx.stroke();

        } else if (stencilType === 'cat_hero') {
            // Full Body Superhero Cat (Head, Body, 4 Legs, Flying Cape & Tail)
            ctx.beginPath();
            // Head
            ctx.arc(400, 210, 85, 0, Math.PI * 2);
            // Ears
            ctx.moveTo(330, 150); ctx.lineTo(300, 60); ctx.lineTo(370, 130);
            ctx.moveTo(470, 150); ctx.lineTo(500, 60); ctx.lineTo(430, 130);
            ctx.stroke();

            // Body
            ctx.beginPath();
            ctx.ellipse(400, 360, 75, 100, 0, 0, Math.PI * 2);
            // 4 Legs & Paws
            ctx.moveTo(350, 400); ctx.lineTo(340, 500); ctx.arc(345, 510, 16, 0, Math.PI * 2);
            ctx.moveTo(380, 400); ctx.lineTo(380, 500); ctx.arc(385, 510, 16, 0, Math.PI * 2);
            ctx.moveTo(420, 400); ctx.lineTo(420, 500); ctx.arc(425, 510, 16, 0, Math.PI * 2);
            ctx.moveTo(450, 400); ctx.lineTo(460, 500); ctx.arc(465, 510, 16, 0, Math.PI * 2);
            ctx.stroke();

            // Flapping Cape
            ctx.beginPath();
            ctx.moveTo(330, 270); ctx.quadraticCurveTo(180, 310, 160, 480); ctx.lineTo(340, 380);
            ctx.moveTo(470, 270); ctx.quadraticCurveTo(620, 310, 640, 480); ctx.lineTo(460, 380);
            ctx.stroke();

            // Tail
            ctx.beginPath();
            ctx.moveTo(470, 410); ctx.quadraticCurveTo(560, 390, 540, 280);
            ctx.stroke();

            // Hero Emblem Star on Chest
            ctx.beginPath();
            ctx.arc(400, 340, 24, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
        saveState();
    }

    // Initialize Blank Canvas
    initCanvas();

    // ----------------------------------------------------
    // 6. SAVE & SUBMIT DRAWING FLOW
    // ----------------------------------------------------
    const openSaveModalBtn = document.getElementById('openSaveModalBtn');
    const saveDrawingModal = document.getElementById('saveDrawingModal');
    const closeSaveModalBtn = document.getElementById('closeSaveModalBtn');
    const saveDrawingForm = document.getElementById('saveDrawingForm');
    const authorNameInput = document.getElementById('authorNameInput');

    const successDrawingModal = document.getElementById('successDrawingModal');
    const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');

    if (openSaveModalBtn && saveDrawingModal) {
        openSaveModalBtn.addEventListener('click', () => {
            saveDrawingModal.hidden = false;
        });
    }

    if (closeSaveModalBtn && saveDrawingModal) {
        closeSaveModalBtn.addEventListener('click', () => {
            saveDrawingModal.hidden = true;
        });
    }

    if (closeSuccessModalBtn && successDrawingModal) {
        closeSuccessModalBtn.addEventListener('click', () => {
            successDrawingModal.hidden = true;
        });
    }

    if (saveDrawingForm) {
        saveDrawingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const authorName = authorNameInput.value.trim();
            if (!authorName) return;

            const submitBtn = saveDrawingForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '⏳ Αποστολή...';
            }

            // Convert canvas to Data URL JPEG (compressed for fast loading)
            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            const drawingId = 'draw_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
            let fileUrl = imageDataUrl;

            // Upload image blob to Supabase Storage bucket 'images' if available
            if (supabase && canvas.toBlob) {
                try {
                    const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.85));
                    if (blob) {
                        const storageFileName = `${drawingId}.jpg`;
                        const { error: uploadErr } = await supabase.storage
                            .from('images')
                            .upload(storageFileName, blob, {
                                contentType: 'image/jpeg',
                                upsert: true
                            });

                        if (!uploadErr) {
                            const { data: urlData } = supabase.storage.from('images').getPublicUrl(storageFileName);
                            if (urlData && urlData.publicUrl) {
                                fileUrl = urlData.publicUrl;
                            }
                        }
                    }
                } catch (err) {
                    console.log('Supabase storage drawing upload notice:', err);
                }
            }

            const newDrawing = {
                id: drawingId,
                name: authorName,
                image_data: fileUrl,
                status: 'pending',
                likes: 0,
                created_at: new Date().toISOString()
            };

            // 1. Save to localStorage
            const localDrawings = JSON.parse(localStorage.getItem('igatamou_drawings') || '[]');
            localDrawings.unshift(newDrawing);
            localStorage.setItem('igatamou_drawings', JSON.stringify(localDrawings));

            // 2. Save to Supabase DB cats table (and drawings table fallback)
            if (supabase) {
                try {
                    await supabase.from('cats').insert([{
                        id: newDrawing.id,
                        name: newDrawing.name,
                        owner: newDrawing.name,
                        bio: '🎨 [DRAWING]',
                        image: newDrawing.image_data,
                        status: 'pending',
                        likes: 0,
                        date: new Date().toLocaleDateString('el-GR')
                    }]);
                } catch (dbErr) {
                    console.log('Supabase cats drawing insert notice:', dbErr);
                }

                try {
                    await supabase.from('drawings').insert([{
                        id: newDrawing.id,
                        name: newDrawing.name,
                        image_data: newDrawing.image_data,
                        status: 'pending',
                        likes: 0,
                        created_at: newDrawing.created_at
                    }]);
                } catch (dbErr) {
                    console.log('Supabase drawings insert notice:', dbErr);
                }
            }

            // Hide save modal & show success modal
            if (saveDrawingModal) saveDrawingModal.hidden = true;
            if (successDrawingModal) successDrawingModal.hidden = false;
            saveDrawingForm.reset();

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '✨ Αποστολή στο Άλμπουμ 💖';
            }
        });
    }
});
