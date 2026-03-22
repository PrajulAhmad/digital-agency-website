// ═══════════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinksEl.classList.toggle('active');
    hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinksEl.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Active link highlight on scroll
window.addEventListener('scroll', () => {
    const sections    = document.querySelectorAll('section');
    const navAllLinks = document.querySelectorAll('.nav-links a');
    let current = '';
    sections.forEach(s => {
        if (window.pageYOffset >= s.offsetTop - 200) current = s.getAttribute('id');
    });
    navAllLinks.forEach(link => {
        link.style.color = link.getAttribute('href').slice(1) === current ? '#00cc44' : 'white';
    });
});

// ═══════════════════════════════════════════════════════════
//  CONTACT FORM
// ═══════════════════════════════════════════════════════════
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const inputs = this.querySelectorAll('input, textarea');
        let valid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) { input.style.borderColor = '#ff4444'; valid = false; }
            else input.style.borderColor = '#eee';
        });
        if (!valid) { showNotification('Please fill in all fields', 'error'); return; }

        const emailInput = this.querySelector('input[type="email"]');
        if (!isValidEmail(emailInput.value)) {
            showNotification('Please enter a valid email address', 'error');
            emailInput.style.borderColor = '#ff4444';
            return;
        }
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        this.reset();
        inputs.forEach(i => { i.style.borderColor = '#eee'; });
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ═══════════════════════════════════════════════════════════
//  NOTIFICATION TOAST
// ═══════════════════════════════════════════════════════════
(function injectToastStyles() {
    const s = document.createElement('style');
    s.textContent = `
        @keyframes slideIn  { from { transform: translateX(420px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(420px); opacity: 0; } }
    `;
    document.head.appendChild(s);
})();

function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = `notification ${type}`;
    el.textContent = message;
    el.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        padding: 14px 20px; border-radius: 10px; font-weight: 600;
        z-index: 20000; animation: slideIn 0.3s ease;
        max-width: 380px; line-height: 1.5; font-size: 0.93rem;
        ${type === 'success' ? 'background:#00cc44;color:#000;' : 'background:#ff4444;color:#fff;'}
    `;
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => el.remove(), 300);
    }, 4500);
}

// ═══════════════════════════════════════════════════════════
//  SCROLL-TO-TOP BUTTON
// ═══════════════════════════════════════════════════════════
const scrollBtn = document.createElement('button');
scrollBtn.id = 'scrollToTopBtn';
scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollBtn.style.cssText = `
    position:fixed; bottom:30px; right:30px; background:#00cc44; color:#000;
    border:none; border-radius:50%; width:50px; height:50px; font-size:1.2rem;
    cursor:pointer; display:none; align-items:center; justify-content:center;
    z-index:99; transition:all 0.3s ease; box-shadow:0 5px 15px rgba(0,204,68,0.3);
