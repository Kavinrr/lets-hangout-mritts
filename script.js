// ===== MUSIC PERSISTENCE ACROSS PAGES =====
const bgMusic = document.getElementById('bgMusic');
const musicToggleSm = document.getElementById('musicToggleSm');
let isPlaying = localStorage.getItem('musicPlaying') !== 'false';
let musicUnlocked = sessionStorage.getItem('musicUnlocked') === 'true';

// Check if we're on the home page (has splash)
const splash = document.getElementById('splash');
const isHomePage = !!splash;

// ===== SPLASH / AUDIO UNLOCK (home page only) =====
function enterSite() {
    if (splash) {
        splash.classList.add('hidden');
        setTimeout(() => splash.remove(), 600);
    }
    
    // Unlock and start music
    musicUnlocked = true;
    isPlaying = true;
    sessionStorage.setItem('musicUnlocked', 'true');
    localStorage.setItem('musicPlaying', 'true');
    localStorage.setItem('musicTime', '0');
    
    bgMusic.muted = false;
    bgMusic.volume = 0.4;
    bgMusic.currentTime = 0;
    bgMusic.play();
    
    // Save playback position continuously
    bgMusic.addEventListener('timeupdate', () => {
        localStorage.setItem('musicTime', String(bgMusic.currentTime));
    });
    
    updateVinylState();
}

// ===== INIT MUSIC STATE =====
function initMusic() {
    if (!musicUnlocked) return;
    
    bgMusic.volume = 0.4;
    bgMusic.muted = false;
    
    // Resume from last position
    const savedTime = parseFloat(localStorage.getItem('musicTime') || '0');
    if (savedTime > 0) {
        bgMusic.currentTime = savedTime;
    }
    
    if (isPlaying) {
        bgMusic.play().catch(() => {
            // Autoplay blocked — that's fine, user can tap toggle
        });
    }
    
    // Continuously save playback position
    bgMusic.addEventListener('timeupdate', () => {
        localStorage.setItem('musicTime', String(bgMusic.currentTime));
    });
    
    updateVinylState();
}

// ===== TOGGLE MUSIC =====
function toggleMusic() {
    if (!musicUnlocked) {
        // First interaction on a non-home page — unlock
        musicUnlocked = true;
        isPlaying = true;
        sessionStorage.setItem('musicUnlocked', 'true');
        localStorage.setItem('musicPlaying', 'true');
        bgMusic.volume = 0.4;
        bgMusic.muted = false;
        bgMusic.play();
        updateVinylState();
        return;
    }
    
    isPlaying = !isPlaying;
    localStorage.setItem('musicPlaying', String(isPlaying));
    
    if (isPlaying) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
    
    updateVinylState();
}

function updateVinylState() {
    const vinyls = document.querySelectorAll('.vinyl');
    vinyls.forEach(v => {
        if (isPlaying) {
            v.classList.remove('paused');
        } else {
            v.classList.add('paused');
        }
    });
    
    // Update all toggle icons on this page
    document.querySelectorAll('.music-icon, .music-icon-sm').forEach(icon => {
        icon.textContent = isPlaying ? '♪' : '◼';
    });
}

// ===== BIND MUSIC TOGGLES =====
const musicToggle = document.getElementById('musicToggle');
if (musicToggle) {
    musicToggle.addEventListener('click', toggleMusic);
}
if (musicToggleSm) {
    musicToggleSm.addEventListener('click', toggleMusic);
}

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

// ===== ACCEPT PAGE LOGIC =====
function initAcceptPage() {
    const params = new URLSearchParams(window.location.search);
    const preselectedPlan = params.get('plan');
    
    const planMessages = {
        plan1: "Windows down, music up, no destination. You just signed up for the best kind of chaos.",
        plan2: "Tony would approve. I'll make sure the beer is cold and the conversation is warm.",
        plan3: "Your city, your rules. I'm just happy to finally see it through your eyes.",
        plan4: "Bengali fish, comfortable silence, and nowhere to be. Sounds like a perfect day to me."
    };

    const planNames = {
        plan1: 'Road Trip.exe',
        plan2: 'Anthony Bourdain Appreciation Society',
        plan3: 'Your Turn',
        plan4: 'Home Chef DLC'
    };
    
    const acceptTitle = document.getElementById('acceptTitle');
    const acceptIntro = document.getElementById('acceptIntro');
    const dropdown = document.getElementById('planSelect');
    const dropdownWrapper = document.getElementById('dropdownWrapper');
    const confirmSection = document.getElementById('acceptConfirm');
    const backBtn = document.getElementById('backBtn');
    
    if (preselectedPlan && planNames[preselectedPlan]) {
        // Came from a specific plan page — hide intro & dropdown, show custom message
        acceptTitle.textContent = 'Great choice.';
        acceptIntro.textContent = planMessages[preselectedPlan];
        dropdown.value = preselectedPlan;
        dropdownWrapper.style.display = 'none';
        confirmSection.style.display = 'block';
        if (backBtn) backBtn.style.display = 'none';
        updateWhatsAppLink(preselectedPlan);
    }
    
    // Dropdown change handler
    if (dropdown) {
        dropdown.addEventListener('change', () => {
            const selected = dropdown.value;
            if (planMessages[selected]) {
                acceptIntro.textContent = planMessages[selected];
            }
            dropdownWrapper.style.display = 'none';
            confirmSection.style.display = 'block';
            if (backBtn) backBtn.style.display = 'none';
            updateWhatsAppLink(selected);
        });
    }
    
    // Launch confetti
    launchConfetti();
}

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

// ===== PAGE INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Home page: show splash only on first visit
    if (isHomePage) {
        if (musicUnlocked) {
            // Returning to home — skip splash, just play music
            if (splash) {
                splash.remove();
            }
            initMusic();
        }
        animateCards();
    } else {
        // Inner pages: remove splash if somehow present, start music
        if (splash) splash.remove();
        initMusic();
    }
    
    // Accept page
    if (document.getElementById('accept')) {
        initAcceptPage();
    }
    
    // Vibe page
    if (document.querySelector('.vibe-list')) {
        animateVibeList();
    }
    
    // Update vinyl visual state
    if (musicUnlocked) {
        updateVinylState();
    }
});
