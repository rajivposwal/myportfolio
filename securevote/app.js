/* ══════════════════════════════════════════════════
   SECUREVOTE — JavaScript Application Logic
   Multi-step voting flow, animations, audit log
══════════════════════════════════════════════════ */

/* ── State ── */
const state = {
    currentStep: 1,
    totalSteps: 5,
    voterName: '',
    voterId: '',
    videoStream: null,
    trustScore: 0,
    selectedCandidate: '',
    DEMO_OTP: '482917',
    voted: false
};

/* ══════════ PARTICLE CANVAS ══════════ */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let raf;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1
        };
    }

    function init() {
        resize();
        particles = Array.from({ length: 90 }, createParticle);
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
            ctx.fill();
        });

        // Draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < 90) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${0.06 * (1 - dist / 90)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        raf = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
})();

/* ══════════ NAVBAR ══════════ */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => observer.observe(s));
})();

/* ══════════ REVEAL ON SCROLL ══════════ */
(function initReveal() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ══════════ RESULTS CHART ANIMATION ══════════ */
(function initCharts() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                document.querySelectorAll('.chart-bar').forEach(bar => {
                    const fill = bar.querySelector('.chart-bar-fill');
                    const pct = getComputedStyle(bar).getPropertyValue('--pct').trim();
                    setTimeout(() => { fill.style.width = pct; }, 300);
                });
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    const chart = document.querySelector('.results-chart-card');
    if (chart) io.observe(chart);
})();

/* ══════════ ADMIN METRIC COUNTERS ══════════ */
(function initCounters() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                document.querySelectorAll('.am-value[data-val]').forEach(el => {
                    const target = parseInt(el.dataset.val, 10);
                    animateCounter(el, 0, target, 1800);
                });
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    const admin = document.querySelector('.admin-grid');
    if (admin) io.observe(admin);
})();

function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(start + (end - start) * easeOut(progress)).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

/* ══════════ AUDIT LOG ══════════ */
const auditMessages = [
    ['ok', 'Vote cast — Anon ID: 0x8f2a...c3d1'],
    ['ok', 'Trust score computed: 94.2% — Voter eligible'],
    ['ok', 'Biometric verification passed — Liveness confirmed'],
    ['warn', 'Location anomaly flagged — Under review (ID: 0x1b7c)'],
    ['ok', 'ID document purged after session — Privacy preserved'],
    ['ok', 'Vote cast — Anon ID: 0xa3f1...b8e2'],
    ['danger', 'Duplicate attempt blocked — IP: 192.168.x.x'],
    ['ok', 'Trust score computed: 88.7% — Voter eligible'],
    ['ok', 'Device fingerprint verified — No anomaly'],
    ['warn', 'Behavioral anomaly detected — Manual review triggered'],
    ['ok', 'Vote cast — Anon ID: 0x5c9d...f4a8'],
    ['ok', 'Behavioral analysis passed — Human verified'],
    ['ok', 'OTP verified — Phone +91 ****43210'],
    ['danger', 'VPN detected — Session terminated'],
    ['ok', 'Vote cast — Anon ID: 0x7f3e...a1c6'],
];

function getTime() {
    return new Date().toLocaleTimeString('en-IN', { hour12: false });
}

function addAuditEntry() {
    const log = document.getElementById('auditLog');
    if (!log) return;
    const msg = auditMessages[Math.floor(Math.random() * auditMessages.length)];
    const entry = document.createElement('div');
    entry.className = 'audit-entry';
    entry.innerHTML = `<span class="audit-time">${getTime()}</span>
        <span class="audit-msg"><span class="${msg[0]}">[${msg[0].toUpperCase()}]</span> ${msg[1]}</span>`;
    log.insertBefore(entry, log.firstChild);
    if (log.children.length > 20) log.removeChild(log.lastChild);
}

// Seed initial log
for (let i = 0; i < 6; i++) addAuditEntry();
setInterval(addAuditEntry, 3000);

