document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------
    // SUPABASE INIT
    // --------------------------------------------------------
    const SUPABASE_URL = 'https://hqabeqlvnqdvipnspjog.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYWJlcWx2bnFkdmlwbnNwam9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDQzNDMsImV4cCI6MjEwMDk4MDM0M30.nmB5WOUN-WFQRhRxS14yCLK7X5I8OqJbWk-lRtR0yDg';
    let supabase = null;
    if (window.supabase && window.supabase.createClient) {
        try { supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); } catch(e) {}
    }

    function escapeHtml(str) {
        return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
    }

    function sanitizeHtml(html) {
        // Allow safe tags only
        const allowedTags = /^(p|br|strong|em|u|h1|h2|h3|ul|ol|li|span|div|img|blockquote)$/i;
        const div = document.createElement('div');
        div.innerHTML = html;
        div.querySelectorAll('*').forEach(el => {
            if (!allowedTags.test(el.tagName)) {
                el.replaceWith(document.createTextNode(el.textContent));
            } else {
                // Strip event handlers
                Array.from(el.attributes).forEach(attr => {
                    if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
                });
                // Only allow src for img (must be https)
                if (el.tagName.toLowerCase() === 'img') {
                    const src = el.getAttribute('src') || '';
                    if (!src.startsWith('https://') && !src.startsWith('data:image/')) {
                        el.remove();
                    }
                }
            }
        });
        return div.innerHTML;
    }

    // --------------------------------------------------------
    // STORIES GRID
    // --------------------------------------------------------
    const storiesGrid = document.getElementById('storiesGrid');
    const storiesLoading = document.getElementById('storiesLoading');
    const emptyStories = document.getElementById('emptyStories');

    if (storiesGrid !== null) {
        loadStories();
    }

    async function loadStories() {
        try {
            let stories = [];
            if (supabase) {
                const { data, error } = await supabase
                    .from('stories')
                    .select('*')
                    .eq('status', 'approved')
                    .order('created_at', { ascending: false });
                if (!error && data) stories = data;
            }

            // Always show the Magkas built-in story first
            const builtInStory = {
                id: 'builtin_magkas',
                title: 'Η Μάγκας και το Μυστικό Ψάρι',
                author: 'Αριάδνη, 7 ετών',
                cover_image_url: 'magkas_logo.png',
                is_admin: true,
                created_at: '2025-01-01',
                content: '<h2>Κεφάλαιο 1: Η Ανακάλυψη</h2><p>Μια ζεστή καλοκαιρινή μέρα, η Μάγκας κοιτούσε έξω από το παράθυρο και είδε κάτι να λάμπει στο δέντρο της αυλής. Τινάχτηκε έξω με μια αναπήδηση...</p><p>«Τι είναι αυτό;» σκέφτηκε με τα μεγάλα της πράσινα μάτια να αστράφτουν από περιέργεια.</p><h2>Κεφάλαιο 2: Η Περιπέτεια</h2><p>Ανέβηκε στο δέντρο — ένα, δύο, τρία άλματα — και βρήκε ένα μυστηριώδες κουτί με ψάρια ζωγραφιστά επάνω! Μέσα ήταν μια επιστολή που έγραφε:</p><blockquote>«Αγαπητή Μάγκας, αυτά τα ψάρια είναι για σένα! Από τον μυστικό σου θαυμαστή 🐟»</blockquote><p>Η Μάγκας χαμογέλασε με όλη της την καρδιά. Ήταν η καλύτερη μέρα της ζωής της! 🐾✨</p>'
            };

            if (storiesLoading) storiesLoading.hidden = true;

            const allStories = [builtInStory, ...stories];

            if (allStories.length === 0) {
                if (emptyStories) emptyStories.hidden = false;
                return;
            }

            if (storiesGrid) storiesGrid.hidden = false;
            renderStoryCards(allStories);
        } catch (e) {
            if (storiesLoading) storiesLoading.hidden = true;
            if (storiesGrid) storiesGrid.hidden = false;
            renderStoryCards([{
                id: 'builtin_magkas',
                title: 'Η Μάγκας και το Μυστικό Ψάρι',
                author: 'Αριάδνη, 7 ετών',
                cover_image_url: 'magkas_logo.png',
                is_admin: true,
                created_at: '2025-01-01',
                content: '<p>Μια ζεστή καλοκαιρινή μέρα, η Μάγκας κοιτούσε έξω από το παράθυρο...</p>'
            }]);
        }
    }

    function getPlainTextPreview(html, maxLen = 150) {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        return text.length > maxLen ? text.slice(0, maxLen).trim() + '…' : text.trim();
    }

    function renderStoryCards(stories) {
        if (!storiesGrid) return;
        storiesGrid.innerHTML = '';
        stories.forEach(story => {
            const coverSrc = story.cover_image_url || 'magkas_logo.png';
            const preview = getPlainTextPreview(story.content);
            const adminBadge = story.is_admin ? '<span class="story-admin-badge">👑 Επίσημη</span>' : '';
            const dateStr = story.created_at ? new Date(story.created_at).toLocaleDateString('el-GR', { year:'numeric', month:'long', day:'numeric' }) : '';

            const card = document.createElement('div');
            card.className = 'story-card';
            card.innerHTML = `
                <div class="story-card-cover">
                    <img src="${escapeHtml(coverSrc)}" alt="${escapeHtml(story.title)}" class="story-cover-img" onerror="this.src='magkas_logo.png'">
                    ${adminBadge}
                </div>
                <div class="story-card-body">
                    <h3 class="story-card-title">${escapeHtml(story.title)}</h3>
                    <div class="story-card-author">✍️ ${escapeHtml(story.author)}</div>
                    ${dateStr ? `<div class="story-card-date">📅 ${dateStr}</div>` : ''}
                    <p class="story-card-preview">${escapeHtml(preview)}</p>
                    <button class="btn btn-read-story" data-id="${escapeHtml(story.id)}">📖 Διάβασε ολόκληρη την ιστορία</button>
                </div>
            `;
            card.querySelector('.btn-read-story').addEventListener('click', () => openBookModal(story));
            storiesGrid.appendChild(card);
        });
    }

    // --------------------------------------------------------
    // BOOK MODAL
    // --------------------------------------------------------
    const bookModal = document.getElementById('bookModal');
    const closeBookBtn = document.getElementById('closeBookBtn');
    const bookTitle = document.getElementById('bookTitle');
    const bookAuthor = document.getElementById('bookAuthor');
    const bookContent = document.getElementById('bookContent');
    const bookPrevBtn = document.getElementById('bookPrevBtn');
    const bookNextBtn = document.getElementById('bookNextBtn');
    const bookPageIndicator = document.getElementById('bookPageIndicator');
    const bookPageNumLeft = document.getElementById('bookPageNumLeft');
    const bookPageNumRight = document.getElementById('bookPageNumRight');
    const bookStoryHeader = document.getElementById('bookStoryHeader');

    let bookPages = [];
    let currentBookPage = 0;

    function splitIntoPages(htmlContent, wordsPerPage = 180) {
        const div = document.createElement('div');
        div.innerHTML = htmlContent;
        const text = div.textContent || '';
        const words = text.trim().split(/\s+/);
        const pages = [];
        // We do a word-based split while preserving some HTML structure
        // Simple approach: split the raw HTML by characters roughly
        const charsPerPage = wordsPerPage * 6; // ~6 chars per word avg
        let remaining = htmlContent;
        while (remaining.length > 0) {
            if (remaining.length <= charsPerPage) {
                pages.push(remaining);
                break;
            }
            // Try to cut at a paragraph boundary
            let cutAt = charsPerPage;
            const pEnd = remaining.lastIndexOf('</p>', cutAt);
            if (pEnd > cutAt / 2) cutAt = pEnd + 4;
            pages.push(remaining.slice(0, cutAt));
            remaining = remaining.slice(cutAt);
        }
        return pages.length > 0 ? pages : [htmlContent];
    }

    function openBookModal(story) {
        if (!bookModal) return;
        bookPages = splitIntoPages(story.content);
        currentBookPage = 0;

        if (bookTitle) bookTitle.textContent = story.title;
        if (bookAuthor) bookAuthor.innerHTML = `✍️ ${escapeHtml(story.author)}`;

        renderBookPage();
        bookModal.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function renderBookPage() {
        if (!bookContent) return;
        const safeHtml = sanitizeHtml(bookPages[currentBookPage] || '');
        bookContent.innerHTML = safeHtml;

        // Show header only on first page
        if (bookStoryHeader) bookStoryHeader.style.display = currentBookPage === 0 ? '' : 'none';

        const total = bookPages.length;
        const pageNum = currentBookPage + 1;
        if (bookPageNumRight) bookPageNumRight.textContent = `${pageNum * 2}`;
        if (bookPageNumLeft) bookPageNumLeft.textContent = `${pageNum * 2 - 1}`;
        if (bookPageIndicator) bookPageIndicator.textContent = `Σελίδα ${pageNum} / ${total}`;
        if (bookPrevBtn) bookPrevBtn.disabled = currentBookPage === 0;
        if (bookNextBtn) bookNextBtn.disabled = currentBookPage >= total - 1;
    }

    if (bookPrevBtn) bookPrevBtn.addEventListener('click', () => {
        if (currentBookPage > 0) { currentBookPage--; renderBookPage(); }
    });
    if (bookNextBtn) bookNextBtn.addEventListener('click', () => {
        if (currentBookPage < bookPages.length - 1) { currentBookPage++; renderBookPage(); }
    });
    if (closeBookBtn) closeBookBtn.addEventListener('click', () => {
        if (bookModal) bookModal.hidden = true;
        document.body.style.overflow = '';
    });
    if (bookModal) bookModal.addEventListener('click', (e) => {
        if (e.target === bookModal) {
            bookModal.hidden = true;
            document.body.style.overflow = '';
        }
    });
});
