document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. SUPABASE CLIENT
    // ----------------------------------------------------
    const SUPABASE_URL = 'https://hqabeqlvnqdvipnspjog.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYWJlcWx2bnFkdmlwbnNwam9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDQzNDMsImV4cCI6MjEwMDk4MDM0M30.nmB5WOUN-WFQRhRxS14yCLK7X5I8OqJbWk-lRtR0yDg';
    let supabase = null;
    if (window.supabase && window.supabase.createClient) {
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } catch (e) {
            console.error('Supabase init error:', e);
        }
    }

    // Check if admin mode
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === '1' || sessionStorage.getItem('igatamou_admin_logged_in') === 'true';

    // ----------------------------------------------------
    // 2. QUILL RICH TEXT EDITOR INITIALIZATION
    // ----------------------------------------------------
    let quill = null;
    if (window.Quill) {
        quill = new Quill('#quillEditor', {
            modules: {
                toolbar: '#storyEditorToolbar'
            },
            placeholder: 'Μια φορά κι έναν καιρό, μια γλυκιά γατούλα...',
            theme: 'snow'
        });
    }

    // Elements
    const storyTitleInput = document.getElementById('storyTitle');
    const storyAuthorInput = document.getElementById('storyAuthor');
    const submitStoryBtn = document.getElementById('submitStoryBtn');
    const editorError = document.getElementById('editorError');
    const editorErrorText = document.getElementById('editorErrorText');
    const editorCard = document.getElementById('editorCard');
    const editorSuccessCard = document.getElementById('editorSuccessCard');

    // Cover Image Handling
    const coverImageInput = document.getElementById('coverImageInput');
    const triggerCoverUpload = document.getElementById('triggerCoverUpload');
    const coverUploadPlaceholder = document.getElementById('coverUploadPlaceholder');
    const coverPreviewWrap = document.getElementById('coverPreviewWrap');
    const coverPreviewImg = document.getElementById('coverPreviewImg');
    const removeCoverBtn = document.getElementById('removeCoverBtn');
    let selectedCoverFile = null;

    if (triggerCoverUpload && coverImageInput) {
        triggerCoverUpload.addEventListener('click', () => coverImageInput.click());
    }

    if (coverImageInput) {
        coverImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleCoverFile(file);
        });
    }

    const coverUploadArea = document.getElementById('coverUploadArea');
    if (coverUploadArea) {
        ['dragenter', 'dragover'].forEach(eventName => {
            coverUploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                coverUploadArea.classList.add('drag-over');
            }, false);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            coverUploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                coverUploadArea.classList.remove('drag-over');
            }, false);
        });
        coverUploadArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const file = dt.files[0];
            if (file && file.type.startsWith('image/')) {
                handleCoverFile(file);
            }
        });
    }

    function handleCoverFile(file) {
        if (!file.type.startsWith('image/')) {
            showError('Παρακαλώ επέλεξε έγκυρο αρχείο εικόνας (PNG, JPG, WebP)!');
            return;
        }
        selectedCoverFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (coverPreviewImg) coverPreviewImg.src = e.target.result;
            if (coverPreviewWrap) coverPreviewWrap.hidden = false;
            if (coverUploadPlaceholder) coverUploadPlaceholder.hidden = true;
        };
        reader.readAsDataURL(file);
    }

    if (removeCoverBtn) {
        removeCoverBtn.addEventListener('click', () => {
            selectedCoverFile = null;
            if (coverImageInput) coverImageInput.value = '';
            if (coverPreviewWrap) coverPreviewWrap.hidden = true;
            if (coverUploadPlaceholder) coverUploadPlaceholder.hidden = false;
        });
    }

    // ----------------------------------------------------
    // 3. IMAGE UPLOAD INSIDE QUILL (BUTTON & COPY-PASTE)
    // ----------------------------------------------------
    const quillImageInput = document.getElementById('quillImageInput');
    const quillImageBtn = document.getElementById('quillImageBtn');

    if (quillImageBtn && quillImageInput) {
        quillImageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            quillImageInput.click();
        });
    }

    if (quillImageInput) {
        quillImageInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && quill) {
                await insertImageIntoQuill(file);
            }
        });
    }

    // Copy-paste image support in Quill editor
    if (quill) {
        quill.root.addEventListener('paste', async (e) => {
            const clipboardData = e.clipboardData || window.clipboardData;
            if (clipboardData && clipboardData.items) {
                for (let i = 0; i < clipboardData.items.length; i++) {
                    const item = clipboardData.items[i];
                    if (item.type.indexOf('image') !== -1) {
                        const file = item.getAsFile();
                        if (file) {
                            e.preventDefault();
                            await insertImageIntoQuill(file);
                        }
                    }
                }
            }
        });
    }

    async function insertImageIntoQuill(file) {
        if (!quill) return;
        const range = quill.getSelection(true);
        // Show temporary placeholder or loading
        const loadingId = 'img_loading_' + Date.now();
        quill.insertText(range.index, '⏳ Ανέβασμα εικόνας...🐾\n', 'bold', true);

        try {
            const uploadedUrl = await uploadImageToSupabase(file, 'story-inline');
            // Remove the loading text
            quill.deleteText(range.index, 26);
            if (uploadedUrl) {
                quill.insertEmbed(range.index, 'image', uploadedUrl);
                quill.setSelection(range.index + 1);
            } else {
                // Fallback to base64 data url if upload failed
                const reader = new FileReader();
                reader.onload = (e) => {
                    quill.insertEmbed(range.index, 'image', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        } catch (err) {
            console.error('Image insert error:', err);
        }
    }

    // Upload helper to Supabase Storage
    async function uploadImageToSupabase(file, prefix = 'story') {
        if (!supabase) return null;
        try {
            const ext = file.name ? file.name.split('.').pop() : 'jpg';
            const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`stories/${filename}`, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.warn('Storage upload error, trying direct public url:', error);
                return null;
            }

            const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(`stories/${filename}`);

            return publicUrlData ? publicUrlData.publicUrl : null;
        } catch (e) {
            console.error('Upload catch:', e);
            return null;
        }
    }

    function showError(msg) {
        if (editorError && editorErrorText) {
            editorErrorText.textContent = msg;
            editorError.hidden = false;
            editorError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function hideError() {
        if (editorError) editorError.hidden = true;
    }

    // ----------------------------------------------------
    // 4. SUBMIT STORY
    // ----------------------------------------------------
    if (submitStoryBtn) {
        submitStoryBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            hideError();

            const title = (storyTitleInput ? storyTitleInput.value : '').trim();
            const author = (storyAuthorInput ? storyAuthorInput.value : '').trim();
            const htmlContent = quill ? quill.root.innerHTML.trim() : '';
            const plainText = quill ? quill.getText().trim() : '';

            if (!title) {
                showError('Παρακαλώ συμπλήρωσε έναν όμορφο τίτλο για την ιστορία σου!');
                storyTitleInput?.focus();
                return;
            }

            if (!author) {
                showError('Παρακαλώ γράψε το όνομα ή το ψευδώνυμό σου!');
                storyAuthorInput?.focus();
                return;
            }

            if (!plainText || plainText.length < 20) {
                showError('Η ιστορία σου είναι πολύ σύντομη! Γράψε τουλάχιστον 2-3 προτάσεις για τη γατούλα σου. 🐾');
                quill?.focus();
                return;
            }

            submitStoryBtn.disabled = true;
            submitStoryBtn.textContent = '⏳ Αποστολή στη Μάγκα...';

            try {
                let coverUrl = null;
                if (selectedCoverFile) {
                    coverUrl = await uploadImageToSupabase(selectedCoverFile, 'cover');
                }

                // If no cover uploaded, extract first image from content if available
                if (!coverUrl) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlContent;
                    const firstImg = tempDiv.querySelector('img');
                    if (firstImg && firstImg.src) {
                        coverUrl = firstImg.src;
                    }
                }

                const storyData = {
                    title: title,
                    author: author,
                    content: htmlContent,
                    cover_image_url: coverUrl || 'magkas_logo.png',
                    status: isAdmin ? 'approved' : 'pending',
                    is_admin: isAdmin,
                    created_at: new Date().toISOString()
                };

                let savedSuccessfully = false;

                if (supabase) {
                    const { data, error } = await supabase
                        .from('stories')
                        .insert([storyData]);

                    if (!error) {
                        savedSuccessfully = true;
                    } else {
                        console.warn('Supabase stories insert error:', error);
                    }
                }

                // Also save to localStorage as backup/offline cache
                try {
                    const localStories = JSON.parse(localStorage.getItem('igatamou_local_stories') || '[]');
                    storyData.id = 'local_' + Date.now();
                    localStories.unshift(storyData);
                    localStorage.setItem('igatamou_local_stories', JSON.stringify(localStories));
                    savedSuccessfully = true;
                } catch (le) {
                    console.error('Local storage backup error:', le);
                }

                if (savedSuccessfully) {
                    if (editorCard) editorCard.hidden = true;
                    if (editorSuccessCard) {
                        editorSuccessCard.hidden = false;
                        if (isAdmin) {
                            const successTitle = editorSuccessCard.querySelector('h1');
                            const successP = editorSuccessCard.querySelector('p');
                            if (successTitle) successTitle.textContent = 'Η ιστορία δημοσιεύτηκε αμέσως! 👑';
                            if (successP) successP.textContent = 'Ως διαχειριστής, η ιστορία σου είναι ήδη Live στο site!';
                        }
                        editorSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else {
                    showError('Υπήρξε πρόβλημα κατά την αποστολή. Παρακαλώ δοκίμασε ξανά σε λίγο!');
                    submitStoryBtn.disabled = false;
                    submitStoryBtn.textContent = '💾 Αποστολή στη Μάγκα! 🐾';
                }
            } catch (err) {
                console.error('Submit error:', err);
                showError('Κάτι πήγε στραβά κατά την αποθήκευση. Δοκίμασε ξανά!');
                submitStoryBtn.disabled = false;
                submitStoryBtn.textContent = '💾 Αποστολή στη Μάγκα! 🐾';
            }
        });
    }
});
