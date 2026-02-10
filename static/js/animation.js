/* ===== ADVANCED ANIMATIONS FILE ===== */
/* This file contains GSAP-powered animations and advanced visual effects */

// ===== GSAP TIMELINE SETUP =====
/* Initialize GSAP animations when DOM is ready */
document.addEventListener('DOMContentLoaded', function() {
    
    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
        
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialize all animation systems
        initializeHeroAnimations();      // Hero section entrance animations
        initializeScrollAnimations();    // Scroll-triggered animations
        initializeParticleEffects();     // Particle systems
        initializeHoverEffects();        // Interactive hover animations
        initializeCottageEffects();      // Cottage-specific animations
        
        console.log('🎭 GSAP animations initialized successfully!');
        
    } else {
        console.warn('GSAP not loaded, using CSS fallback animations');
        initializeFallbackAnimations();
    }
});

// ===== HERO SECTION ANIMATIONS =====
/* Advanced entrance animations for hero section */
function initializeHeroAnimations() {
    
    // Create main timeline for hero entrance
    const heroTimeline = gsap.timeline({ 
        delay: 0.5,  // Wait for page to settle
        ease: "power2.out" 
    });
    
    // ===== TITLE ANIMATION SEQUENCE =====
    /* Animate title lines with advanced effects */
    
    // Set initial state for title lines
    gsap.set(".title-line-1, .title-line-2, .title-line-3", {
        opacity: 0,
        y: 50,           // Start below final position
        rotateX: -90,    // Start rotated
        transformOrigin: "50% 100%"  // Rotate from bottom
    });
    
    // Animate title lines in sequence
    heroTimeline
        .to(".title-line-1", {
            duration: 1,
            opacity: 1,
            y: 0,
            rotateX: 0,
            ease: "back.out(1.7)",  // Bounce effect
        })
        .to(".title-line-2", {
            duration: 1,
            opacity: 1,
            y: 0,
            rotateX: 0,
            ease: "back.out(1.7)",
        }, "-=0.7")  // Start 0.7 seconds before previous ends
        .to(".title-line-3", {
            duration: 1,
            opacity: 1,
            y: 0,
            rotateX: 0,
            ease: "back.out(1.7)",
        }, "-=0.7");
    
    // ===== SUBTITLE AND CTA ANIMATIONS =====
    /* Animate supporting elements */
    
    // Set initial state
    gsap.set(".hero-subtitle", {
        opacity: 0,
        y: 30,
        scale: 0.8
    });
    
    gsap.set(".hero-cta", {
        opacity: 0,
        y: 20,
        scale: 0.9
    });
    
    // Animate subtitle
    heroTimeline.to(".hero-subtitle", {
        duration: 0.8,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "power2.out"
    }, "-=0.3");
    
    // Animate CTA button with special effects
    heroTimeline.to(".hero-cta", {
        duration: 0.6,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "elastic.out(1, 0.5)",  // Elastic bounce
        onComplete: function() {
            // Add continuous pulse to CTA button
            gsap.to(".cta-button", {
                duration: 2,
                scale: 1.05,
                ease: "power2.inOut",
                yoyo: true,      // Reverse animation
                repeat: -1       // Infinite repeat
            });
        }
    }, "-=0.2");
    
    // ===== FLOATING MAGNIFIER ANIMATION =====
    /* Animate the floating magnifier with complex motion */
    
    gsap.set(".floating-magnifier", {
        opacity: 0,
        scale: 0,
        rotation: -180
    });
    
    heroTimeline.to(".floating-magnifier", {
        duration: 1.2,
        opacity: 1,
        scale: 1,
        rotation: 0,
        ease: "elastic.out(1, 0.3)"
    }, "-=0.5");
    
    // Continuous floating animation for magnifier
    gsap.to(".floating-magnifier", {
        duration: 4,
        y: "+=20",           // Float up and down
        rotation: "+=10",    // Slight rotation
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });
    
    // ===== DECORATIVE ELEMENTS =====
    /* Animate cottage decorations */
    
    // Animate navigation dots
    gsap.set(".hero-nav-dots .dot", {
        opacity: 0,
        scale: 0
    });
    
    heroTimeline.to(".hero-nav-dots .dot", {
        duration: 0.4,
        opacity: 1,
        scale: 1,
        ease: "back.out(1.7)",
        stagger: 0.1  // Animate each dot with 0.1s delay
    }, "-=0.3");
    
    // ===== PARTICLE ENTRANCE =====
    /* Create particle entrance effect */
    createHeroParticles();
}

