# AI Resume Builder

A minimal professional web application that generates optimized, ATS-friendly resumes tailored to specific job descriptions. Uses AI to enhance work experience descriptions and calculate job match scores.

## Features

- **No Authentication Required**: Simple, local-first application
- **AI-Powered Optimization**: Automatically enhances experience descriptions with action verbs
- **Job Match Scoring**: Calculates a 0-100 score based on skills vs job description keywords
- **PDF Export**: Print-friendly design with browser print functionality
- **LocalStorage**: All data stored locally in browser
- **Clean ATS-Friendly Template**: Professional resume layout optimized for applicant tracking systems
###################################################################
## Project Structure
###################################################################
```
ai resume builder/
├── backend/
│   ├── app.py              # Flask server with API endpoints
│   ├── ai_engine.py        # AI logic for keyword extraction and resume enhancement
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── index.html          # Main form page
│   ├── resume.html         # Resume preview page
│   ├── styles.css          # Form page styles
│   ├── resume.css          # Resume page styles (including print styles)
│   └── script.js           # Frontend JavaScript logic
└── README.md               # This file
```
######################################################################################################################################
## Setup Instructions

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Edge, etc.)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up Google Gemini API Key (Optional but Recommended):**
   
   For AI-powered resume enhancement, you can optionally add a Google Gemini API key:
   
   **Option A: Using .env file (Recommended)**
   - A `.env` file has been created in the `backend` directory for you
   - Open the `.env` file and replace the placeholder with your actual API key:
     ```
     GEMINI_API_KEY=your_actual_gemini_api_key_here
     ```
   - Replace `your_actual_gemini_api_key_here` with your actual API key
   - Get your API key from: https://makersuite.google.com/app/apikey
   - **Important:** Make sure there are no spaces around the `=` sign
   
   **Option B: Environment Variable**
   - Windows (PowerShell):
     ```powershell
     $env:GEMINI_API_KEY="your_actual_api_key_here"
     ```
   - Windows (Command Prompt):
     ```cmd
     set GEMINI_API_KEY=your_actual_api_key_here
     ```
   - macOS/Linux:
     ```bash
     export GEMINI_API_KEY="your_actual_api_key_here"
     ```
   
   **Note:** If no API key is provided, the app will still work using regex-based enhancement as a fallback. However, AI-powered enhancement provides much better results. See `backend/SETUP_API_KEY.md` for detailed instructions.

6. **Run the Flask server:**
   ```bash
   python app.py
   ```

   The server will start on `http://localhost:5000`
   - If API key is found, you'll see: "[OK] GEMINI_API_KEY found - Using Google Gemini for AI-powered resume enhancement"
   - If no API key, you'll see: "[INFO] No GEMINI_API_KEY found - Using regex-based resume enhancement"

7. **Open your web browser and navigate to:**
   ```
   http://localhost:5000
   ```
   
   The Flask server now serves both the API and the frontend, so everything works from one URL!
   
   **Note:** You can also still open `frontend/index.html` directly in your browser if you prefer, but using the Flask server (http://localhost:5000) is recommended.

3. **If using a simple HTTP server**, make sure to start it from the `frontend` directory so that all relative paths work correctly.

## Usage

1. **Fill out the form** in `index.html`:
   - Enter your personal information (Full Name, Job Title, Contact details)
   - Add your skills (comma-separated)
   - Describe your work experience
   - Paste the target job description

2. **Click "Generate Resume"** - The app will:
   - Send data to the backend API
   - Extract keywords from the job description
   - Calculate a job match score (0-100)
   - Enhance your experience with better action verbs
   - Store the optimized resume in localStorage

3. **Review your resume** on the `resume.html` page:
   - See your formatted resume with ATS-friendly layout
   - Check your job match score
   - Use "Download as PDF" to print/save as PDF

## API Endpoint

### POST /generate-resume

**Request Body:**
```json
{
  "fullName": "John Doe",
  "jobTitle": "Software Engineer",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "location": "San Francisco, CA",
  "portfolio": "https://johndoe.dev",
  "skills": "Python, JavaScript, React, AWS",
  "experience": "Worked on web applications using React and Python...",
  "jobDescription": "We are looking for a Software Engineer with experience in React and Python..."
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "fullName": "John Doe",
    "jobTitle": "Software Engineer",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "portfolio": "https://johndoe.dev",
    "skills": ["Python", "JavaScript", "React", "AWS"],
    "experience": "• Developed web applications...\n• Implemented features...",
    "score": 85,
    "matchedKeywords": ["react", "python", "aws", ...]
  }
}
```

## How to Export as PDF

1. Click the "📄 Download as PDF" button on the resume page
2. This will open your browser's print dialog
3. Select "Save as PDF" as the destination
4. Adjust settings if needed (margins, scale, etc.)
5. Click "Save" to download your resume as a PDF

## Technologies Used

- **Backend**: Python, Flask, Flask-CORS
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser LocalStorage
- **AI Logic**: 
  - Google Gemini API (optional) for AI-powered resume enhancement
  - Regex-based keyword extraction and text enhancement (fallback)

## Notes

- The application runs entirely locally - no data is sent to external servers (except Google Gemini API if API key is configured)
- All resume data is stored in browser LocalStorage
- The backend must be running for the resume generation to work
- **With Gemini API Key**: Uses Google Gemini for intelligent resume enhancement
- **Without API Key**: Uses regex patterns and heuristics - works offline but with less sophisticated results

## Troubleshooting

**Backend won't start:**
- Make sure Python is installed and in your PATH
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Ensure port 5000 is not already in use

**Frontend can't connect to backend:**
- Verify the Flask server is running on `http://localhost:5000`
- Check browser console for CORS errors
- If using `file://` protocol, consider using a local HTTP server instead

**PDF export not working:**
- Make sure you're using a modern browser (Chrome, Firefox, Edge)
- Check browser print settings
- Try using "Print to PDF" directly from the browser menu

## License

This project is provided as-is for educational and personal use.

