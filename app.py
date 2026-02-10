from flask import Flask, request, render_template, jsonify, redirect, url_for, session
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
from datetime import datetime
import os
from tensorflow.keras.utils import register_keras_serializable
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.secret_key = 'your-secret-key-change-this'  # Change this in production

app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = 3600 

# Define your custom focal loss function
@register_keras_serializable()
def focal_loss_fn(y_true, y_pred, gamma=2.0, alpha=0.25):
    epsilon = tf.keras.backend.epsilon()
    y_pred = tf.clip_by_value(y_pred, epsilon, 1.0 - epsilon)
    cross_entropy = -y_true * tf.math.log(y_pred)
    weight = alpha * y_true * tf.math.pow(1 - y_pred, gamma)
    loss = weight * cross_entropy
    loss = tf.reduce_sum(loss, axis=-1)
    return tf.reduce_mean(loss)

# Load your model
model = tf.keras.models.load_model('model.keras', compile=False)

# Define your class names (matching your cottage inspection theme)
CLASS_NAMES = ["Algae", "Major Crack", "Minor Crack", "Normal", "Peeling", "Spalling", "Stain"]

def preprocess_image(image):
    """Adjust this function based on your model's input requirements"""
    image = image.resize((224, 224))  # Adjust size to match your model
    image = np.array(image)
    image = image / 255.0  # Normalize if needed
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

# ===== HELPER FUNCTIONS =====

def get_issue_severity(class_name):
    """Determine severity level of detected issues"""
    if class_name == 'Normal':
        return 'normal'
    elif class_name in ['Major Crack']:
        return 'severe'
    elif class_name in ['Minor Crack', 'Peeling']:
        return 'moderate'
    else:  # Algae, Spalling, Stain
        return 'minor'
    
def get_issue_emoji(class_name):
    """Get emoji for issue type"""
    emojis = {
        'Normal': '🟢',
        'Major Crack': '🔴',
        'Minor Crack': '🟡', 
        'Peeling': '🟠',
        'Algae': '🟡',
        'Spalling': '🟠',
        'Stain': '🟡'
    }
    return emojis.get(class_name, '🔵')

def get_recommendation(class_name):
    """Get basic maintenance recommendations based on prediction"""
    recommendations = {
        'Normal': 'Your cottage structure appears to be in good condition. Continue regular maintenance.',
        'Major Crack': 'Immediate attention required! Consult a structural engineer for major crack repair.',
        'Minor Crack': 'Monitor and seal minor cracks to prevent water damage and further deterioration.',
        'Peeling': 'Schedule repainting and surface preparation to protect your cottage exterior.',
        'Algae': 'Clean affected areas and improve drainage to prevent moisture buildup.',
        'Spalling': 'Repair concrete/masonry spalling to prevent further structural damage.',
        'Stain': 'Investigate stain source and clean to maintain cottage appearance and prevent damage.'
    }
    
    return recommendations.get(class_name, 'Consult a professional for proper assessment and repair.')

