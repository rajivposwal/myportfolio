document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Soot Sprite Cursor (Replacing Dot)
       ========================================= */
    const cursorDot = document.querySelector('.cursor-dot');
    // If you want a soot sprite cursor, you'd add an image here and update CSS
    // keeping it simple for now as requested by style, just basic tracking or none

    /* =========================================
       2. Soft Typing Effect (Replacing Matrix)
       ========================================= */
    const textElement = document.querySelector('.typing-text');
    const roles = ["Data Science Engineer", "Creative Developer", "Problem Solver", "Dreamer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            textElement.textContent = currentRole.substring(0, charIndex--);
            typeSpeed = 50;
        } else {
            textElement.textContent = currentRole.substring(0, charIndex++);
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();


    /* =========================================
       3. Gentle Float Animation (Replacing Tilt)
       ========================================= */
    // Instead of active tilt on mousemove which is very "tech", 
    // we use CSS transitions for hover lift. 
    // This JS adds a subtle continuous float to images/cards

    const floatElements = document.querySelectorAll('.image-wrapper, .glass-card, .project-card');

    floatElements.forEach((el, index) => {
        el.style.animation = `float 6s ease-in-out ${index * 0.5}s infinite`;
    });

    // Add keyframes dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
    `;
    document.head.appendChild(styleSheet);


    /* =========================================
    /* =========================================
       4. Universal Data Network
       ========================================= */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; // Node size
            this.speedX = (Math.random() - 0.5) * 0.5; 
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = '#3b82f6'; // Universal blue nodes
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }
        draw() {
            ctx.globalAlpha = 1;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 10000;
        if (numberOfParticles > 120) numberOfParticles = 120; // Cap to avoid lag
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < 12000) {
                    opacityValue = 1 - (distance / 12000);
                    ctx.strokeStyle = 'rgba(59, 130, 246,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connect();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    /* =========================================
       5. Scroll Reveal (Soft Fade)
       ========================================= */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                // Count up logic
                if (entry.target.classList.contains('stat-item')) {
                    const counter = entry.target.querySelector('.count-up');
                    if (counter) runCounter(counter); // Keep existing counter logic if element exists
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.hero-text, .image-wrapper, .section-title, .glass-card, .project-card, .contact-item');

    animateElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)"; // Gentle rise
        el.style.transition = "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // Smooth easing
        observer.observe(el);
    });

    function runCounter(el) {
        const target = +el.getAttribute('data-target');
        const increment = target / 50;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target + "+";
                clearInterval(timer);
            } else {
                el.innerText = Math.ceil(current);
            }
        }, 30);
    }

    /* =========================================
       6. Theme Toggle (Dark / Light)
       ========================================= */
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        const root = document.documentElement;

        // Check Local Storage on load
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