/* ══════════ STEP NAVIGATION ══════════ */
function goToStep(n) {
    const oldPanel = document.getElementById(`step-${state.currentStep}`);
    if (oldPanel) oldPanel.classList.remove('active');

    // Mark progress
    for (let i = 1; i <= state.totalSteps; i++) {
        const pstep = document.getElementById(`pstep-${i}`);
        const pline = document.getElementById(`pline-${i}`);
        if (!pstep) continue;
        pstep.classList.remove('active', 'done');
        if (i < n) pstep.classList.add('done');
        else if (i === n) pstep.classList.add('active');
        if (pline) pline.classList.toggle('done', i < n);
    }

    state.currentStep = n;
    const newPanel = document.getElementById(`step-${n}`);
    if (newPanel) {
        newPanel.classList.add('active');
        newPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/* ══════════ STEP 1: OTP ══════════ */
window.sendOtp = function () {
    const name = document.getElementById('voterName').value.trim();
    const id = document.getElementById('voterId').value.trim();
    const phone = document.getElementById('voterPhone').value.trim();
    const dob = document.getElementById('voterDob').value;

    if (!name || !id || !phone || !dob) {
        showToast('Please fill in all fields before sending OTP.', 'warn');
        return;
    }
    state.voterName = name;
    state.voterId = id;

    document.getElementById('sendOtpBtn').style.display = 'none';
    document.getElementById('otpSection').style.display = 'block';
    document.getElementById('verifyOtpBtn').style.display = 'inline-flex';
    showToast('OTP sent to your registered phone!', 'ok');
    initOtpInputs();
};

function initOtpInputs() {
    const boxes = document.querySelectorAll('.otp-box');
    boxes.forEach((box, i) => {
        box.addEventListener('input', () => {
            if (box.value.length === 1 && i < boxes.length - 1) boxes[i + 1].focus();
        });
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus();
        });
    });
}

window.verifyOtp = function () {
    const otp = Array.from(document.querySelectorAll('.otp-box')).map(b => b.value).join('');
    if (otp === state.DEMO_OTP) {
        showToast('OTP verified! Proceeding to biometric check...', 'ok');
        setTimeout(() => goToStep(2), 800);
    } else {
        showToast('Incorrect OTP. Hint: 4 8 2 9 1 7', 'warn');
        document.querySelectorAll('.otp-box').forEach(b => { b.value = ''; b.style.borderColor = 'var(--red)'; });
    }
};

/* ══════════ STEP 2: CAMERA ══════════ */
window.startCamera = async function () {
    const overlay = document.getElementById('cameraOverlay');
    const status = document.getElementById('cameraStatus');
    const scanLine = document.getElementById('scanLine');
    const video = document.getElementById('videoFeed');
    const startBtn = document.getElementById('startCameraBtn');
    const captureBtn = document.getElementById('captureBtn');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        state.videoStream = stream;
        video.srcObject = stream;
        video.style.display = 'block';
        overlay.style.display = 'none';
        scanLine.style.display = 'block';
        status.textContent = 'Analyzing...';
        startBtn.style.display = 'none';
        captureBtn.style.display = 'inline-flex';

        simulateLivenessChecks(captureBtn, status);
    } catch (err) {
        // Camera not available — simulate for demo
        overlay.innerHTML = '<i class="fas fa-video-slash fa-2x" style="color:var(--cyan)"></i><p style="color:var(--cyan)">Demo Mode (No Camera)</p>';
        status.textContent = 'Simulating...';
        scanLine.style.display = 'block';
        startBtn.style.display = 'none';
        captureBtn.style.display = 'inline-flex';
        simulateLivenessChecks(captureBtn, status);
    }
};

function simulateLivenessChecks(captureBtn, status) {
    const checks = [
        { id: 'lCheck1', icon: 'fa-eye', text: 'Blink detected — ✓ Passed' },
        { id: 'lCheck2', icon: 'fa-arrows-left-right', text: 'Head movement — ✓ Passed' },
        { id: 'lCheck3', icon: 'fa-face-smile', text: 'Smile detected — ✓ Passed' }
    ];
    checks.forEach((c, i) => {
        setTimeout(() => {
            const el = document.getElementById(c.id);
            el.classList.add('ok');
            el.innerHTML = `<i class="fas fa-check-circle"></i><span>${c.text}</span>`;
            if (i === checks.length - 1) {
                status.textContent = 'Liveness confirmed!';
                captureBtn.disabled = false;
            }
        }, 1200 * (i + 1));
    });
}

