document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. SUPABASE CLIENT & DATA INITIALIZATION
    // ----------------------------------------------------
    const SUPABASE_URL = 'https://hqabeqlvnqdvipnspjog.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYWJlcWx2bnFkdmlwbnNwam9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDQzNDMsImV4cCI6MjEwMDk4MDM0M30.nmB5WOUN-WFQRhRxS14yCLK7X5I8OqJbWk-lRtR0yDg';
    let supabase = null;
    if (window.supabase && window.supabase.createClient) {
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } catch (e) {
            console.log('Supabase client init error in drawings-gallery.js:', e);
        }
    }

    const drawingsGrid = document.getElementById('drawingsGrid');
    const emptyDrawings = document.getElementById('emptyDrawings');

    // Sync from Supabase DB ('cats' table drawing items + 'drawings' table fallback)
    async function syncFromSupabase() {
        const isDog = window.SITE_CONFIG ? (SITE_CONFIG.domain === 'oskilosmou') : false;
        let localDrawings = JSON.parse(localStorage.getItem(SITE_CONFIG.localStoragePrefix + '_drawings') || '[]');
        
        // Filter local cache strictly by domain
        if (isDog) {
            localDrawings = localDrawings.filter(d => d.bio ? (d.bio.includes('[DOG]') || d.bio.includes('[OSKILOSMOU]')) : false);
        } else {
            localDrawings = localDrawings.filter(d => d.bio ? (!d.bio.includes('[DOG]') && !d.bio.includes('[OSKILOSMOU]')) : true);
        }

        if (supabase) {
            try {
                let dbDrawings = [];

                // 1. Fetch from cats table (where drawings with id 'draw_...' or bio '🎨 [DRAWING]' are stored)
                const { data: catsData } = await supabase.from('cats').select('*');
                if (catsData && Array.isArray(catsData)) {
                    const drawingCats = catsData.filter(c => {
                        const isDrawing = (c.id && c.id.startsWith('draw_')) || (c.bio && c.bio.includes('🎨 [DRAWING]'));
                        if (!isDrawing) return false;
                        const bio = c.bio || '';
                        if (isDog) {
                            return bio.includes('[DOG]') || bio.includes('[OSKILOSMOU]') || c.domain === 'oskilosmou';
                        } else {
                            return !bio.includes('[DOG]') && !bio.includes('[OSKILOSMOU]') && c.domain !== 'oskilosmou';
                        }
                    });
                    drawingCats.forEach(c => {
                        dbDrawings.push({
                            id: c.id,
                            name: c.name,
                            image_data: c.image,
                            status: c.status,
                            likes: c.likes || 0,
                            created_at: c.date || new Date().toISOString()
                        });
                    });
                }

                if (dbDrawings.length > 0) {
                    const drawingMap = new Map();
                    localDrawings.forEach(d => drawingMap.set(d.id, d));

                    dbDrawings.forEach(dbItem => {
                        const localItem = drawingMap.get(dbItem.id);
                        if (localItem) {
                            // Smart status merge: if either local or DB is approved, keep approved!
                            const finalStatus = (localItem.status === 'approved' || dbItem.status === 'approved') ? 'approved' : (localItem.status === 'rejected' || dbItem.status === 'rejected' ? 'rejected' : dbItem.status || localItem.status);
                            const finalLikes = Math.max(localItem.likes || 0, dbItem.likes || 0);
                            drawingMap.set(dbItem.id, {
                                ...localItem,
                                ...dbItem,
                                status: finalStatus,
                                likes: finalLikes
                            });
                        } else {
                            drawingMap.set(dbItem.id, dbItem);
                        }
                    });

                    localDrawings = Array.from(drawingMap.values());
                    localStorage.setItem(SITE_CONFIG.localStoragePrefix + '_drawings', JSON.stringify(localDrawings));
                } else if (isDog) {
                    localDrawings = [];
                    localStorage.setItem(SITE_CONFIG.localStoragePrefix + '_drawings', '[]');
                }
            } catch (err) {
                console.log('Supabase drawings sync notice:', err);
            }
        }

        renderGallery(localDrawings);
    }

    // Infinite scroll state
    let drawingsPageSize = 10;
    let drawingsRenderedCount = 0;
    let drawingsAllItems = [];
    let drawingsObserver = null;

    function renderGallery(allDrawings) {
        if (!drawingsGrid) return;
        drawingsGrid.innerHTML = '';

        // Clean up any old sentinel/observer
        const oldSentinel = document.getElementById('drawingsSentinel');
        if (oldSentinel) oldSentinel.remove();
        if (drawingsObserver) { drawingsObserver.disconnect(); drawingsObserver = null; }

        const approvedDrawings = allDrawings.filter(d => d.status === 'approved');

        if (approvedDrawings.length === 0) {
            if (emptyDrawings) emptyDrawings.hidden = false;
            return;
        }
        if (emptyDrawings) emptyDrawings.hidden = true;

        drawingsAllItems = approvedDrawings;
        drawingsRenderedCount = 0;

        // Render first batch
        appendDrawingCards();

        // If more items remain, observe a sentinel for infinite scroll
        if (drawingsRenderedCount < drawingsAllItems.length) {
            const sentinel = document.createElement('div');
            sentinel.id = 'drawingsSentinel';
            sentinel.style.cssText = 'height:1px;grid-column:1/-1;';
            drawingsGrid.parentNode.insertBefore(sentinel, drawingsGrid.nextSibling);

            drawingsObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    appendDrawingCards();
                    if (drawingsRenderedCount >= drawingsAllItems.length) {
                        drawingsObserver.disconnect();
                        drawingsObserver = null;
                        sentinel.remove();
                    }
                }
            }, { rootMargin: '200px' });

            drawingsObserver.observe(sentinel);
        }
    }

    function appendDrawingCards() {
        const batch = drawingsAllItems.slice(drawingsRenderedCount, drawingsRenderedCount + drawingsPageSize);
        batch.forEach(drawing => {
            const card = document.createElement('div');
            card.className = 'drawing-card';

            const formattedDate = (() => {
                if (!drawing.created_at) return 'Σήμερα';
                const raw = String(drawing.created_at).trim();
                const normalized = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw + 'T00:00:00' : raw;
                const d = new Date(normalized);
                return isNaN(d.getTime()) ? 'Σήμερα' : d.toLocaleDateString('el-GR');
            })();
            const likesCount = drawing.likes || 0;

            card.innerHTML = `
                <div class="drawing-img-wrapper">
                    <img src="${drawing.image_data}" alt="Ζωγραφιά από ${drawing.name}" class="drawing-img" loading="lazy" decoding="async">
                </div>
                <div class="drawing-card-body">
                    <div class="drawing-author">🎨 Από τον/την: <strong>${escapeHtml(drawing.name)}</strong></div>
                    <div class="drawing-date">📅 ${formattedDate}</div>
                    <button class="drawing-like-btn" data-id="${drawing.id}">
                        💖 <span class="like-count">${likesCount}</span> Γατο-Χάδια
                    </button>
                </div>
            `;

            const likeBtn = card.querySelector('.drawing-like-btn');
            likeBtn.addEventListener('click', () => {
                drawing.likes = (drawing.likes || 0) + 1;
                card.querySelector('.like-count').textContent = drawing.likes;

                const currentDrawings = JSON.parse(localStorage.getItem(SITE_CONFIG.localStoragePrefix + '_drawings') || '[]');
                const target = currentDrawings.find(d => d.id === drawing.id);
                if (target) {
                    target.likes = drawing.likes;
                    localStorage.setItem(SITE_CONFIG.localStoragePrefix + '_drawings', JSON.stringify(currentDrawings));
                }

                if (supabase) {
                    supabase.from('cats').update({ likes: drawing.likes }).eq('id', drawing.id).then().catch(() => {});
                }
            });

            drawingsGrid.appendChild(card);
        });
        drawingsRenderedCount += batch.length;
    }

    function escapeHtml(str) {
        return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    syncFromSupabase();
});