def get_detailed_recommendation(class_name):
    """Get detailed recommendations with DIY instructions and professional referrals"""
    
    recommendations = {
        'Normal': {
            'status': 'good',
            'urgency': 'low',
            'summary': 'Your cottage appears to be in excellent condition with no structural issues detected.',
            'action': 'Continue regular maintenance and seasonal inspections to preserve your cottage\'s condition.',
            'estimated_cost': 'RM 0 - RM 300 (routine maintenance)',
            'timeframe': 'Ongoing maintenance',
            'diy_possible': True,
            'referral_needed': False,
            'referral_type': None,
            'materials': [
                'Nippon Paint Weatherbond (5L) - RM 85',
                'Dulux Ambience Wood Stain (1L) - RM 45', 
                'Ronseal Thompson\'s WaterSeal (1L) - RM 35',
                'General cleaning supplies - RM 20'
            ],
            'tools': [
                'Cleaning cloths and brushes',
                'Garden hose',
                'Basic hand tools (screwdriver, hammer)',
                'Extension ladder (if needed)'
            ],
            'steps': [
                'Perform visual inspection quarterly for any new issues',
                'Clean exterior surfaces annually with mild detergent',
                'Check for new issues after heavy rain or storms',
                'Maintain proper drainage around cottage foundation',
                'Apply protective treatments (paint/stain) every 2-3 years as needed'
            ]
        },
        'Major Crack': {
            'status': 'critical',
            'urgency': 'high',
            'summary': 'Significant structural damage detected that poses potential safety risks and requires immediate professional assessment.',
            'action': 'Contact a structural engineer immediately for professional evaluation. Do not attempt DIY repairs on major cracks.',
            'estimated_cost': 'RM 1,500 - RM 15,000+ (professional assessment and repair)',
            'timeframe': 'Immediate action required (within 1-2 days)',
            'diy_possible': False,
            'referral_needed': True,
            'referral_type': 'Structural Engineer',
            'materials': [
                'Professional assessment required',
                'Structural repair materials (determined by engineer)',
                'Potential foundation work materials',
                'Waterproofing systems if needed'
            ],
            'tools': [
                'Professional equipment only',
                'Structural assessment tools',
                'Specialized repair equipment',
                'Safety equipment for workers'
            ],
            'steps': [
                'DO NOT attempt DIY repair - contact professional immediately',
                'Document the crack with photos and measurements',
                'Restrict access to affected area if safety concern',
                'Get quotes from certified structural engineers',
                'Obtain necessary permits for structural work',
                'Schedule professional repair work',
                'Arrange for post-repair inspection and certification'
            ]
        },
        'Minor Crack': {
            'status': 'attention_needed',
            'urgency': 'medium',
            'summary': 'Small cracks detected that should be monitored and sealed to prevent water infiltration and expansion.',
            'action': 'Clean and seal cracks with appropriate filler, then monitor for growth over time.',
            'estimated_cost': 'RM 150 - RM 600 (DIY) or RM 600 - RM 1,500 (professional)',
            'timeframe': '1-2 weeks (monitor ongoing)',
            'diy_possible': True,
            'referral_needed': False,
            'referral_type': None,
            'materials': [
                'Sika Crack Repair Kit (500ml) - RM 45',
                'Dulux 1Step Primer (1L) - RM 35',
                'Nippon Paint Weatherbond (1L) - RM 25',
                'Sandpaper (120 & 220 grit) - RM 15',
                'Masking tape - RM 8',
                'Cleaning supplies - RM 20'
            ],
            'tools': [
                'Caulk gun (RM 15)',
                'Putty knife (RM 12)',
                'Wire brush (RM 8)',
                'Paintbrush 2-inch (RM 15)',
                'Measuring tape (RM 20)',
                'Safety glasses and gloves (RM 25)'
            ],
            'steps': [
                'Clean crack thoroughly using wire brush to remove all loose debris and old filler',
                'Use vacuum or compressed air to remove dust from crack interior',
                'Apply Sika Crack Repair filler using caulk gun, filling crack completely',
                'Smooth surface with putty knife, removing excess material',
                'Allow to cure for 24-48 hours as per manufacturer instructions',
                'Sand smooth with 120 grit sandpaper, then 220 grit for finishing',
                'Apply Dulux 1Step Primer to prepared surface and let dry',
                'Paint with Nippon Weatherbond using 2 coats for best protection',
                'Monitor crack monthly for 6 months for any signs of expansion'
            ]
        },
        'Peeling': {
            'status': 'maintenance_required',
            'urgency': 'medium',
            'summary': 'Paint deterioration detected that affects both protection and aesthetics. Surface preparation and repainting needed.',
            'action': 'Remove loose paint, prepare surface properly, and repaint affected areas with high-quality exterior paint.',
            'estimated_cost': 'RM 300 - RM 2,400 (depending on area size and paint quality)',
            'timeframe': '2-4 days (weather dependent)',
            'diy_possible': True,
            'referral_needed': False,
            'referral_type': None,
            'materials': [
                'Paint scraper (RM 25)',
                'Sandpaper variety pack (RM 35)',
                'Dulux 1Step Primer (5L) - RM 120',
                'Nippon Paint Weatherbond (5L) - RM 85',
                'Drop cloths (RM 30)',
                'Masking tape (RM 15)',
                'Cleaning supplies (RM 25)'
            ],
            'tools': [
                'Paint scraper (RM 25)',
                'Electric sander (RM 150) or sanding blocks (RM 20)',
                'Paintbrush set (RM 45)',
                'Paint roller with tray (RM 35)',
                'Extension ladder (RM 200 rental/day)',
                'Safety equipment (mask, goggles) - RM 40'
            ],
            'steps': [
                'Remove all loose and peeling paint using paint scraper',
                'Sand entire surface starting with 80 grit, then 120 grit for smoothness',
                'Clean surface thoroughly with tack cloth to remove all dust',
                'Apply Dulux 1Step Primer evenly and allow to dry per instructions',
                'Lightly sand primed surface with 220 grit sandpaper',
                'Clean again with tack cloth to remove sanding dust',
                'Apply first coat of Nippon Weatherbond paint using roller and brush',
                'Allow first coat to dry completely (typically 4-6 hours)',
                'Apply second coat for optimal protection and coverage',
                'Remove masking tape while paint is still slightly wet for clean lines'
            ]
        },
        'Algae': {
            'status': 'maintenance_required',
            'urgency': 'medium',
            'summary': 'Algae growth detected indicating moisture issues. Cleaning and moisture control needed to prevent recurrence.',
            'action': 'Clean affected areas with appropriate algaecide and address underlying moisture sources.',
            'estimated_cost': 'RM 150 - RM 900 (depending on area and cleaning method)',
            'timeframe': '1-2 days (plus ongoing moisture management)',
            'diy_possible': True,
            'referral_needed': False,
            'referral_type': None,
            'materials': [
                'Clorox Algae Remover (1L) - RM 25',
                'Domestos Bleach (1L) - RM 12',
                'Soft-bristled brush (RM 20)',
                'Spray bottle (RM 15)',
                'Protective equipment (gloves, goggles) - RM 30',
                'Anti-algae treatment (500ml) - RM 45'
            ],
            'tools': [
                'Pressure washer (RM 80/day rental) or garden hose',
                'Soft-bristled brush or broom (RM 25)',
                'Bucket for mixing solution (RM 15)',
                'Sprayer or watering can (RM 20)',
                'Rubber gloves and safety glasses (RM 30)'
            ],
            'steps': [
                'Mix cleaning solution (1 part Domestos bleach to 10 parts water)',
                'Wet the affected area with clean water first',
                'Apply cleaning solution from bottom to top using spray bottle',
                'Allow solution to sit for 10-15 minutes (don\'t let it dry)',
                'Scrub gently with soft brush to remove algae buildup',
                'Rinse thoroughly with clean water from top to bottom',
                'Improve drainage around affected areas by clearing gutters',
                'Trim vegetation to increase sunlight and air circulation',
                'Apply anti-algae treatment as per manufacturer instructions',
                'Monitor area monthly and reapply treatment every 6 months'
            ]
        },
        'Spalling': {
            'status': 'repair_needed',
            'urgency': 'medium',
            'summary': 'Concrete or masonry deterioration detected. Professional repair recommended to prevent further structural damage.',
            'action': 'Repair damaged masonry to restore structural integrity and prevent water penetration.',
            'estimated_cost': 'RM 600 - RM 3,000+ (depending on extent and accessibility)',
            'timeframe': '2-5 days (depending on scope)',
            'diy_possible': True,
            'referral_needed': False,
            'referral_type': 'Mason or Concrete Contractor (for major spalling)',
            'materials': [
                'Sika Concrete Repair Mortar (5kg) - RM 65',
                'Bondcrete Concrete Bonding Agent (1L) - RM 35',
                'Concrete primer (500ml) - RM 25',
                'Waterproof sealant (1L) - RM 45',
                'Wire brush (RM 15)',
                'Mixing bucket (RM 20)'
            ],
            'tools': [
                'Hammer and chisel (RM 35)',
                'Wire brush (RM 15)',
                'Mixing paddle (RM 25)',
                'Trowel (RM 20)',
                'Float (RM 25)',
                'Safety equipment (RM 40)'
            ],
            'steps': [
                'Remove all loose concrete using hammer and chisel',
                'Clean area thoroughly with wire brush to remove debris',
                'Apply Bondcrete bonding agent to cleaned surface',
                'Allow bonding agent to become tacky (about 30 minutes)',
                'Mix Sika Concrete Repair Mortar according to package instructions',
                'Apply mortar using trowel, building up in thin layers',
                'Smooth surface with float to match surrounding area',
                'Allow to cure for 24-48 hours, keeping slightly moist',
                'Apply concrete primer followed by waterproof sealant',
                'Monitor repair area for 3 months for any signs of failure'
            ]
        },
        'Stain': {
            'status': 'cosmetic_attention',
            'urgency': 'low',
            'summary': 'Surface staining detected that may indicate underlying issues. Investigation and appropriate treatment needed.',
            'action': 'Identify stain source and apply appropriate cleaning method. Monitor for recurrence.',
            'estimated_cost': 'RM 75 - RM 450 (depending on stain type and cleaning method)',
            'timeframe': '1 day (investigation and cleaning)',
            'diy_possible': True,
            'referral_needed': False,
            'referral_type': None,
            'materials': [
                'Mr. Muscle Bathroom Cleaner (500ml) - RM 15',
                'Clorox Stain Remover (1L) - RM 25',
                'Scrub brush (RM 18)',
                'Clean cloths/rags (RM 20)',
                'Protective gloves (RM 12)',
                'Stain-blocking primer (500ml) - RM 35'
            ],
            'tools': [
                'Scrub brush or power brush (RM 25)',
                'Pressure washer (RM 80/day rental) - if appropriate',
                'Bucket for mixing solutions (RM 15)',
                'Protective gloves and eyewear (RM 30)',
                'pH testing strips (RM 20) - for some stains'
            ],
            'steps': [
                'Identify stain type (rust, mold, mineral deposits, etc.)',
                'Test cleaning method on small, inconspicuous area first',
                'Apply appropriate cleaner (Mr. Muscle for mold, Clorox for general stains)',
                'Allow cleaner to work for recommended contact time',
                'Scrub gently with brush and rinse thoroughly',
                'For stubborn stains, repeat process or try stronger concentration',
                'If stain persists, apply stain-blocking primer before painting',
                'Investigate and address underlying cause (leaks, moisture, etc.)',
                'Apply protective coating if recommended for stain type'
            ]
        }
    }
    
    return recommendations.get(class_name, recommendations['Normal'])