`;
document.body.appendChild(scrollBtn);
window.addEventListener('scroll', () => { scrollBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none'; });
scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
scrollBtn.addEventListener('mouseenter', () => { scrollBtn.style.transform = 'translateY(-5px)'; scrollBtn.style.boxShadow = '0 10px 25px rgba(0,204,68,0.4)'; });
scrollBtn.addEventListener('mouseleave', () => { scrollBtn.style.transform = 'translateY(0)'; scrollBtn.style.boxShadow = '0 5px 15px rgba(0,204,68,0.3)'; });

// ═══════════════════════════════════════════════════════════
//  FADE-IN ANIMATIONS (Intersection Observer)
// ═══════════════════════════════════════════════════════════
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.service-card, .portfolio-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});

// ═══════════════════════════════════════════════════════════
//  COUNTER ANIMATION
// ═══════════════════════════════════════════════════════════
function animateCounter(el, target) {
    let current = 0;
    const inc = target / 50;
    const timer = setInterval(() => {
        current += inc;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
        else { el.textContent = Math.floor(current); }
    }, 30);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            animateCounter(entry.target, parseInt(entry.target.textContent));
        }
    });
});
document.querySelectorAll('.stat h3').forEach(stat => counterObserver.observe(stat));

// ═══════════════════════════════════════════════════════════
//  SERVICE ICON ANIMATIONS
// ═══════════════════════════════════════════════════════════
document.querySelectorAll('.service-icon').forEach(icon => {
    icon.style.transition = 'transform 0.3s ease';
    icon.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.1) rotate(5deg)'; });
    icon.addEventListener('mouseleave', function() { this.style.transform = 'scale(1) rotate(0deg)'; });
});

// ═══════════════════════════════════════════════════════════
//  PORTFOLIO FILTER
// ═══════════════════════════════════════════════════════════
document.querySelectorAll('.portfolio-tag').forEach(tag => {
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', function() {
        const name = this.textContent;
        document.querySelectorAll('.portfolio-item').forEach(item => {
            const match = item.querySelector('.portfolio-tag').textContent === name;
            item.style.opacity = match ? '1' : '0.3';
            item.style.pointerEvents = match ? 'auto' : 'none';
        });
    });
});
document.addEventListener('dblclick', () => {
    document.querySelectorAll('.portfolio-item').forEach(i => { i.style.opacity = '1'; i.style.pointerEvents = 'auto'; });
});


// ═══════════════════════════════════════════════════════════
//  BACKEND CONFIG
// ═══════════════════════════════════════════════════════════
const API_BASE = 'http://localhost:3001/api';


// ═══════════════════════════════════════════════════════════
//  AUTH STATE — localStorage persistence
// ═══════════════════════════════════════════════════════════
let currentUser = null;

const getToken    = () => localStorage.getItem('da_token');
const setToken    = (t) => localStorage.setItem('da_token', t);
const clearTokens = () => { localStorage.removeItem('da_token'); localStorage.removeItem('da_user'); };
const saveUser    = (u) => { localStorage.setItem('da_user', JSON.stringify(u)); currentUser = u; };
const getSavedUser = () => {
    try { const u = localStorage.getItem('da_user'); return u ? JSON.parse(u) : null; } catch { return null; }
};


// ═══════════════════════════════════════════════════════════
//  NAV STATE
// ═══════════════════════════════════════════════════════════
function updateNavState(loggedIn) {
    const show = (id, as) => { const el = document.getElementById(id); if (el) el.style.display = as; };
    if (loggedIn) {
        show('navSignupBtn', 'none');
        show('navLoginBtn',  'none');
        show('navDashboardBtn', 'flex');
        show('navLogoutBtn',    'flex');
    } else {
        show('navSignupBtn', '');
        show('navLoginBtn',  '');
        show('navDashboardBtn', 'none');
        show('navLogoutBtn',    'none');
    }
}


// ═══════════════════════════════════════════════════════════
//  SUBSCRIBE BUTTON
// ═══════════════════════════════════════════════════════════
function handleSubscribe() {
    getSavedUser() ? openDashboard() : openSignupModal();
}


// ═══════════════════════════════════════════════════════════
//  SIGN UP MODAL
// ═══════════════════════════════════════════════════════════
function openSignupModal() {
    document.getElementById('signupModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const el = document.getElementById('signup-name'); if (el) el.focus(); }, 120);
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('active');
    document.body.style.overflow = '';
    const f = document.getElementById('signupForm');
    if (f) f.reset();
    clearAuthError('signupError');
    ['signup-name','signup-email','signup-password'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('error');
    });
}


// ═══════════════════════════════════════════════════════════
//  LOGIN MODAL
// ═══════════════════════════════════════════════════════════
function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const el = document.getElementById('login-email'); if (el) el.focus(); }, 120);
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.body.style.overflow = '';
    const f = document.getElementById('loginForm');
    if (f) f.reset();
    clearAuthError('loginError');
}

function switchToLogin()  { closeSignupModal(); setTimeout(openLoginModal,  150); }
function switchToSignup() { closeLoginModal();  setTimeout(openSignupModal, 150); }

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSignupModal(); closeLoginModal(); }
});


// ═══════════════════════════════════════════════════════════
//  PASSWORD TOGGLE
// ═══════════════════════════════════════════════════════════
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon  = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}


// ═══════════════════════════════════════════════════════════
//  FORM HELPER UTILITIES
// ═══════════════════════════════════════════════════════════
function showAuthError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    el.style.display = 'flex';
}
function clearAuthError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'none';
    el.textContent = '';
}
function setInputError(input, has) {
    if (!input) return;
    has ? input.classList.add('error') : input.classList.remove('error');
}
function setButtonLoading(btn, loading, original) {
    btn.innerHTML = loading ? '<i class="fas fa-spinner fa-spin"></i> Please wait...' : original;
    btn.disabled  = loading;
}


// ═══════════════════════════════════════════════════════════
//  SIGN UP → POST /api/auth/register
// ═══════════════════════════════════════════════════════════
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearAuthError('signupError');
        ['signup-name','signup-email','signup-password'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('error');
        });

        const nameEl  = document.getElementById('signup-name');
        const emailEl = document.getElementById('signup-email');
        const passEl  = document.getElementById('signup-password');
        const name    = nameEl.value.trim();
        const email   = emailEl.value.trim();
        const company = document.getElementById('signup-company').value.trim();
        const password = passEl.value;

        let hasError = false;
        if (!name)                           { setInputError(nameEl, true);  hasError = true; }
        if (!email || !isValidEmail(email))  { setInputError(emailEl, true); hasError = true; }
        if (!password || password.length < 6){ setInputError(passEl, true);  hasError = true; }

        if (hasError) {
            showAuthError('signupError', 'Please fill in all required fields. Password must be at least 6 characters.');
            return;
        }

        const btn  = document.getElementById('signupSubmitBtn');
        const orig = btn.innerHTML;
        setButtonLoading(btn, true, orig);

        try {
            const res  = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, company, password, plan: 'Revenue Framework' })
            });
            const data = await res.json();

            if (!res.ok) {
                showAuthError('signupError', data.message || 'Registration failed. Please try again.');
                setButtonLoading(btn, false, orig);
                return;
            }

            setToken(data.token);
            saveUser(data.user);
            updateNavState(true);
            closeSignupModal();
            showNotification(`🎉 Welcome, ${data.user.name}! Your subscription account is ready.`, 'success');
            setTimeout(openDashboard, 900);

        } catch (err) {
            console.error('Sign up error:', err);
            showAuthError('signupError', '⚠️ Cannot reach the server. Please start the backend: cd backend && node server.js');
            setButtonLoading(btn, false, orig);
        }
    });
}


// ═══════════════════════════════════════════════════════════
//  LOGIN → POST /api/auth/login
// ═══════════════════════════════════════════════════════════
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearAuthError('loginError');

        const email    = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            showAuthError('loginError', 'Please enter your email and password.');
            return;
        }

        const btn  = document.getElementById('loginSubmitBtn');
        const orig = btn.innerHTML;
        setButtonLoading(btn, true, orig);

        try {
            const res  = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                showAuthError('loginError', data.message || 'Invalid email or password.');
                setButtonLoading(btn, false, orig);
                return;
            }

            setToken(data.token);
            saveUser(data.user);
            updateNavState(true);
            closeLoginModal();
            showNotification(`👋 ${data.message}`, 'success');
            setTimeout(openDashboard, 700);

        } catch (err) {
            console.error('Login error:', err);
            showAuthError('loginError', '⚠️ Cannot reach the server. Please start the backend: cd backend && node server.js');
            setButtonLoading(btn, false, orig);
        }
    });
}


// ═══════════════════════════════════════════════════════════
//  MEMBER DASHBOARD
// ═══════════════════════════════════════════════════════════
function openDashboard() {
    const user = getSavedUser();
    if (!user) { openLoginModal(); return; }
    populateDashboard(user);
    document.getElementById('memberDashboard').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeDashboard() {
    document.getElementById('memberDashboard').style.display = 'none';
    document.body.style.overflow = '';
}

function populateDashboard(user) {
    const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set('dashboardAvatar',       initials);
    set('dashboardUsername',     user.name);
    set('dashboardPlan',         user.plan || 'Revenue Framework');
    set('dashboardWelcomeName',  user.name.split(' ')[0]);
    set('dashAccountName',       user.name);
    set('dashAccountEmail',      user.email);
    set('dashAccountCompany',    user.company || '—');
    set('dashAccountPlan',       user.plan || 'Revenue Framework');

    const since = user.subscribedAt || user.createdAt;
    if (since) {
        const d = new Date(since);
        set('dashAccountDate', d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }
}


// ═══════════════════════════════════════════════════════════
//  LOGOUT → POST /api/auth/logout
// ═══════════════════════════════════════════════════════════
async function handleLogout() {
    const token = getToken();
    if (token) {
        try {
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (_) { /* ok if server is offline */ }
    }
    clearTokens();
    currentUser = null;
    updateNavState(false);
    closeDashboard();
    showNotification('You have been logged out successfully.', 'success');
}


// ═══════════════════════════════════════════════════════════
//  RESTORE SESSION ON PAGE LOAD
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '1';

    const savedUser = getSavedUser();
    const token     = getToken();

    if (savedUser && token) {
        currentUser = savedUser;
        updateNavState(true);

        // Verify token silently
        fetch(`${API_BASE}/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(r => r.json())
            .then(data => {
                if (data.success) saveUser(data.user);
                else { clearTokens(); updateNavState(false); }
            })
            .catch(() => { /* keep cached session if server offline */ });
    } else {
        updateNavState(false);
    }
});

console.log('Digital Agency — all scripts loaded ✅');
