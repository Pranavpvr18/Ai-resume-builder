# How to Add Google Gemini API Key for AI Resume Enhancement

## Quick Setup Guide

### Step 1: Get Your Google Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API key"
4. Copy your API key (keep it secure!)

### Step 2: Add API Key to Your Project

**Option A: Using .env file (Recommended)**

1. In the `backend` directory, a `.env` file has been created for you
2. Open the `.env` file and replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

**Option B: Using Environment Variable**

- **Windows (PowerShell):**
  ```powershell
  $env:GEMINI_API_KEY="your_actual_api_key_here"
  ```

- **Windows (Command Prompt):**
  ```cmd
  set GEMINI_API_KEY=your_actual_api_key_here
  ```

- **macOS/Linux:**
  ```bash
  export GEMINI_API_KEY="your_actual_api_key_here"
  ```

### Step 3: Verify Setup

1. Start the backend server:
   ```bash
   cd backend
   python app.py
   ```

2. Look for this message:
   - ✅ **Success**: `[OK] GEMINI_API_KEY found - Using Google Gemini for AI-powered resume enhancement`
   - ℹ️ **Fallback**: `[INFO] No GEMINI_API_KEY found - Using regex-based resume enhancement`

## Cost Information

- OpenAI API charges per token used
- GPT-3.5-turbo is very affordable (approximately $0.001-0.002 per resume generation)
- You get $5 free credit when you sign up
- Monitor usage at: https://platform.openai.com/usage

## Troubleshooting

**"Module not found: openai"**
- Run: `pip install -r requirements.txt`

**API Key not working**
- Make sure there are no extra spaces in your `.env` file
- Verify the key starts with `sk-`
- Check that your OpenAI account has credits available

**API errors during resume generation**
- The app will automatically fall back to regex-based enhancement
- Check your OpenAI account balance
- Verify your API key hasn't expired

## Security Notes

- **Never commit your `.env` file to git** (it's already in `.gitignore`)
- Don't share your API key publicly
- The `.env` file is for local development only