# ===== MAIN ROUTES =====

@app.route('/')
def homepage():
    """Homepage with cottage-modern design"""
    return render_template('homepage.html')

@app.route('/index.html')
def index_redirect():
    """Handle index.html requests"""
    return redirect(url_for('homepage'))

@app.route('/inspection.html')
@app.route('/inspection')
def inspection():
    """Inspection page with ML integration"""
    return render_template('inspection.html')

@app.route('/detailed_report')
@app.route('/report/detailed')
def detailed_report():
    """Detailed inspection report with recommendations - FIXED"""
    result = None
    
    # Check for current_result first (latest inspection)
    if 'current_result' in session:
        result = session['current_result']
        print(f"DEBUG: Using current_result: {result['predicted_class']}")
    # Fallback to last_result
    elif 'last_result' in session and session['last_result']:
        result = session['last_result']
        print(f"DEBUG: Using last_result: {result['predicted_class']}")
    else:
        print("DEBUG: No results found, redirecting to inspection")
        return redirect(url_for('inspection'))
    
    # Get recommendation
    recommendation = get_detailed_recommendation(result['predicted_class'])
    
    return render_template('detailed_report.html', 
                         result=result, 
                         recommendation=recommendation)

@app.route('/history.html')
@app.route('/report')
def history():
    """History/Report page"""
    inspection_history = session.get('inspection_history', [])
    return render_template('history.html', history=inspection_history)