window.captureFace = function () {
    if (state.videoStream) {
        state.videoStream.getTracks().forEach(t => t.stop());
    }
    const status = document.getElementById('cameraStatus');
    status.textContent = '96.7% Match — Verified';
    showToast('Facial verification successful (96.7% match)!', 'ok');
    setTimeout(() => goToStep(3), 800);
};

/* ══════════ STEP 3: ID UPLOAD ══════════ */
window.handleIdUpload = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const area = document.getElementById('idUploadArea');
    const preview = document.getElementById('idPreview');
    const previewImg = document.getElementById('idPreviewImg');
    const scanStatus = document.getElementById('idScanStatus');
    const extractedData = document.getElementById('idExtractedData');
    const verifyBtn = document.getElementById('idVerifyBtn');

    area.style.display = 'none';
    preview.style.display = 'block';

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => { previewImg.src = e.target.result; };
        reader.readAsDataURL(file);
    } else {
        previewImg.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" style="background:%230a1628"><text x="50%" y="50%" fill="%2306b6d4" text-anchor="middle" font-size="18" font-family="monospace">PDF Document Uploaded</text></svg>';
    }

    // Simulate OCR scanning
    setTimeout(() => {
        scanStatus.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Running OCR...';
        setTimeout(() => {
            scanStatus.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Matching face...';
            setTimeout(() => {
                document.getElementById('id-scan-overlay') && (document.querySelector('.id-scan-overlay').style.display = 'none');
                extractedData.style.display = 'block';
                verifyBtn.style.display = 'inline-flex';
                showToast('ID document verified successfully!', 'ok');
            }, 1500);
        }, 1500);
    }, 1000);
};

window.proceedFromIdVerify = function () {
    goToStep(4);
    setTimeout(animateTrustScore, 600);
};

/* ══════════ STEP 4: TRUST SCORE ══════════ */
function animateTrustScore() {
    const gaugeCircle = document.getElementById('gaugeCircle');
    const trustValueEl = document.getElementById('trustValue');
    const trustVerdict = document.getElementById('trustVerdict');
    const proceedBtn = document.getElementById('proceedVoteBtn');
    const circumference = 502;
    const targetScore = 93;
    state.trustScore = targetScore;

    // Animate bars first
    const bars = document.querySelectorAll('.ti-fill');
    bars.forEach((bar, i) => {
        setTimeout(() => {
            bar.style.width = bar.dataset.target + '%';
        }, i * 200 + 300);
    });

    // Then animate gauge
    let current = 0;
    const interval = setInterval(() => {
        current++;
        trustValueEl.textContent = current;
        const offset = circumference - (current / 100) * circumference;
        gaugeCircle.style.strokeDashoffset = offset;
        if (current >= targetScore) {
            clearInterval(interval);
            setTimeout(() => {
                trustVerdict.style.display = 'flex';
                proceedBtn.style.display = 'inline-flex';
                showToast('Trust score: ' + targetScore + '% — You are authorized to vote!', 'ok');
            }, 400);
        }
    }, 18);
}

window.goToVotingBallot = function () {
    goToStep(5);
};

/* ══════════ STEP 5: BALLOT ══════════ */
window.reviewVote = function () {
    const selected = document.querySelector('input[name="candidate"]:checked');
    if (!selected) {
        showToast('Please select a candidate before reviewing.', 'warn');
        return;
    }
    const label = document.querySelector(`label[for="${selected.id}"] .cand-info h4`);
    state.selectedCandidate = label ? label.textContent : selected.value;
    document.getElementById('selectedCandidateName').textContent = state.selectedCandidate;
    document.getElementById('ballotConfirm').style.display = 'block';
    document.getElementById('ballotActions').style.display = 'none';
    document.getElementById('ballotConfirm').scrollIntoView({ behavior: 'smooth', block: 'center' });
};