// ===== SCROLL-TRIGGERED ANIMATIONS =====
/* Animations that trigger based on scroll position */
function initializeScrollAnimations() {
    
    // ===== SECTION HEADER ANIMATIONS =====
    /* Animate section headers when they come into view */
    
    gsap.utils.toArray(".section-header").forEach(header => {
        
        // Create timeline for each header
        const headerTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: "top 80%",    // Start when top of element is 80% down viewport
                end: "bottom 20%",   // End when bottom is 20% down viewport
                toggleActions: "play none none reverse"
            }
        });
        
        // Find title and subtitle within header
        const title = header.querySelector(".section-title");
        const subtitle = header.querySelector(".section-subtitle");
        
        // Set initial states
        if (title) {
            gsap.set(title, {
                opacity: 0,
                y: 50,
                scale: 0.8
            });
        }
        
        if (subtitle) {
            gsap.set(subtitle, {
                opacity: 0,
                y: 30
            });
        }
        
        // Animate title
        if (title) {
            headerTimeline.to(title, {
                duration: 1,
                opacity: 1,
                y: 0,
                scale: 1,
                ease: "power2.out"
            });
        }
        
        // Animate subtitle
        if (subtitle) {
            headerTimeline.to(subtitle, {
                duration: 0.8,
                opacity: 1,
                y: 0,
                ease: "power2.out"
            }, "-=0.5");
        }
    });
    
    // ===== PROBLEM CARDS ANIMATION =====
    /* Advanced animation for problem identification cards */
    
    gsap.utils.toArray(".problem-card").forEach((card, index) => {
        
        // Create timeline for each card
        const cardTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Get card elements
        const image = card.querySelector(".card-image img");
        const icon = card.querySelector(".problem-icon");
        const title = card.querySelector(".card-title");
        const severity = card.querySelector(".severity");
        const description = card.querySelector(".card-description");
        
        // Set initial states
        gsap.set(card, {
            opacity: 0,
            y: 100,
            rotateY: -15,
            transformOrigin: "center center"
        });
        
        if (image) {
            gsap.set(image, {
                scale: 1.3,
                filter: "blur(5px)"
            });
        }
        
        if (icon) {
            gsap.set(icon, {
                scale: 0,
                rotation: -180
            });
        }
        
        // Animate card entrance
        cardTimeline
            .to(card, {
                duration: 0.8,
                opacity: 1,
                y: 0,
                rotateY: 0,
                ease: "power2.out",
                delay: index * 0.1  // Stagger based on card index
            })
            .to(image, {
                duration: 1,
                scale: 1,
                filter: "blur(0px)",
                ease: "power2.out"
            }, "-=0.6")
            .to(icon, {
                duration: 0.6,
                scale: 1,
                rotation: 0,
                ease: "back.out(1.7)"
            }, "-=0.4")
            .to([title, severity, description], {
                duration: 0.5,
                opacity: 1,
                y: 0,
                ease: "power2.out",
                stagger: 0.1
            }, "-=0.3");
        
        // Add hover animation
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                scale: 1.05,
                rotateY: 5,
                z: 50,
                ease: "power2.out"
            });
            
            gsap.to(image, {
                duration: 0.3,
                scale: 1.1,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.3,
                scale: 1,
                rotateY: 0,
                z: 0,
                ease: "power2.out"
            });
            
            gsap.to(image, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            });
        });
    });
    
    // ===== SERVICE CARDS ANIMATION =====
    /* Advanced animation for service cards */
    
    gsap.utils.toArray(".service-card").forEach((card, index) => {
        
        const cardTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Get card elements
        const icon = card.querySelector(".service-icon");
        const title = card.querySelector(".service-title");
        const description = card.querySelector(".service-description");
        const features = card.querySelectorAll(".feature");
        
        // Set initial states
        gsap.set(card, {
            opacity: 0,
            y: 80,
            scale: 0.8
        });
        
        if (icon) {
            gsap.set(icon, {
                scale: 0,
                rotation: 360
            });
        }
        
        // Animate card
        cardTimeline
            .to(card, {
                duration: 0.8,
                opacity: 1,
                y: 0,
                scale: 1,
                ease: "power2.out",
                delay: index * 0.2
            })
            .to(icon, {
                duration: 0.6,
                scale: 1,
                rotation: 0,
                ease: "elastic.out(1, 0.3)"
            }, "-=0.4")
            .to([title, description], {
                duration: 0.5,
                opacity: 1,
                y: 0,
                ease: "power2.out",
                stagger: 0.1
            }, "-=0.3")
            .to(features, {
                duration: 0.4,
                opacity: 1,
                x: 0,
                ease: "power2.out",
                stagger: 0.05
            }, "-=0.2");
    });
    
    // ===== APP SECTION ANIMATION =====
    /* Animate mobile app showcase */
    
    const appContent = document.querySelector(".app-content");
    const appMockup = document.querySelector(".app-mockup");
    
    if (appContent && appMockup) {
        
        const appTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".app-section",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Set initial states
        gsap.set(appContent, {
            opacity: 0,
            x: -100
        });
        
        gsap.set(appMockup, {
            opacity: 0,
            x: 100,
            rotateY: -30
        });
        
        // Animate app content
        appTimeline
            .to(appContent, {
                duration: 1,
                opacity: 1,
                x: 0,
                ease: "power2.out"
            })
            .to(appMockup, {
                duration: 1,
                opacity: 1,
                x: 0,
                rotateY: 0,
                ease: "power2.out"
            }, "-=0.5");
        
        // Add 3D phone rotation effect
        gsap.to(".phone-3d", {
            duration: 8,
            rotateY: "+=360",
            ease: "none",
            repeat: -1
        });
    }
}

