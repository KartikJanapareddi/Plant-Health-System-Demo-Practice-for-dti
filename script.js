document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Check & Personality
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    const authName = localStorage.getItem('authName') || 'Botanist';
    const welcomeText = document.getElementById('welcomeText');
    const userNameEl = document.querySelector('.user-name');
    
    if (welcomeText) welcomeText.innerText = `Welcome Back, ${authName}`;
    if (userNameEl) userNameEl.innerText = authName;

    // 2. Profile Pillar Interaction (Mocked)
    const profileToggle = document.getElementById('profileToggle');
    if (profileToggle) {
        profileToggle.style.cursor = 'default';
    }

    // 3. Modal Handlers
    const setupModal = (modalId, openBtnId, closeBtnId) => {
        const modal = document.getElementById(modalId);
        const openBtn = document.getElementById(openBtnId);
        const closeBtn = document.getElementById(closeBtnId);

        if (openBtn && modal && closeBtn) {
            openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
            closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        }
    };

    setupModal('guideModal', 'openGuideBtn', 'closeModal');
    setupModal('ipModal', 'openIpModalBtn', 'closeIpModal');

    // 4. Staggered Entry Animations
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    // 5. Environmental Falling Leaves Generator
    const leafContainer = document.getElementById('leaf-container');
    const leafSVG = `
        <svg viewBox="0 0 24 24" class="falling-leaf" style="width:__SIZE__px; left:__LEFT__vw; animation-duration:__DUR__s; animation-delay: __DELAY__s;">
            <path d="M12 2C7 2 4 6 4 12C4 18 8 21 12 21C16 21 20 18 20 12C20 6 17 2 12 2Z"/>
            <path d="M12 22C12 22 13 18 10 15C10 15 13 17 12 22Z" fill="#3B82F6" opacity="0.4"/>
        </svg>
    `;

    function createLeaf() {
        if (!leafContainer || document.querySelectorAll('.falling-leaf').length > 10) return;
        
        const size = Math.random() * 12 + 8;
        const left = Math.random() * 100;
        const duration = Math.random() * 12 + 10;
        const delay = Math.random() * 3;

        const html = leafSVG
            .replace('__SIZE__', size)
            .replace('__LEFT__', left)
            .replace('__DUR__', duration)
            .replace('__DELAY__', delay);
            
        leafContainer.insertAdjacentHTML('beforeend', html);

        const el = leafContainer.lastElementChild;
        setTimeout(() => {
            if (el && el.parentNode) el.parentNode.removeChild(el);
        }, (duration + delay) * 1000);
    }

    // 7. AI Scanner Logic
    const scannerModal = document.getElementById('scannerModal');
    const scanLeafBtn = document.querySelectorAll('.glass-card')[2]; // Scan Leaf Card
    const closeScannerModal = document.getElementById('closeScannerModal');
    const scannerVideo = document.getElementById('scannerVideo');
    const captureBtn = document.getElementById('captureBtn');
    
    const analysisResult = document.getElementById('analysisResult');
    const resultTitle = document.getElementById('resultTitle');
    const resultText = document.getElementById('resultText');
    const diseaseLabels = document.getElementById('diseaseLabels');

    let stream = null;

    if (scanLeafBtn && scannerModal) {
        scanLeafBtn.addEventListener('click', async () => {
            scannerModal.classList.remove('hidden');
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                scannerVideo.srcObject = stream;
            } catch (err) {
                console.error("Camera access denied:", err);
                alert("Please allow camera access to use the AI Scanner.");
            }
        });

        closeScannerModal.addEventListener('click', () => {
            scannerModal.classList.add('hidden');
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            analysisResult.classList.add('hidden');
        });
    }

    if (captureBtn) {
        captureBtn.addEventListener('click', async () => {
            const canvas = document.createElement('canvas');
            canvas.width = scannerVideo.videoWidth;
            canvas.height = scannerVideo.videoHeight;
            canvas.getContext('2d').drawImage(scannerVideo, 0, 0);
            
            const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
            
            captureBtn.disabled = true;
            captureBtn.innerText = 'Analyzing...';
            analysisResult.classList.remove('hidden');
            resultTitle.innerText = 'Analyzing Leaf Health...';
            resultText.innerText = 'Processing visual data via Google AI...';
            diseaseLabels.innerHTML = '';

            // --- SERPAPI (GOOGLE LENS) INTEGRATION ---
            // Paste your real SerpApi Key below to enable professional-grade detection
            const SERPAPI_KEY = 'PASTE_YOUR_SERPAPI_KEY_HERE'; 
            
            if (SERPAPI_KEY === 'PASTE_YOUR_SERPAPI_KEY_HERE') {
                // Mock result if no key provided
                setTimeout(() => {
                    resultTitle.innerText = 'Scanning Complete (Simulated)';
                    resultText.innerText = 'Health detected: 94%. Patterns match "Septoria Leaf Spot" and "Organic Nutrient Deficiency." Suggesting organic fungicide and nitrogen boost.';
                    diseaseLabels.innerHTML = `
                        <span class="disease-tag">Septoria Spot</span>
                        <span class="disease-tag">Low Nitrogen</span>
                    `;
                    captureBtn.disabled = false;
                    captureBtn.innerText = 'Scan Again';
                }, 2000);
            } else {
                try {
                    // Note: SerpApi usually requires a server-side call or a proxy due to CORS.
                    // This is the formatted request structure for SerpApi Google Lens.
                    const serpApiUrl = `https://serpapi.com/search.json?engine=google_lens&api_key=${SERPAPI_KEY}&url=[YOUR_PUBLIC_IMAGE_URL]`;
                    
                    resultTitle.innerText = 'Connecting to SerpApi...';
                    resultText.innerText = 'Visual search via Google Lens is in progress...';

                    // For demonstration, we simulate the fetch result from SerpApi
                    const response = await fetch(serpApiUrl);
                    const data = await response.json();
                    
                    if (data.visual_matches) {
                        resultTitle.innerText = 'SerpApi Discovery';
                        resultText.innerText = 'Google Lens found several visual matches:';
                        diseaseLabels.innerHTML = data.visual_matches.slice(0, 3).map(m => `
                            <a href="${m.link}" target="_blank" class="disease-tag" style="text-decoration: none; display: flex; align-items: center; gap: 5px;">
                                <img src="${m.thumbnail}" style="width: 20px; height: 20px; border-radius: 4px;"> 
                                ${m.title}
                            </a>
                        `).join('');
                    } else {
                        throw new Error("No visual matches");
                    }
                    
                    captureBtn.disabled = false;
                    captureBtn.innerText = 'Scan Again';
                } catch (err) {
                    resultTitle.innerText = 'Scan Failed';
                    resultText.innerText = 'There was an error connecting to SerpApi. Please ensure your API key and Image URL are valid.';
                    captureBtn.disabled = false;
                    captureBtn.innerText = 'Try Again';
                }
            }
        });
    }
});
