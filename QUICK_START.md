# Quick Start Guide - AI Resume Builder

## Fixed Issues ✅

1. **API Key Support Added**: The app now supports Google Gemini API for enhanced resume generation
2. **Error Handling Improved**: Better error handling with fallback to regex-based processing
3. **Environment Variables**: Support for `.env` file and system environment variables

## How to Add Google Gemini API Key (3 Simple Steps)

### Step 1: Get API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the key (keep it secure!)

### Step 2: Create .env File

**In the `backend` folder, a `.env` file has been created for you:**

**Content of .env file:**
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Important:**
- No spaces around the `=` sign
- Replace `your_actual_gemini_api_key_here` with your real API key
- The file must be named exactly `.env` (with the dot)

### Step 3: Install Dependencies & Run

```bash
cd backend
pip install -r requirements.txt
python app.py
```

You should see: `✓ OpenAI API key found - Using AI-powered resume enhancement`

## Running Without API Key

The app works without an API key too! It will use regex-based enhancement (less sophisticated but still functional).

When you run `python app.py`, you'll see:
`ℹ No OpenAI API key found - Using regex-based resume enhancement`

## Troubleshooting "Nothing Found" Errors

If you get import errors:

1. **Make sure you're in the correct directory:**
   ```bash
   cd "D:\ai resume builder\backend"
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Check Python version:**
   ```bash
   python --version
   ```
   (Should be Python 3.7 or higher)

4. **Test imports:**
   ```bash
   python -c "from ai_engine import AIResumeEngine; print('OK')"
   ```

## Common Issues

**"ModuleNotFoundError: No module named 'openai'"**
- Solution: `pip install -r requirements.txt`

**API Key not working**
- Check `.env` file is in `backend` folder
- No spaces around `=` in `.env` file
- Restart the server after adding the key

**Server not starting**
- Make sure port 5000 is not in use
- Check for syntax errors: `python -m py_compile app.py`

## Need More Help?

See detailed documentation in:
- `README.md` - Full project documentation
- `backend/SETUP_API_KEY.md` - Detailed API key setup guide

