// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    // Prevent navigation if page is locked
    if (pageLocked && pageId !== 'accept') return;

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Re-trigger fade animation
        target.style.animation = 'none';
        target.offsetHeight;
        target.style.animation = '';
        
        // Toggle vinyl visibility
        const vinylSmall = document.getElementById('vinylSmall');
        if (pageId === 'home') {
            vinylSmall.classList.remove('visible');
        } else {
            vinylSmall.classList.add('visible');
        }

        // Trigger confetti on accept page
        if (pageId === 'accept') {
            launchConfetti();
        }

        // Animate vibe list items
        if (pageId === 'vibe') {
            animateVibeList();
        }

        // Animate cards when showing home
        if (pageId === 'home') {
            animateCards();
        }
    }
}

// ===== PAGE LOCK (after option selected) =====
let pageLocked = false;

// ===== SELECT AN OPTION (from plan detail page) =====
function selectOption(planId) {
    const planNames = {
        plan1: 'Road Trip.exe',
        plan2: 'Anthony Bourdain Appreciation Society',
        plan3: 'Your Turn',
        plan4: 'Home Chef DLC'
    };

    // Lock the page — no going back
    pageLocked = true;

    // Show accept page with pre-selected option
    showPage('accept');
    
    // Update the accept page messaging
    const acceptTitle = document.getElementById('acceptTitle');
    const acceptIntro = document.getElementById('acceptIntro');
    const dropdown = document.getElementById('planSelect');
    const dropdownWrapper = document.getElementById('dropdownWrapper');
    const confirmSection = document.getElementById('acceptConfirm');
    const backBtn = document.querySelector('#accept .btn-back-link');

    acceptTitle.textContent = 'Great choice.';
    acceptIntro.textContent = `You picked "${planNames[planId]}". Love it.`;
    
    // Pre-select the dropdown and hide it, show confirm directly
    dropdown.value = planId;
    dropdownWrapper.style.display = 'none';
    confirmSection.style.display = 'block';
    
    // Hide back button since page is locked
    if (backBtn) backBtn.style.display = 'none';
}

// ===== SPLASH / AUDIO UNLOCK =====
function enterSite() {
    const splash = document.getElementById('splash');
    splash.classList.add('hidden');
    setTimeout(() => splash.remove(), 600);
    
    // Start music immediately after user interaction
    bgMusic.muted = false;
    bgMusic.volume = 0.4;
    bgMusic.play();
}

// ===== VINYL / MUSIC =====
const musicToggle = document.getElementById('musicToggle');
const musicToggleSm = document.getElementById('musicToggleSm');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = true;

function toggleMusic() {
    isPlaying = !isPlaying;
    const vinyls = document.querySelectorAll('.vinyl');
    vinyls.forEach(v => {
        if (isPlaying) {
            v.classList.remove('paused');
        } else {
            v.classList.add('paused');
        }
    });
    
    if (isPlaying) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
    
    musicToggle.querySelector('.music-icon').textContent = isPlaying ? '♪' : '◼';
    musicToggleSm.querySelector('.music-icon-sm').textContent = isPlaying ? '♪' : '◼';
}

musicToggle.addEventListener('click', toggleMusic);
musicToggleSm.addEventListener('click', toggleMusic);

// ===== DROPDOWN CHANGE (on accept page) =====
const planSelect = document.getElementById('planSelect');
planSelect.addEventListener('change', () => {
    const confirmSection = document.getElementById('acceptConfirm');
    confirmSection.style.display = 'block';
    
    // Lock the page after selection
    pageLocked = true;
    const backBtn = document.querySelector('#accept .btn-back-link');
    if (backBtn) backBtn.style.display = 'none';
});

// ===== CONFETTI =====
function launchConfetti() {
    const colors = ['#e8c547', '#4ecdc4', '#ff6b6b', '#f0efe9', '#a78bfa', '#f97316'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        const shapes = ['circle', 'square', 'rectangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        if (shape === 'circle') {
            piece.style.borderRadius = '50%';
        } else if (shape === 'rectangle') {
            piece.style.width = '6px';
            piece.style.height = '14px';
        }
        
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 5000);
    }
}

// ===== VIBE LIST ANIMATION =====
function animateVibeList() {
    const items = document.querySelectorAll('.vibe-list li');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        item.style.transition = `all 0.4s ease ${index * 0.07}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 50);
    });
}

// ===== CARD ANIMATIONS =====
function animateCards() {
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        card.style.transition = `all 0.4s ease ${index * 0.08}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    });
}

// Initial card animation on load
animateCards();

// ===== KEYBOARD NAV =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activePlan = document.querySelector('.plan-detail.active');
        if (activePlan) {
            showPage('home');
        }
    }
});

// ===== RESET ACCEPT PAGE when navigating away =====
// So if she goes back and comes again, it resets
const originalAcceptTitle = 'You just made my week.';
const originalAcceptIntro = "Personally, I'd be fine to just share a chai and sutta break with you. But since we're here...";

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-back-link');
    if (btn && btn.closest('#accept')) {
        // Reset accept page state
        document.getElementById('acceptTitle').textContent = originalAcceptTitle;
        document.getElementById('acceptIntro').textContent = originalAcceptIntro;
        document.getElementById('dropdownWrapper').style.display = '';
        document.getElementById('acceptConfirm').style.display = 'none';
        document.getElementById('planSelect').value = '';
    }
});
