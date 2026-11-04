document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Scroll Progress Bar
       ========================================= */
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = pct + '%';
    }, { passive: true });


    /* =========================================
       2. Hamburger Menu Toggle
       ========================================= */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close nav when a link is clicked (mobile)
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });


    /* =========================================
       3. Active Nav Link on Scroll
       ========================================= */
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links li a[href^="#"]');

    const activateLink = () => {
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 140;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateLink, { passive: true });
    activateLink();


    /* =========================================
       4. Typing Effect
       ========================================= */
    const textElement = document.querySelector('.typing-text');
    if (textElement) {
        const roles = [
            "Software Engineer",
            "Full-Stack Developer",
            "Data Science Enthusiast",
            "Python Specialist",
            "Systems Architect"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 120;

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                textElement.textContent = currentRole.substring(0, charIndex--);
                typeSpeed = 45;
            } else {
                textElement.textContent = currentRole.substring(0, charIndex++);
                typeSpeed = 110;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2200;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 400;
            }

            setTimeout(typeEffect, typeSpeed);
        }

        typeEffect();
    }


    /* =========================================
       5. Scroll Reveal
       ========================================= */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    /* =========================================
       6. Dark / Light Theme Toggle
       ========================================= */
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        const root = document.documentElement;

        if (localStorage.getItem('theme') === 'light') {
            root.classList.add('light-mode');
            icon.classList.replace('fa-sun', 'fa-moon');
        }

        themeBtn.addEventListener('click', () => {
            root.classList.toggle('light-mode');

            if (root.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                icon.classList.replace('fa-sun', 'fa-moon');
            } else {
                localStorage.setItem('theme', 'dark');
                icon.classList.replace('fa-moon', 'fa-sun');
            }
        });
    }


    /* =========================================
       7. High-Tech Cyber Particle Mesh Canvas
       ========================================= */
    const canvas = document.getElementById('tech-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }, { passive: true });

        const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
        let particles = [];
        let mouse = { x: null, y: null, maxDist: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 1.6 + 0.8;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                const isLight = document.documentElement.classList.contains('light-mode');
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = isLight ? 'rgba(37, 99, 235, 0.45)' : 'rgba(56, 189, 248, 0.55)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function connectParticles() {
            const isLight = document.documentElement.classList.contains('light-mode');
            const maxConnDist = 120;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxConnDist) {
                        const alpha = (1 - dist / maxConnDist) * (isLight ? 0.15 : 0.22);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = isLight ? `rgba(37, 99, 235, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (mouse.x !== null && mouse.y !== null) {
                    const mdx = particles[i].x - mouse.x;
                    const mdy = particles[i].y - mouse.y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                    if (mdist < mouse.maxDist) {
                        const mAlpha = (1 - mdist / mouse.maxDist) * (isLight ? 0.25 : 0.4);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = isLight ? `rgba(99, 102, 241, ${mAlpha})` : `rgba(129, 140, 248, ${mAlpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }


    /* =========================================
       8. Hacker / Cyber Text Decrypt Animation
       ========================================= */
    const decryptEls = document.querySelectorAll('[data-decrypt]');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//<>{}!=_*&^%$#@~';

    function decryptEffect(element) {
        const originalText = element.getAttribute('data-original') || element.innerText;
        element.setAttribute('data-original', originalText);
        let iterations = 0;

        const interval = setInterval(() => {
            element.innerText = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations || char === ' ') return char;
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iterations >= originalText.length) {
                clearInterval(interval);
                element.innerText = originalText;
            }
            iterations += 1 / 2;
        }, 30);
    }

    decryptEls.forEach(el => {
        el.addEventListener('mouseenter', () => decryptEffect(el));
    });

    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-section .name');
        if (heroTitle) decryptEffect(heroTitle);
    }, 500);


    /* =========================================
       9. Mouse Spotlight Tracking on Cyber Cards
       ========================================= */
    const spotlightCards = document.querySelectorAll('.card, .project-card, .cert-card, .cv-card-banner, .about-text, .skills-wrapper, .terminal-window, .ide-container, .arch-spec-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    /* =========================================
       10. Interactive Cyber Terminal (CLI)
       ========================================= */
    const terminalBody   = document.getElementById('terminal-output');
    const terminalInput  = document.getElementById('terminal-input');
    const terminalForm   = document.getElementById('terminal-form');
    const cmdChips       = document.querySelectorAll('.cmd-chip');

    const commands = {
        whoami: [
            '<span class="t-cyan">Rajiv Kumar</span> — Software & Data Science Engineer',
            'Education: B.Tech Computer Science & Engineering (Lovely Professional University)',
            'Specialization: Python, Full-Stack Web Applications, Machine Learning, Systems Architecture',
            'Philosophy: Building reliable, high-performance software with clean design & integrity.'
        ],
        skills: [
            '<span class="t-cyan">[LANGUAGES]</span>  Python, SQL, JavaScript, HTML5, CSS3, Java',
            '<span class="t-cyan">[FRAMEWORKS]</span> Flask, Jinja2, RESTful APIs, Bootstrap',
            '<span class="t-cyan">[DATABASES]</span>  MySQL, SQLite, Schema Design, Query Optimization',
            '<span class="t-cyan">[ANALYTICS]</span>   Power BI, Data Processing, Jupyter Notebook',
            '<span class="t-cyan">[DEV TOOLS]</span>  Git, GitHub, VS Code, Linux/Bash, IntelliJ IDEA'
        ],
        projects: [
            '<span class="t-green">1. NexLib Management System:</span> Python-based digital library with inventory tracking and auto fine calculation. <a href="librarymanagementsystem/" target="_blank" class="t-link">[Live Demo]</a>',
            '<span class="t-green">2. Global Ticket Booking System:</span> Flight, Hotel, Train & Bus booking platform with live FlightRadar24 API. <a href="https://travel-universe.vercel.app" target="_blank" class="t-link">[Live Demo]</a>'
        ],
        contact: [
            'EMAIL:    <a href="mailto:rajivposwal489@gmail.com" class="t-link">rajivposwal489@gmail.com</a>',
            'PHONE:    +91 9896144387',
            'LINKEDIN: <a href="https://www.linkedin.com/in/rajivposla489" target="_blank" class="t-link">linkedin.com/in/rajivposla489</a>',
            'GITHUB:   <a href="https://github.com/rajivposwal" target="_blank" class="t-link">github.com/rajivposwal</a>'
        ],
        status: [
            '<span class="t-green">[SYS_STATUS: OPTIMAL]</span>',
            'All systems operational. Ready for software engineering opportunities & collaborations.',
            'Location: Lovely Professional University, Punjab, India'
        ],
        help: [
            'Available high-tech CLI commands:',
            '  <span class="t-cyan">whoami</span>    - Core background & profile summary',
            '  <span class="t-cyan">skills</span>    - Technical stack & capabilities matrix',
            '  <span class="t-cyan">projects</span>  - Featured live systems & repositories',
            '  <span class="t-cyan">status</span>    - Real-time telemetry & availability',
            '  <span class="t-cyan">contact</span>   - Communication links & social nodes',
            '  <span class="t-cyan">clear</span>     - Clear terminal buffer'
        ]
    };

    function appendTerminalOutput(cmd, lines) {
        if (!terminalBody) return;

        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-row user-cmd';
        cmdLine.innerHTML = `<span class="t-prompt">rajiv@sys-core:~$</span> <span class="t-cmd">${escapeHTML(cmd)}</span>`;
        terminalBody.appendChild(cmdLine);

        lines.forEach(line => {
            const respLine = document.createElement('div');
            respLine.className = 'terminal-row resp-line';
            respLine.innerHTML = line;
            terminalBody.appendChild(respLine);
        });

        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function executeCommand(inputCmd) {
        const cleanCmd = inputCmd.trim().toLowerCase();
        if (!cleanCmd) return;

        if (cleanCmd === 'clear') {
            if (terminalBody) terminalBody.innerHTML = '';
            return;
        }

        if (commands[cleanCmd]) {
            appendTerminalOutput(cleanCmd, commands[cleanCmd]);
        } else {
            appendTerminalOutput(cleanCmd, [
                `<span class="t-err">Command not found: "${escapeHTML(cleanCmd)}". Type <span class="t-cyan">'help'</span> for operational commands.</span>`
            ]);
        }
    }

    terminalForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!terminalInput) return;
        executeCommand(terminalInput.value);
        terminalInput.value = '';
    });

    cmdChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            if (cmd) executeCommand(cmd);
        });
    });


    /* =========================================
       11. Interactive Code Workbench IDE
       ========================================= */
    const ideTabs   = document.querySelectorAll('.ide-tab');
    const ideCode   = document.getElementById('ide-code');
    const ideLines  = document.getElementById('ide-lines');
    const idePath   = document.getElementById('ide-filepath');
    const copyBtn   = document.getElementById('btn-copy-code');

    const snippets = {
        'main.py': {
            path: 'src/services/circulation_engine.py',
            code: `<span class="tok-cm"># NexLib Core Library Service Engine - Production Logic</span>
<span class="tok-kw">from</span> dataclasses <span class="tok-kw">import</span> dataclass
<span class="tok-kw">from</span> datetime <span class="tok-kw">import</span> datetime, date
<span class="tok-kw">from</span> typing <span class="tok-kw">import</span> Dict, Any

<span class="tok-type">@dataclass</span>
<span class="tok-kw">class</span> <span class="tok-fn">CirculationRecord</span>:
    circulation_id: <span class="tok-type">str</span>
    book_id: <span class="tok-type">str</span>
    borrower_id: <span class="tok-type">str</span>
    issue_date: <span class="tok-type">date</span>
    due_date: <span class="tok-type">date</span>
    fine_rate_per_week: <span class="tok-type">float</span> = <span class="tok-num">100.00</span>  <span class="tok-cm"># Standard ₹100/wk</span>

    <span class="tok-kw">def</span> <span class="tok-fn">compute_penalty</span>(<span class="tok-var">self</span>, return_date: <span class="tok-type">date</span>) -&gt; Dict[<span class="tok-type">str</span>, Any]:
        <span class="tok-str">"""Computes overdue weeks & monetary penalty with strict validation."""</span>
        <span class="tok-kw">if</span> return_date &lt;= <span class="tok-var">self</span>.due_date:
            <span class="tok-kw">return</span> {<span class="tok-str">"overdue"</span>: <span class="tok-kw">False</span>, <span class="tok-str">"penalty"</span>: <span class="tok-num">0.00</span>, <span class="tok-str">"days_late"</span>: <span class="tok-num">0</span>}

        delta_days = (return_date - <span class="tok-var">self</span>.due_date).days
        overdue_weeks = ((delta_days - <span class="tok-num">1</span>) // <span class="tok-num">7</span>) + <span class="tok-num">1</span>
        total_fine = overdue_weeks * <span class="tok-var">self</span>.fine_rate_per_week

        <span class="tok-kw">return</span> {
            <span class="tok-str">"overdue"</span>: <span class="tok-kw">True</span>,
            <span class="tok-str">"days_late"</span>: delta_days,
            <span class="tok-str">"overdue_weeks"</span>: overdue_weeks,
            <span class="tok-str">"total_fine"</span>: round(total_fine, <span class="tok-num">2</span>),
            <span class="tok-str">"status"</span>: <span class="tok-str">"ACCRUED"</span>
        }`
        },
        'schema.sql': {
            path: 'database/schema_production.sql',
            code: `<span class="tok-cm">-- Relational Schema: Production Architecture (3NF Compliant)</span>
<span class="tok-kw">CREATE TABLE IF NOT EXISTS</span> <span class="tok-fn">system_users</span> (
    user_id <span class="tok-type">VARCHAR</span>(<span class="tok-num">36</span>) <span class="tok-kw">PRIMARY KEY</span>,
    full_name <span class="tok-type">VARCHAR</span>(<span class="tok-num">120</span>) <span class="tok-kw">NOT NULL</span>,
    email <span class="tok-type">VARCHAR</span>(<span class="tok-num">160</span>) <span class="tok-kw">UNIQUE NOT NULL</span>,
    access_level <span class="tok-type">ENUM</span>(<span class="tok-str">'admin'</span>, <span class="tok-str">'faculty'</span>, <span class="tok-str">'student'</span>) <span class="tok-kw">DEFAULT</span> <span class="tok-str">'student'</span>,
    created_at <span class="tok-type">TIMESTAMP</span> <span class="tok-kw">DEFAULT CURRENT_TIMESTAMP</span>
);

<span class="tok-kw">CREATE TABLE IF NOT EXISTS</span> <span class="tok-fn">book_inventory</span> (
    isbn <span class="tok-type">VARCHAR</span>(<span class="tok-num">20</span>) <span class="tok-kw">PRIMARY KEY</span>,
    title <span class="tok-type">VARCHAR</span>(<span class="tok-num">255</span>) <span class="tok-kw">NOT NULL</span>,
    author <span class="tok-type">VARCHAR</span>(<span class="tok-num">180</span>) <span class="tok-kw">NOT NULL</span>,
    total_copies <span class="tok-type">INT UNSIGNED</span> <span class="tok-kw">DEFAULT</span> <span class="tok-num">1</span>,
    available_copies <span class="tok-type">INT UNSIGNED</span> <span class="tok-kw">DEFAULT</span> <span class="tok-num">1</span>
);

<span class="tok-kw">CREATE TABLE IF NOT EXISTS</span> <span class="tok-fn">circulation_audit</span> (
    transaction_id <span class="tok-type">VARCHAR</span>(<span class="tok-num">36</span>) <span class="tok-kw">PRIMARY KEY</span>,
    isbn <span class="tok-type">VARCHAR</span>(<span class="tok-num">20</span>) <span class="tok-kw">NOT NULL</span>,
    user_id <span class="tok-type">VARCHAR</span>(<span class="tok-num">36</span>) <span class="tok-kw">NOT NULL</span>,
    issue_date <span class="tok-type">DATE</span> <span class="tok-kw">NOT NULL</span>,
    due_date <span class="tok-type">DATE</span> <span class="tok-kw">NOT NULL</span>,
    return_date <span class="tok-type">DATE NULL</span>,
    fine_assessed <span class="tok-type">DECIMAL</span>(<span class="tok-num">8</span>, <span class="tok-num">2</span>) <span class="tok-kw">DEFAULT</span> <span class="tok-num">0.00</span>,
    <span class="tok-kw">FOREIGN KEY</span> (isbn) <span class="tok-kw">REFERENCES</span> <span class="tok-fn">book_inventory</span>(isbn),
    <span class="tok-kw">FOREIGN KEY</span> (user_id) <span class="tok-kw">REFERENCES</span> <span class="tok-fn">system_users</span>(user_id) <span class="tok-kw">ON DELETE CASCADE</span>
);`
        },
        'routes.py': {
            path: 'src/api/flight_routes.py',
            code: `<span class="tok-cm"># FlightRadar24 Live Avionics & Travel Dispatch API Router</span>
<span class="tok-kw">from</span> flask <span class="tok-kw">import</span> Blueprint, jsonify, request
<span class="tok-kw">import</span> requests, os

travel_router = <span class="tok-fn">Blueprint</span>(<span class="tok-str">'travel_router'</span>, __name__, url_prefix=<span class="tok-str">'/api/v2'</span>)

<span class="tok-type">@travel_router.route</span>(<span class="tok-str">'/avionics/live'</span>, methods=[<span class="tok-str">'GET'</span>])
<span class="tok-kw">def</span> <span class="tok-fn">fetch_live_flights</span>():
    <span class="tok-str">"""Fetches real-time flight telemetry coordinates via proxy."""</span>
    bbox = request.args.get(<span class="tok-str">'bbox'</span>, <span class="tok-str">'28.70,77.10,12.97,77.59'</span>)
    rapidapi_key = os.getenv(<span class="tok-str">'FLIGHTRADAR_API_KEY'</span>)
    
    <span class="tok-kw">try</span>:
        upstream = requests.get(
            <span class="tok-str">f'https://flightradar24-proxy.internal/v1/zones/{bbox}'</span>,
            headers={<span class="tok-str">'X-RapidAPI-Key'</span>: rapidapi_key},
            timeout=<span class="tok-num">4.5</span>
        )
        upstream.raise_for_status()
        radar_feed = upstream.json().get(<span class="tok-str">'aircraft'</span>, [])
        
        <span class="tok-kw">return</span> jsonify({
            <span class="tok-str">'status'</span>: <span class="tok-str">'HEALTHY'</span>,
            <span class="tok-str">'active_aircraft'</span>: len(radar_feed),
            <span class="tok-str">'telemetry'</span>: radar_feed
        }), <span class="tok-num">200</span>
    <span class="tok-kw">except</span> requests.RequestException <span class="tok-kw">as</span> err:
        <span class="tok-kw">return</span> jsonify({<span class="tok-str">'status'</span>: <span class="tok-str">'FAIL'</span>, <span class="tok-str">'error'</span>: str(err)}), <span class="tok-num">503</span>`
        },
        'config.json': {
            path: 'config/system_telemetry.json',
            code: `{
  <span class="tok-type">"system_telemetry"</span>: {
    <span class="tok-str">"node_id"</span>: <span class="tok-str">"rajiv-production-01"</span>,
    <span class="tok-str">"architecture"</span>: <span class="tok-str">"Modular Micro-MVC / Python 3.12"</span>,
    <span class="tok-str">"engineer"</span>: <span class="tok-str">"Rajiv Kumar"</span>,
    <span class="tok-str">"degree"</span>: <span class="tok-str">"B.Tech Computer Science &amp; Engineering"</span>,
    <span class="tok-str">"institution"</span>: <span class="tok-str">"Lovely Professional University"</span>,
    <span class="tok-str">"performance_metrics"</span>: {
      <span class="tok-str">"average_latency_ms"</span>: <span class="tok-num">18.4</span>,
      <span class="tok-str">"uptime_sla"</span>: <span class="tok-str">"99.95%"</span>,
      <span class="tok-str">"verified_certifications"</span>: <span class="tok-num">5</span>,
      <span class="tok-str">"hackathon_placement"</span>: <span class="tok-str">"5th / 200+ Developers"</span>
    },
    <span class="tok-str">"runtime_stack"</span>: {
      <span class="tok-str">"backend"</span>: [<span class="tok-str">"Python"</span>, <span class="tok-str">"Flask"</span>, <span class="tok-str">"Gunicorn"</span>, <span class="tok-str">"Jinja2"</span>],
      <span class="tok-str">"database"</span>: [<span class="tok-str">"MySQL"</span>, <span class="tok-str">"SQLite3"</span>, <span class="tok-str">"ACID Compliance"</span>],
      <span class="tok-str">"analytics"</span>: [<span class="tok-str">"Power BI"</span>, <span class="tok-str">"Pandas"</span>, <span class="tok-str">"Jupyter Notebook"</span>]
    }
  }
}`
        }
    };

    function updateCodeView(tabName) {
        if (!snippets[tabName] || !ideCode || !ideLines) return;
        const snip = snippets[tabName];
        ideCode.innerHTML = snip.code;
        if (idePath) idePath.textContent = snip.path;

        // Generate line numbers
        const lineCount = snip.code.split('\n').length;
        let lineHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            lineHTML += `<div>${i}</div>`;
        }
        ideLines.innerHTML = lineHTML;
    }

    ideTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            ideTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const file = tab.getAttribute('data-file');
            updateCodeView(file);
        });
    });

    // Copy Code Button
    copyBtn?.addEventListener('click', () => {
        if (!ideCode) return;
        const text = ideCode.innerText;
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        });
    });

    // Initialize with first tab
    updateCodeView('main.py');

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }

});