@app.route('/guide.html')
def guide():
    """Guide page for cottage maintenance"""
    return render_template('guide.html')

@app.route('/about.html')
def about():
    """About page"""
    return render_template('about.html')

# ===== ML PREDICTION ROUTES - SIMPLIFIED =====

@app.route('/predict', methods=['POST'])
def predict():
    """Handle ML predictions - SIMPLIFIED (NO CONFIDENCE %)"""
    try:
        # Handle file upload or camera capture
        if 'file' in request.files and request.files['file'].filename != '':
            # File upload
            file = request.files['file']
            image = Image.open(file.stream)
        elif 'image_data' in request.form:
            # Camera capture
            image_data_url = request.form['image_data']
            image_data_base64 = image_data_url.split(',')[1]
            image_bytes = base64.b64decode(image_data_base64)
            image = Image.open(io.BytesIO(image_bytes))
        else:
            return jsonify({'error': 'No image provided'})
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Process the image
        processed_image = preprocess_image(image)
        
        # Make prediction
        prediction = model.predict(processed_image)
        prediction_scores = prediction[0]
        predicted_class_index = np.argmax(prediction_scores)
        predicted_class_name = CLASS_NAMES[predicted_class_index]
        
        # SIMPLIFIED RESULT - ONLY CLASS AND TIMESTAMP
        result = {
            'predicted_class': predicted_class_name,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Clear any existing current_result first
        session.pop('current_result', None)
        
        # Store results in session
        session['current_result'] = result.copy()
        session['last_result'] = result.copy()  # Keep for compatibility
        
        # Store in report history
        if 'inspection_history' not in session:
            session['inspection_history'] = []
        
        session['inspection_history'].append(result.copy())
        
        # Keep only last 50 reports
        if len(session['inspection_history']) > 50:
            session['inspection_history'] = session['inspection_history'][-50:]
            
        # Force session to be saved
        session.modified = True
        session.permanent = True  # Make session permanent
        
        print(f"DEBUG: Prediction saved - {result['predicted_class']}")
        print(f"DEBUG: History length: {len(session.get('inspection_history', []))}")
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)})

