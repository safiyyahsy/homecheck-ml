/* ===== AI COTTAGE INSPECTION ===== */
/* Handles AI-powered image analysis for cottage inspection */

// ===== GLOBAL VARIABLES =====
let currentImage = null;
let currentMethod = 'upload';
let stream = null;
let analysisInProgress = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeAIInspection();
    console.log('🤖 AI inspection interface initialized');
});

// ===== MAIN INITIALIZATION =====
function initializeAIInspection() {
    // Set active navigation
    setActiveNavigation('inspect');
    
    // Initialize AI features
    checkCameraAvailability();
    initializeDragAndDrop();
    setupFormHandling();
    setupMethodSwitching();
    setupKeyboardNavigation();
    
    // Reset interface
    resetInspection();
    
    console.log('✅ AI inspection features loaded');
}

// ===== CAMERA AVAILABILITY =====
function checkCameraAvailability() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('⚠️ Camera not supported');
        const cameraBtn = document.getElementById('cameraMethodBtn');
        if (cameraBtn) {
            cameraBtn.style.opacity = '0.5';
            cameraBtn.title = 'Camera not available';
            cameraBtn.disabled = true;
        }
    }
}

// ===== METHOD SWITCHING =====
function setupMethodSwitching() {
    document.getElementById('uploadMethodBtn')?.addEventListener('click', () => switchMethod('upload'));
    document.getElementById('cameraMethodBtn')?.addEventListener('click', () => switchMethod('camera'));
}

function switchMethod(method) {
    // Update button states
    document.querySelectorAll('.method-btn').forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = method === 'upload' ? 
        document.getElementById('uploadMethodBtn') : 
        document.getElementById('cameraMethodBtn');
    activeBtn?.classList.add('active');
    
    // Show/hide sections
    const uploadSection = document.getElementById('uploadSection');
    const cameraSection = document.getElementById('cameraSection');
    
    if (method === 'upload') {
        uploadSection.style.display = 'block';
        uploadSection.classList.add('active');
        cameraSection.style.display = 'none';
        cameraSection.classList.remove('active');
        
        if (stream) stopCamera();
    } else {
        uploadSection.style.display = 'none';
        uploadSection.classList.remove('active');
        cameraSection.style.display = 'block';
        cameraSection.classList.add('active');
    }
    
    currentMethod = method;
    resetInspection();
    
    console.log(`📱 Switched to ${method} method`);
}

// ===== DRAG AND DROP =====
function initializeDragAndDrop() {
    const uploadArea = document.querySelector('.upload-area');
    if (!uploadArea) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
    });

    uploadArea.addEventListener('drop', handleDrop, false);
    uploadArea.addEventListener('click', () => document.getElementById('fileInput')?.click());
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect({ files: files });
    }
}

// ===== FILE HANDLING =====
function handleFileSelect(input) {
    const file = input.files[0];
    if (!file) {
        showError('No file selected');
        return;
    }
    
    // Validate file
    if (!file.type.startsWith('image/')) {
        showError('❌ Please select a valid image file (JPG, PNG, GIF)');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        showError('❌ File size must be less than 10MB');
        return;
    }
    
    showSuccess(`✅ Image loaded: ${file.name}`);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        currentImage = e.target.result;
        showPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    console.log(`📁 File selected: ${file.name} (${(file.size/1024/1024).toFixed(2)}MB)`);
}

// ===== CAMERA FUNCTIONS =====
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
        video.srcObject = stream;
        video.style.display = 'block';
        
        // Update buttons
        document.getElementById('startBtn').style.display = 'none';
        document.getElementById('captureBtn').style.display = 'block';
        
        showSuccess('✅ Camera ready! Position your cottage and capture');
        console.log('📹 Camera started');
        
    } catch (err) {
        console.error('Camera error:', err);
        showError('❌ Unable to access camera. Please check permissions or try uploading instead.');
    }
}

function captureImage() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to data URL
    currentImage = canvas.toDataURL('image/jpeg', 0.8);
    
    // Show canvas, hide video
    canvas.style.display = 'block';
    video.style.display = 'none';
    
    // Update buttons
    document.getElementById('captureBtn').style.display = 'none';
    document.getElementById('retakeBtn').style.display = 'block';
    
    showPreview(currentImage);
    showSuccess('📸 Image captured! Ready for AI analysis');
    console.log('📸 Image captured');
}