// ===== PARTICLE EFFECTS =====
/* Create and manage particle systems */
function initializeParticleEffects() {
    
    // ===== SERVICES SECTION PARTICLES =====
    /* Create floating particles for services section */
    createServicesParticles();
    
    // ===== HERO PARTICLES =====
    /* Create magical cottage particles for hero */
    createCottageParticles();
}

// Create particles for services section
function createServicesParticles() {
    
    const servicesSection = document.querySelector(".services-section");
    const particlesContainer = document.getElementById("particles");
    
    if (!servicesSection || !particlesContainer) return;
    
    // Create 50 floating particles
    for (let i = 0; i < 50; i++) {
        
        // Create particle element
        const particle = document.createElement("div");
        particle.className = "particle";
        
        // Style particle
        particle.style.position = "absolute";
        particle.style.width = Math.random() * 4 + 2 + "px";
        particle.style.height = particle.style.width;
        particle.style.background = "rgba(255, 255, 255, 0.1)";
        particle.style.borderRadius = "50%";
        particle.style.pointerEvents = "none";
        
        // Random starting position
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        
        // Add to container
        particlesContainer.appendChild(particle);
        
        // Animate particle with GSAP
        gsap.to(particle, {
            duration: Math.random() * 20 + 10,  // 10-30 seconds
            y: "-=200",                          // Float upward
            x: "+=100",                          // Drift sideways
            opacity: 0,                          // Fade out
            ease: "none",
            repeat: -1,                          // Infinite repeat
            delay: Math.random() * 5             // Random start delay
        });
        
        // Add subtle rotation
        gsap.to(particle, {
            duration: Math.random() * 10 + 5,
            rotation: "+=360",
            ease: "none",
            repeat: -1
        });
    }
}

