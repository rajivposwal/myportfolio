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
       4. Infinity Cube (Rotating Hypercube)
       ========================================= */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 4D Tesseract vertices
    const points = [];
    for (let i = 0; i < 16; i++) {
        points.push([
            (i & 1) ? 1 : -1,
            (i & 2) ? 1 : -1,
            (i & 4) ? 1 : -1,
            (i & 8) ? 1 : -1
        ]);
    }

    let angle = 0;

    function drawInfinityCube() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const scale = Math.min(canvas.width, canvas.height) / 5;
        
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)'; // Orange glow lines
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f97316';
        ctx.fillStyle = '#fca5a5'; // Bright orange core points
        
        angle += 0.005; // Slow ambient rotation
        
        const projected2D = [];
        
        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            
            // XW Rotation
            let x0 = p[0] * Math.cos(angle) - p[3] * Math.sin(angle);
            let w0 = p[0] * Math.sin(angle) + p[3] * Math.cos(angle);
            let y0 = p[1];
            let z0 = p[2];
            
            // YZ Rotation
            let y1 = y0 * Math.cos(angle*0.8) - z0 * Math.sin(angle*0.8);
            let z1 = y0 * Math.sin(angle*0.8) + z0 * Math.cos(angle*0.8);
            let x1 = x0;
            let w1 = w0;
            
            // ZW Rotation
            let z2 = z1 * Math.cos(angle*0.5) - w1 * Math.sin(angle*0.5);
            let w2 = z1 * Math.sin(angle*0.5) + w1 * Math.cos(angle*0.5);
            let x2 = x1;
            let y2 = y1;
            
            // 4D to 3D Projection
            let d4 = 3.5;
            let w_proj = 1 / (d4 - w2);
            
            let x3 = x2 * w_proj;
            let y3 = y2 * w_proj;
            let z3 = z2 * w_proj;
            
            // 3D to 2D Projection
            let d3 = 3;
            let z_proj = 1 / (d3 - z3);
            
            let px = x3 * z_proj * scale + cx;
            let py = y3 * z_proj * scale + cy;
            
            projected2D.push([px, py]);
            
            // Draw Vertex
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Connect the 32 edges of the hypercube
        ctx.beginPath();
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 4; j++) {
                let neighbor = i ^ (1 << j);
                if (i < neighbor) {
                    ctx.moveTo(projected2D[i][0], projected2D[i][1]);
                    ctx.lineTo(projected2D[neighbor][0], projected2D[neighbor][1]);
                }
            }
        }
        ctx.stroke();
        
        requestAnimationFrame(drawInfinityCube);
    }
    
    drawInfinityCube();


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
