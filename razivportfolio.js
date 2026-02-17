document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Custom Cursor & Magnetic Elements
       ========================================= */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows smoothly
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 400, fill: "forwards" });
    });

    // Magnetic Button Effect
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move button slightly towards cursor
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

            // Expand cursor
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'rgba(0, 242, 255, 0.1)';
        });
    });


    /* =========================================
       2. Hacker Text Scramble Effect (Role)
       ========================================= */
    const textElement = document.querySelector('.typing-text');
    const roles = ["Data Science Engineer", "Machine Learning Expert", "Python Developer", "Full Stack Engineer"];
    let roleIndex = 0;

    // Characters to use for scrambling
    const chars = "!@#$%^&*()_+-=[]{}|;':,./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    function scrambleText(targetText) {
        let iterations = 0;
        const interval = setInterval(() => {
            textElement.innerText = targetText
                .split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return targetText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");

            if (iterations >= targetText.length) {
                clearInterval(interval);
                // Wait then next role
                setTimeout(() => {
                    roleIndex = (roleIndex + 1) % roles.length;
                    scrambleText(roles[roleIndex]);
                }, 3000);
            }

            iterations += 1 / 3; // Speed of resolve
        }, 30);
    }

    // Start Scramble Loop
    scrambleText(roles[0]);


    /* =========================================
       3. 3D Tilt Effect for Cards
       ========================================= */
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Max rotation degrees
            const rotateX = ((y - centerY) / centerY) * -10; // Invert Y for correct tilt
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });


    /* =========================================
       4. Neural Network Particle System
       ========================================= */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;

    // Resize
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
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1.5 - 0.75;
            this.speedY = Math.random() * 1.5 - 0.75;
            this.color = '#00f2ff'; // Cyan
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Boundary Logic
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
        const numberOfParticles = (canvas.height * canvas.width) / 10000; // Higher density
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = dx * dx + dy * dy;

                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    let opacityValue = 1 - (distance / 25000);
                    if (opacityValue > 0) {
                        ctx.strokeStyle = `rgba(0, 242, 255, ${opacityValue * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Add a very subtle trail effect for "speed" feel
        // ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
        // ctx.fillRect(0,0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    /* =========================================
       5. Scroll Reveal Animations
       ========================================= */
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0) scale(1)";

                // Trigger count up if it's a number
                if (entry.target.classList.contains('stat-item')) {
                    const counter = entry.target.querySelector('.count-up');
                    if (counter) runCounter(counter);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.card, .about-text, .skills-wrapper, .section-title, .contact-item, .stat-item');

    animateElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(40px) scale(0.95)";
        el.style.transition = "all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)";
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
});
