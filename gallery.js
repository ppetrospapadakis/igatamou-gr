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

    // Initial sample approved cat (Real Magkas Photo Album with 5 photos!)
    const sampleCats = [
        {
            id: 'cat_sample_1',
            name: 'Μάγκας',
            owner: 'Αριάδνη (7 ετών)',
            bio: 'Η επίσημη μασκότ μας με το ροζ κορδελάκι της! 🎀',
            image: 'magkas.jpg',
            gallery: ['magkas.jpg', 'magkas_2.jpg', 'magkas_3.jpg', 'magkas_4.jpg', 'magkas_5.jpg'],
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
                data.forEach(c => {
                    if (typeof c.gallery === 'string') {
                        try { c.gallery = JSON.parse(c.gallery); } catch(e) {}
                    }
                    map.set(c.id, c);
                });
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
    const albumModal = document.getElementById('albumModal');
    const openUploadBtn = document.getElementById('openUploadBtn');
    const closeUploadBtn = document.getElementById('closeUploadBtn');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    const okSuccessBtn = document.getElementById('okSuccessBtn');
    const closeAlbumBtn = document.getElementById('closeAlbumBtn');

    const catUploadForm = document.getElementById('catUploadForm');
    const catPhotoInput = document.getElementById('catPhotoInput');
    const imagePreviewBox = document.getElementById('imagePreviewBox');
    const previewImg = document.getElementById('previewImg');
    const previewCountBadge = document.getElementById('previewCountBadge');

    // Album Modal Elements
    const albumCatName = document.getElementById('albumCatName');
    const albumCatOwner = document.getElementById('albumCatOwner');
    const albumFeaturedImg = document.getElementById('albumFeaturedImg');
    const albumImageCounter = document.getElementById('albumImageCounter');
    const albumThumbnails = document.getElementById('albumThumbnails');
    const prevAlbumImg = document.getElementById('prevAlbumImg');
    const nextAlbumImg = document.getElementById('nextAlbumImg');

    const adminSinglePhotoActions = document.getElementById('adminSinglePhotoActions');
    const deleteSinglePhotoBtn = document.getElementById('deleteSinglePhotoBtn');

    let currentAlbumCatId = null;
    let currentAlbumPhotos = [];
    let currentAlbumIndex = 0;

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
            const photoList = cat.gallery && cat.gallery.length ? cat.gallery : [cat.image];

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
                    
                    ${photoList.length > 0 ? `
                        <button class="btn-view-album" data-id="${cat.id}">
                            🖼️ Δες Άλμπουμ (${photoList.length} Φωτογραφίες) 📸
                        </button>
                    ` : ''}

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

            const albumBtn = card.querySelector('.btn-view-album');
            if (albumBtn) {
                albumBtn.addEventListener('click', () => openCatAlbumModal(cat));
            }

            galleryGrid.appendChild(card);
        });
    }

    // INTERACTIVE PHOTO ALBUM MODAL LOGIC (WITH ADMIN SINGLE-PHOTO DELETE)
    function openCatAlbumModal(cat) {
        currentAlbumCatId = cat.id;
        currentAlbumPhotos = cat.gallery && cat.gallery.length ? [...cat.gallery] : [cat.image];
        currentAlbumIndex = 0;

        if (albumCatName) albumCatName.textContent = `📸 Άλμπουμ: ${cat.name} 🐾`;
        if (albumCatOwner) albumCatOwner.textContent = `👤 ${cat.owner}`;

        // Show single photo delete action bar ONLY for Admin
        if (adminSinglePhotoActions) {
            adminSinglePhotoActions.hidden = !isAdminLoggedIn();
        }

        updateAlbumView();

        if (albumModal) albumModal.hidden = false;
    }

    function updateAlbumView() {
        if (!currentAlbumPhotos.length) return;

        const currentSrc = currentAlbumPhotos[currentAlbumIndex];
        if (albumFeaturedImg) {
            albumFeaturedImg.style.opacity = '0.3';
            setTimeout(() => {
                albumFeaturedImg.src = currentSrc;
                albumFeaturedImg.style.opacity = '1';
            }, 100);
        }

        if (albumImageCounter) {
            albumImageCounter.textContent = `${currentAlbumIndex + 1} / ${currentAlbumPhotos.length}`;
        }

        // Render Thumbnails
        if (albumThumbnails) {
            albumThumbnails.innerHTML = '';
            currentAlbumPhotos.forEach((src, idx) => {
                const thumb = document.createElement('div');
                thumb.className = `album-thumb ${idx === currentAlbumIndex ? 'active-thumb' : ''}`;
                thumb.innerHTML = `<img src="${src}" alt="Thumbnail ${idx + 1}">`;
                thumb.addEventListener('click', () => {
                    currentAlbumIndex = idx;
                    updateAlbumView();
                });
                albumThumbnails.appendChild(thumb);
            });
        }
    }

    // Delete single photo from album (Admin function)
    if (deleteSinglePhotoBtn) {
        deleteSinglePhotoBtn.addEventListener('click', () => {
            if (!currentAlbumCatId || !currentAlbumPhotos.length) return;

            const catId = currentAlbumCatId;
            const cats = getCatsData();
            const cat = cats.find(c => c.id === catId);
            if (!cat) return;

            const photoToDelete = currentAlbumPhotos[currentAlbumIndex];

            // Remove selected photo from current album array
            currentAlbumPhotos.splice(currentAlbumIndex, 1);

            if (currentAlbumPhotos.length === 0) {
                // If 0 photos left, delete cat profile completely
                updateCatStatus(catId, 'rejected');
                if (albumModal) albumModal.hidden = true;
                return;
            }

            // Update cat's gallery & main thumbnail image
            cat.gallery = currentAlbumPhotos;
            if (cat.image === photoToDelete) {
                cat.image = currentAlbumPhotos[0];
            }

            saveCatsData(cats);

            // Sync deletion to Supabase DB
            if (supabase) {
                supabase.from('cats').upsert({
                    id: cat.id,
                    name: cat.name,
                    owner: cat.owner,
                    bio: cat.bio,
                    image: cat.image,
                    gallery: JSON.stringify(cat.gallery),
                    status: cat.status,
                    likes: cat.likes,
                    date: cat.date
                }).then();
            }

            // Adjust index if out of bounds
            if (currentAlbumIndex >= currentAlbumPhotos.length) {
                currentAlbumIndex = currentAlbumPhotos.length - 1;
            }

            updateAlbumView();

            if (galleryGrid) renderPublicGallery();
            if (adminApprovedGrid) renderAdminDashboard();
        });
    }

    if (prevAlbumImg) {
        prevAlbumImg.addEventListener('click', () => {
            if (currentAlbumPhotos.length === 0) return;
            currentAlbumIndex = (currentAlbumIndex - 1 + currentAlbumPhotos.length) % currentAlbumPhotos.length;
            updateAlbumView();
        });
    }

    if (nextAlbumImg) {
        nextAlbumImg.addEventListener('click', () => {
            if (currentAlbumPhotos.length === 0) return;
            currentAlbumIndex = (currentAlbumIndex + 1) % currentAlbumPhotos.length;
            updateAlbumView();
        });
    }

    if (closeAlbumBtn) {
        closeAlbumBtn.addEventListener('click', () => {
            if (albumModal) albumModal.hidden = true;
        });
    }

    function handleCatLike(catId, btnEl) {
        const likedCatIds = getLikedCatIds();
        const cats = getCatsData();
        const targetCat = cats.find(c => c.id === catId);
        if (!targetCat) return;

        btnEl.classList.remove('heart-pop');
        void btnEl.offsetWidth; // Force reflow
        btnEl.classList.add('heart-pop');

        if (!likedCatIds.includes(catId)) {
            likedCatIds.push(catId);
            localStorage.setItem(LIKED_CATS_KEY, JSON.stringify(likedCatIds));

            targetCat.likes = (targetCat.likes || 0) + 1;
            saveCatsData(cats);

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

    // Multi-Photo Preview & Canvas Compression
    let selectedFilesArray = [];
    let compressedImagesArray = [];

    if (catPhotoInput) {
        catPhotoInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            selectedFilesArray = files;
            compressedImagesArray = [];

            let processedCount = 0;
            files.forEach((file, index) => {
                compressImageFile(file, (base64Img) => {
                    compressedImagesArray[index] = base64Img;
                    processedCount++;

                    if (index === 0 && previewImg) {
                        previewImg.src = base64Img;
                        if (imagePreviewBox) imagePreviewBox.hidden = false;
                    }

                    if (previewCountBadge) {
                        previewCountBadge.hidden = false;
                        previewCountBadge.textContent = `📷 ${files.length} Φωτογραφίες`;
                    }
                });
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
                const MAX_WIDTH = 900;
                const MAX_HEIGHT = 900;
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

                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.78);
                callback(compressedBase64);
            };
        };
    }

    // Submit Upload Form with Multi-Photo Supabase Storage & Album Support
    if (catUploadForm) {
        catUploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('catNameInput').value.trim();
            const owner = document.getElementById('ownerNameInput').value.trim();
            const bio = document.getElementById('catBioInput').value.trim();

            if (!name || !owner || !compressedImagesArray.length) {
                alert('Παρακαλώ συμπλήρωσε όλα τα υποχρεωτικά πεδία και διάλεξε τουλάχιστον μία φωτογραφία!');
                return;
            }

            const catId = 'cat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
            const uploadedUrls = [];

            // Upload each selected photo to Supabase Storage Bucket 'images'
            for (let i = 0; i < selectedFilesArray.length; i++) {
                const file = selectedFilesArray[i];
                let fileUrl = compressedImagesArray[i] || compressedImagesArray[0];

                if (supabase && file) {
                    try {
                        const storageFileName = `${catId}_${i + 1}.jpg`;
                        const { error: uploadErr } = await supabase.storage
                            .from('images')
                            .upload(storageFileName, file, {
                                contentType: file.type || 'image/jpeg',
                                upsert: true
                            });

                        if (!uploadErr) {
                            const { data: urlData } = supabase.storage.from('images').getPublicUrl(storageFileName);
                            if (urlData && urlData.publicUrl) {
                                fileUrl = urlData.publicUrl;
                            }
                        }
                    } catch (err) {
                        console.log('Supabase storage upload notice:', err);
                    }
                }
                uploadedUrls.push(fileUrl);
            }

            const primaryImage = uploadedUrls[0] || compressedImagesArray[0];

            const newCat = {
                id: catId,
                name: name,
                owner: owner,
                bio: bio,
                image: primaryImage,
                gallery: uploadedUrls,
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
                        gallery: JSON.stringify(newCat.gallery),
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
            selectedFilesArray = [];
            compressedImagesArray = [];
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
            const pw = adminPasswordInput ? adminPasswordInput.value.trim().toLowerCase() : '';
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

        const pendingCountEl = document.getElementById('pendingCount');
        const approvedCountEl = document.getElementById('approvedCount');
        if (pendingCountEl) pendingCountEl.textContent = pendingCats.length;
        if (approvedCountEl) approvedCountEl.textContent = approvedCats.length;

        // 1. Pending Grid
        if (adminPendingGrid) {
            adminPendingGrid.innerHTML = '';
            if (pendingCats.length === 0) {
                if (emptyAdminPending) emptyAdminPending.hidden = false;
            } else {
                if (emptyAdminPending) emptyAdminPending.hidden = true;

                pendingCats.forEach(cat => {
                    const photoCount = cat.gallery && cat.gallery.length ? cat.gallery.length : 1;
                    const card = document.createElement('div');
                    card.className = 'admin-cat-card';
                    card.innerHTML = `
                        <img src="${cat.image}" alt="${cat.name}" class="admin-cat-img">
                        <div class="admin-cat-info">
                            <h4>${cat.name}</h4>
                            <p><strong>Ιδιοκτήτης:</strong> ${cat.owner}</p>
                            ${cat.bio ? `<p><strong>Περιγραφή:</strong> "${cat.bio}"</p>` : ''}
                            <p><small>Φωτογραφίες Άλμπουμ: <strong>${photoCount}</strong></small></p>
                            <button class="btn-view-album" data-id="${cat.id}">🖼️ Προεπισκόπηση Άλμπουμ</button>
                            <div class="admin-card-actions">
                                <button class="btn-approve" data-id="${cat.id}">✅ Έγκριση</button>
                                <button class="btn-reject" data-id="${cat.id}">❌ Απόρριψη</button>
                            </div>
                        </div>
                    `;

                    const approveBtn = card.querySelector('.btn-approve');
                    const rejectBtn = card.querySelector('.btn-reject');
                    const albumBtn = card.querySelector('.btn-view-album');

                    if (albumBtn) albumBtn.addEventListener('click', () => openCatAlbumModal(cat));
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
                    const photoCount = cat.gallery && cat.gallery.length ? cat.gallery.length : 1;
                    const card = document.createElement('div');
                    card.className = 'admin-cat-card';
                    card.innerHTML = `
                        <img src="${cat.image}" alt="${cat.name}" class="admin-cat-img">
                        <div class="admin-cat-info">
                            <h4>${cat.name}</h4>
                            <p><strong>Ιδιοκτήτης:</strong> ${cat.owner}</p>
                            <p><strong>Χάδια:</strong> 💖 ${cat.likes || 0}</p>
                            <p><small>Φωτογραφίες Άλμπουμ: <strong>${photoCount}</strong></small></p>
                            <button class="btn-view-album" data-id="${cat.id}">🖼️ Προβολή Άλμπουμ</button>
                            <div class="admin-card-actions">
                                <button class="btn-reject" data-id="${cat.id}">🗑️ Διαγραφή</button>
                            </div>
                        </div>
                    `;

                    const deleteBtn = card.querySelector('.btn-reject');
                    const albumBtn = card.querySelector('.btn-view-album');

                    if (albumBtn) albumBtn.addEventListener('click', () => openCatAlbumModal(cat));
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
