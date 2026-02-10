/* ===== MAIN JAVASCRIPT FILE ===== */
/* This file handles the core functionality of the cottage-modern website */

// ===== WAIT FOR DOM TO LOAD =====
// Ensure all HTML elements are loaded before running JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== INITIALIZE ALL COMPONENTS =====
    initializeNavigation();      // Setup navigation behavior
    initializeHero();           // Setup hero section animations
    initializeScrollEffects();  // Setup scroll-based animations
    initializeThreeJS();        // Setup 3D effects
    initializeAOS();            // Setup Animate On Scroll library
    initializeMobileMenu();     // Setup mobile navigation
    
    console.log('🏡 CottageCheck website initialized successfully!');
});

// ===== NAVIGATION FUNCTIONALITY =====
/* Handle navigation behavior, including scroll effects and active states */
function initializeNavigation() {
    
    // Get navigation elements from DOM
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // ===== HEADER SCROLL EFFECT =====
    /* Add/remove 'scrolled' class based on scroll position */
    window.addEventListener('scroll', function() {
        
        // Get current scroll position from top
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // If scrolled more than 100 pixels, add 'scrolled' class
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active navigation link based on scroll position
        updateActiveNavigation();
    });
    
    // ===== SMOOTH SCROLLING =====
    /* Enable smooth scrolling for navigation links */
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            
            // Get target from href attribute
            const href = this.getAttribute('href');
            
            // Check if it's an anchor link (starts with #)
            if (href.startsWith('#')) {
                // Prevent default link behavior for anchor links
                e.preventDefault();
                
                // Get target section ID
                const targetSection = document.querySelector(href);
                
                // Only scroll if target section exists
                if (targetSection) {
                    
                    // Calculate target position (accounting for fixed header)
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    // Smooth scroll to target position
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // For page links (ending with .html), let browser handle normally
            
            // Add visual feedback for clicked link
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// ===== UPDATE ACTIVE NAVIGATION =====
/* Highlight the navigation link corresponding to current section */
function updateActiveNavigation() {
    
    // Get all sections with IDs (navigation targets)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Get current scroll position
    const scrollPos = window.pageYOffset + 150; // Offset for header
    
    // Check which section is currently in view
    sections.forEach(section => {
        
        // Get section position and height
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // Check if current scroll position is within this section
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            
            // Remove active class from all navigation links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to corresponding navigation link
            const activeLink = document.querySelector(`[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// ===== HERO SECTION FUNCTIONALITY =====
/* Handle hero section animations and interactions */
function initializeHero() {
    
    // Get hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const ctaButton = document.querySelector('.cta-button');
    const navDots = document.querySelectorAll('.dot');
    
    // ===== TITLE ANIMATION SEQUENCE =====
    /* Animate title lines with staggered timing */
    if (heroTitle) {
        const titleLines = heroTitle.querySelectorAll('[class^="title-line"]');
        
        // Animate each title line with increasing delay
        titleLines.forEach((line, index) => {
            
            // Set initial state (invisible and below final position)
            line.style.opacity = '0';
            line.style.transform = 'translateY(30px)';
            
            // Animate to final state with delay
            setTimeout(() => {
                line.style.transition = 'all 1s ease-out';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, (index + 1) * 200); // 200ms delay between each line
        });
    }
    
    // ===== PARALLAX EFFECT =====
    /* Create parallax scrolling effect for hero background */
    window.addEventListener('scroll', function() {
        
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            // Move background slower than scroll speed for parallax effect
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // ===== HERO NAVIGATION DOTS =====
    /* Handle clicking on hero navigation dots */
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            
            // Remove active class from all dots
            navDots.forEach(d => d.classList.remove('active'));
            
            // Add active class to clicked dot
            this.classList.add('active');
            
            // Here you could add functionality to change hero content
            // For example, switching between different hero slides
            console.log(`Clicked hero slide ${index + 1}`);
        });
    });
    
    // ===== CTA BUTTON ENHANCEMENT =====
    /* Add enhanced interactions to CTA button */
    if (ctaButton) {
        
        // Add ripple effect on click
        ctaButton.addEventListener('click', function(e) {
            
            // Create ripple element
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            // Position ripple at click location
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            ripple.classList.add('ripple');
            
            // Add styles for ripple effect
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'rippleEffect 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            // Add ripple to button and remove after animation
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
}

// ===== SCROLL-BASED EFFECTS =====
/* Handle various scroll-triggered animations and effects */
function initializeScrollEffects() {
    
    // ===== INTERSECTION OBSERVER =====
    /* Observe elements entering/leaving viewport for animations */
    const observerOptions = {
        threshold: 0.1,           // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px'  // Trigger 50px before bottom of viewport
    };
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            
            if (entry.isIntersecting) {
                // Element is entering viewport
                entry.target.classList.add('animate-in');
                
                // Add special effects for different element types
                if (entry.target.classList.contains('problem-card')) {
                    animateProblemCard(entry.target);
                }
                
                if (entry.target.classList.contains('service-card')) {
                    animateServiceCard(entry.target);
                }
                
            } else {
                // Element is leaving viewport
                entry.target.classList.remove('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.problem-card, .service-card, .app-content, .section-header'
    );
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
    
    // ===== SCROLL PROGRESS INDICATOR =====
    /* Show scroll progress (could be added to header) */
    window.addEventListener('scroll', function() {
        
        // Calculate scroll progress as percentage
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Update CSS custom property for progress bar
        document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
    });
}

// ===== PROBLEM CARD ANIMATION =====
/* Animate problem cards when they enter viewport */
function animateProblemCard(card) {
    
    // Get card elements
    const icon = card.querySelector('.problem-icon');
    const title = card.querySelector('.card-title');
    const severity = card.querySelector('.severity');
    
    // Animate icon with bounce effect
    if (icon) {
        icon.style.transform = 'scale(0) rotate(180deg)';
        icon.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }, 100);
    }
    
    // Animate title with slide-in effect
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateX(-20px)';
        title.style.transition = 'all 0.4s ease-out';
        
        setTimeout(() => {
            title.style.opacity = '1';
            title.style.transform = 'translateX(0)';
        }, 200);
    }
    
    // Animate severity badge
    if (severity) {
        severity.style.opacity = '0';
        severity.style.transform = 'translateY(10px)';
        severity.style.transition = 'all 0.4s ease-out';
        
        setTimeout(() => {
            severity.style.opacity = '1';
            severity.style.transform = 'translateY(0)';
        }, 300);
    }
}

// ===== SERVICE CARD ANIMATION =====
/* Animate service cards when they enter viewport */
function animateServiceCard(card) {
    
    // Get card elements
    const icon = card.querySelector('.service-icon');
    const title = card.querySelector('.service-title');
    const features = card.querySelectorAll('.feature');
    
    // Animate icon with pulse effect
    if (icon) {
        icon.style.transform = 'scale(0)';
        icon.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Animate title
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        title.style.transition = 'all 0.4s ease-out';
        
        setTimeout(() => {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 250);
    }
    
    // Animate features with staggered delay
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-20px)';
        feature.style.transition = 'all 0.3s ease-out';
        
        setTimeout(() => {
            feature.style.opacity = '1';
            feature.style.transform = 'translateX(0)';
        }, 350 + (index * 100)); // Staggered delay
    });
}

// ===== THREE.JS INITIALIZATION =====
/* Setup 3D background effects using Three.js */
function initializeThreeJS() {
    
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded, skipping 3D effects');
        return;
    }
    
    // Get canvas element for Three.js
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    // ===== SCENE SETUP =====
    /* Create Three.js scene, camera, and renderer */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,                                    // Field of view
        canvas.offsetWidth / canvas.offsetHeight, // Aspect ratio
        0.1,                                   // Near clipping plane
        1000                                   // Far clipping plane
    );
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,                          // Transparent background
        antialias: true                       // Smooth edges
    });
    
    // Set renderer size to match canvas
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // ===== CREATE 3D COTTAGE ELEMENTS =====
    /* Add floating geometric shapes representing cottage elements */
    const cottageElements = [];
    
    // Create cottage-inspired geometries
    const geometries = [
        new THREE.BoxGeometry(0.5, 0.5, 0.5),      // Cottage blocks
        new THREE.ConeGeometry(0.3, 0.8, 6),       // Roof shapes
        new THREE.CylinderGeometry(0.2, 0.2, 1, 8), // Chimneys
    ];
    
    // Cottage-inspired materials with warm colors
    const materials = [
        new THREE.MeshBasicMaterial({ 
            color: 0x8B4513,           // Cottage brown
            opacity: 0.7, 
            transparent: true 
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x9CAF88,           // Sage green
            opacity: 0.6, 
            transparent: true 
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0xD4AF37,           // Gold accent
            opacity: 0.5, 
            transparent: true 
        }),
    ];
    
    // Create multiple floating cottage elements
    for (let i = 0; i < 15; i++) {
        
        // Randomly select geometry and material
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        
        // Create mesh (3D object)
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position randomly in 3D space
        mesh.position.x = (Math.random() - 0.5) * 20;  // Random X position
        mesh.position.y = (Math.random() - 0.5) * 10;  // Random Y position
        mesh.position.z = (Math.random() - 0.5) * 10;  // Random Z position
        
        // Random rotation for variety
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;
        
        // Store original position for animation
        mesh.userData.originalPosition = mesh.position.clone();
        mesh.userData.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };
        
        // Add to scene and tracking array
        scene.add(mesh);
        cottageElements.push(mesh);
    }
    
    // Position camera
    camera.position.z = 5;
    
    // ===== MOUSE INTERACTION =====
    /* Make 3D elements respond to mouse movement */
    let mouseX = 0;
    let mouseY = 0;
    
    canvas.addEventListener('mousemove', function(event) {
        
        // Get mouse position relative to canvas
        const rect = canvas.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;   // Normalize to -1 to 1
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;  // Normalize and invert Y
        
        // Update camera position based on mouse (subtle parallax effect)
        camera.position.x = mouseX * 0.5;
        camera.position.y = mouseY * 0.5;
        camera.lookAt(0, 0, 0); // Always look at center
    });
    
    // ===== ANIMATION LOOP =====
    /* Continuously animate the 3D scene */
    function animate() {
        
        // Request next animation frame for smooth 60fps animation
        requestAnimationFrame(animate);
        
        // Animate each cottage element
        cottageElements.forEach((element, index) => {
            
            // Rotate elements continuously
            element.rotation.x += element.userData.rotationSpeed.x;
            element.rotation.y += element.userData.rotationSpeed.y;
            element.rotation.z += element.userData.rotationSpeed.z;
            
            // Add floating motion
            const time = Date.now() * 0.001; // Current time in seconds
            element.position.y = element.userData.originalPosition.y + 
                                Math.sin(time + index) * 0.5; // Sine wave motion
            
            // Add subtle mouse influence
            element.position.x = element.userData.originalPosition.x + mouseX * 0.5;
            element.position.z = element.userData.originalPosition.z + mouseY * 0.3;
        });
        
        // Render the scene
        renderer.render(scene, camera);
    }
    
    // Start animation loop
    animate();
    
    // ===== RESIZE HANDLER =====
    /* Handle window resize to maintain proper aspect ratio */
    window.addEventListener('resize', function() {
        
        // Update canvas size
        const newWidth = canvas.offsetWidth;
        const newHeight = canvas.offsetHeight;
        
        // Update camera aspect ratio
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        
        // Update renderer size
        renderer.setSize(newWidth, newHeight);
    });
}

// ===== AOS (ANIMATE ON SCROLL) INITIALIZATION =====
/* Initialize the AOS library for scroll animations */
function initializeAOS() {
    
    // Check if AOS library is available
    if (typeof AOS !== 'undefined') {
        
        // Initialize AOS with cottage-themed settings
        AOS.init({
            duration: 800,           // Animation duration in milliseconds
            easing: 'ease-out-cubic', // Easing function for smooth animations
            once: true,              // Animate only once when scrolling down
            offset: 120,             // Offset from viewport bottom
            delay: 0,               // Global delay for all animations
            mirror: false,          // Don't animate when scrolling back up
            anchorPlacement: 'top-bottom', // When to trigger animations
        });
        
        // Add custom AOS animations
        document.addEventListener('aos:in', function(e) {
            
            // Add special effects when elements animate in
            if (e.detail.classList.contains('problem-card')) {
                // Add subtle shake effect to problem cards
                e.detail.style.animation = 'subtle-shake 0.5s ease-out';
            }
            
            if (e.detail.classList.contains('service-card')) {
                // Add glow effect to service cards
                e.detail.style.boxShadow = '0 0 30px rgba(52, 152, 219, 0.3)';
            }
        });
        
        console.log('🎬 AOS animations initialized');
        
    } else {
        console.warn('AOS library not loaded, using fallback animations');
        
        // Fallback: Add simple fade-in for elements with AOS attributes
        const elementsWithAOS = document.querySelectorAll('[data-aos]');
        elementsWithAOS.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease-out';
            
            // Simple intersection observer for fallback
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            });
            
            observer.observe(element);
        });
    }
}

// ===== MOBILE MENU FUNCTIONALITY =====
/* Handle mobile navigation menu toggle */
function initializeMobileMenu() {
    
    // Get mobile menu elements
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (!mobileToggle || !navMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    // ===== MOBILE MENU TOGGLE =====
    /* Toggle mobile menu when hamburger is clicked */
    mobileToggle.addEventListener('click', function() {
        
        // Toggle menu visibility
        navMenu.classList.toggle('mobile-open');
        mobileToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Animate hamburger lines
        const spans = mobileToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            
            if (mobileToggle.classList.contains('active')) {
                // Transform to X shape
                if (index === 0) {
                    span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                } else if (index === 1) {
                    span.style.opacity = '0';
                } else if (index === 2) {
                    span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                }
            } else {
                // Reset to hamburger shape
                span.style.transform = '';
                span.style.opacity = '';
            }
        });
        
        console.log('📱 Mobile menu toggled');
    });
    
    // ===== CLOSE MENU ON LINK CLICK =====
    /* Close mobile menu when navigation link is clicked */
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            
            // Close mobile menu
            navMenu.classList.remove('mobile-open');
            mobileToggle.classList.remove('active');
            body.classList.remove('menu-open');
            
            // Reset hamburger animation
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        });
    });
    
    // ===== CLOSE MENU ON OUTSIDE CLICK =====
    /* Close mobile menu when clicking outside of it */
    document.addEventListener('click', function(e) {
        
        // Check if click is outside menu and toggle button
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            
            // Close menu if it's open
            if (navMenu.classList.contains('mobile-open')) {
                navMenu.classList.remove('mobile-open');
                mobileToggle.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset hamburger animation
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        }
    });
}

// ===== PERFORMANCE MONITORING =====
/* Monitor and log performance metrics */
function monitorPerformance() {
    
    // Log page load time
    window.addEventListener('load', function() {
        
        const loadTime = performance.now();
        console.log(`⚡ Page loaded in ${Math.round(loadTime)}ms`);
        
        // Log resource loading times
        const resources = performance.getEntriesByType('resource');
        console.log(`📦 Loaded ${resources.length} resources`);
        
        // Check for slow-loading resources
        resources.forEach(resource => {
            if (resource.duration > 1000) {
                console.warn(`🐌 Slow resource: ${resource.name} (${Math.round(resource.duration)}ms)`);
            }
        });
    });
    
    // Monitor frame rate for animations
    let frameCount = 0;
    let lastTime = performance.now();
    
    function checkFrameRate() {
        frameCount++;
        const currentTime = performance.now();
        
        // Calculate FPS every second
        if (currentTime - lastTime >= 1000) {
            const fps = frameCount;
            frameCount = 0;
            lastTime = currentTime;
            
            // Warn if FPS is too low
            if (fps < 30) {
                console.warn(`🎮 Low FPS detected: ${fps} fps`);
            }
        }
        
        requestAnimationFrame(checkFrameRate);
    }
    
    // Start FPS monitoring
    requestAnimationFrame(checkFrameRate);
}

// ===== UTILITY FUNCTIONS =====
/* Helper functions used throughout the application */

// Debounce function to limit how often a function can be called
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function to limit function calls to once per specified time
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Get element position relative to viewport
function getElementViewportPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
        width: rect.width,
        height: rect.height,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2
    };
}

// Check if element is in viewport
function isElementInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.top >= -threshold &&
        rect.left >= -threshold &&
        rect.bottom <= windowHeight + threshold &&
        rect.right <= windowWidth + threshold
    );
}

// Smooth scroll to element (alternative to browser's scrollIntoView)
function smoothScrollToElement(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000; // 1 second
    let start = null;
    
    function animateScroll(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        const ease = easeInOutCubic(Math.min(progress / duration, 1));
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < duration) {
            requestAnimationFrame(animateScroll);
        }
    }
    
    requestAnimationFrame(animateScroll);
}

// ===== ERROR HANDLING =====
/* Global error handling for better debugging */

// Handle JavaScript errors
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript Error:', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno,
        error: e.error
    });
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('🚨 Unhandled Promise Rejection:', e.reason);
    e.preventDefault(); // Prevent default browser error handling
});

// ===== DEVELOPMENT HELPERS =====
/* Helper functions for development and debugging */

// Only include in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    
    // Add development console commands
    window.cottageCheck = {
        
        // Toggle debug mode
        debug: function(enabled = true) {
            document.body.classList.toggle('debug-mode', enabled);
            console.log(`🔧 Debug mode ${enabled ? 'enabled' : 'disabled'}`);
        },
        
        // Show element boundaries
        showBoundaries: function() {
            const style = document.createElement('style');
            style.textContent = `
                * { outline: 1px solid red !important; }
                * * { outline: 1px solid green !important; }
                * * * { outline: 1px solid blue !important; }
            `;
            document.head.appendChild(style);
            console.log('🎯 Element boundaries shown');
        },
        
        // Performance snapshot
        performance: function() {
            const memory = performance.memory || {};
            console.log('📊 Performance Snapshot:', {
                loadTime: Math.round(performance.now()),
                memory: {
                    used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                    total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
                    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
                },
                resources: performance.getEntriesByType('resource').length
            });
        }
    };
    
    console.log('🛠️ Development mode detected. Type cottageCheck.debug() to enable debug mode.');
}

// Start performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    monitorPerformance();
}