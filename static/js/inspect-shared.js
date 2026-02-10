/* ===== SHARED UTILITIES FOR INSPECTION PAGES ===== */
/* Common functionality used across both traditional and AI inspection pages */

// ===== GLOBAL UTILITIES =====
/* Utility functions used throughout the inspection system */

// Debounce function to limit function calls
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

// Throttle function to limit function calls
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
function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        isVisible: rect.top < window.innerHeight && rect.bottom > 0
    };
}

// Smooth scroll to element
function smoothScrollTo(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// ===== MESSAGE FUNCTIONS =====
/* Show and hide error/success messages */

function showError(message) {
    hideMessages();
    
    const errorDiv = document.getElementById('errorMessage') || createMessageDiv('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
    
    console.error('❌ Error:', message);
}

function showSuccess(message) {
    hideMessages();
    
    const successDiv = document.getElementById('successMessage') || createMessageDiv('success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
    
    console.log('✅ Success:', message);
}

function hideMessages() {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

function createMessageDiv(type) {
    const div = document.createElement('div');
    div.id = type === 'error' ? 'errorMessage' : 'successMessage';
    div.className = `${type}-message`;
    
    // Style the message
    div.style.padding = 'var(--space-md)';
    div.style.borderRadius = 'var(--radius-sm)';
    div.style.marginBottom = 'var(--space-lg)';
    div.style.fontFamily = 'var(--font-secondary)';
    div.style.fontWeight = '600';
    div.style.display = 'none';
    
    if (type === 'error') {
        div.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
        div.style.color = '#e74c3c';
        div.style.border = '1px solid rgba(231, 76, 60, 0.3)';
    } else {
        div.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
        div.style.color = '#27ae60';
        div.style.border = '1px solid rgba(46, 204, 113, 0.3)';
    }
    
    // Insert at top of main container
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(div, container.firstChild);
    
    return div;
}

// ===== FORM VALIDATION HELPERS =====
/* Common form validation functions */

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

function isValidDate(dateString) {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    return selectedDate >= today;
}

// ===== ANIMATION UTILITIES =====
/* Common animation functions */

function addFloatingAnimation(element, duration = 3) {
    const randomDelay = Math.random() * 2;
    const randomDuration = duration + Math.random() * 2;
    
    element.style.animation = `cardFloat ${randomDuration}s ease-in-out ${randomDelay}s infinite`;
}

function addFadeInAnimation(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease-out';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

// ===== NAVIGATION UTILITIES =====
/* Set active navigation state */

function setActiveNavigation(pageName) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`[href="${pageName}.html"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ===== SCROLL UTILITIES =====
/* Scroll-based functionality */

function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--cottage-sage), var(--cottage-gold));
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    }, 16));
}

// ===== INTERSECTION OBSERVER UTILITIES =====
/* Viewport-based animations */

function observeElements(selector, callback, options = { threshold: 0.2 }) {
    const elements = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    elements.forEach(element => observer.observe(element));
}

// ===== ACCESSIBILITY UTILITIES =====
/* Accessibility enhancements */

function makeKeyboardAccessible(element, callback) {
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            callback(this);
        }
    });
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===== PERFORMANCE UTILITIES =====
/* Performance monitoring and optimization */

function measurePerformance(label, fn) {
    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();
    
    console.log(`⚡ ${label} took ${Math.round(endTime - startTime)}ms`);
    return result;
}

function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// ===== ERROR HANDLING =====
/* Global error handling setup */

function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('🚨 Global Error:', {
            message: e.message,
            filename: e.filename,
            line: e.lineno,
            column: e.colno
        });
        
        // Show user-friendly error message
        showError('An unexpected error occurred. Please refresh the page and try again.');
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('🚨 Unhandled Promise Rejection:', e.reason);
        showError('Network error occurred. Please check your connection and try again.');
    });
}

// ===== INITIALIZATION =====
/* Initialize shared functionality */

function initializeSharedFeatures() {
    // Set up error handling
    setupErrorHandling();
    
    // Add scroll progress bar
    addScrollProgress();
    
    // Add global keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // ESC key to close modals/overlays
        if (e.key === 'Escape') {
            hideMessages();
            // Trigger custom escape event for other components
            document.dispatchEvent(new CustomEvent('globalEscape'));
        }
    });
    
    // Add resize handler
    window.addEventListener('resize', debounce(() => {
        document.dispatchEvent(new CustomEvent('globalResize'));
    }, 250));
    
    console.log('✅ Shared inspection utilities initialized');
}

// ===== SHARED CSS ANIMATIONS =====
/* Inject common CSS animations */

function injectSharedStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cardFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .pulse {
            animation: pulse 2s ease-in-out infinite;
        }
        
        .spinner {
            animation: spin 1s linear infinite;
        }
    `;
    
    document.head.appendChild(style);
}

// ===== AUTO-INITIALIZATION =====
/* Auto-initialize when DOM is ready */

document.addEventListener('DOMContentLoaded', function() {
    initializeSharedFeatures();
    injectSharedStyles();
});

// ===== EXPORT FOR MODULE USAGE =====
/* Export functions for use in other modules */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        getElementPosition,
        smoothScrollTo,
        showError,
        showSuccess,
        hideMessages,
        isValidEmail,
        isValidPhone,
        isValidDate,
        addFloatingAnimation,
        addFadeInAnimation,
        setActiveNavigation,
        observeElements,
        makeKeyboardAccessible,
        announceToScreenReader,
        measurePerformance,
        preloadImages
    };
}