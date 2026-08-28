document.addEventListener('DOMContentLoaded', async () => {
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

    // Check if admin mode or edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const editStoryId = urlParams.get('edit');
    const isAdmin = urlParams.get('admin') === '1' || sessionStorage.getItem('igatamou_admin_logged_in') === 'true';

    // ----------------------------------------------------
    // 3. QUILL RICH TEXT EDITOR INITIALIZATION
    // ----------------------------------------------------
    let quill = null;
    if (window.Quill) {
        // Register custom Page Break blot
        const BlockEmbed = Quill.import('blots/block/embed');
        class PageBreakBlot extends BlockEmbed {
            static create(value) {
                const node = super.create();
                node.setAttribute('class', 'story-page-break');
                node.setAttribute('data-page-break', 'true');
                node.setAttribute('contenteditable', 'false');
                return node;
            }
        }
        PageBreakBlot.blotName = 'pageBreak';
        PageBreakBlot.tagName = 'hr';
        Quill.register(PageBreakBlot);

        quill = new Quill('#quillEditor', {
            modules: {
                toolbar: '#storyEditorToolbar'
            },
            placeholder: 'Μια φορά κι έναν καιρό, μια γλυκιά γατούλα...',
            theme: 'snow'
        });

        function insertPageBreak() {
            if (!quill) return;
            const range = quill.getSelection(true);
            const index = range ? range.index : quill.getLength();
            quill.insertEmbed(index, 'pageBreak', true, Quill.sources.USER);
            quill.setSelection(index + 1, Quill.sources.SILENT);
        }

        const toolbar = quill.getModule('toolbar');
        if (toolbar) {
            toolbar.addHandler('pageBreak', insertPageBreak);
        }

        const insertPageBreakBtn = document.getElementById('insertPageBreakBtn');
        if (insertPageBreakBtn) {
            insertPageBreakBtn.addEventListener('click', insertPageBreak);
        }

        // Safe toolbar handler for image insertion
        const quillImageInput = document.getElementById('quillImageInput');
        if (quillImageInput) {
            if (toolbar) {
                toolbar.addHandler('image', () => {
                    quillImageInput.click();
                });
            }

            quillImageInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file && quill) {
                    await insertImageIntoQuill(file);
                    quillImageInput.value = '';
                }
            });
        }

        // Copy-paste image support in Quill editor
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
    let existingCoverUrl = null;

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
            e.preventDefault();
            coverUploadArea.classList.remove('drag-over');
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
            existingCoverUrl = null;
            if (coverImageInput) coverImageInput.value = '';
            if (coverPreviewWrap) coverPreviewWrap.hidden = true;
            if (coverUploadPlaceholder) coverUploadPlaceholder.hidden = false;
        });
    }

    // ----------------------------------------------------
    // 4. LOAD STORY IF IN EDIT MODE (?edit=ID)
    // ----------------------------------------------------
    let editingStoryData = null;
    if (editStoryId) {
        await loadStoryForEditing(editStoryId);
    }

    async function loadStoryForEditing(id) {
        // Try local storage first
        let local = JSON.parse(localStorage.getItem(SITE_CONFIG.localStoragePrefix + '_local_stories') || '[]');
        let story = local.find(s => s.id === id);

        // If not found locally, try Supabase cats table
        if (!story && supabase) {
            try {
                const { data } = await supabase.from('cats').select('*').eq('id', id).single();
                if (data && data.bio && data.bio.includes('[STORY]')) {
                    try {
                        const parsed = JSON.parse(data.bio.replace(/^📖\s*\[STORY\]\s*/, ''));
                        story = {
                            id: data.id,
                            title: data.name,
                            author: data.owner,
                            content: parsed.content || '',
                            cover_image_url: data.image || parsed.cover_image_url,
                            is_admin: parsed.is_admin || false,
                            status: data.status
                        };
                    } catch(pe) {}
                }
            } catch(e) {}
        }

        if (story) {
            editingStoryData = story;
            if (storyTitleInput) storyTitleInput.value = story.title || '';
            if (storyAuthorInput) storyAuthorInput.value = story.author || '';
            if (quill && story.content) {
                quill.root.innerHTML = story.content;
            }
            if (story.cover_image_url && story.cover_image_url !== 'magkas_logo.png') {
                existingCoverUrl = story.cover_image_url;
                if (coverPreviewImg) coverPreviewImg.src = story.cover_image_url;
                if (coverPreviewWrap) coverPreviewWrap.hidden = false;
                if (coverUploadPlaceholder) coverUploadPlaceholder.hidden = true;
            }
            if (submitStoryBtn) {
                submitStoryBtn.textContent = '💾 Αποθήκευση Αλλαγών! 🐾';
            }
            const h1 = document.querySelector('.editor-main-card h1');
            if (h1) h1.textContent = '✏️ Επεξεργασία Γατο-Ιστορίας';
        }
    }

    async function insertImageIntoQuill(file) {
        if (!quill) return;
        const range = quill.getSelection(true) || { index: quill.getLength() };
        quill.insertText(range.index, '⏳ Ανέβασμα εικόνας... 🐾\n', 'bold', true);

        try {
            const uploadedUrl = await uploadImageToSupabase(file, 'story-inline');
            quill.deleteText(range.index, 26);
            if (uploadedUrl) {
                quill.insertEmbed(range.index, 'image', uploadedUrl);
                quill.setSelection(range.index + 1);
            } else {
                // Fallback to base64 if storage is not connected
                const reader = new FileReader();
                reader.onload = (e) => {
                    quill.insertEmbed(range.index, 'image', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        } catch (err) {
            console.error('Image insert error:', err);
            quill.deleteText(range.index, 26);
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
                console.warn('Storage upload error, returning null for base64 fallback');
                return null;
            }

            const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(`stories/${filename}`);

            return publicUrlData ? publicUrlData.publicUrl : null;
        } catch (e) {
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
    // 5. SUBMIT / SAVE STORY
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

            if (!plainText || plainText.length < 15) {
                showError('Η ιστορία σου είναι πολύ σύντομη! Γράψε τουλάχιστον 2-3 προτάσεις για τη γατούλα σου. 🐾');
                quill?.focus();
                return;
            }

            submitStoryBtn.disabled = true;
            submitStoryBtn.textContent = '⏳ Αποθήκευση...';

            try {
                let coverUrl = existingCoverUrl;
                if (selectedCoverFile) {
                    coverUrl = await uploadImageToSupabase(selectedCoverFile, 'cover');
                    if (!coverUrl && coverPreviewImg) {
                        coverUrl = coverPreviewImg.src;
                    }
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

                const targetId = editingStoryData ? editingStoryData.id : ('story_' + Date.now());
                const isStoryAdmin = editingStoryData ? (editingStoryData.is_admin || isAdmin) : isAdmin;
                const status = editingStoryData ? (editingStoryData.status || 'approved') : (isAdmin ? 'approved' : 'pending');

                const storyData = {
                    id: targetId,
                    title: title,
                    author: author,
                    content: htmlContent,
                    cover_image_url: coverUrl || 'magkas_logo.png',
                    status: status,
                    is_admin: isStoryAdmin,
                    created_at: editingStoryData ? (editingStoryData.created_at || new Date().toISOString()) : new Date().toISOString()
                };

                // 1. Save / Update in localStorage
                let localStories = JSON.parse(localStorage.getItem(SITE_CONFIG.localStoragePrefix + '_local_stories') || '[]');
                const existingIdx = localStories.findIndex(s => s.id === targetId);
                if (existingIdx !== -1) {
                    localStories[existingIdx] = storyData;
                } else {
                    localStories.unshift(storyData);
                }
                localStorage.setItem(SITE_CONFIG.localStoragePrefix + '_local_stories', JSON.stringify(localStories));

                // 2. Cloud Sync to Supabase `cats` table
                if (supabase) {
                    try {
                        const isDog = typeof checkIsDogDomain === 'function' 
                            ? checkIsDogDomain() 
                            : ((window.SITE_CONFIG && window.SITE_CONFIG.domain === 'oskilosmou') || window.location.hostname.includes('oskilosmou') || (new URLSearchParams(window.location.search).get('site') || '').includes('oskilosmou') || (new URLSearchParams(window.location.search).get('site') || '').includes('dog'));
                        const defaultCover = isDog ? 'dog_logo.png' : 'magkas_logo.png';
                        const curDomain = isDog ? 'oskilosmou' : 'igatamou';
                        await supabase.from('cats').upsert([{
                            id: targetId,
                            name: title,
                            owner: author,
                            bio: '📖 [STORY] ' + JSON.stringify({
                                content: htmlContent,
                                cover_image_url: coverUrl || defaultCover,
                                is_admin: isStoryAdmin,
                                domain: curDomain
                            }),
                            image: coverUrl || defaultCover,
                            status: status,
                            likes: 0,
                            date: new Date().toLocaleDateString('el-GR'),
                            domain: curDomain
                        }]);
                    } catch (sErr) {
                        console.log('Supabase sync info:', sErr);
                    }
                }

                // Show success screen
                if (editorCard) editorCard.hidden = true;
                if (editorSuccessCard) {
                    editorSuccessCard.hidden = false;
                    const successTitle = editorSuccessCard.querySelector('h1');
                    const successP = editorSuccessCard.querySelector('p');
                    if (editingStoryData) {
                        if (successTitle) successTitle.textContent = 'Οι αλλαγές αποθηκεύτηκαν! 🐾✨';
                        if (successP) successP.textContent = 'Η ιστορία σου ενημερώθηκε επιτυχώς!';
                    } else if (isAdmin) {
                        if (successTitle) successTitle.textContent = 'Η ιστορία δημοσιεύτηκε αμέσως! 👑';
                        if (successP) successP.textContent = 'Ως διαχειριστής, η ιστορία σου είναι ήδη Live στο site!';
                    }
                    editorSuccessCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } catch (err) {
                console.error('Submit error:', err);
                showError('Κάτι πήγε στραβά κατά την αποθήκευση. Δοκίμασε ξανά!');
                const isDog = typeof checkIsDogDomain === 'function' ? checkIsDogDomain() : false;
                submitStoryBtn.disabled = false;
                submitStoryBtn.textContent = editingStoryData ? '💾 Αποθήκευση Αλλαγών! 🐾' : (isDog ? '💾 Αποστολή στον Φίλο! 🐾' : '💾 Αποστολή στη Μάγκα! 🐾');
            }
        });
    }
});
