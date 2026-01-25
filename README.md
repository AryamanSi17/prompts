# Prompts.

A premium, black-and-white themed AI generation app inspired by NothingOS.

## Features
- Modular React Frontend
- Express.js Backend
- Gemini AI Integration (User provided API Keys)
- Video/Photo collection and prompt-based generation
- Secure Auth simulation

## Setup

### Prerequisites
- Node.js & npm
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Backend**
   ```bash
   cd server
   npm install
   # Create .env with MONGODB_URI
   node seed.js # To populate prompts from CSV and JS
   npm start
   ```

2. **Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Configuration
- Navigate to the Settings tab in the app to provide your Google Gemini API Key.
- The app uses `gemini-pro-vision` for processing image and video prompts.
