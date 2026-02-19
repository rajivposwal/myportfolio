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
       4. Fireflies / Dust Motes (Replacing Neural Network)
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
            this.size = Math.random() * 3 + 1; // Variable size
            this.speedX = Math.random() * 0.5 - 0.25; // Slow drift
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(255, 248, 225, ${Math.random() * 0.5 + 0.1})`; // Warm light
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around screen
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = 50; // Sparse, magical feel
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
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

    // Simple counter for stats
    function runCounter(el) {
        // ... (keep simple counter if needed, or remove if not present in HTML)
    }
});
