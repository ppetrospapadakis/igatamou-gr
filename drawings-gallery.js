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
        let localDrawings = JSON.parse(localStorage.getItem('igatamou_drawings') || '[]');

        if (supabase) {
            try {
                let dbDrawings = [];

                // 1. Fetch from cats table (where drawings with id 'draw_...' or bio '🎨 [DRAWING]' are stored)
                const { data: catsData } = await supabase.from('cats').select('*');
                if (catsData && Array.isArray(catsData)) {
                    const drawingCats = catsData.filter(c => (c.id && c.id.startsWith('draw_')) || (c.bio && c.bio.includes('🎨 [DRAWING]')));
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
                    localStorage.setItem('igatamou_drawings', JSON.stringify(localDrawings));
                }
            } catch (err) {
                console.log('Supabase drawings sync notice:', err);
            }
        }

        renderGallery(localDrawings);
    }

    let showAllDrawings = false;

    function renderGallery(allDrawings) {
        if (!drawingsGrid) return;
        drawingsGrid.innerHTML = '';

        const existingShowMore = document.getElementById('drawingsShowMoreWrapper');
        if (existingShowMore) existingShowMore.remove();

        const approvedDrawings = allDrawings.filter(d => d.status === 'approved');

        if (approvedDrawings.length === 0) {
            if (emptyDrawings) emptyDrawings.hidden = false;
            return;
        }

        if (emptyDrawings) emptyDrawings.hidden = true;

        const visibleDrawings = showAllDrawings ? approvedDrawings : approvedDrawings.slice(0, 10);

        visibleDrawings.forEach(drawing => {
            const card = document.createElement('div');
            card.className = 'drawing-card';

            const formattedDate = drawing.created_at ? new Date(drawing.created_at).toLocaleDateString('el-GR') : 'Σήμερα';
            const likesCount = drawing.likes || 0;

            card.innerHTML = `
                <div class="drawing-img-wrapper">
                    <img src="${drawing.image_data}" alt="Ζωγραφιά από ${drawing.name}" class="drawing-img" loading="lazy">
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

                // Update localStorage
                const currentDrawings = JSON.parse(localStorage.getItem('igatamou_drawings') || '[]');
                const target = currentDrawings.find(d => d.id === drawing.id);
                if (target) {
                    target.likes = drawing.likes;
                    localStorage.setItem('igatamou_drawings', JSON.stringify(currentDrawings));
                }

                // Update Supabase DB
                if (supabase) {
                    supabase.from('cats').update({ likes: drawing.likes }).eq('id', drawing.id).then().catch(() => {});
                }
            });

            drawingsGrid.appendChild(card);
        });

        // Show "Εμφάνιση όλων" button if there are more than 10 drawings and not all are shown yet
        if (!showAllDrawings && approvedDrawings.length > 10) {
            const showMoreWrapper = document.createElement('div');
            showMoreWrapper.id = 'drawingsShowMoreWrapper';
            showMoreWrapper.className = 'show-more-wrapper';
            showMoreWrapper.style.cssText = 'display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; margin: 40px auto 25px auto !important; width: 100% !important; clear: both !important; grid-column: 1 / -1 !important;';
            showMoreWrapper.innerHTML = `
                <button id="showAllDrawingsBtn" class="btn-show-all" style="background: linear-gradient(135deg, #ff5e7e 0%, #a855f7 50%, #00b4d8 100%) !important; color: #ffffff !important; font-family: 'Fredoka', cursive, sans-serif !important; font-weight: 700 !important; font-size: 1.25rem !important; padding: 16px 40px !important; border-radius: 50px !important; border: 3px solid #ffffff !important; cursor: pointer !important; box-shadow: 0 10px 30px rgba(168, 85, 247, 0.45) !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; gap: 12px !important; margin: 0 auto !important;">
                    🎨 Εμφάνιση όλων (${approvedDrawings.length} Ζωγραφιές) ✨
                </button>
            `;
            drawingsGrid.parentNode.insertBefore(showMoreWrapper, drawingsGrid.nextSibling);

            const showAllBtn = document.getElementById('showAllDrawingsBtn');
            if (showAllBtn) {
                showAllBtn.addEventListener('click', () => {
                    showAllDrawings = true;
                    renderGallery(allDrawings);
                });
            }
        }
    }

    function escapeHtml(str) {
        return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    syncFromSupabase();
});