function retakeImage() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    
    // Show video, hide canvas
    video.style.display = 'block';
    canvas.style.display = 'none';
    
    // Update buttons
    document.getElementById('captureBtn').style.display = 'block';
    document.getElementById('retakeBtn').style.display = 'none';
    
    // Hide preview
    document.getElementById('previewContainer').style.display = 'none';
    currentImage = null;
    
    console.log('🔄 Retaking image');
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    // Reset UI
    document.getElementById('video').style.display = 'none';
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('startBtn').style.display = 'block';
    document.getElementById('captureBtn').style.display = 'none';
    document.getElementById('retakeBtn').style.display = 'none';
    
    console.log('📹 Camera stopped');
}

// ===== PREVIEW FUNCTIONS =====
function showPreview(imageSrc) {
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    
    previewImage.src = imageSrc;
    previewContainer.style.display = 'block';
    previewContainer.classList.add('fade-in-up');
    
    // Scroll to preview
    smoothScrollTo(previewContainer);
    
    // Hide previous results
    document.getElementById('predictionSection').style.display = 'none';
}

// ===== AI ANALYSIS =====
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
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('predictionSection').style.display = 'none';
    
    // Start loading animation
    animateLoadingSteps();
    
    try {
        console.log('🤖 Starting AI analysis...');
        
        // Prepare form data
        const formData = new FormData();
        
        if (currentMethod === 'upload') {
            const fileInput = document.getElementById('fileInput');
            if (fileInput.files[0]) {
                formData.append('file', fileInput.files[0]);
            } else {
                throw new Error('No file selected');
            }
        } else {
            formData.append('image_data', currentImage);
        }
        
        // Send to backend
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
        
        console.log('✅ AI analysis complete:', result);
        
        // Show results
        setTimeout(() => {
            showPredictionResults(result);
        }, 1000);
        
    } catch (error) {
        console.error('🚨 AI analysis failed:', error);
        showError(`❌ Analysis failed: ${error.message}`);
        
        // Reset UI
        document.getElementById('loading').style.display = 'none';
        document.getElementById('previewContainer').style.display = 'block';
    } finally {
        analysisInProgress = false;
    }
}

// ===== LOADING ANIMATION =====
function animateLoadingSteps() {
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
    let currentStep = 0;
    
    // Reset steps
    steps.forEach(stepId => {
        document.getElementById(stepId)?.classList.remove('active');
    });
    
    // Animate steps
    const stepInterval = setInterval(() => {
        if (currentStep < steps.length) {
            document.getElementById(steps[currentStep])?.classList.add('active');
            currentStep++;
        } else {
            clearInterval(stepInterval);
        }
    }, 800);
}

