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

    // Sync from Supabase DB 'drawings'
    async function syncFromSupabase() {
        let localDrawings = JSON.parse(localStorage.getItem('igatamou_drawings') || '[]');

        if (supabase) {
            try {
                const { data, error } = await supabase.from('drawings').select('*');
                if (!error && data && Array.isArray(data)) {
                    const drawingMap = new Map();
                    // Put local first
                    localDrawings.forEach(d => drawingMap.set(d.id, d));
                    // DB overrides/adds
                    data.forEach(d => drawingMap.set(d.id, d));

                    localDrawings = Array.from(drawingMap.values());
                    localStorage.setItem('igatamou_drawings', JSON.stringify(localDrawings));
                }
            } catch (err) {
                console.log('Supabase drawings sync notice:', err);
            }
        }

        renderGallery(localDrawings);
    }

    function renderGallery(allDrawings) {
        if (!drawingsGrid) return;
        drawingsGrid.innerHTML = '';

        const approvedDrawings = allDrawings.filter(d => d.status === 'approved');

        if (approvedDrawings.length === 0) {
            if (emptyDrawings) emptyDrawings.hidden = false;
            return;
        }

        if (emptyDrawings) emptyDrawings.hidden = true;

        approvedDrawings.forEach(drawing => {
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
                    supabase.from('drawings').update({ likes: drawing.likes }).eq('id', drawing.id).then();
                }
            });

            drawingsGrid.appendChild(card);
        });
    }

    function escapeHtml(str) {
        return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    syncFromSupabase();
});
