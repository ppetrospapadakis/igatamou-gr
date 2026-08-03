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
    let currentSize = 8;
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
            currentSize = parseInt(btn.getAttribute('data-size')) || 8;
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
            // Paw Prints & Hearts Stencil
            function drawPaw(cx, cy, scale) {
                ctx.beginPath();
                ctx.arc(cx, cy, 35 * scale, 0, Math.PI * 2);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(cx - 35 * scale, cy - 40 * scale, 12 * scale, 0, Math.PI * 2);
                ctx.arc(cx - 12 * scale, cy - 55 * scale, 12 * scale, 0, Math.PI * 2);
                ctx.arc(cx + 12 * scale, cy - 55 * scale, 12 * scale, 0, Math.PI * 2);
                ctx.arc(cx + 35 * scale, cy - 40 * scale, 12 * scale, 0, Math.PI * 2);
                ctx.fill();
            }

            drawPaw(250, 250, 1.4);
            drawPaw(550, 200, 1.2);
            drawPaw(400, 420, 1.6);
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

            // Convert canvas to Data URL PNG
            const imageDataUrl = canvas.toDataURL('image/png');

            const newDrawing = {
                id: 'draw_' + Date.now(),
                name: authorName,
                image_data: imageDataUrl,
                status: 'pending',
                likes: 0,
                created_at: new Date().toISOString()
            };

            // 1. Save to localStorage
            const localDrawings = JSON.parse(localStorage.getItem('igatamou_drawings') || '[]');
            localDrawings.unshift(newDrawing);
            localStorage.setItem('igatamou_drawings', JSON.stringify(localDrawings));

            // 2. Save to Supabase DB if available
            if (supabase) {
                try {
                    await supabase.from('drawings').insert([{
                        id: newDrawing.id,
                        name: newDrawing.name,
                        image_data: newDrawing.image_data,
                        status: newDrawing.status,
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
        });
    }
});
