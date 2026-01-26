const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// HELP DEBUG VERCEL CRASHES
process.on('uncaughtException', (err) => {
    console.error('FATAL ERROR: Uncaught Exception', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('FATAL ERROR: Unhandled Rejection at:', promise, 'reason:', reason);
});

// Root route - should be very fast

app.get('/', (req, res) => {
    res.json({
        message: 'nano prompts API',
        status: 'live',
        node_env: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Manual CORS Middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = ['https://nanoprompts.space', 'https://www.nanoprompts.space', 'http://localhost:3000'];

    if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - Lazy require might help if a route is heavy
app.use('/api/auth', require('./routes/auth'));
app.use('/api/prompts', require('./routes/prompts'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState });
});

// MongoDB Connection with strict timeouts for Vercel
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
    mongoose.set('strictQuery', false);
    mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 1
    }).then(() => console.log('DB Connected'))
        .catch(err => console.error('DB Error:', err.message));
} else if (process.env.VERCEL) {
    console.warn('MONGODB_URI missing in Vercel environment');
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`local: http://localhost:${PORT}`));
}

module.exports = app;