// Create hero particles
function createHeroParticles() {
    
    const hero = document.querySelector(".hero");
    if (!hero) return;
    
    // Create particles container
    const particlesContainer = document.createElement("div");
    particlesContainer.className = "hero-particles";
    particlesContainer.style.position = "absolute";
    particlesContainer.style.top = "0";
    particlesContainer.style.left = "0";
    particlesContainer.style.width = "100%";
    particlesContainer.style.height = "100%";
    particlesContainer.style.pointerEvents = "none";
    particlesContainer.style.zIndex = "2";
    
    hero.appendChild(particlesContainer);
    
    // Create cottage-themed particles (leaves, stars, etc.)
    const particleTypes = ["🍃", "✨", "🌟", "💫"];
    
    for (let i = 0; i < 30; i++) {
        
        const particle = document.createElement("div");
        particle.textContent = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        particle.style.position = "absolute";
        particle.style.fontSize = Math.random() * 20 + 10 + "px";
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        particle.style.pointerEvents = "none";
        
        // Random position
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        
        particlesContainer.appendChild(particle);
        
        // Animate with GSAP
        gsap.to(particle, {
            duration: Math.random() * 15 + 10,
            y: "-=300",
            x: Math.random() * 200 - 100,
            rotation: "+=360",
            opacity: 0,
            ease: "none",
            repeat: -1,
            delay: Math.random() * 10
        });
    }
}

// ===== COTTAGE-SPECIFIC EFFECTS =====
/* Special animations that enhance the cottage theme */
function initializeCottageEffects() {
    
    // ===== WOOD GRAIN ANIMATION =====
    /* Animate wood texture elements */
    animateWoodTexture();
    
    // ===== SEASONAL EFFECTS =====
    /* Add seasonal cottage effects */
    addSeasonalEffects();
    
    // ===== COZY LIGHTING EFFECTS =====
    /* Create warm, cozy lighting animations */
    createCozyLighting();
}

// Animate wood texture elements
function animateWoodTexture() {
    
    const woodElements = document.querySelectorAll(".texture-overlay.wood-grain");
    
    woodElements.forEach(element => {
        
        // Create subtle wood grain movement
        gsap.to(element, {
            duration: 20,
            backgroundPosition: "20px 0px",
            ease: "none",
            repeat: -1,
            yoyo: true
        });
    });
}

// Add seasonal cottage effects
function addSeasonalEffects() {
    
    // Determine season based on date
    const month = new Date().getMonth();
    let season;
    
    if (month >= 2 && month <= 4) season = "spring";
    else if (month >= 5 && month <= 7) season = "summer";
    else if (month >= 8 && month <= 10) season = "autumn";
    else season = "winter";
    
    // Add season-specific class to body
    document.body.classList.add(`season-${season}`);
    
    // Create season-specific effects
    switch (season) {
        case "spring":
            createSpringEffects();
            break;
        case "summer":
            createSummerEffects();
            break;
        case "autumn":
            createAutumnEffects();
            break;
        case "winter":
            createWinterEffects();
            break;
    }
    
    console.log(`🌿 ${season.charAt(0).toUpperCase() + season.slice(1)} cottage effects activated`);
}

// Spring effects
function createSpringEffects() {
    
    // Add blooming flower particles
    const flowers = ["🌸", "🌺", "🌻", "🌼"];
    createSeasonalParticles(flowers, 20, "spring-flowers");
    
    // Gentle color transitions
    gsap.to(":root", {
        duration: 5,
        "--cottage-sage": "#a8d5a8",  // Brighter green
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
    });
}

// Summer effects  
function createSummerEffects() {
    
    // Add buzzing bee and butterfly particles
    const insects = ["🐝", "🦋", "🐛"];
    createSeasonalParticles(insects, 15, "summer-insects");
    
    // Warm lighting effect
    gsap.to(":root", {
        duration: 3,
        "--cottage-gold": "#f4d03f",  // Warmer gold
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
    });
}

// Autumn effects
function createAutumnEffects() {
    
    // Enhanced falling leaves (already created in CSS, but add more)
    const leaves = ["🍂", "🍁", "🍃"];
    createSeasonalParticles(leaves, 30, "autumn-leaves");
    
    // Cozy orange glow
    gsap.to(":root", {
        duration: 4,
        "--cottage-terracotta": "#e67e22",  // Deeper orange
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
    });
}

// Winter effects
function createWinterEffects() {
    
    // Add snowflake particles
    const snowflakes = ["❄️", "❅", "❆"];
    createSeasonalParticles(snowflakes, 40, "winter-snow");
    
    // Cool blue tones
    gsap.to(":root", {
        duration: 6,
        "--modern-blue": "#5dade2",  // Cooler blue
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
    });
}

