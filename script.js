// ===== PAGE NAVIGATION WITH HISTORY =====
function showPage(pageId, pushState = true) {
    // Save scroll position of current page before switching
    const currentPage = document.querySelector('.page.active');
    if (currentPage && pushState) {
        currentPage.dataset.scrollPos = window.scrollY;
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        
        // Restore scroll position if going back, otherwise go to top
        if (!pushState && target.dataset.scrollPos) {
            window.scrollTo({ top: parseInt(target.dataset.scrollPos), behavior: 'instant' });
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
        
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

        // Push to history so phone back button works
        if (pushState) {
            history.pushState({ page: pageId }, '', '#' + pageId);
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

function goBack() {
    history.back();
}

// Handle browser/phone back button
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
        showPage(e.state.page, false);
    } else {
        showPage('home', false);
    }
});

// ===== SELECT AN OPTION =====
function selectOption(planId) {
    selectedPlan = planId;
    showPage('accept');
    
    const planMessages = {
        plan1: "Windows down, music up, no destination. You just signed up for the best kind of chaos. Time for some road rage ‼️",
        plan2: "Tony would approve. I'll make sure the beer is cold and the conversation is warm.",
        plan3: "Your city, your rules. I'm just happy to finally see it through your eyes.",
        plan4: "Bengali fish, comfortable silence, and nowhere to be. Sounds like a perfect day to me."
    };

    const acceptTitle = document.getElementById('acceptTitle');
    const acceptIntro = document.getElementById('acceptIntro');
    const dropdownWrapper = document.getElementById('dropdownWrapper');
    const confirmSection = document.getElementById('acceptConfirm');
    const backBtn = document.getElementById('backBtn');

    acceptTitle.textContent = 'Great choice.';
    acceptIntro.textContent = planMessages[planId];
    dropdownWrapper.style.display = 'none';
    confirmSection.style.display = 'block';
    if (backBtn) backBtn.style.display = 'none';
    updateWhatsAppLink(planId);
}

let selectedPlan = null;

// ===== WHATSAPP LINK =====
function updateWhatsAppLink(planId) {
    const waMessages = {
        plan1: "Hey! I'm in for the road trip 🚗 Let's figure out a day?",
        plan2: "Tony Bourdain it is 🎬 When are we doing this?",
        plan3: "My turn to show you around 🗺️ Pick a day!",
        plan4: "Bengali fish please 👨‍🍳 When works for you?"
    };
    
    const waBtn = document.getElementById('waBtn');
    if (waBtn && waMessages[planId]) {
        const msg = encodeURIComponent(waMessages[planId]);
        waBtn.href = `https://wa.me/918248324352?text=${msg}`;
        waBtn.style.display = 'inline-block';
    }
}

// ===== MUSIC =====
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicToggleSm = document.getElementById('musicToggleSm');
let isPlaying = false;

function enterSite() {
    const splash = document.getElementById('splash');
    if (splash) {
        splash.classList.add('hidden');
        setTimeout(() => splash.remove(), 600);
    }
    
    // Start music
    isPlaying = true;
    bgMusic.volume = 0.4;
    bgMusic.muted = false;
    bgMusic.play();
    updateVinylState();
    
    // Set initial history state
    history.replaceState({ page: 'home' }, '', '#home');
}

function toggleMusic() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
    
    updateVinylState();
}

function updateVinylState() {
    document.querySelectorAll('.vinyl').forEach(v => {
        if (isPlaying) {
            v.classList.remove('paused');
        } else {
            v.classList.add('paused');
        }
    });
    
    document.querySelectorAll('.music-icon, .music-icon-sm').forEach(icon => {
        icon.textContent = isPlaying ? '♪' : '◼';
    });
}

musicToggle.addEventListener('click', toggleMusic);
musicToggleSm.addEventListener('click', toggleMusic);

// Start vinyl paused until splash is tapped
document.querySelectorAll('.vinyl').forEach(v => v.classList.add('paused'));

// ===== DROPDOWN (accept page) =====
const planSelect = document.getElementById('planSelect');
planSelect.addEventListener('change', () => {
    const selected = planSelect.value;
    const planMessages = {
        plan1: "Windows down, music up, no destination. You just signed up for the best kind of chaos. Time for some road rage ‼️",
        plan2: "Tony would approve. I'll make sure the beer is cold and the conversation is warm.",
        plan3: "Your city, your rules. I'm just happy to finally see it through your eyes.",
        plan4: "Bengali fish, comfortable silence, and nowhere to be. Sounds like a perfect day to me."
    };
    
    const acceptTitle = document.getElementById('acceptTitle');
    const acceptIntro = document.getElementById('acceptIntro');
    const dropdownWrapper = document.getElementById('dropdownWrapper');
    const confirmSection = document.getElementById('acceptConfirm');
    const backBtn = document.getElementById('backBtn');
    
    acceptTitle.textContent = 'Great choice.';
    if (planMessages[selected]) {
        acceptIntro.textContent = planMessages[selected];
    }
    dropdownWrapper.style.display = 'none';
    confirmSection.style.display = 'block';
    if (backBtn) backBtn.style.display = 'none';
    updateWhatsAppLink(selected);
});

// Reset accept page when navigating to it via "I'm in" (no pre-selection)
const originalShowPage = showPage;
showPage = function(pageId, pushState = true) {
    // Reset accept page if going there without selectOption
    if (pageId === 'accept' && !selectedPlan) {
        document.getElementById('acceptTitle').textContent = 'You just made my week.';
        document.getElementById('acceptIntro').textContent = "Personally, I'd be fine to just share a chai and sutta break with you. But since we're here...";
        document.getElementById('dropdownWrapper').style.display = '';
        document.getElementById('acceptConfirm').style.display = 'none';
        document.getElementById('backBtn').style.display = '';
        document.getElementById('planSelect').value = '';
        document.getElementById('waBtn').style.display = 'none';
    }
    // Reset selectedPlan after showing accept
    if (pageId !== 'accept') {
        selectedPlan = null;
    }
    originalShowPage(pageId, pushState);
};

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

// ===== INIT =====
animateCards();
