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

    function escapeHtml(str) {
        return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
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

    // thumbUrl: reserved for future image optimizations.
    // Supabase Image Transform API requires a paid plan — disabled for now.
    function thumbUrl(src) {
        return src || '';
    }

    // One-time background migration: re-compress any oversized base64 images already in localStorage.
    // Runs silently, does NOT block page rendering.
    function migrateOldBase64Images() {
        const MIGRATION_KEY = 'igatamou_migration_v1';
        if (localStorage.getItem(MIGRATION_KEY)) return; // already done

        setTimeout(async () => {
            const cats = getCatsData();
            let changed = false;

            for (const cat of cats) {
                const urls = [cat.image, ...(cat.gallery || [])].filter(Boolean);
                const recompressed = [];

                for (const url of urls) {
                    if (!url.startsWith('data:image')) {
                        recompressed.push(url); // Supabase URL — skip
                        continue;
                    }
                    // Only re-compress if base64 is large (> ~150KB encoded ≈ roughly 200KB string)
                    if (url.length < 200_000) {
                        recompressed.push(url); // already small enough
                        continue;
                    }
                    // Re-compress via canvas at 500px / quality 0.65
                    const smaller = await new Promise(resolve => {
                        const img = new Image();
                        img.onload = () => {
                            const MAX = 500;
                            let w = img.width, h = img.height;
                            if (w > h) { if (w > MAX) { h = h * MAX / w; w = MAX; } }
                            else       { if (h > MAX) { w = w * MAX / h; h = MAX; } }
                            const canvas = document.createElement('canvas');
                            canvas.width = w; canvas.height = h;
                            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                            resolve(canvas.toDataURL('image/jpeg', 0.65));
                        };
                        img.onerror = () => resolve(url); // keep original on error
                        img.src = url;
                    });
                    recompressed.push(smaller);
                    changed = true;
                }

                if (changed) {
                    cat.image = recompressed[0] || cat.image;
                    cat.gallery = recompressed.length > 0 ? recompressed : cat.gallery;
                }
            }

            if (changed) {
                saveCatsData(cats);
                console.log('igatamou: base64 images re-compressed and saved.');
            }
            localStorage.setItem(MIGRATION_KEY, '1');
        }, 3000); // run 3s after page load — doesn't affect initial render
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
                    const localCat = map.get(c.id);
                    if (localCat && Array.isArray(localCat.gallery) && localCat.gallery.length > 0) {
                        const allPhotos = new Set([c.image, ...(c.gallery || []), ...localCat.gallery]);
                        c.gallery = Array.from(allPhotos);
                    } else if (!c.gallery || !Array.isArray(c.gallery)) {
                        c.gallery = [c.image];
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
    migrateOldBase64Images(); // silently re-compress old large base64 images in background

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

    const catUploadForm = document.getElementById('catUploadForm') || document.getElementById('uploadForm');
    const catPhotoInput = document.getElementById('catPhotoInput');
    const imagePreviewBox = document.getElementById('imagePreviewBox') || document.getElementById('imagePreviewContainer');
    const previewImg = document.getElementById('previewImg') || document.getElementById('imagePreview');
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

    // Infinite scroll state for cats gallery (must be declared before renderPublicGallery is called)
    // Initial batch: 3 on mobile, 6 on desktop — subsequent batches always 6
    const catsInitialSize = window.innerWidth < 600 ? 3 : 6;
    let catsPageSize = 6;
    let catsRenderedCount = 0;
    let catsAllItems = [];
    let catsObserver = null;

    if (galleryGrid) {
        renderPublicGallery();
    }

    function renderPublicGallery() {
        const cats = getCatsData().filter(c => !(c.id && c.id.startsWith('draw_')) && !(c.bio && c.bio.includes('🎨 [DRAWING]')));
        const likedCatIds = getLikedCatIds();
        const approvedCats = cats.filter(c => c.status === 'approved');

        if (!galleryGrid) return;
        galleryGrid.innerHTML = '';

        // Clean up any old sentinel/observer
        const oldSentinel = document.getElementById('catsSentinel');
        if (oldSentinel) oldSentinel.remove();
        if (catsObserver) { catsObserver.disconnect(); catsObserver = null; }

        if (approvedCats.length === 0) {
            if (emptyGallery) emptyGallery.hidden = false;
            return;
        }
        if (emptyGallery) emptyGallery.hidden = true;

        catsAllItems = approvedCats;
        catsRenderedCount = 0;

        // Render first batch (smaller on mobile for faster initial paint)
        appendCatCards(likedCatIds, catsInitialSize);

        // If there are more items, set up IntersectionObserver on a sentinel
        if (catsRenderedCount < catsAllItems.length) {
            const sentinel = document.createElement('div');
            sentinel.id = 'catsSentinel';
            sentinel.style.cssText = 'height:1px;grid-column:1/-1;';
            galleryGrid.parentNode.insertBefore(sentinel, galleryGrid.nextSibling);

            catsObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    appendCatCards(getLikedCatIds(), catsPageSize);
                    if (catsRenderedCount >= catsAllItems.length) {
                        catsObserver.disconnect();
                        catsObserver = null;
                        sentinel.remove();
                    }
                }
            }, { rootMargin: '200px' });

            catsObserver.observe(sentinel);
        }
    }

    function appendCatCards(likedCatIds, batchSize = catsPageSize) {
        const batch = catsAllItems.slice(catsRenderedCount, catsRenderedCount + batchSize);
        batch.forEach(cat => {
            const isLiked = likedCatIds.includes(cat.id);
            const photoList = cat.gallery && cat.gallery.length ? cat.gallery : [cat.image];

            const card = document.createElement('div');
            card.className = 'cat-gallery-card';
            card.innerHTML = `
                <div class="cat-card-img-wrapper">
                    <img src="${thumbUrl(cat.image)}" alt="${cat.name}" class="cat-card-img" loading="lazy" decoding="async" width="300" height="220">
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

            // Fade-in image once loaded
            const imgEl = card.querySelector('.cat-card-img');
            if (imgEl) {
                if (imgEl.complete && imgEl.naturalWidth > 0) {
                    imgEl.classList.add('loaded');
                } else {
                    imgEl.addEventListener('load', () => imgEl.classList.add('loaded'));
                    imgEl.addEventListener('error', () => imgEl.classList.add('loaded'));
                }
            }
        });
        catsRenderedCount += batch.length;
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
            // Fade out, swap src only when new image is loaded
            albumFeaturedImg.style.opacity = '0.2';
            albumFeaturedImg.style.transition = 'opacity 0.2s ease';

            const preload = new Image();
            preload.onload = () => {
                albumFeaturedImg.src = currentSrc;
                albumFeaturedImg.style.opacity = '1';
            };
            preload.onerror = () => {
                albumFeaturedImg.src = currentSrc;
                albumFeaturedImg.style.opacity = '1';
            };
            preload.src = currentSrc;
        }

        if (albumImageCounter) {
            albumImageCounter.textContent = `${currentAlbumIndex + 1} / ${currentAlbumPhotos.length}`;
        }

        // Render Thumbnails with lazy loading
        if (albumThumbnails) {
            albumThumbnails.innerHTML = '';
            currentAlbumPhotos.forEach((src, idx) => {
                const thumb = document.createElement('div');
                thumb.className = `album-thumb ${idx === currentAlbumIndex ? 'active-thumb' : ''}`;
                // First thumb loads eagerly (already visible), rest lazy
                thumb.innerHTML = `<img src="${src}" alt="Thumbnail ${idx + 1}" loading="${idx === 0 ? 'eager' : 'lazy'}" decoding="async" width="80" height="80">`;
                thumb.addEventListener('click', () => {
                    currentAlbumIndex = idx;
                    updateAlbumView();
                });
                albumThumbnails.appendChild(thumb);
            });
        }

        // Preload next image in background for instant navigation
        const nextIdx = (currentAlbumIndex + 1) % currentAlbumPhotos.length;
        if (nextIdx !== currentAlbumIndex) {
            const nextPreload = new Image();
            nextPreload.src = currentAlbumPhotos[nextIdx];
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

    async function compressImageFile(file, callback, maxPx = 800, quality = 0.75) {
        let processFile = file;

        if (file && (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif') || (file.type && file.type.includes('heic')))) {
            if (typeof heic2any !== 'undefined') {
                try {
                    const convertedBlob = await heic2any({
                        blob: file,
                        toType: 'image/jpeg',
                        quality: 0.82
                    });
                    processFile = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                } catch (heicErr) {
                    console.log('HEIC conversion notice:', heicErr);
                }
            }
        }

        const reader = new FileReader();
        reader.readAsDataURL(processFile);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = maxPx;
                const MAX_HEIGHT = maxPx;
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

                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                callback(compressedBase64);
            };
            img.onerror = () => {
                callback(event.target.result);
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

            // Fallback: If compressedImagesArray is empty, compress selected files on the fly!
            if (!compressedImagesArray.length && catPhotoInput && catPhotoInput.files && catPhotoInput.files.length) {
                selectedFilesArray = Array.from(catPhotoInput.files);
                await new Promise((resolve) => {
                    let processed = 0;
                    selectedFilesArray.forEach((file, idx) => {
                        compressImageFile(file, (base64Img) => {
                            compressedImagesArray[idx] = base64Img;
                            processed++;
                            if (processed === selectedFilesArray.length) resolve();
                        });
                    });
                });
            }

            if (!name || !owner || !compressedImagesArray.length) {
                alert('Παρακαλώ συμπλήρωσε όλα τα υποχρεωτικά πεδία και διάλεξε τουλάχιστον μία φωτογραφία!');
                return;
            }

            const submitBtn = catUploadForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '⏳ Αποστολή... Παρακαλώ περιμένετε!';
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

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '✨ Αποστολή για Έγκριση 🐾';
            }
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
    const tabSubscribers = document.getElementById('tabSubscribers');
    const adminPendingSection = document.getElementById('adminPendingSection');
    const adminApprovedSection = document.getElementById('adminApprovedSection');
    const adminSubscribersSection = document.getElementById('adminSubscribersSection');
    const adminPendingGrid = document.getElementById('adminPendingGrid');
    const adminApprovedGrid = document.getElementById('adminApprovedGrid');
    const emptyAdminPending = document.getElementById('emptyAdminPending');
    const emptyAdminApproved = document.getElementById('emptyAdminApproved');
    const subscribersCountEl = document.getElementById('subscribersCount');
    const subscribersTableBody = document.getElementById('subscribersTableBody');
    const emptySubscribers = document.getElementById('emptySubscribers');
    const copyAllEmailsBtn = document.getElementById('copyAllEmailsBtn');
    const clearAllEmailsBtn = document.getElementById('clearAllEmailsBtn');
    const copyNotification = document.getElementById('copyNotification');

    const SUBSCRIBERS_STORAGE_KEY = 'igatamou_newsletter_subscribers';

    function getSubscribersData() {
        try {
            return JSON.parse(localStorage.getItem(SUBSCRIBERS_STORAGE_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveSubscribersData(subs) {
        localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(subs));
    }

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
        const tabDrawings = document.getElementById('tabDrawings');
        const adminDrawingsSection = document.getElementById('adminDrawingsSection');

        if (tabPending && tabApproved) {
            tabPending.addEventListener('click', () => {
                tabPending.classList.add('active');
                tabApproved.classList.remove('active');
                if (tabSubscribers) tabSubscribers.classList.remove('active');
                if (tabDrawings) tabDrawings.classList.remove('active');
                if (adminPendingSection) adminPendingSection.hidden = false;
                if (adminApprovedSection) adminApprovedSection.hidden = true;
                if (adminSubscribersSection) adminSubscribersSection.hidden = true;
                if (adminDrawingsSection) adminDrawingsSection.hidden = true;
            });

            tabApproved.addEventListener('click', () => {
                tabApproved.classList.add('active');
                tabPending.classList.remove('active');
                if (tabSubscribers) tabSubscribers.classList.remove('active');
                if (tabDrawings) tabDrawings.classList.remove('active');
                if (adminApprovedSection) adminApprovedSection.hidden = false;
                if (adminPendingSection) adminPendingSection.hidden = true;
                if (adminSubscribersSection) adminSubscribersSection.hidden = true;
                if (adminDrawingsSection) adminDrawingsSection.hidden = true;
            });

            if (tabSubscribers) {
                tabSubscribers.addEventListener('click', () => {
                    tabSubscribers.classList.add('active');
                    tabPending.classList.remove('active');
                    tabApproved.classList.remove('active');
                    if (tabDrawings) tabDrawings.classList.remove('active');
                    if (adminSubscribersSection) adminSubscribersSection.hidden = false;
                    if (adminPendingSection) adminPendingSection.hidden = true;
                    if (adminApprovedSection) adminApprovedSection.hidden = true;
                    if (adminDrawingsSection) adminDrawingsSection.hidden = true;
                    renderSubscribersSection();
                });
            }

            if (tabDrawings) {
                tabDrawings.addEventListener('click', () => {
                    tabDrawings.classList.add('active');
                    tabPending.classList.remove('active');
                    tabApproved.classList.remove('active');
                    if (tabSubscribers) tabSubscribers.classList.remove('active');
                    if (adminDrawingsSection) adminDrawingsSection.hidden = false;
                    if (adminPendingSection) adminPendingSection.hidden = true;
                    if (adminApprovedSection) adminApprovedSection.hidden = true;
                    if (adminSubscribersSection) adminSubscribersSection.hidden = true;
                    renderDrawingsAdminSection();
                });
            }
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

    async function renderSubscribersSection() {
        let subs = getSubscribersData();

        if (supabase) {
            try {
                const { data } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false });
                if (data && data.length) {
                    data.forEach(item => {
                        if (item.email && !subs.some(s => s.email.toLowerCase() === item.email.toLowerCase())) {
                            const dateObj = new Date(item.created_at || Date.now());
                            const formattedDate = dateObj.toLocaleDateString('el-GR') + ' ' + dateObj.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });
                            subs.push({
                                id: 'sub_' + (item.id || Date.now()),
                                email: item.email,
                                date: formattedDate,
                                timestamp: dateObj.getTime()
                            });
                        }
                    });
                    saveSubscribersData(subs);
                }
            } catch(e) {
                console.log('Supabase subscribers fetch notice');
            }
        }

        if (subscribersCountEl) subscribersCountEl.textContent = subs.length;

        if (!subscribersTableBody) return;

        subscribersTableBody.innerHTML = '';
        if (subs.length === 0) {
            if (emptySubscribers) emptySubscribers.hidden = false;
        } else {
            if (emptySubscribers) emptySubscribers.hidden = true;

            subs.forEach((sub, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${idx + 1}</strong></td>
                    <td class="subscriber-email"><code style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-weight: bold; color: #0f172a;">${sub.email}</code></td>
                    <td><small>${sub.date || '-'}</small></td>
                    <td>
                        <button class="btn-delete-sub" data-id="${sub.id}" style="background: #ef4444; color: white; border: none; border-radius: 10px; padding: 6px 12px; cursor: pointer; font-size: 0.85rem; font-weight: bold;">
                            🗑️ Διαγραφή
                        </button>
                    </td>
                `;

                const delBtn = tr.querySelector('.btn-delete-sub');
                if (delBtn) {
                    delBtn.addEventListener('click', () => {
                        const updated = subs.filter(s => s.id !== sub.id);
                        saveSubscribersData(updated);
                        if (supabase) {
                            try { supabase.from('subscribers').delete().eq('email', sub.email).then(); } catch(e){}
                        }
                        renderSubscribersSection();
                    });
                }

                subscribersTableBody.appendChild(tr);
            });
        }
    }

    if (copyAllEmailsBtn) {
        copyAllEmailsBtn.addEventListener('click', () => {
            const subs = getSubscribersData();
            if (subs.length === 0) {
                alert('Δεν υπάρχουν εγγεγραμμένα emails για αντιγραφή!');
                return;
            }
            const allEmailsStr = subs.map(s => s.email).join(', ');
            navigator.clipboard.writeText(allEmailsStr).then(() => {
                if (copyNotification) {
                    copyNotification.hidden = false;
                    copyNotification.innerHTML = `✅ Αντιγράφηκαν <strong>${subs.length} emails</strong> στο πρόχειρο (clipboard)!`;
                    setTimeout(() => { copyNotification.hidden = true; }, 3500);
                }
            }).catch(() => {
                prompt('Αντίγραψε τα emails από εδώ:', allEmailsStr);
            });
        });
    }

    if (clearAllEmailsBtn) {
        clearAllEmailsBtn.addEventListener('click', () => {
            if (confirm('Είσαι σίγουρος/η ότι θέλεις να διαγράψεις ΟΛΑ τα εγγεγραμμένα emails;')) {
                localStorage.removeItem(SUBSCRIBERS_STORAGE_KEY);
                renderSubscribersSection();
            }
        });
    }

    function renderAdminDashboard() {
        const cats = getCatsData().filter(c => !(c.id && c.id.startsWith('draw_')) && !(c.bio && c.bio.includes('🎨 [DRAWING]')));
        const pendingCats = cats.filter(c => c.status === 'pending');
        const approvedCats = cats.filter(c => c.status === 'approved');

        const pendingCountEl = document.getElementById('pendingCount');
        const approvedCountEl = document.getElementById('approvedCount');
        if (pendingCountEl) pendingCountEl.textContent = pendingCats.length;
        if (approvedCountEl) approvedCountEl.textContent = approvedCats.length;

        const subs = getSubscribersData();
        if (subscribersCountEl) subscribersCountEl.textContent = subs.length;

        const localDrawings = JSON.parse(localStorage.getItem('igatamou_drawings') || '[]');
        const pendingDrawingsCountEl = document.getElementById('pendingDrawingsCount');
        if (pendingDrawingsCountEl) {
            pendingDrawingsCountEl.textContent = localDrawings.filter(d => d.status === 'pending').length;
        }

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
                            <button class="btn-group-cat" data-id="${cat.id}">📂 Ομαδοποίηση σε Άλμπουμ</button>
                            <button class="btn-edit-cat" data-id="${cat.id}">✏️ Επεξεργασία Στοιχείων</button>
                            <div class="admin-card-actions">
                                <button class="btn-approve" data-id="${cat.id}">✅ Έγκριση</button>
                                <button class="btn-reject" data-id="${cat.id}">❌ Απόρριψη</button>
                            </div>
                        </div>
                    `;

                    const approveBtn = card.querySelector('.btn-approve');
                    const rejectBtn = card.querySelector('.btn-reject');
                    const albumBtn = card.querySelector('.btn-view-album');
                    const groupBtn = card.querySelector('.btn-group-cat');
                    const editBtn = card.querySelector('.btn-edit-cat');

                    if (albumBtn) albumBtn.addEventListener('click', () => openCatAlbumModal(cat));
                    if (groupBtn) groupBtn.addEventListener('click', () => openGroupModal(cat));
                    if (editBtn) editBtn.addEventListener('click', () => openEditModal(cat));
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
                            ${cat.bio ? `<p><strong>Περιγραφή:</strong> "${cat.bio}"</p>` : ''}
                            <p><strong>Χάδια:</strong> 💖 ${cat.likes || 0}</p>
                            <p><small>Φωτογραφίες Άλμπουμ: <strong>${photoCount}</strong></small></p>
                            <button class="btn-view-album" data-id="${cat.id}">🖼️ Προβολή Άλμπουμ</button>
                            <button class="btn-group-cat" data-id="${cat.id}">📂 Ομαδοποίηση σε Άλμπουμ</button>
                            <button class="btn-edit-cat" data-id="${cat.id}">✏️ Επεξεργασία Στοιχείων</button>
                            <div class="admin-card-actions">
                                <button class="btn-reject" data-id="${cat.id}">🗑️ Διαγραφή</button>
                            </div>
                        </div>
                    `;

                    const deleteBtn = card.querySelector('.btn-reject');
                    const albumBtn = card.querySelector('.btn-view-album');
                    const groupBtn = card.querySelector('.btn-group-cat');
                    const editBtn = card.querySelector('.btn-edit-cat');

                    if (albumBtn) albumBtn.addEventListener('click', () => openCatAlbumModal(cat));
                    if (groupBtn) groupBtn.addEventListener('click', () => openGroupModal(cat));
                    if (editBtn) editBtn.addEventListener('click', () => openEditModal(cat));
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

    // Admin Grouping Logic
    const groupModal = document.getElementById('groupModal');
    const closeGroupBtn = document.getElementById('closeGroupBtn');
    const groupForm = document.getElementById('groupForm');
    const groupSourceCatName = document.getElementById('groupSourceCatName');
    const groupTargetSelect = document.getElementById('groupTargetSelect');
    const groupNewNameInput = document.getElementById('groupNewNameInput');

    let currentGroupSourceCatId = null;

    if (closeGroupBtn) {
        closeGroupBtn.addEventListener('click', () => {
            if (groupModal) groupModal.hidden = true;
        });
    }

    function openGroupModal(sourceCat) {
        currentGroupSourceCatId = sourceCat.id;
        const cats = getCatsData().filter(c => !(c.id && c.id.startsWith('draw_')) && !(c.bio && c.bio.includes('🎨 [DRAWING]')));
        const otherCats = cats.filter(c => c.id !== sourceCat.id);

        if (groupSourceCatName) {
            groupSourceCatName.textContent = `Ομαδοποίηση φωτογραφιών της/του "${sourceCat.name}" (από ${sourceCat.owner}):`;
        }

        if (groupTargetSelect) {
            groupTargetSelect.innerHTML = '<option value="">-- Επιλογή Υπάρχοντος Άλμπουμ / Γάτας --</option>';
            otherCats.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = `${c.name} (${c.owner}) - ${c.gallery ? c.gallery.length : 1} φωτό`;
                groupTargetSelect.appendChild(opt);
            });
        }

        if (groupNewNameInput) groupNewNameInput.value = '';
        if (groupModal) groupModal.hidden = false;
    }

    if (groupForm) {
        groupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentGroupSourceCatId) return;

            let cats = getCatsData();
            const sourceCat = cats.find(c => c.id === currentGroupSourceCatId);
            if (!sourceCat) return;

            const targetId = groupTargetSelect ? groupTargetSelect.value : '';
            const newName = groupNewNameInput ? groupNewNameInput.value.trim() : '';

            const sourcePhotos = sourceCat.gallery && sourceCat.gallery.length ? sourceCat.gallery : [sourceCat.image];

            if (targetId) {
                const targetCat = cats.find(c => c.id === targetId);
                if (targetCat) {
                    if (!targetCat.gallery) targetCat.gallery = [targetCat.image];
                    sourcePhotos.forEach(photo => {
                        if (!targetCat.gallery.includes(photo)) {
                            targetCat.gallery.push(photo);
                        }
                    });

                    cats = cats.filter(c => c.id !== sourceCat.id);
                    saveCatsData(cats);

                    if (supabase) {
                        try {
                            await supabase.from('cats').upsert([{
                                id: targetCat.id,
                                name: targetCat.name,
                                owner: targetCat.owner,
                                bio: targetCat.bio,
                                image: targetCat.image,
                                status: targetCat.status,
                                likes: targetCat.likes,
                                date: targetCat.date
                            }]);
                            await supabase.from('cats').delete().eq('id', sourceCat.id);
                        } catch (err) {}
                    }
                }
            } else if (newName) {
                sourceCat.name = newName;
                saveCatsData(cats);

                if (supabase) {
                    try {
                        await supabase.from('cats').update({ name: newName }).eq('id', sourceCat.id);
                    } catch (err) {}
                }
            }

            if (groupModal) groupModal.hidden = true;
            renderAdminDashboard();
            if (galleryGrid) renderPublicGallery();
        });
    }

    // Admin Edit Cat Details Modal Logic
    const editModal = document.getElementById('editModal');
    const closeEditBtn = document.getElementById('closeEditBtn');
    const editForm = document.getElementById('editForm');
    const editNameInput = document.getElementById('editNameInput');
    const editOwnerInput = document.getElementById('editOwnerInput');
    const editBioInput = document.getElementById('editBioInput');
    let currentEditCatId = null;

    if (closeEditBtn) {
        closeEditBtn.addEventListener('click', () => {
            if (editModal) editModal.hidden = true;
        });
    }

    function openEditModal(cat) {
        currentEditCatId = cat.id;
        if (editNameInput) editNameInput.value = cat.name || '';
        if (editOwnerInput) editOwnerInput.value = cat.owner || '';
        if (editBioInput) editBioInput.value = cat.bio || '';
        if (editModal) editModal.hidden = false;
    }

    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentEditCatId) return;

            let cats = getCatsData();
            const cat = cats.find(c => c.id === currentEditCatId);
            if (!cat) return;

            cat.name = editNameInput.value.trim();
            cat.owner = editOwnerInput.value.trim();
            cat.bio = editBioInput.value.trim();

            saveCatsData(cats);

            if (supabase) {
                try {
                    await supabase.from('cats').update({
                        name: cat.name,
                        owner: cat.owner,
                        bio: cat.bio
                    }).eq('id', cat.id);
                } catch (err) {
                    console.log('Supabase cat update notice:', err);
                }
            }

            if (editModal) editModal.hidden = true;
            renderAdminDashboard();
            if (galleryGrid) renderPublicGallery();
        });
    }

    // ----------------------------------------------------
    // DRAWINGS ADMIN MANAGEMENT
    // ----------------------------------------------------
    // ----------------------------------------------------
    // DRAWINGS ADMIN MANAGEMENT
    // ----------------------------------------------------
    async function renderDrawingsAdminSection() {
        let localDrawings = JSON.parse(localStorage.getItem('igatamou_drawings') || '[]');
        renderDrawingsGrids(localDrawings);

        if (supabase) {
            try {
                let dbDrawings = [];

                // 1. Fetch from cats table (where drawings are stored)
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
                    renderDrawingsGrids(localDrawings);
                }
            } catch (err) {
                console.log('Supabase drawings admin sync notice:', err);
            }
        }
    }

    function renderDrawingsGrids(localDrawings) {
        const pendingDrawings = localDrawings.filter(d => d.status === 'pending');
        const approvedDrawings = localDrawings.filter(d => d.status === 'approved');

        const pendingDrawingsCountEl = document.getElementById('pendingDrawingsCount');
        if (pendingDrawingsCountEl) pendingDrawingsCountEl.textContent = pendingDrawings.length;

        const adminPendingDrawingsGrid = document.getElementById('adminPendingDrawingsGrid');
        const emptyAdminDrawingsPending = document.getElementById('emptyAdminDrawingsPending');
        const adminApprovedDrawingsGrid = document.getElementById('adminApprovedDrawingsGrid');
        const emptyAdminDrawingsApproved = document.getElementById('emptyAdminDrawingsApproved');

        // Render Pending Drawings
        if (adminPendingDrawingsGrid) {
            adminPendingDrawingsGrid.innerHTML = '';
            if (pendingDrawings.length === 0) {
                if (emptyAdminDrawingsPending) emptyAdminDrawingsPending.hidden = false;
            } else {
                if (emptyAdminDrawingsPending) emptyAdminDrawingsPending.hidden = true;
                pendingDrawings.forEach(d => {
                    const card = document.createElement('div');
                    card.className = 'drawing-card';
                    card.innerHTML = `
                        <div class="drawing-img-wrapper">
                            <img src="${d.image_data}" alt="${escapeHtml(d.name)}" class="drawing-img">
                        </div>
                        <div class="drawing-card-body">
                            <div class="drawing-author">🎨 Από: <strong>${escapeHtml(d.name)}</strong></div>
                            <div style="display: flex; gap: 8px; margin-top: 10px;">
                                <button class="btn btn-submit-upload approve-draw-btn" style="flex: 1; padding: 8px; font-size: 0.9rem; background: #10b981;">✅ Έγκριση</button>
                                <button class="btn btn-back-menu reject-draw-btn" style="flex: 1; padding: 8px; font-size: 0.9rem; background: #ef4444; color: white;">🗑️ Απόρριψη</button>
                            </div>
                        </div>
                    `;

                    card.querySelector('.approve-draw-btn').addEventListener('click', async () => {
                        d.status = 'approved';
                        updateLocalAndDbDrawing(d);
                        renderDrawingsAdminSection();
                        renderAdminDashboard();
                    });

                    card.querySelector('.reject-draw-btn').addEventListener('click', async () => {
                        if (confirm('Θέλετε να απορρίψετε αυτή τη ζωγραφιά;')) {
                            deleteLocalAndDbDrawing(d.id);
                            renderDrawingsAdminSection();
                            renderAdminDashboard();
                        }
                    });

                    adminPendingDrawingsGrid.appendChild(card);
                });
            }
        }

        // Render Approved Drawings
        if (adminApprovedDrawingsGrid) {
            adminApprovedDrawingsGrid.innerHTML = '';
            if (approvedDrawings.length === 0) {
                if (emptyAdminDrawingsApproved) emptyAdminDrawingsApproved.hidden = false;
            } else {
                if (emptyAdminDrawingsApproved) emptyAdminDrawingsApproved.hidden = true;
                approvedDrawings.forEach(d => {
                    const card = document.createElement('div');
                    card.className = 'drawing-card';
                    card.innerHTML = `
                        <div class="drawing-img-wrapper">
                            <img src="${d.image_data}" alt="${escapeHtml(d.name)}" class="drawing-img">
                        </div>
                        <div class="drawing-card-body">
                            <div class="drawing-author">🎨 Από: <strong>${escapeHtml(d.name)}</strong></div>
                            <div style="margin-top: 10px;">
                                <button class="btn btn-back-menu delete-draw-btn" style="width: 100%; padding: 8px; font-size: 0.9rem; background: #ef4444; color: white;">🗑️ Διαγραφή</button>
                            </div>
                        </div>
                    `;

                    card.querySelector('.delete-draw-btn').addEventListener('click', async () => {
                        if (confirm('Θέλετε να διαγράψετε αυτή τη ζωγραφιά;')) {
                            deleteLocalAndDbDrawing(d.id);
                            renderDrawingsAdminSection();
                            renderAdminDashboard();
                        }
                    });

                    adminApprovedDrawingsGrid.appendChild(card);
                });
            }
        }
    }

    function updateLocalAndDbDrawing(drawing) {
        let localDrawings = JSON.parse(localStorage.getItem('igatamou_drawings') || '[]');
        const idx = localDrawings.findIndex(d => d.id === drawing.id);
        if (idx !== -1) localDrawings[idx] = drawing;
        else localDrawings.push(drawing);
        localStorage.setItem('igatamou_drawings', JSON.stringify(localDrawings));

        if (supabase) {
            // Update in cats table (where drawings are cloud synced)
            supabase.from('cats').upsert([{
                id: drawing.id,
                name: drawing.name,
                owner: drawing.name,
                bio: '🎨 [DRAWING]',
                image: drawing.image_data,
                status: drawing.status,
                likes: drawing.likes || 0,
                date: new Date().toLocaleDateString('el-GR')
            }]).then();

            supabase.from('cats').update({ status: drawing.status }).eq('id', drawing.id).then();
        }
    }

    function deleteLocalAndDbDrawing(id) {
        let localDrawings = JSON.parse(localStorage.getItem('igatamou_drawings') || '[]');
        localDrawings = localDrawings.filter(d => d.id !== id);
        localStorage.setItem('igatamou_drawings', JSON.stringify(localDrawings));

        if (supabase) {
            supabase.from('cats').delete().eq('id', id).then();
        }
    }
});
