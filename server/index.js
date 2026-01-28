const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try {
        mongoose.set('strictQuery', false);
        const db = await mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/prompts', {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 5,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
    }
};

connectDB();

process.on('uncaughtException', (err) => {
    console.error('FATAL ERROR: Uncaught Exception', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('FATAL ERROR: Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        await connectDB();
    }
    next();
});

app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        'https://nanoprompts.space',
        'https://www.nanoprompts.space',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000'
    ];

    if (origin && (allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1'))) {
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

// 4. ROUTES
app.get('/', (req, res) => {
    res.json({
        message: 'nano prompts API',
        status: 'live',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
        timestamp: new Date().toISOString()
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/prompts', require('./routes/prompts'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState });
});

// 5. GLOBAL ERROR HANDLER
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
