/* ===== COTTAGE INSPECTION JAVASCRIPT ===== */
/* Complete inspection functionality - traditional booking + AI analysis */

// ===== GLOBAL VARIABLES =====
let currentImage = null;
let currentMethod = 'upload';
let stream = null;
let analysisInProgress = false;
let selectedForComparison = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeInspectionPage();
    console.log('🔍 Inspection page initialized successfully!');
});

function initializeInspectionPage() {
    // Set active navigation
    setActiveNavigation('inspect');
    
    // Initialize traditional features
    setupProcessStepAnimations();
    setupInspectionTypeCards();
    setupBookingForm();
    setupPricingInteractions();
    
    // Initialize AI features
    checkCameraAvailability();
    initializeDragAndDrop();
    setupMethodSwitching();
    
    // Initialize animations and utilities
    setupFormValidation();
    setupFloatingTools();
    initializePageAnimations();
    setupErrorHandling();
    
    // Reset interface
    resetInspection();
}

// ===== UTILITY FUNCTIONS =====
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

function smoothScrollTo(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

function setActiveNavigation(pageName) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[href="${pageName}.html"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// ===== MESSAGE FUNCTIONS =====
function showError(message) {
    hideMessages();
    const errorDiv = getOrCreateMessageDiv('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => errorDiv.style.display = 'none', 5000);
    console.error('❌ Error:', message);
}

function showSuccess(message) {
    hideMessages();
    const successDiv = getOrCreateMessageDiv('success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    setTimeout(() => successDiv.style.display = 'none', 3000);
    console.log('✅ Success:', message);
}

function hideMessages() {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

function getOrCreateMessageDiv(type) {
    const id = type === 'error' ? 'errorMessage' : 'successMessage';
    let div = document.getElementById(id);
    
    if (!div) {
        div = document.createElement('div');
        div.id = id;
        div.className = `${type}-message`;
        
        // Style the message
        div.style.cssText = `
            padding: var(--space-md);
            border-radius: var(--radius-sm);
            margin-bottom: var(--space-lg);
            font-family: var(--font-secondary);
            font-weight: 600;
            display: none;
            ${type === 'error' ? 
                'background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.3);' :
                'background: rgba(46, 204, 113, 0.1); color: #27ae60; border: 1px solid rgba(46, 204, 113, 0.3);'
            }
        `;
    }
    
    // Create detailed predictions
    const predictionResults = document.getElementById('predictionResults');
    if (predictionResults && result.all_predictions) {
        const resultsHTML = result.all_predictions.map((pred, index) => `
            <div style="background: rgba(255, 255, 255, 0.9); border-radius: 8px; padding: 16px; margin: 8px 0; border-left: 4px solid ${index === 0 ? '#28a745' : 'var(--cottage-blue)'}; transition: all 0.3s;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.2rem;">${getIssueEmoji(pred.class_name)}</span>
                        <strong style="font-size: 1.1rem;">${pred.class_name}</strong>
                        ${index === 0 ? '<span style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; margin-left: 8px;">TOP MATCH</span>' : ''}
                    </div>
                    <span style="font-weight: bold; color: var(--cottage-blue);">${pred.percentage.toFixed(1)}%</span>
                </div>
                <div style="background: rgba(74, 144, 164, 0.1); border-radius: 4px; height: 25px; margin: 8px 0; overflow: hidden;">
                    <div style="height: 100%; width: ${pred.percentage}%; background: ${getConfidenceColor(pred.percentage)}; border-radius: 4px; transition: width 1.5s ease-out;"></div>
                </div>
                <div style="margin-top: 4px; font-size: 0.9rem; color: #666;">
                    ${getIssueDescription(pred.class_name)}
                </div>
            </div>
        `).join('');
        
        predictionResults.innerHTML = resultsHTML;
    }
    
    // Generate AI insights
    const aiInsights = document.getElementById('aiInsights');
    if (aiInsights) {
        aiInsights.innerHTML = generateAIInsights(result);
    }
    
    // Show results
    if (predictionSection) {
        predictionSection.style.display = 'block';
        smoothScrollTo(predictionSection);
    }
    
    console.log('🎉 AI Analysis Results displayed');
}

function getIssueEmoji(className) {
    const emojis = {
        'Normal': '🟢',
        'Major Crack': '🔴',
        'Minor Crack': '🟡', 
        'Peeling': '🟠',
        'Algae': '🟡',
        'Spalling': '🟠',
        'Stain': '🟡'
    };
    return emojis[className] || '🔵';
}

function getConfidenceColor(percentage) {
    if (percentage >= 80) return 'linear-gradient(90deg, #28a745, #20c997)';
    if (percentage >= 60) return 'linear-gradient(90deg, #ffc107, #ffeb3b)';
    if (percentage >= 40) return 'linear-gradient(90deg, #ff9800, #ffb74d)';
    return 'linear-gradient(90deg, #f44336, #ef5350)';
}

function getIssueDescription(className) {
    const descriptions = {
        'Normal': 'No structural issues detected. Your cottage appears to be in good condition.',
        'Major Crack': 'Significant structural damage detected that requires immediate professional attention.',
        'Minor Crack': 'Small cracks detected that should be monitored and sealed to prevent expansion.',
        'Peeling': 'Paint deterioration detected. Surface preparation and repainting needed.',
        'Algae': 'Algae growth detected. Cleaning and moisture control recommended.',
        'Spalling': 'Concrete/masonry deterioration detected. Professional repair recommended.',
        'Stain': 'Surface staining detected. Investigation of source and cleaning needed.'
    };
    return descriptions[className] || 'Issue detected requiring further evaluation.';
}

function generateAIInsights(result) {
    const topPrediction = result.predicted_class;
    const confidence = result.max_confidence_percentage;
    
    let insights = `
        <div style="margin-bottom: 16px;">
            <p><strong>🎯 Detection Confidence:</strong> The AI model is ${confidence.toFixed(1)}% confident in detecting "${topPrediction}".</p>
        </div>
    `;
    
    if (topPrediction === 'Normal') {
        insights += `
            <div style="background: rgba(40, 167, 69, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid #28a745;">
                <p><strong>✅ Good News:</strong> Your cottage structure appears healthy! Continue regular maintenance.</p>
                <p><strong>💡 Recommendation:</strong> Schedule annual inspections to catch issues early.</p>
            </div>
        `;
    } else if (topPrediction.includes('Crack')) {
        insights += `
            <div style="background: rgba(255, 193, 7, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <p><strong>⚠️ Attention Needed:</strong> Cracks can indicate structural stress or settling issues.</p>
                <p><strong>🔧 Next Steps:</strong> ${topPrediction === 'Major Crack' ? 'Contact a structural engineer immediately.' : 'Monitor crack size and seal to prevent water infiltration.'}</p>
                <p><strong>📊 Prevention:</strong> Ensure proper drainage around your cottage foundation.</p>
            </div>
        `;
    } else {
        insights += `
            <div style="background: rgba(74, 144, 164, 0.1); padding: 16px; border-radius: 8px; border-left: 4px solid var(--cottage-blue);">
                <p><strong>🔍 Issue Detected:</strong> The AI has identified "${topPrediction}" that requires attention.</p>
                <p><strong>📋 Recommendation:</strong> View the detailed report for specific action steps.</p>
            </div>
        `;
    }
    
    insights += `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(74, 144, 164, 0.2);">
            <p style="font-size: 0.9rem; color: #666;">
                <strong>🤖 AI Model Info:</strong> Analysis performed using our trained deep learning model with 97% accuracy.
            </p>
        </div>
    `;
    
    return insights;
}

function resetInspection() {
    const sections = ['previewContainer', 'loading', 'predictionSection'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
    
    currentImage = null;
    analysisInProgress = false;
    
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
    
    stopCamera();
    hideMessages();
    
    document.querySelectorAll('.upload-area').forEach(area => {
        area.classList.remove('dragover');
    });
}

// ===== FLOATING TOOLS =====
function setupFloatingTools() {
    const tools = document.querySelectorAll('.tool');
    
    tools.forEach((tool, index) => {
        tool.addEventListener('click', function() {
            animateToolClick(this);
        });
        
        const floatDuration = 2 + Math.random() * 2;
        const floatDelay = index * 0.5;
        
        tool.style.animation = `toolFloat ${floatDuration}s ease-in-out ${floatDelay}s infinite`;
    });
}

function animateToolClick(tool) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        transition: all 0.6s ease-out;
    `;
    
    tool.style.position = 'relative';
    tool.appendChild(ripple);
    
    setTimeout(() => {
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        ripple.style.opacity = '0';
    }, 10);
    
    setTimeout(() => ripple.remove(), 600);
    
    tool.style.transform = 'scale(0.8)';
    setTimeout(() => tool.style.transform = '', 200);
}

// ===== FORM VALIDATION SETUP =====
function setupFormValidation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fieldShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        @keyframes cardFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        @keyframes toolFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.1); }
        }
        
        .inspection-type.selected {
            border-color: var(--cottage-gold) !important;
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3) !important;
            transform: scale(1.02) !important;
        }
        
        .field-error {
            animation: fadeInError 0.3s ease-out;
        }
        
        @keyframes fadeInError {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== PAGE ANIMATIONS =====
function initializePageAnimations() {
    const pageHero = document.querySelector('.page-hero-content');
    if (pageHero) {
        pageHero.style.opacity = '0';
        pageHero.style.transform = 'translateY(30px)';
        pageHero.style.transition = 'all 1s ease-out';
        
        setTimeout(() => {
            pageHero.style.opacity = '1';
            pageHero.style.transform = 'translateY(0)';
        }, 300);
    }
    
    const tools = document.querySelectorAll('.tool');
    tools.forEach((tool, index) => {
        tool.style.opacity = '0';
        tool.style.transform = 'scale(0)';
        tool.style.transition = 'all 0.6s ease-out';
        
        setTimeout(() => {
            tool.style.opacity = '1';
            tool.style.transform = 'scale(1)';
        }, 600 + (index * 200));
    });
    
    setupScrollAnimations();
}

function setupScrollAnimations() {
    // Add scroll progress bar
    const progressBar = document.createElement('div');
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
    
    // Parallax effect for hero
    const pageHero = document.querySelector('.page-hero');
    if (pageHero) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            pageHero.style.transform = `translateY(${parallax}px)`;
        }, 16));
    }
}

// ===== ERROR HANDLING =====
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('🚨 Global Error:', {
            message: e.message,
            filename: e.filename,
            line: e.lineno,
            column: e.colno
        });
        
        showError('An unexpected error occurred. Please refresh and try again.');
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('🚨 Unhandled Promise Rejection:', e.reason);
        showError('Network error occurred. Please check your connection.');
        
        analysisInProgress = false;
        const loading = document.getElementById('loading');
        const previewContainer = document.getElementById('previewContainer');
        if (loading) loading.style.display = 'none';
        if (previewContainer) previewContainer.style.display = 'block';
    });
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // ESC to reset
    if (e.key === 'Escape') {
        resetInspection();
    }
    
    // Enter to analyze
    if (e.key === 'Enter' && currentImage && !analysisInProgress) {
        analyzeImage();
    }
    
    // Space to capture
    if (e.key === ' ' && currentMethod === 'camera') {
        const captureBtn = document.getElementById('captureBtn');
        if (captureBtn && captureBtn.style.display !== 'none') {
            e.preventDefault();
            captureImage();
        }
    }
    
    // Arrow key navigation for service cards
    if (e.target.classList.contains('inspection-type')) {
        const cards = Array.from(document.querySelectorAll('.inspection-type'));
        const currentIndex = cards.indexOf(e.target);
        
        let nextIndex = currentIndex;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                selectInspectionType(e.target);
                return;
        }
        
        if (nextIndex !== currentIndex) {
            e.preventDefault();
            cards[nextIndex].focus();
        }
    }
});

// ===== ACCESSIBILITY SETUP =====
document.addEventListener('DOMContentLoaded', function() {
    // Make service cards focusable
    document.querySelectorAll('.inspection-type').forEach(card => {
        const title = card.querySelector('.type-title')?.textContent || 'inspection service';
        card.setAttribute('aria-label', `Select ${title}`);
        
        card.addEventListener('focus', function() {
            this.style.outline = '3px solid var(--cottage-gold)';
            this.style.outlineOffset = '2px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add ARIA labels to form fields
    document.querySelectorAll('input, select, textarea').forEach(field => {
        const label = field.parentNode?.querySelector('label');
        if (label && !field.getAttribute('aria-label')) {
            field.setAttribute('aria-label', label.textContent);
        }
    });
    
    // File input handler
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            handleFileSelect(this);
        });
    }
    
    // Camera button handlers
    const startBtn = document.getElementById('startBtn');
    const captureBtn = document.getElementById('captureBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    
    if (startBtn) startBtn.addEventListener('click', startCamera);
    if (captureBtn) captureBtn.addEventListener('click', captureImage);
    if (retakeBtn) retakeBtn.addEventListener('click', retakeImage);
});

// ===== GLOBAL FUNCTIONS FOR HTML =====
// These functions are called from HTML onclick attributes
window.switchMethod = switchMethod;
window.handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
};
window.handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
};
window.handleDrop = handleDrop;
window.handleFileSelect = handleFileSelect;
window.startCamera = startCamera;
window.captureImage = captureImage;
window.retakeImage = retakeImage;
window.analyzeImage = analyzeImage;
window.resetInspection = resetInspection;

// ===== CLEANUP =====
window.addEventListener('beforeunload', function() {
    stopCamera();
    console.log('🧹 Inspection cleanup complete');
});

// ===== DEVELOPMENT TOOLS =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.inspectionDebug = {
        simulateAI: function() {
            const mockResult = {
                predicted_class: 'Minor Crack',
                max_confidence_percentage: 87.3,
                all_predictions: [
                    { class_name: 'Minor Crack', percentage: 87.3 },
                    { class_name: 'Normal', percentage: 8.1 },
                    { class_name: 'Major Crack', percentage: 2.8 },
                    { class_name: 'Peeling', percentage: 1.5 },
                    { class_name: 'Stain', percentage: 0.3 }
                ]
            };
            showPredictionResults(mockResult);
            console.log('🧪 Simulated AI result');
        },
        
        fillTestData: function() {
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                switch(input.type) {
                    case 'text':
                        if (input.name === 'name') input.value = 'John Cottage Owner';
                        if (input.name === 'address') input.value = '123 Cottage Lane';
                        break;
                    case 'email':
                        input.value = 'john@example.com';
                        break;
                    case 'tel':
                        input.value = '(555) 123-4567';
                        break;
                    case 'date':
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        input.value = tomorrow.toISOString().split('T')[0];
                        break;
                }
                if (input.tagName === 'SELECT') input.value = 'comprehensive';
                if (input.tagName === 'TEXTAREA') input.value = 'Test inspection request';
            });
            console.log('🧪 Test data filled');
        },
        
        getCurrentState: function() {
            return {
                currentMethod,
                hasImage: !!currentImage,
                analysisInProgress,
                cameraActive: !!stream
            };
        }
    };
    
    console.log('🛠️ Debug tools: inspectionDebug.simulateAI(), inspectionDebug.fillTestData()');
}

console.log('✅ Inspection page JavaScript loaded successfully');
{
        
        const container = document.querySelector('.inspection-container') || document.querySelector('.container') || document.body;
        container.insertBefore(div, container.firstChild);


    return div;
}

// ===== TRADITIONAL INSPECTION FEATURES =====

// Process Step Animations
function setupProcessStepAnimations() {
    const processSteps = document.querySelectorAll('.process-step');
    
    processSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(50px)';
        step.style.transition = 'all 0.6s ease-out';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(step);
        
        step.addEventListener('mouseenter', function() {
            animateStepHover(this, true);
        });
        
        step.addEventListener('mouseleave', function() {
            animateStepHover(this, false);
        });
    });
}

function animateStepHover(step, isHovering) {
    const stepNumber = step.querySelector('.step-number');
    const stepIcon = step.querySelector('.step-icon');
    const stepFeatures = step.querySelectorAll('.step-features li');
    
    if (isHovering) {
        if (stepNumber) stepNumber.style.transform = 'scale(1.1) rotate(5deg)';
        if (stepIcon) stepIcon.style.transform = 'scale(1.1) rotate(-5deg)';
        
        stepFeatures.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateX(10px)';
                feature.style.color = 'var(--cottage-brown)';
            }, index * 50);
        });
    } else {
        if (stepNumber) stepNumber.style.transform = '';
        if (stepIcon) stepIcon.style.transform = '';
        
        stepFeatures.forEach(feature => {
            feature.style.transform = '';
            feature.style.color = '';
        });
    }
}

// Inspection Type Cards
function setupInspectionTypeCards() {
    const typeCards = document.querySelectorAll('.inspection-type');
    
    typeCards.forEach(card => {
        card.addEventListener('click', function() {
            selectInspectionType(this);
        });
        
        card.addEventListener('mouseenter', function() {
            animateTypeCardHover(this, true);
        });
        
        card.addEventListener('mouseleave', function() {
            animateTypeCardHover(this, false);
        });
        
        addFloatingAnimation(card);
        makeKeyboardAccessible(card);
    });
}

function selectInspectionType(selectedCard) {
    document.querySelectorAll('.inspection-type').forEach(card => {
        card.classList.remove('selected');
    });
    
    selectedCard.classList.add('selected');
    
    const serviceSelect = document.getElementById('service');
    const cardTitle = selectedCard.querySelector('.type-title')?.textContent;
    const cardPrice = selectedCard.querySelector('.type-price')?.textContent;
    
    if (serviceSelect && cardTitle) {
        const serviceMap = {
            'Basic Cottage Check': 'basic',
            'Comprehensive Analysis': 'comprehensive',
            'Heritage Preservation': 'heritage'
        };
        
        const serviceValue = serviceMap[cardTitle];
        if (serviceValue) {
            serviceSelect.value = serviceValue;
            serviceSelect.style.borderColor = 'var(--cottage-sage)';
            setTimeout(() => serviceSelect.style.borderColor = '', 2000);
        }
    }
    
    selectedCard.style.transform = 'scale(0.95)';
    setTimeout(() => selectedCard.style.transform = '', 150);
    
    console.log(`Selected: ${cardTitle} - ${cardPrice}`);
}

function animateTypeCardHover(card, isHovering) {
    const typeIcon = card.querySelector('.type-icon');
    const typeButton = card.querySelector('.type-button');
    const typeFeatures = card.querySelectorAll('.type-features li');
    
    if (isHovering) {
        if (typeIcon) typeIcon.style.transform = 'scale(1.2) rotate(10deg)';
        if (typeButton) typeButton.style.transform = 'translateY(-3px)';
        
        typeFeatures.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateX(5px)';
                feature.style.opacity = '1';
            }, index * 30);
        });
    } else {
        if (typeIcon) typeIcon.style.transform = '';
        if (typeButton) typeButton.style.transform = '';
        
        typeFeatures.forEach(feature => {
            feature.style.transform = '';
            feature.style.opacity = '';
        });
    }
}

function addFloatingAnimation(element) {
    const randomDelay = Math.random() * 2;
    const randomDuration = 3 + Math.random() * 2;
    element.style.animation = `cardFloat ${randomDuration}s ease-in-out ${randomDelay}s infinite`;
}

function makeKeyboardAccessible(element) {
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (element.classList.contains('inspection-type')) {
                selectInspectionType(element);
            } else {
                element.click();
            }
        }
    });
}

// ===== BOOKING FORM =====
function setupBookingForm() {
    const form = document.querySelector('.inspection-form');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    setupDateValidation();
    setupPhoneFormatting();
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    if (!validateForm(form)) {
        showError('Please fill in all required fields correctly.');
        return;
    }
    
    const submitButton = form.querySelector('.form-submit');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<span class="button-text">Scheduling...</span><span class="button-icon">⏳</span>';
    submitButton.disabled = true;
    
    setTimeout(() => {
        showSuccess('Inspection scheduled successfully! We\'ll contact you within 24 hours.');
        form.reset();
        
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        document.querySelectorAll('.inspection-type').forEach(card => {
            card.classList.remove('selected');
        });
        
        console.log('Form submitted:', Object.fromEntries(formData));
    }, 2000);
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError(e);
    
    if (field.required && !value) {
        showFieldError(field, 'This field is required.');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number.');
        return false;
    }
    
    // Date validation
    if (field.type === 'date' && value && !isValidDate(value)) {
        showFieldError(field, 'Please select a future date.');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: #e74c3c; font-size: 0.8rem; margin-top: 0.25rem;';
    
    field.parentNode.appendChild(errorElement);
    
    field.style.animation = 'fieldShake 0.5s ease-in-out';
    setTimeout(() => field.style.animation = '', 500);
}

function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorMessage = field.parentNode.querySelector('.field-error');
    if (errorMessage) errorMessage.remove();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return /^[\+]?[1-9][\d]{0,15}$/.test(cleanPhone) && cleanPhone.length >= 10;
}

function isValidDate(dateString) {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

function setupDateValidation() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;
    
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    
    dateInput.min = today;
    dateInput.max = maxDate.toISOString().split('T')[0];
}

function setupPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        
        this.value = value;
    });
}

// ===== PRICING INTERACTIONS =====
function setupPricingInteractions() {
    setupServiceRecommendations();
    setupDynamicPricing();
}

function setupServiceRecommendations() {
    const messageInput = document.getElementById('message');
    if (!messageInput) return;
    
    messageInput.addEventListener('input', debounce(function() {
        const concerns = this.value.toLowerCase();
        const recommendation = getServiceRecommendation(concerns);
        
        if (recommendation) {
            showRecommendation(recommendation);
        }
    }, 500));
}

function getServiceRecommendation(concerns) {
    const heritageKeywords = ['historic', 'heritage', 'old', 'traditional', 'antique'];
    const comprehensiveKeywords = ['structural', 'foundation', 'electrical', 'plumbing', 'serious', 'major'];
    const basicKeywords = ['routine', 'general', 'maintenance', 'check'];
    
    if (heritageKeywords.some(keyword => concerns.includes(keyword))) {
        return {
            service: 'heritage',
            reason: 'Based on your heritage concerns, we recommend our Heritage Preservation service.'
        };
    }
    
    if (comprehensiveKeywords.some(keyword => concerns.includes(keyword))) {
        return {
            service: 'comprehensive', 
            reason: 'Based on your structural concerns, we recommend our Comprehensive Analysis.'
        };
    }
    
    if (basicKeywords.some(keyword => concerns.includes(keyword))) {
        return {
            service: 'basic',
            reason: 'For routine maintenance, our Basic Cottage Check is perfect.'
        };
    }
    
    return null;
}

function showRecommendation(recommendation) {
    const existingRec = document.querySelector('.service-recommendation');
    if (existingRec) existingRec.remove();
    
    const recElement = document.createElement('div');
    recElement.className = 'service-recommendation';
    recElement.innerHTML = `
        <div style="background: rgba(156, 175, 136, 0.1); border: 1px solid var(--cottage-sage); border-radius: 8px; padding: 16px; margin-top: 8px; font-size: 0.9rem;">
            <strong>💡 Recommendation:</strong> ${recommendation.reason}
        </div>
    `;
    
    const messageGroup = document.getElementById('message')?.parentNode;
    if (messageGroup) {
        messageGroup.appendChild(recElement);
        setTimeout(() => recElement.remove(), 10000);
    }
}

function setupDynamicPricing() {
    const month = new Date().getMonth();
    
    if (month === 11 || month === 0 || month === 1) {
        displaySeasonalBanner('❄️ Winter Special: 10% off all inspections!');
    } else if (month >= 2 && month <= 4) {
        displaySeasonalBanner('🌸 Spring Inspection Season: Perfect time for maintenance!');
    }
}

function displaySeasonalBanner(message) {
    const pricingSection = document.querySelector('.inspection-types');
    if (!pricingSection) return;
    
    const banner = document.createElement('div');
    banner.style.cssText = `
        background: linear-gradient(135deg, var(--cottage-gold), var(--cottage-sage));
        color: white;
        padding: 16px;
        border-radius: 8px;
        text-align: center;
        margin-bottom: 24px;
        font-weight: 600;
    `;
    banner.textContent = message;
    
    const container = pricingSection.querySelector('.container');
    const header = container?.querySelector('.section-header');
    if (header) {
        header.insertAdjacentElement('afterend', banner);
    }
}

// ===== AI INSPECTION FEATURES =====

function checkCameraAvailability() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const cameraBtn = document.getElementById('cameraMethodBtn');
        if (cameraBtn) {
            cameraBtn.style.opacity = '0.5';
            cameraBtn.disabled = true;
            cameraBtn.title = 'Camera not available';
        }
    }
}

function setupMethodSwitching() {
    const uploadBtn = document.getElementById('uploadMethodBtn');
    const cameraBtn = document.getElementById('cameraMethodBtn');
    
    if (uploadBtn) uploadBtn.addEventListener('click', () => switchMethod('upload'));
    if (cameraBtn) cameraBtn.addEventListener('click', () => switchMethod('camera'));
}

function switchMethod(method) {
    document.querySelectorAll('.method-btn').forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = method === 'upload' ? 
        document.getElementById('uploadMethodBtn') : 
        document.getElementById('cameraMethodBtn');
    if (activeBtn) activeBtn.classList.add('active');
    
    const uploadSection = document.getElementById('uploadSection');
    const cameraSection = document.getElementById('cameraSection');
    
    if (method === 'upload') {
        if (uploadSection) {
            uploadSection.style.display = 'block';
            uploadSection.classList.add('active');
        }
        if (cameraSection) {
            cameraSection.style.display = 'none';
            cameraSection.classList.remove('active');
        }
        if (stream) stopCamera();
    } else {
        if (uploadSection) {
            uploadSection.style.display = 'none';
            uploadSection.classList.remove('active');
        }
        if (cameraSection) {
            cameraSection.style.display = 'block';
            cameraSection.classList.add('active');
        }
    }
    
    currentMethod = method;
    resetInspection();
    console.log(`📱 Switched to ${method} method`);
}

function initializeDragAndDrop() {
    const uploadArea = document.querySelector('.upload-area');
    if (!uploadArea) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, e => e.preventDefault(), false);
    });

    uploadArea.addEventListener('dragover', e => e.currentTarget.classList.add('dragover'));
    uploadArea.addEventListener('dragleave', e => e.currentTarget.classList.remove('dragover'));
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', () => document.getElementById('fileInput')?.click());
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect({ files: files });
    }
}

function handleFileSelect(input) {
    const file = input.files[0];
    if (!file) {
        showError('No file selected');
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        showError('❌ Please select a valid image file (JPG, PNG, GIF)');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        showError('❌ File size must be less than 10MB');
        return;
    }
    
    showSuccess(`✅ Image loaded: ${file.name}`);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentImage = e.target.result;
        showPreview(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Camera Functions
async function startCamera() {
    try {
        showSuccess('📹 Starting camera...');
        
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'environment'
            } 
        });
        
        const video = document.getElementById('video');
        if (video) {
            video.srcObject = stream;
            video.style.display = 'block';
        }
        
        updateCameraButtons('capture');
        showSuccess('✅ Camera ready! Position your cottage and capture');
        
    } catch (err) {
        console.error('Camera error:', err);
        showError('❌ Unable to access camera. Please try uploading instead.');
    }
}

function captureImage() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    if (!video || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    currentImage = canvas.toDataURL('image/jpeg', 0.8);
    
    canvas.style.display = 'block';
    video.style.display = 'none';
    
    updateCameraButtons('retake');
    showPreview(currentImage);
    showSuccess('📸 Image captured! Ready for AI analysis');
}

function retakeImage() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    
    if (video) video.style.display = 'block';
    if (canvas) canvas.style.display = 'none';
    
    updateCameraButtons('capture');
    
    const previewContainer = document.getElementById('previewContainer');
    if (previewContainer) previewContainer.style.display = 'none';
    
    currentImage = null;
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    
    if (video) video.style.display = 'none';
    if (canvas) canvas.style.display = 'none';
    
    updateCameraButtons('start');
}

function updateCameraButtons(state) {
    const startBtn = document.getElementById('startBtn');
    const captureBtn = document.getElementById('captureBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    
    if (startBtn) startBtn.style.display = state === 'start' ? 'block' : 'none';
    if (captureBtn) captureBtn.style.display = state === 'capture' ? 'block' : 'none';
    if (retakeBtn) retakeBtn.style.display = state === 'retake' ? 'block' : 'none';
}

function showPreview(imageSrc) {
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    
    if (previewImage) previewImage.src = imageSrc;
    if (previewContainer) {
        previewContainer.style.display = 'block';
        smoothScrollTo(previewContainer);
    }
    
    const predictionSection = document.getElementById('predictionSection');
    if (predictionSection) predictionSection.style.display = 'none';
}

// AI Analysis
async function analyzeImage() {
    if (!currentImage) {
        showError('❌ No image to analyze');
        return;
    }
    
    if (analysisInProgress) {
        showError('⏳ Analysis already in progress');
        return;
    }
    
    analysisInProgress = true;
    
    const loading = document.getElementById('loading');
    const previewContainer = document.getElementById('previewContainer');
    const predictionSection = document.getElementById('predictionSection');
    
    if (loading) loading.style.display = 'block';
    if (previewContainer) previewContainer.style.display = 'none';
    if (predictionSection) predictionSection.style.display = 'none';
    
    animateLoadingSteps();
    
    try {
        const formData = new FormData();
        
        if (currentMethod === 'upload') {
            const fileInput = document.getElementById('fileInput');
            if (fileInput?.files[0]) {
                formData.append('file', fileInput.files[0]);
            } else {
                throw new Error('No file selected');
            }
        } else {
            formData.append('image_data', currentImage);
        }
        
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        setTimeout(() => showPredictionResults(result), 1000);
        
    } catch (error) {
        console.error('🚨 AI analysis failed:', error);
        showError(`❌ Analysis failed: ${error.message}`);
        
        if (loading) loading.style.display = 'none';
        if (previewContainer) previewContainer.style.display = 'block';
    } finally {
        analysisInProgress = false;
    }
}

function animateLoadingSteps() {
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
    let currentStep = 0;
    
    steps.forEach(stepId => {
        const step = document.getElementById(stepId);
        if (step) step.classList.remove('active');
    });
    
    const stepInterval = setInterval(() => {
        if (currentStep < steps.length) {
            const step = document.getElementById(steps[currentStep]);
            if (step) step.classList.add('active');
            currentStep++;
        } else {
            clearInterval(stepInterval);
        }
    }, 800);
}

function showPredictionResults(result) {
    const loading = document.getElementById('loading');
    const predictionSection = document.getElementById('predictionSection');
    
    if (loading) loading.style.display = 'none';
    
    // Create top prediction
    const topPrediction = document.getElementById('topPrediction');
    if (topPrediction) {
        topPrediction.innerHTML = `
            <h2 style="color: #155724; margin-bottom: 16px; font-family: var(--font-accent);">
                🎯 AI Prediction: ${result.predicted_class}
            </h2>
            <div style="font-size: 2.5rem; font-weight: bold; color: #28a745; margin: 16px 0;">${result.max_confidence_percentage.toFixed(1)}%</div>
            <div style="background: rgba(40, 167, 69, 0.1); padding: 8px 16px; border-radius: 4px; color: #28a745; font-size: 0.9rem; font-weight: 600; margin-top: 16px; display: inline-block;">
                🧠 AI Analysis Complete
            </div>
        `,
        topPrediction.style.display = 'block';
    }
}