// Generic function to create seasonal particles
function createSeasonalParticles(particleArray, count, className) {
    
    const hero = document.querySelector(".hero");
    if (!hero) return;
    
    const container = document.createElement("div");
    container.className = `seasonal-particles ${className}`;
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "3";
    
    hero.appendChild(container);
    
    for (let i = 0; i < count; i++) {
        
        const particle = document.createElement("div");
        particle.textContent = particleArray[Math.floor(Math.random() * particleArray.length)];
        particle.style.position = "absolute";
        particle.style.fontSize = Math.random() * 15 + 8 + "px";
        particle.style.opacity = Math.random() * 0.7 + 0.3;
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = "-20px";
        
        container.appendChild(particle);
        
        // Animate falling/floating
        gsap.to(particle, {
            duration: Math.random() * 10 + 5,
            y: "100vh",
            x: Math.random() * 100 - 50,
            rotation: "+=360",
            ease: "none",
            repeat: -1,
            delay: Math.random() * 5
        });
    }
}

// Create cozy lighting effects
function createCozyLighting() {
    
    // Add warm glow to cottage elements
    const cottageElements = document.querySelectorAll(
        ".problem-icon.cottage-wood, .problem-icon.cottage-home, .service-icon"
    );
    
    cottageElements.forEach(element => {
        
        // Create pulsing glow effect
        gsap.to(element, {
            duration: 3,
            boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)",
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true
        });
    });
    
    // Add candlelight flicker to CTA buttons
    const ctaButtons = document.querySelectorAll(".cta-button");
    
    ctaButtons.forEach(button => {
        
        gsap.to(button, {
            duration: 0.1,
            filter: "brightness(1.1)",
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            repeatDelay: Math.random() * 2
        });
    });
}

// ===== HOVER EFFECTS =====
/* Advanced hover animations for interactive elements */
function initializeHoverEffects() {
    
    // ===== ENHANCED BUTTON HOVERS =====
    /* Advanced button hover effects */
    const buttons = document.querySelectorAll(".cta-button, .app-button");
    
    buttons.forEach(button => {
        
        button.addEventListener('mouseenter', function() {
            
            // Scale and glow effect
            gsap.to(this, {
                duration: 0.3,
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(52, 152, 219, 0.4)",
                ease: "power2.out"
            });
            
            // Create ripple effect background
            const ripple = document.createElement("div");
            ripple.style.position = "absolute";
            ripple.style.top = "50%";
            ripple.style.left = "50%";
            ripple.style.width = "0";
            ripple.style.height = "0";
            ripple.style.background = "rgba(255, 255, 255, 0.2)";
            ripple.style.borderRadius = "50%";
            ripple.style.transform = "translate(-50%, -50%)";
            ripple.style.pointerEvents = "none";
            
            this.style.position = "relative";
            this.style.overflow = "hidden";
            this.appendChild(ripple);
            
            gsap.to(ripple, {
                duration: 0.6,
                width: "200px",
                height: "200px",
                opacity: 0,
                ease: "power2.out",
                onComplete: () => ripple.remove()
            });
        });
        
        button.addEventListener('mouseleave', function() {
            
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                ease: "power2.out"
            });
        });
    });
    
    // ===== NAVIGATION LINK HOVERS =====
    /* Advanced nav link hover effects */
    const navLinks = document.querySelectorAll(".nav-link");
    
    navLinks.forEach(link => {
        
        link.addEventListener('mouseenter', function() {
            
            gsap.to(this, {
                duration: 0.3,
                y: -2,
                color: "#3498db",
                ease: "power2.out"
            });
        });
        
        link.addEventListener('mouseleave', function() {
            
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                color: "#2c3e50",
                ease: "power2.out"
            });
        });
    });
    
    // ===== LOGO HOVER EFFECT =====
    /* Animated logo hover */
    const logo = document.querySelector(".logo");
    
    if (logo) {
        
        logo.addEventListener('mouseenter', function() {
            
            gsap.to(".logo-cottage", {
                duration: 0.4,
                rotation: -5,
                transformOrigin: "center center",
                ease: "power2.out"
            });
            
            gsap.to(".logo-check", {
                duration: 0.4,
                rotation: 5,
                transformOrigin: "center center",
                ease: "power2.out"
            });
        });
        
        logo.addEventListener('mouseleave', function() {
            
            gsap.to(".logo-cottage, .logo-check", {
                duration: 0.4,
                rotation: 0,
                ease: "power2.out"
            });
        });
    }
}

