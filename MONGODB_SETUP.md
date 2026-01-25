# MongoDB Atlas Setup Guide

## Quick Start

1. **Create MongoDB Atlas Account**:
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create Cluster**:
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a cloud provider and region

3. **Configure Database Access**:
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Create username and password
   - Set privileges to "Read and write to any database"

4. **Configure Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String**:
   - Go to "Database" tab
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `myFirstDatabase` with `prompts`

6. **Update `.env` File**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/prompts?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=prompts_secret_key_2024
   ```

7. **Seed Database**:
   ```bash
   cd server
   node seed.js
   ```

8. **Start Server**:
   ```bash
   npm start
   ```

## Alternative: Local MongoDB

If you prefer to run MongoDB locally:

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

Then use this in your `.env`:
```
MONGODB_URI=mongodb://localhost:27017/prompts
```
