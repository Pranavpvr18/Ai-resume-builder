# Testing the Server

## Quick Test

1. **Start the backend server:**
   ```bash
   cd backend
   python app.py
   ```

2. **Test the root endpoint:**
   - Open your browser and go to: http://localhost:5000/
   - You should see JSON with API information (not a 404 error)

3. **Test the health endpoint:**
   - Go to: http://localhost:5000/health
   - You should see: `{"status": "ok"}`

4. **Open the frontend:**
   - Navigate to the `frontend` folder
   - Double-click `index.html` to open it in your browser
   - Fill out the form and submit

## Troubleshooting

**If you still see "Not Found":**
- Make sure the Flask server is running
- Check the URL you're accessing (should be http://localhost:5000/)
- Make sure port 5000 is not already in use
- Check the terminal/console for error messages

**If you see connection errors:**
- Make sure the backend is running before opening the frontend
- Check that you're accessing the correct URLs
- Frontend should access: http://localhost:5000/generate-resume (POST)