// ===== FALLBACK ANIMATIONS =====
/* CSS-based animations when GSAP is not available */
function initializeFallbackAnimations() {
    
    // Add fallback CSS animations
    const fallbackCSS = `
        <style>
        @keyframes fallbackFadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fallbackSlideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fallbackSlideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .hero-title {
            animation: fallbackFadeInUp 1s ease-out 0.5s both;
        }
        
        .hero-subtitle {
            animation: fallbackFadeInUp 1s ease-out 0.8s both;
        }
        
        .hero-cta {
            animation: fallbackFadeInUp 1s ease-out 1.1s both;
        }
        
        .problem-card {
            animation: fallbackFadeInUp 0.8s ease-out both;
        }
        
        .service-card {
            animation: fallbackSlideInLeft 0.8s ease-out both;
        }
        
        .app-content {
            animation: fallbackSlideInLeft 1s ease-out both;
        }
        
        .app-mockup {
            animation: fallbackSlideInRight 1s ease-out both;
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', fallbackCSS);
    
    console.log('📱 Fallback CSS animations applied');
}

// ===== PERFORMANCE OPTIMIZATION =====
/* Optimize animations for better performance */

// Pause animations when page is not visible
document.addEventListener('visibilitychange', function() {
    
    if (document.hidden) {
        // Page is hidden, pause animations
        gsap.globalTimeline.pause();
        console.log('⏸️ Animations paused (page hidden)');
    } else {
        // Page is visible, resume animations
        gsap.globalTimeline.resume();
        console.log('▶️ Animations resumed (page visible)');
    }
});

// Reduce animations on low-end devices
function optimizeForDevice() {
    
    // Check device performance indicators
    const isLowEnd = (
        navigator.hardwareConcurrency <= 2 ||  // Low CPU cores
        navigator.deviceMemory <= 2 ||         // Low RAM
        /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) // Mobile device
    );
    
    if (isLowEnd) {
        
        // Reduce animation complexity
        gsap.globalTimeline.timeScale(0.5);  // Slow down animations
        
        // Disable some effects
        document.body.classList.add('reduced-motion');
        
        console.log('📱 Animations optimized for low-end device');
    }
}

// Initialize device optimization
optimizeForDevice();

// ===== ANIMATION UTILITIES =====
/* Utility functions for creating consistent animations */

// Create staggered fade-in animation
function createStaggeredFadeIn(elements, delay = 0.1) {
    
    gsap.set(elements, { opacity: 0, y: 30 });
    
    return gsap.to(elements, {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: "power2.out",
        stagger: delay
    });
}

// Create bounce entrance animation
function createBounceEntrance(element) {
    
    gsap.set(element, { scale: 0, rotation: 180 });
    
    return gsap.to(element, {
        duration: 0.8,
        scale: 1,
        rotation: 0,
        ease: "elastic.out(1, 0.3)"
    });
}

// Create slide animation from direction
function createSlideIn(element, direction = "left") {
    
    const positions = {
        left: { x: -100, y: 0 },
        right: { x: 100, y: 0 },
        top: { x: 0, y: -100 },
        bottom: { x: 0, y: 100 }
    };
    
    const pos = positions[direction];
    
    gsap.set(element, { opacity: 0, x: pos.x, y: pos.y });
    
    return gsap.to(element, {
        duration: 0.8,
        opacity: 1,
        x: 0,
        y: 0,
        ease: "power2.out"
    });
}

// Export utility functions for use in other files
window.cottageAnimations = {
    staggeredFadeIn: createStaggeredFadeIn,
    bounceEntrance: createBounceEntrance,
    slideIn: createSlideIn
};

console.log('🎭 Animation utilities ready for use');