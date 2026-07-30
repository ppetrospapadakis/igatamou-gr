document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. DATA STORAGE INITIALIZATION
    // ----------------------------------------------------
    const STORAGE_KEY = 'igatamou_user_cats';
    const ADMIN_AUTH_KEY = 'igatamou_admin_logged_in';

    // Initial sample approved cats if empty
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
        const approvedCats = cats.filter(c => c.status === 'approved');

        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';

        if (approvedCats.length === 0) {
            if (emptyGallery) emptyGallery.hidden = false;
            return;
        }

        if (emptyGallery) emptyGallery.hidden = true;

        approvedCats.forEach(cat => {
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
                        <button class="btn-like-cat" data-id="${cat.id}">
                            💖 <span class="like-count">${cat.likes || 0}</span> <small>Χάδια</small>
                        </button>
                        <span class="cat-date">${cat.date || ''}</span>
                    </div>
                </div>
            `;
            galleryGrid.appendChild(card);
        });

        // Like Button Event Listeners
        document.querySelectorAll('.btn-like-cat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const catId = btn.getAttribute('data-id');
                handleLikeCat(catId, btn);
            });
        });
    }

    function handleLikeCat(catId, btnEl) {
        const cats = getCatsData();
        const cat = cats.find(c => c.id === catId);
        if (cat) {
            cat.likes = (cat.likes || 0) + 1;
            saveCatsData(cats);

            // Update UI
            const countEl = btnEl.querySelector('.like-count');
            if (countEl) countEl.textContent = cat.likes;

            // Heart animation
            btnEl.classList.add('heart-pop');
            setTimeout(() => btnEl.classList.remove('heart-pop'), 400);
        }
    }

    // Modal Triggers
    if (openUploadBtn) {
        openUploadBtn.addEventListener('click', () => {
            if (uploadModal) uploadModal.hidden = false;
        });
    }

    document.querySelectorAll('.openUploadTrigger').forEach(btn => {
        btn.addEventListener('click', () => {
            if (uploadModal) uploadModal.hidden = false;
        });
    });

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

    if (catPhotoInput) {
        catPhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

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

                // Export as compressed JPEG quality 0.75
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
                callback(compressedBase64);
            };
        };
    }

    // Submit Upload Form
    if (catUploadForm) {
        catUploadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('catNameInput').value.trim();
            const owner = document.getElementById('ownerNameInput').value.trim();
            const bio = document.getElementById('catBioInput').value.trim();

            if (!name || !owner || !compressedImageData) {
                alert('Παρακαλώ συμπλήρωσε όλα τα υποχρεωτικά πεδία και διάλεξε φωτογραφία!');
                return;
            }

            const newCat = {
                id: 'cat_' + Date.now(),
                name: name,
                owner: owner,
                bio: bio,
                image: compressedImageData,
                status: 'pending', // Awaiting Admin Approval!
                likes: 0,
                date: new Date().toLocaleDateString('el-GR')
            };

            const cats = getCatsData();
            cats.push(newCat);
            saveCatsData(cats);

            // Reset Form & Close Upload Modal
            catUploadForm.reset();
            if (imagePreviewBox) imagePreviewBox.hidden = true;
            compressedImageData = null;
            if (uploadModal) uploadModal.hidden = true;

            // Show Success Modal Popup with Μάγκας text!
            if (successModal) successModal.hidden = false;
        });
    }

    // ----------------------------------------------------
    // 3. ADMIN PANEL LOGIC (admin.html)
    // ----------------------------------------------------
    const adminLoginCard = document.getElementById('adminLoginCard');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminDashboard = document.getElementById('adminDashboard');
    const adminPasswordInput = document.getElementById('adminPasswordInput');
    const loginErrorMsg = document.getElementById('loginErrorMsg');
    const adminHeaderActions = document.getElementById('adminHeaderActions');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    const tabPendingBtn = document.getElementById('tabPendingBtn');
    const tabApprovedBtn = document.getElementById('tabApprovedBtn');
    const sectionPending = document.getElementById('sectionPending');
    const sectionApproved = document.getElementById('sectionApproved');

    const pendingGrid = document.getElementById('pendingGrid');
    const approvedAdminGrid = document.getElementById('approvedAdminGrid');
    const emptyPending = document.getElementById('emptyPending');
    const emptyApproved = document.getElementById('emptyApproved');
    const pendingCount = document.getElementById('pendingCount');
    const approvedCount = document.getElementById('approvedCount');

    if (adminLoginForm) {
        checkAdminLoginState();

        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pwd = adminPasswordInput.value.trim();

            if (pwd === 'ariadni13') {
                localStorage.setItem(ADMIN_AUTH_KEY, 'true');
                if (loginErrorMsg) loginErrorMsg.hidden = true;
                checkAdminLoginState();
            } else {
                if (loginErrorMsg) loginErrorMsg.hidden = false;
            }
        });
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem(ADMIN_AUTH_KEY);
            checkAdminLoginState();
        });
    }

    function checkAdminLoginState() {
        const isLoggedIn = localStorage.getItem(ADMIN_AUTH_KEY) === 'true';

        if (isLoggedIn) {
            if (adminLoginCard) adminLoginCard.hidden = true;
            if (adminDashboard) adminDashboard.hidden = false;
            if (adminHeaderActions) adminHeaderActions.hidden = false;
            renderAdminDashboard();
        } else {
            if (adminLoginCard) adminLoginCard.hidden = false;
            if (adminDashboard) adminDashboard.hidden = true;
            if (adminHeaderActions) adminHeaderActions.hidden = true;
        }
    }

    // Admin Tabs
    if (tabPendingBtn && tabApprovedBtn) {
        tabPendingBtn.addEventListener('click', () => {
            tabPendingBtn.classList.add('active');
            tabApprovedBtn.classList.remove('active');
            if (sectionPending) sectionPending.hidden = false;
            if (sectionApproved) sectionApproved.hidden = true;
        });

        tabApprovedBtn.addEventListener('click', () => {
            tabApprovedBtn.classList.add('active');
            tabPendingBtn.classList.remove('active');
            if (sectionApproved) sectionApproved.hidden = false;
            if (sectionPending) sectionPending.hidden = true;
        });
    }

    function renderAdminDashboard() {
        const cats = getCatsData();
        const pendingCats = cats.filter(c => c.status === 'pending');
        const approvedCats = cats.filter(c => c.status === 'approved');

        if (pendingCount) pendingCount.textContent = pendingCats.length;
        if (approvedCount) approvedCount.textContent = approvedCats.length;

        // Render Pending
        if (pendingGrid) {
            pendingGrid.innerHTML = '';
            if (pendingCats.length === 0) {
                if (emptyPending) emptyPending.hidden = false;
            } else {
                if (emptyPending) emptyPending.hidden = true;
                pendingCats.forEach(cat => {
                    const card = createAdminCatCard(cat, true);
                    pendingGrid.appendChild(card);
                });
            }
        }

        // Render Approved
        if (approvedAdminGrid) {
            approvedAdminGrid.innerHTML = '';
            if (approvedCats.length === 0) {
                if (emptyApproved) emptyApproved.hidden = false;
            } else {
                if (emptyApproved) emptyApproved.hidden = true;
                approvedCats.forEach(cat => {
                    const card = createAdminCatCard(cat, false);
                    approvedAdminGrid.appendChild(card);
                });
            }
        }
    }

    function createAdminCatCard(cat, isPending) {
        const card = document.createElement('div');
        card.className = 'admin-cat-card';
        card.innerHTML = `
            <img src="${cat.image}" alt="${cat.name}" class="admin-cat-img">
            <div class="admin-cat-info">
                <h4>${cat.name}</h4>
                <p><strong>Ιδιοκτήτης:</strong> ${cat.owner}</p>
                ${cat.bio ? `<p><strong>Περιγραφή:</strong> ${cat.bio}</p>` : ''}
                <p class="cat-date"><strong>Ημερομηνία:</strong> ${cat.date || ''}</p>
                <div class="admin-card-actions">
                    ${isPending ? `
                        <button class="btn btn-approve" data-id="${cat.id}">
                            ✅ Έγκριση
                        </button>
                    ` : ''}
                    <button class="btn btn-reject" data-id="${cat.id}">
                        ❌ Διαγραφή
                    </button>
                </div>
            </div>
        `;

        // Action Handlers
        const approveBtn = card.querySelector('.btn-approve');
        if (approveBtn) {
            approveBtn.addEventListener('click', () => {
                approveCatSubmission(cat.id);
            });
        }

        const rejectBtn = card.querySelector('.btn-reject');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                deleteCatSubmission(cat.id);
            });
        }

        return card;
    }

    function approveCatSubmission(catId) {
        const cats = getCatsData();
        const cat = cats.find(c => c.id === catId);
        if (cat) {
            cat.status = 'approved';
            saveCatsData(cats);
            renderAdminDashboard();
        }
    }

    function deleteCatSubmission(catId) {
        if (confirm('Είσαι σίγουρος/η ότι θέλεις να διαγράψεις αυτή τη φωτογραφία;')) {
            let cats = getCatsData();
            cats = cats.filter(c => c.id !== catId);
            saveCatsData(cats);
            renderAdminDashboard();
        }
    }
});
