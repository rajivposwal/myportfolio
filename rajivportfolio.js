document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Scroll Progress Bar
       ========================================= */
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
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
            const top = sec.offsetTop - 120;
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
            "Data Science Engineer",
            "Machine Learning Developer",
            "Creative Problem Solver",
            "Web Developer"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 120;

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                textElement.textContent = currentRole.substring(0, charIndex--);
                typeSpeed = 55;
            } else {
                textElement.textContent = currentRole.substring(0, charIndex++);
                typeSpeed = 130;
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

});