window.cancelVote = function () {
    document.getElementById('ballotConfirm').style.display = 'none';
    document.getElementById('ballotActions').style.display = 'flex';
};

window.submitVote = function () {
    if (state.voted) { showToast('You have already submitted your vote.', 'warn'); return; }
    state.voted = true;

    showToast('Encrypting and submitting your vote...', 'ok');

    // Hide all panels, show complete
    document.querySelectorAll('.vote-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('voteProgress').style.display = 'none';

    setTimeout(() => {
        document.getElementById('step-complete').classList.add('active');
        document.getElementById('receiptId').textContent = 'SV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        document.getElementById('receiptTime').textContent = new Date().toLocaleString('en-IN');
        document.getElementById('step-complete').scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add to audit log
        addAuditEntry();
    }, 1200);
};

window.viewResults = function () {
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    // Trigger chart animation
    document.querySelectorAll('.chart-bar-fill').forEach(fill => {
        const bar = fill.parentElement;
        const pct = getComputedStyle(bar).getPropertyValue('--pct').trim();
        fill.style.width = pct;
    });
};

/* ══════════ RESULTS FILTER ══════════ */
const resultDatasets = {
    all:    [42, 35, 19, 4],
    gender: [45, 32, 18, 5],
    age:    [38, 40, 17, 5],
    region: [40, 36, 21, 3]
};
const voteLabels = {
    all:    ['4,218', '3,512', '1,906', '401'],
    gender: ['4,511', '3,211', '1,806', '502'],
    age:    ['3,812', '4,015', '1,707', '502'],
    region: ['4,016', '3,611', '2,107', '302'],
};

window.filterResults = function (type, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const pcts = resultDatasets[type] || resultDatasets.all;
    const votes = voteLabels[type] || voteLabels.all;
    document.querySelectorAll('.chart-bar').forEach((bar, i) => {
        const fill = bar.querySelector('.chart-bar-fill');
        const pctEl = bar.querySelector('.chart-pct');
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = pcts[i] + '%';
            if (pctEl) pctEl.textContent = pcts[i] + '%';
        }, 100);
        const voteEl = bar.parentElement.parentElement.querySelector('.chart-votes');
        if (voteEl) voteEl.textContent = votes[i] + ' votes';
    });
};

/* ══════════ TOAST NOTIFICATIONS ══════════ */
function showToast(msg, type = 'ok') {
    const existing = document.querySelector('.sv-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'sv-toast';
    const colors = { ok: 'var(--green)', warn: 'var(--amber)', danger: 'var(--red)' };
    const icons = { ok: 'fa-check-circle', warn: 'fa-exclamation-triangle', danger: 'fa-times-circle' };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.ok}"></i> ${msg}`;
    toast.style.cssText = `
        position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
        background: var(--bg2); border: 1px solid ${colors[type] || colors.ok};
        color: ${colors[type] || colors.ok}; padding: 0.8rem 1.3rem;
        border-radius: 10px; font-size: 0.85rem; font-weight: 500;
        display: flex; align-items: center; gap: 0.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        animation: toastIn 0.3s ease;
        max-width: 360px;
    `;
    const style = document.createElement('style');
    style.textContent = `@keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`;
    document.head.appendChild(style);
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

/* ══════════ TYPING EFFECT ══════════ */
(function initTypingEffect() {
    const texts = ['Secure Democracy', 'Private Voting', 'Fraud-Free Elections', 'AI-Powered Trust'];
    let ti = 0, ci = 0, adding = true;
    const el = document.querySelector('.gradient-text');
    if (!el) return;
    setInterval(() => {
        const text = texts[ti];
        if (adding) {
            el.textContent = text.substring(0, ++ci);
            if (ci === text.length) { adding = false; }
        } else {
            el.textContent = text.substring(0, --ci);
            if (ci === 0) { adding = true; ti = (ti + 1) % texts.length; }
        }
    }, 80);
})();
