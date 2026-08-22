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

    const OFFICIAL_MAGKAS_STORY = {
        id: 'story_official_magkas',
        title: 'Η Μάγκας και το Μυστικό Ψάρι',
        author: 'Αριάδνη, 7 ετών',
        cover_image_url: 'magkas_logo.png',
        is_admin: true,
        status: 'approved',
        created_at: '2025-01-01',
        content: '<h2>Κεφάλαιο 1: Η Ανακάλυψη</h2><p>Μια ζεστή καλοκαιρινή μέρα, η Μάγκας κοιτούσε έξω από το παράθυρο και είδε κάτι να λάμπει στο δέντρο της αυλής. Τινάχτηκε έξω με μια αναπήδηση...</p><p>«Τι είναι αυτό;» σκέφτηκε με τα μεγάλα της πράσινα μάτια να αστράφτουν από περιέργεια.</p><h2>Κεφάλαιο 2: Η Περιπέτεια</h2><p>Ανέβηκε στο δέντρο — ένα, δύο, τρία άλματα — και βρήκε ένα μυστηριώδες κουτί με ψάρια ζωγραφιστά επάνω! Μέσα ήταν μια επιστολή που έγραφε:</p><blockquote>«Αγαπητή Μάγκας, αυτά τα ψάρια είναι για σένα! Από τον μυστικό σου θαυμαστή 🐟»</blockquote><p>Η Μάγκας χαμογέλασε με όλη της την καρδιά. Ήταν η καλύτερη μέρα της ζωής της! 🐾✨</p>'
    };

    function escapeHtml(str) {
        return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
    }

    function sanitizeHtml(html) {
        const allowedTags = /^(p|br|strong|em|u|h1|h2|h3|ul|ol|li|span|div|img|blockquote)$/i;
        const div = document.createElement('div');
        div.innerHTML = html;
        div.querySelectorAll('*').forEach(el => {
            if (!allowedTags.test(el.tagName)) {
                el.replaceWith(document.createTextNode(el.textContent));
            } else {
                Array.from(el.attributes).forEach(attr => {
                    if (attr.name.startsWith('on')) el.removeAttribute(attr.name);
                });
                if (el.tagName.toLowerCase() === 'img') {
                    const src = el.getAttribute('src') || '';
                    if (!src.startsWith('https://') && !src.startsWith('data:image/') && !src.startsWith('http://') && !src.includes('.png') && !src.includes('.jpg') && !src.includes('.jpeg') && !src.includes('.webp')) {
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
        initStoriesPage();
    }

    function getLocalStories() {
        let localStories = [];
        try {
            localStories = JSON.parse(localStorage.getItem('igatamou_local_stories') || '[]');
            if (!localStorage.getItem('igatamou_stories_initialized')) {
                localStories.unshift(OFFICIAL_MAGKAS_STORY);
                localStorage.setItem('igatamou_local_stories', JSON.stringify(localStories));
                localStorage.setItem('igatamou_stories_initialized', 'true');
            }
        } catch(e) {}
        return localStories.filter(s => s.status === 'approved');
    }

    async function initStoriesPage() {
        // 1. INSTANT RENDER (0ms) from local cache / defaults
        const cachedStories = getLocalStories();
        if (cachedStories.length > 0) {
            if (storiesLoading) storiesLoading.hidden = true;
            if (emptyStories) emptyStories.hidden = true;
            if (storiesGrid) storiesGrid.hidden = false;
            renderStoryCards(cachedStories);
        }

        // 2. FAST BACKGROUND SYNC with targeted query (only story rows, minimal payload)
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('cats')
                    .select('id, name, owner, bio, image, status, date')
                    .ilike('bio', '%STORY%')
                    .eq('status', 'approved');

                if (!error && data && data.length > 0) {
                    const cloudStories = [];
                    data.forEach(item => {
                        if (item.bio && item.bio.includes('[STORY]')) {
                            try {
                                const parsed = JSON.parse(item.bio.replace(/^📖\s*\[STORY\]\s*/, ''));
                                cloudStories.push({
                                    id: item.id,
                                    title: item.name,
                                    author: item.owner,
                                    content: parsed.content || '',
                                    cover_image_url: item.image || parsed.cover_image_url || 'magkas_logo.png',
                                    is_admin: parsed.is_admin || false,
                                    status: item.status,
                                    created_at: item.date || ''
                                });
                            } catch(pe) {}
                        }
                    });

                    // Merge cloud with local
                    const mergedMap = new Map();
                    cachedStories.forEach(s => mergedMap.set(s.id, s));
                    cloudStories.forEach(s => mergedMap.set(s.id, s));
                    const finalStories = Array.from(mergedMap.values());

                    // Save merged cache
                    try {
                        localStorage.setItem('igatamou_local_stories', JSON.stringify(finalStories));
                    } catch(se) {}

                    if (storiesLoading) storiesLoading.hidden = true;
                    if (emptyStories) emptyStories.hidden = finalStories.length > 0;
                    if (storiesGrid) storiesGrid.hidden = false;
                    renderStoryCards(finalStories);
                    return;
                }
            } catch(e) {
                console.log('Background stories sync notice:', e);
            }
        }

        // Fallback if no cache was shown
        if (storiesLoading) storiesLoading.hidden = true;
        const current = getLocalStories();
        if (current.length > 0) {
            if (storiesGrid) storiesGrid.hidden = false;
            renderStoryCards(current);
        } else {
            if (emptyStories) emptyStories.hidden = false;
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
            const dateStr = story.created_at ? (isNaN(Date.parse(story.created_at)) ? story.created_at : new Date(story.created_at).toLocaleDateString('el-GR', { year:'numeric', month:'long', day:'numeric' })) : '';

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

    function buildStoryBookPages(story) {
        const coverUrl = story.cover_image_url || 'magkas_logo.png';
        const coverPageHtml = `
            <div class="book-cover-page">
                <div class="book-cover-badge">✨ Γατο-Ιστορίες 📖</div>
                <h2 class="book-cover-title">${escapeHtml(story.title)}</h2>
                <div class="book-cover-author">✍️ Από: <strong>${escapeHtml(story.author)}</strong></div>
                <div class="book-cover-img-box">
                    <img src="${escapeHtml(coverUrl)}" alt="${escapeHtml(story.title)}" class="book-cover-img" onerror="this.src='magkas_logo.png'">
                </div>
                <div class="book-cover-hint">🐾 Πάτα «Επόμενη ▶» για να διαβάσεις! 📖</div>
            </div>
        `;

        const isMobile = window.innerWidth <= 768;
        const wordsPerPage = isMobile ? 85 : 150;
        const charsPerPage = wordsPerPage * 6;

        let remaining = story.content || '';
        const textPages = [];
        while (remaining.length > 0) {
            if (remaining.length <= charsPerPage) {
                textPages.push(remaining);
                break;
            }
            let cutAt = charsPerPage;
            const pEnd = remaining.lastIndexOf('</p>', cutAt);
            if (pEnd > cutAt / 2) cutAt = pEnd + 4;
            textPages.push(remaining.slice(0, cutAt));
            remaining = remaining.slice(cutAt);
        }

        if (textPages.length === 0) textPages.push(story.content || '');

        return [coverPageHtml, ...textPages];
    }

    function openBookModal(story) {
        if (!bookModal) return;
        bookPages = buildStoryBookPages(story);
        currentBookPage = 0;

        if (bookTitle) bookTitle.textContent = story.title;
        if (bookAuthor) bookAuthor.innerHTML = `✍️ ${escapeHtml(story.author)}`;

        renderBookPage();
        bookModal.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function renderBookPage() {
        if (!bookContent) return;
        const safeHtml = currentBookPage === 0 ? bookPages[0] : sanitizeHtml(bookPages[currentBookPage] || '');
        bookContent.innerHTML = safeHtml;

        // Reset scroll position to top
        bookContent.scrollTop = 0;
        const bookPageRight = document.getElementById('bookPageRight');
        if (bookPageRight) bookPageRight.scrollTop = 0;
        const bookElement = document.getElementById('bookElement');
        if (bookElement) bookElement.scrollTop = 0;
        const modalContainer = document.querySelector('.book-modal-container');
        if (modalContainer) modalContainer.scrollTop = 0;
        if (bookModal) bookModal.scrollTop = 0;

        // Header hidden on cover page (page 0)
        if (bookStoryHeader) bookStoryHeader.style.display = currentBookPage === 0 ? 'none' : '';

        const total = bookPages.length;
        const pageNum = currentBookPage + 1;
        if (bookPageNumRight) bookPageNumRight.textContent = `${pageNum}`;
        if (bookPageNumLeft) bookPageNumLeft.textContent = `${Math.max(1, pageNum - 1)}`;
        if (bookPageIndicator) bookPageIndicator.textContent = currentBookPage === 0 ? `Εξώφυλλο (1 / ${total})` : `Σελίδα ${pageNum} / ${total}`;
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

    window.openBookModal = openBookModal;
});
