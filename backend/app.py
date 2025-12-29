from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ai_engine import AIResumeEngine
import os

# Get the parent directory (project root)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

# Load environment variables from .env file (optional)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv not installed, will use system environment variables only

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize AI engine with optional API key (Google Gemini)
api_key = os.getenv('GEMINI_API_KEY')
# Check if API key is set and not a placeholder
has_valid_api_key = api_key and api_key != 'your_gemini_api_key_here'
ai_engine = AIResumeEngine(api_key=api_key if has_valid_api_key else None)

if has_valid_api_key:
    print("[OK] GEMINI_API_KEY found - Using Google Gemini for AI-powered resume enhancement")
else:
    print("[INFO] No GEMINI_API_KEY found - Using regex-based resume enhancement")

@app.route('/generate-resume', methods=['POST'])
def generate_resume():
    """
    Endpoint to generate optimized resume based on user input.
    Expects JSON data with user details and job description.
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({
                "status": "error",
                "message": "No data provided"
            }), 400
        
        # Validate required fields
        required_fields = ['fullName', 'jobTitle', 'skills', 'experience', 'jobDescription']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                "status": "error",
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        # Process resume using AI engine
        enhanced_data = ai_engine.process_resume(data)
        
        # Return success response
        return jsonify({
            "status": "success",
            "data": enhanced_data
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"}), 200

# Frontend routes - must be after API routes
@app.route('/', methods=['GET'])
def index():
    """Serve the main index.html page"""
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/resume.html', methods=['GET'])
def resume():
    """Serve the resume.html page"""
    return send_from_directory(FRONTEND_DIR, 'resume.html')

# Static files route - must be last to avoid catching API routes
@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS) from frontend directory"""
    # Only serve files that actually exist and are safe
    allowed_extensions = ['.css', '.js', '.html', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico']
    if any(filename.endswith(ext) for ext in allowed_extensions):
        try:
            return send_from_directory(FRONTEND_DIR, filename)
        except FileNotFoundError:
            return jsonify({"status": "error", "message": "File not found"}), 404
    return jsonify({"status": "error", "message": "Invalid file type"}), 404

if __name__ == '__main__':
    print("Starting AI Resume Builder Backend...")
    print("Server running at http://localhost:5000")
    app.run(debug=True, port=5000)

