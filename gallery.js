document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. SUPABASE CLIENT & DATA STORAGE INITIALIZATION
    // ----------------------------------------------------
    const STORAGE_KEY = 'igatamou_user_cats';
    const LIKED_CATS_KEY = 'igatamou_liked_cats';
    const ADMIN_AUTH_KEY = 'igatamou_admin_logged_in';

    const SUPABASE_URL = 'https://hqabeqlvnqdvipnspjog.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYWJlcWx2bnFkdmlwbnNwam9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDQzNDMsImV4cCI6MjEwMDk4MDM0M30.nmB5WOUN-WFQRhRxS14yCLK7X5I8OqJbWk-lRtR0yDg';

    let supabase = null;
    if (window.supabase && window.supabase.createClient) {
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } catch (e) {
            console.log('Supabase client init error:', e);
        }
    }

    // Initial sample approved cat (Real Magkas Photo)
    const sampleCats = [
        {
            id: 'cat_sample_1',
            name: 'Μάγκας',
            owner: 'Αριάδνη (7 ετών)',
            bio: 'Η επίσημη μασκότ μας με το ροζ κορδελάκι της! 🎀',
            image: 'magkas.jpg',
            status: 'approved',
            likes: 18,
            date: '30/07/2026'
        }
    ];

    function getCatsData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCats));
            return sampleCats;
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            return sampleCats;
        }
    }

    function saveCatsData(cats) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
    }

    function getLikedCatIds() {
        try {
            return JSON.parse(localStorage.getItem(LIKED_CATS_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    // Sync from Supabase DB on page load
    async function syncFromSupabase() {
        if (!supabase) return;
        try {
            const { data, error } = await supabase.from('cats').select('*');
            if (!error && Array.isArray(data) && data.length > 0) {
                const localCats = getCatsData();
                const map = new Map();
                localCats.forEach(c => map.set(c.id, c));
                data.forEach(c => map.set(c.id, c));
                const merged = Array.from(map.values());
                saveCatsData(merged);
                
                if (galleryGrid) renderPublicGallery();
                if (adminApprovedGrid) renderAdminDashboard();
            }
        } catch (err) {
            console.log('Supabase sync notice:', err);
        }
    }

    // Trigger initial sync
    syncFromSupabase();

    // ----------------------------------------------------
    // 2. PUBLIC GALLERY PAGE LOGIC (gallery.html)
    // ----------------------------------------------------
    const galleryGrid = document.getElementById('galleryGrid');
    const emptyGallery = document.getElementById('emptyGallery');
    const uploadModal = document.getElementById('uploadModal');
    const successModal = document.getElementById('successModal');
    const openUploadBtn = document.getElementById('openUploadBtn');
    const closeUploadBtn = document.getElementById('closeUploadBtn');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    const okSuccessBtn = document.getElementById('okSuccessBtn');
    const catUploadForm = document.getElementById('catUploadForm');
    const catPhotoInput = document.getElementById('catPhotoInput');
    const imagePreviewBox = document.getElementById('imagePreviewBox');
    const previewImg = document.getElementById('previewImg');

    if (galleryGrid) {
        renderPublicGallery();
    }

    function renderPublicGallery() {
        const cats = getCatsData();
        const likedCatIds = getLikedCatIds();
        const approvedCats = cats.filter(c => c.status === 'approved');

        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';

        if (approvedCats.length === 0) {
            if (emptyGallery) emptyGallery.hidden = false;
            return;
        }

        if (emptyGallery) emptyGallery.hidden = true;

        approvedCats.forEach(cat => {
            const isLiked = likedCatIds.includes(cat.id);
            const card = document.createElement('div');
            card.className = 'cat-gallery-card';
            card.innerHTML = `
                <div class="cat-card-img-wrapper">
                    <img src="${cat.image}" alt="${cat.name}" class="cat-card-img">
                    <span class="cat-card-ribbon">🎀</span>
                </div>
                <div class="cat-card-body">
                    <div class="cat-card-header">
                        <h3>${cat.name}</h3>
                        <span class="owner-badge">👤 ${cat.owner}</span>
                    </div>
                    ${cat.bio ? `<p class="cat-card-bio">"${cat.bio}"</p>` : ''}
                    <div class="cat-card-footer">
                        <button class="btn-like-cat ${isLiked ? 'already-liked' : ''}" data-id="${cat.id}">
                            💖 <span class="like-count">${cat.likes || 0}</span> <small>${isLiked ? 'Χαϊδεύτηκε!' : 'Χάδια'}</small>
                        </button>
                        <span class="cat-date">📅 ${cat.date || ''}</span>
                    </div>
                </div>
            `;

            const likeBtn = card.querySelector('.btn-like-cat');
            likeBtn.addEventListener('click', () => handleCatLike(cat.id, likeBtn));

            galleryGrid.appendChild(card);
        });
    }

    function handleCatLike(catId, btnEl) {
        const likedCatIds = getLikedCatIds();
        const cats = getCatsData();
        const targetCat = cats.find(c => c.id === catId);
        if (!targetCat) return;

        // Visual Heart Pop Animation on EVERY click
        btnEl.classList.remove('heart-pop');
        void btnEl.offsetWidth; // Force reflow
        btnEl.classList.add('heart-pop');

        // Only increment the persistent global count ONCE per visitor
        if (!likedCatIds.includes(catId)) {
            likedCatIds.push(catId);
            localStorage.setItem(LIKED_CATS_KEY, JSON.stringify(likedCatIds));

            targetCat.likes = (targetCat.likes || 0) + 1;
            saveCatsData(cats);

            // Sync Like to Supabase DB
            if (supabase) {
                supabase.from('cats').update({ likes: targetCat.likes }).eq('id', catId).then();
            }

            btnEl.classList.add('already-liked');
            const countSpan = btnEl.querySelector('.like-count');
            const textSmall = btnEl.querySelector('small');
            if (countSpan) countSpan.textContent = targetCat.likes;
            if (textSmall) textSmall.textContent = 'Χαϊδεύτηκε!';
        }
    }

    // Modal Control
    if (openUploadBtn) {
        openUploadBtn.addEventListener('click', () => {
            if (uploadModal) uploadModal.hidden = false;
        });
    }

    if (closeUploadBtn) {
        closeUploadBtn.addEventListener('click', () => {
            if (uploadModal) uploadModal.hidden = true;
        });
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            if (successModal) successModal.hidden = true;
        });
    }

    if (okSuccessBtn) {
        okSuccessBtn.addEventListener('click', () => {
            if (successModal) successModal.hidden = true;
        });
    }

    // Photo Preview & Canvas Compression
    let compressedImageData = null;
    let selectedFileBlob = null;

    if (catPhotoInput) {
        catPhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            selectedFileBlob = file;

            compressImageFile(file, (base64Img) => {
                compressedImageData = base64Img;
                if (previewImg) previewImg.src = base64Img;
                if (imagePreviewBox) imagePreviewBox.hidden = false;
            });
        });
    }

    function compressImageFile(file, callback) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
                callback(compressedBase64);
            };
        };
    }

    // Submit Upload Form with Supabase Storage Integration
    if (catUploadForm) {
        catUploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('catNameInput').value.trim();
            const owner = document.getElementById('ownerNameInput').value.trim();
            const bio = document.getElementById('catBioInput').value.trim();

            if (!name || !owner || !compressedImageData) {
                alert('Παρακαλώ συμπλήρωσε όλα τα υποχρεωτικά πεδία και διάλεξε φωτογραφία!');
                return;
            }

            const catId = 'cat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
            let imageUrl = compressedImageData;

            // Upload image to Supabase Storage Bucket 'images'
            if (supabase && selectedFileBlob) {
                try {
                    const storageFileName = `${catId}.jpg`;
                    const { data: uploadData, error: uploadErr } = await supabase.storage
                        .from('images')
                        .upload(storageFileName, selectedFileBlob, {
                            contentType: selectedFileBlob.type || 'image/jpeg',
                            upsert: true
                        });

                    if (!uploadErr) {
                        const { data: urlData } = supabase.storage.from('images').getPublicUrl(storageFileName);
                        if (urlData && urlData.publicUrl) {
                            imageUrl = urlData.publicUrl;
                        }
                    }
                } catch (err) {
                    console.log('Supabase storage upload notice:', err);
                }
            }

            const newCat = {
                id: catId,
                name: name,
                owner: owner,
                bio: bio,
                image: imageUrl,
                status: 'pending', // Awaiting Admin Approval!
                likes: 0,
                date: new Date().toLocaleDateString('el-GR')
            };

            // Save to local storage
            const cats = getCatsData();
            cats.push(newCat);
            saveCatsData(cats);

            // Insert to Supabase DB 'cats' table
            if (supabase) {
                try {
                    await supabase.from('cats').insert([{
                        id: newCat.id,
                        name: newCat.name,
                        owner: newCat.owner,
                        bio: newCat.bio,
                        image: newCat.image,
                        status: newCat.status,
                        likes: newCat.likes,
                        date: newCat.date
                    }]);
                } catch (dbErr) {
                    console.log('Supabase DB insert notice:', dbErr);
                }
            }

            // Reset Form & Show Success Modal
            catUploadForm.reset();
            compressedImageData = null;
            selectedFileBlob = null;
            if (imagePreviewBox) imagePreviewBox.hidden = true;
            if (uploadModal) uploadModal.hidden = true;
            if (successModal) successModal.hidden = false;
        });
    }

    // ----------------------------------------------------
    // 3. ADMIN PANEL LOGIC (admin.html)
    // ----------------------------------------------------
    const adminLoginCard = document.getElementById('adminLoginCard');
    const adminDashboardCard = document.getElementById('adminDashboardCard');
    const adminHeaderActions = document.getElementById('adminHeaderActions');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const loginErrorMsg = document.getElementById('loginErrorMsg');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    const tabPending = document.getElementById('tabPending');
    const tabApproved = document.getElementById('tabApproved');
    const adminPendingSection = document.getElementById('adminPendingSection');
    const adminApprovedSection = document.getElementById('adminApprovedSection');
    const adminPendingGrid = document.getElementById('adminPendingGrid');
    const adminApprovedGrid = document.getElementById('adminApprovedGrid');
    const emptyAdminPending = document.getElementById('emptyAdminPending');
    const emptyAdminApproved = document.getElementById('emptyAdminApproved');

    // Admin Auth State
    function isAdminLoggedIn() {
        return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    }

    if (adminLoginForm) {
        checkAdminState();

        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pw = adminPasswordInput ? adminPasswordInput.value : '';
            if (pw === 'ariadni13') {
                localStorage.setItem(ADMIN_AUTH_KEY, 'true');
                if (loginErrorMsg) loginErrorMsg.hidden = true;
                checkAdminState();
            } else {
                if (loginErrorMsg) loginErrorMsg.hidden = false;
            }
        });

        if (adminLogoutBtn) {
            adminLogoutBtn.addEventListener('click', () => {
                localStorage.removeItem(ADMIN_AUTH_KEY);
                checkAdminState();
            });
        }

        // Tab Switching
        if (tabPending && tabApproved) {
            tabPending.addEventListener('click', () => {
                tabPending.classList.add('active');
                tabApproved.classList.remove('active');
                if (adminPendingSection) adminPendingSection.hidden = false;
                if (adminApprovedSection) adminApprovedSection.hidden = true;
            });

            tabApproved.addEventListener('click', () => {
                tabApproved.classList.add('active');
                tabPending.classList.remove('active');
                if (adminPendingSection) adminPendingSection.hidden = true;
                if (adminApprovedSection) adminApprovedSection.hidden = false;
            });
        }
    }

    function checkAdminState() {
        if (!adminLoginCard || !adminDashboardCard) return;

        if (isAdminLoggedIn()) {
            adminLoginCard.hidden = true;
            adminDashboardCard.hidden = false;
            if (adminHeaderActions) adminHeaderActions.hidden = false;
            renderAdminDashboard();
        } else {
            adminLoginCard.hidden = false;
            adminDashboardCard.hidden = true;
            if (adminHeaderActions) adminHeaderActions.hidden = true;
        }
    }

    function renderAdminDashboard() {
        const cats = getCatsData();
        const pendingCats = cats.filter(c => c.status === 'pending');
        const approvedCats = cats.filter(c => c.status === 'approved');

        // 1. Pending Grid
        if (adminPendingGrid) {
            adminPendingGrid.innerHTML = '';
            if (pendingCats.length === 0) {
                if (emptyAdminPending) emptyAdminPending.hidden = false;
            } else {
                if (emptyAdminPending) emptyAdminPending.hidden = true;

                pendingCats.forEach(cat => {
                    const card = document.createElement('div');
                    card.className = 'admin-cat-card';
                    card.innerHTML = `
                        <img src="${cat.image}" alt="${cat.name}" class="admin-cat-img">
                        <div class="admin-cat-info">
                            <h4>${cat.name}</h4>
                            <p><strong>Ιδιοκτήτης:</strong> ${cat.owner}</p>
                            ${cat.bio ? `<p><strong>Περιγραφή:</strong> "${cat.bio}"</p>` : ''}
                            <p><small>Ημερομηνία: ${cat.date || ''}</small></p>
                            <div class="admin-card-actions">
                                <button class="btn-approve" data-id="${cat.id}">✅ Έγκριση</button>
                                <button class="btn-reject" data-id="${cat.id}">❌ Απόρριψη</button>
                            </div>
                        </div>
                    `;

                    const approveBtn = card.querySelector('.btn-approve');
                    const rejectBtn = card.querySelector('.btn-reject');

                    approveBtn.addEventListener('click', () => updateCatStatus(cat.id, 'approved'));
                    rejectBtn.addEventListener('click', () => updateCatStatus(cat.id, 'rejected'));

                    adminPendingGrid.appendChild(card);
                });
            }
        }

        // 2. Approved Grid
        if (adminApprovedGrid) {
            adminApprovedGrid.innerHTML = '';
            if (approvedCats.length === 0) {
                if (emptyAdminApproved) emptyAdminApproved.hidden = false;
            } else {
                if (emptyAdminApproved) emptyAdminApproved.hidden = true;

                approvedCats.forEach(cat => {
                    const card = document.createElement('div');
                    card.className = 'admin-cat-card';
                    card.innerHTML = `
                        <img src="${cat.image}" alt="${cat.name}" class="admin-cat-img">
                        <div class="admin-cat-info">
                            <h4>${cat.name}</h4>
                            <p><strong>Ιδιοκτήτης:</strong> ${cat.owner}</p>
                            <p><strong>Χάδια:</strong> 💖 ${cat.likes || 0}</p>
                            <div class="admin-card-actions">
                                <button class="btn-reject" data-id="${cat.id}">🗑️ Διαγραφή</button>
                            </div>
                        </div>
                    `;

                    const deleteBtn = card.querySelector('.btn-reject');
                    deleteBtn.addEventListener('click', () => updateCatStatus(cat.id, 'rejected'));

                    adminApprovedGrid.appendChild(card);
                });
            }
        }
    }

    function updateCatStatus(catId, newStatus) {
        let cats = getCatsData();

        if (newStatus === 'rejected') {
            cats = cats.filter(c => c.id !== catId);
            if (supabase) {
                supabase.from('cats').delete().eq('id', catId).then();
            }
        } else {
            const target = cats.find(c => c.id === catId);
            if (target) {
                target.status = newStatus;
                if (supabase) {
                    supabase.from('cats').update({ status: newStatus }).eq('id', catId).then();
                }
            }
        }

        saveCatsData(cats);
        renderAdminDashboard();
    }
});