@app.route('/result')
@app.route('/result/<int:report_index>')
def result(report_index=None):
    """Show detailed results - FIXED INDEX HANDLING"""
    if report_index is not None:
        # View specific report from history
        history = session.get('inspection_history', [])
        print(f"DEBUG: Viewing report {report_index} from {len(history)} reports")
        
        if 0 <= report_index < len(history):
            # Set the selected result as current_result for viewing
            selected_result = history[report_index].copy()
            session['current_result'] = selected_result
            session.modified = True
            print(f"DEBUG: Selected report: {selected_result['predicted_class']}")
            return redirect(url_for('detailed_report'))
        else:
            print(f"DEBUG: Invalid report index: {report_index}")
            return redirect(url_for('history'))
    
    # For current/latest result, redirect to detailed report
    return redirect(url_for('detailed_report'))

#===== EMAIL TEMPLATE =====

# Add this route to your app.py file

@app.route('/email_template')
@app.route('/email_template/<issue_type>')
def email_template(issue_type=None):
    """Email template generator for contacting professionals"""
    
    # Get issue type from URL parameter or current session result
    if issue_type is None:
        if 'current_result' in session:
            issue_type = session['current_result']['predicted_class']
        elif 'last_result' in session:
            issue_type = session['last_result']['predicted_class']
        else:
            # If no result available, redirect to inspection
            return redirect(url_for('inspection'))
    
    # Get inspection details from session if available
    current_result = session.get('current_result') or session.get('last_result')
    
    # Prepare template context
    template_context = {
        'issue_type': issue_type,
        'inspection_date': current_result.get('timestamp', 'Recent') if current_result else 'Recent',
        'confidence': None  # Removed confidence as per your simplified version
    }
    
    print(f"DEBUG: Email template for {issue_type}")
    
    return render_template('email_template.html', **template_context)

# ===== HISTORY MANAGEMENT ROUTES =====

@app.route('/clear_history')
def clear_history():
    """Clear all inspection history"""
    session.pop('inspection_history', None)
    session.pop('last_result', None)
    session.pop('current_result', None)
    session.modified = True
    return redirect(url_for('history'))

@app.route('/delete_report/<int:report_index>')
def delete_report(report_index):
    """Delete a specific report"""
    history = session.get('inspection_history', [])
    # Convert from display index to actual index
    actual_index = len(history) - 1 - report_index
    if 0 <= actual_index < len(history):
        history.pop(actual_index)
        session['inspection_history'] = history
        session.modified = True
    return redirect(url_for('history'))

# ===== API ROUTES FOR AJAX =====

@app.route('/api/stats')
def get_stats():
    """Get inspection statistics for dashboard"""
    history = session.get('inspection_history', [])
    
    stats = {
        'total_inspections': len(history),
        'normal_count': len([r for r in history if r['predicted_class'] == 'Normal']),
        'issues_count': len([r for r in history if r['predicted_class'] != 'Normal']),
        'recent_inspections': history[-5:] if history else []  # Last 5
    }
    
    return jsonify(stats)

@app.route('/api/export_history')
def export_history():
    """Export inspection history as JSON"""
    history = session.get('inspection_history', [])
    return jsonify({
        'export_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'total_reports': len(history),
        'reports': history
    })

# ===== DEBUG ROUTE =====

@app.route('/debug/session')
def debug_session():
    """Debug route to check session state"""
    if app.debug:  # Only in debug mode
        return jsonify({
            'has_current_result': 'current_result' in session,
            'has_last_result': 'last_result' in session,
            'history_length': len(session.get('inspection_history', [])),
            'current_class': session.get('current_result', {}).get('predicted_class', 'None'),
            'last_class': session.get('last_result', {}).get('predicted_class', 'None')
        })
    return jsonify({'error': 'Debug mode only'})

# ===== ERROR HANDLERS =====

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

# ===== TEMPLATE CONTEXT PROCESSOR =====

@app.context_processor
def utility_processor():
    """Add utility functions to all templates"""
    return {
        'get_issue_severity': get_issue_severity,
        'get_recommendation': get_recommendation,
        'get_detailed_recommendation': get_detailed_recommendation,
        'get_issue_emoji': get_issue_emoji,
        'datetime': datetime
    }

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('static/fonts', exist_ok=True)
    
    app.run(debug=True, port=5001)