// ===== RESULTS DISPLAY =====
function showPredictionResults(result) {
    // Hide loading
    document.getElementById('loading').style.display = 'none';
    
    // Create top prediction
    const topPrediction = document.getElementById('topPrediction');
    topPrediction.innerHTML = `
        <h2 style="color: #155724; margin-bottom: var(--space-md); font-family: var(--font-accent);">
            🎯 AI Prediction: ${result.predicted_class}
        </h2>
        <div class="confidence-score">${result.max_confidence_percentage.toFixed(1)}%</div>
        <div class="ai-status-indicator">
            <div class="status-dot"></div>
            AI Analysis Complete
        </div>
    `;
    
    // Create detailed breakdown
    const resultsHTML = result.all_predictions.map((pred, index) => `
        <div class="prediction-item ${index === 0 ? 'top' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm);">
                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    <span style="font-size: 1.2rem;">${getIssueEmoji(pred.class_name)}</span>
                    <strong style="font-size: 1.1rem;">${pred.class_name}</strong>
                    ${index === 0 ? '<span class="ai-badge">TOP MATCH</span>' : ''}
                </div>
                <span style="font-weight: bold; color: var(--cottage-blue);">${pred.percentage.toFixed(1)}%</span>
            </div>
            <div class="confidence-bar">
                <div class="confidence-fill" style="width: ${pred.percentage}%; background: ${getConfidenceColor(pred.percentage)};"></div>
            </div>
            <div style="margin-top: var(--space-xs); font-size: 0.9rem; color: var(--modern-grey);">
                ${getIssueDescription(pred.class_name)}
            </div>
        </div>
    `).join('');
    
    document.getElementById('predictionResults').innerHTML = resultsHTML;
    
    // Generate insights
    const insights = generateAIInsights(result);
    document.getElementById('aiInsights').innerHTML = insights;
    
    // Show section
    const predictionSection = document.getElementById('predictionSection');
    predictionSection.style.display = 'block';
    predictionSection.classList.add('fade-in-up');
    
    // Animate confidence bars
    setTimeout(() => {
        document.querySelectorAll('.confidence-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            bar.style.transition = 'width 1.5s ease-out';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
    
    // Scroll to results
    smoothScrollTo(predictionSection);
    
    // Update URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('confidence', result.max_confidence_percentage.toFixed(1));
    const newUrl = window.location.pathname + '?' + urlParams.toString();
    window.history.replaceState({}, '', newUrl);
    
    console.log('🎉 Results displayed successfully');
}

// ===== HELPER FUNCTIONS =====
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
        <div style="margin-bottom: var(--space-md);">
            <p><strong>🎯 Detection Confidence:</strong> The AI model is ${confidence.toFixed(1)}% confident in detecting "${topPrediction}".</p>
        </div>
    `;
    
    if (topPrediction === 'Normal') {
        insights += `
            <div style="background: rgba(40, 167, 69, 0.1); padding: var(--space-md); border-radius: var(--radius-sm); border-left: 4px solid #28a745;">
                <p><strong>✅ Good News:</strong> Your cottage structure appears healthy! Continue regular maintenance.</p>
                <p><strong>💡 Recommendation:</strong> Schedule annual inspections to catch issues early.</p>
            </div>
        `;
    } else if (topPrediction.includes('Crack')) {
        insights += `
            <div style="background: rgba(255, 193, 7, 0.1); padding: var(--space-md); border-radius: var(--radius-sm); border-left: 4px solid #ffc107;">
                <p><strong>⚠️ Attention Needed:</strong> Cracks can indicate structural stress or settling issues.</p>
                <p><strong>🔧 Next Steps:</strong> ${topPrediction === 'Major Crack' ? 'Contact a structural engineer immediately.' : 'Monitor crack size and seal to prevent water infiltration.'}</p>
                <p><strong>📊 Prevention:</strong> Ensure proper drainage around your cottage foundation.</p>
            </div>
        `;
    } else {
        insights += `
            <div style="background: rgba(74, 144, 164, 0.1); padding: var(--space-md); border-radius: var(--radius-sm); border-left: 4px solid var(--cottage-blue);">
                <p><strong>🔍 Issue Detected:</strong> The AI has identified "${topPrediction}" that requires attention.</p>
                <p><strong>📋 Recommendation:</strong> View the detailed report for specific action steps.</p>
            </div>
        `;
    }
    
    insights += `
        <div style="margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid rgba(74, 144, 164, 0.2);">
            <p style="font-size: 0.9rem; color: var(--modern-grey);">
                <strong>🤖 AI Model Info:</strong> Analysis performed using our trained deep learning model with 97% accuracy.
            </p>
        </div>
    `;
    
    return insights;
}

// ===== RESET FUNCTIONALITY =====
function resetInspection() {
    // Hide sections
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('predictionSection').style.display = 'none';
    
    // Clear state
    currentImage = null;
    analysisInProgress = false;
    
    // Reset file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
    
    // Stop camera
    stopCamera();
    
    // Clear drag classes
    document.querySelectorAll('.upload-area').forEach(area => {
        area.classList.remove('dragover');
    });
    
    // Clear messages
    hideMessages();
    
    console.log('🔄 AI inspection reset');
}

// ===== FORM HANDLING =====
function setupFormHandling() {
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (currentImage) {
                analyzeImage();
            } else {
                showError('Please select an image first');
            }
        });
    }
    
    // File input change handler
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            handleFileSelect(this);
        });
    }
    
    // Camera button handlers
    document.getElementById('startBtn')?.addEventListener('click', startCamera);
    document.getElementById('captureBtn')?.addEventListener('click', captureImage);
    document.getElementById('retakeBtn')?.addEventListener('click', retakeImage);
    
    // Analysis button handlers
    document.querySelector('[onclick="analyzeImage()"]')?.addEventListener('click', analyzeImage);
    document.querySelector('[onclick="resetInspection()"]')?.addEventListener('click', resetInspection);
}

// ===== KEYBOARD NAVIGATION =====
function setupKeyboardNavigation() {
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
            if (captureBtn.style.display !== 'none') {
                e.preventDefault();
                captureImage();
            }
        }
    });
    
    // Make upload area keyboard accessible
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        makeKeyboardAccessible(uploadArea, () => {
            document.getElementById('fileInput')?.click();
        });
        uploadArea.setAttribute('aria-label', 'Click to upload image or drag and drop');
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function setupAccessibility() {
    // Method buttons
    document.querySelectorAll('.method-btn').forEach(btn => {
        makeKeyboardAccessible(btn, function() {
            const method = this.id === 'uploadMethodBtn' ? 'upload' : 'camera';
            switchMethod(method);
        });
    });
    
    // Add focus styles
    const style = document.createElement('style');
    style.textContent = `
        .method-btn:focus,
        .upload-area:focus {
            outline: 3px solid var(--cottage-gold);
            outline-offset: 2px;
        }
        
        .ai-status-indicator {
            display: inline-flex;
            align-items: center;
            gap: var(--space-xs);
            background: rgba(40, 167, 69, 0.1);
            padding: var(--space-xs) var(--space-sm);
            border-radius: var(--radius-sm);
            color: #28a745;
            font-size: 0.9rem;
            font-weight: 600;
            margin-top: var(--space-md);
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            background: #28a745;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        .ai-badge {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            margin-left: 8px;
        }
        
        .prediction-item {
            background: rgba(255, 255, 255, 0.9);
            border-radius: var(--radius-sm);
            padding: var(--space-md);
            margin: var(--space-sm) 0;
            border-left: 4px solid var(--cottage-blue);
            transition: all var(--transition-normal);
        }
        
        .prediction-item:hover {
            transform: translateX(5px);
            box-shadow: var(--shadow-sm);
        }
        
        .prediction-item.top {
            border-left-color: #28a745;
            background: rgba(40, 167, 69, 0.05);
        }
        
        .confidence-bar {
            background: rgba(74, 144, 164, 0.1);
            border-radius: var(--radius-sm);
            height: 25px;
            margin: var(--space-sm) 0;
            overflow: hidden;
            position: relative;
        }
        
        .confidence-fill {
            height: 100%;
            border-radius: var(--radius-sm);
            transition: width 1s ease-out;
            position: relative;
        }
        
        .confidence-score {
            font-size: 2.5rem;
            font-weight: bold;
            background: var(--blue-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-family: var(--font-accent);
            margin: var(--space-md) 0;
        }
    `;
    document.head.appendChild(style);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function setupPerformanceOptimizations() {
    // Preload important images
    const importantImages = [
        '/static/images/loading-brain.gif',
        '/static/images/ai-analysis.svg'
    ];
    
    importantImages.forEach(url => {
        const img = new Image();
        img.src = url;
    });
    
    // Lazy load preview images
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== DEVELOPMENT TOOLS =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.aiInspectionDebug = {
        simulateResult: function() {
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
        
        testLoadingAnimation: function() {
            document.getElementById('loading').style.display = 'block';
            animateLoadingSteps();
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, 5000);
            console.log('🎭 Testing loading animation');
        },
        
        getCurrentState: function() {
            return {
                currentMethod,
                hasImage: !!currentImage,
                analysisInProgress,
                cameraActive: !!stream
            };
        },
        
        testCameraCapture: function() {
            // Mock camera capture for testing
            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            
            // Draw test pattern
            ctx.fillStyle = '#4a90a4';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Test Cottage', canvas.width/2, canvas.height/2);
            
            currentImage = canvas.toDataURL('image/jpeg', 0.8);
            showPreview(currentImage);
            console.log('📸 Test image captured');
        }
    };
    
    console.log('🛠️ AI inspection debug tools available');
}

// ===== CLEANUP =====
window.addEventListener('beforeunload', function() {
    stopCamera();
    console.log('🧹 AI inspection cleanup complete');
});

// ===== FINAL INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    setupAccessibility();
    setupPerformanceOptimizations();
    
    // Custom event listeners
    document.addEventListener('globalEscape', resetInspection);
    document.addEventListener('globalResize', debounce(() => {
        // Adjust camera view on resize
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        if (video && canvas) {
            const rect = video.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
    }, 250));
    
    console.log('✅ AI inspection page fully loaded');
});

// ===== GLOBAL FUNCTIONS FOR HTML =====
// These functions are called from the HTML template
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