const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const promptRoutes = require('./routes/prompts');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prompts')
    .then(() => {
        console.log('Connected to MongoDB');
        mongoose.model('Prompt').syncIndexes().catch(() => { });
    })
    .catch(err => console.error('MongoDB connection error:', err));

const allowedOrigins = [
    'https://prompts-collect.vercel.app',
    'https://nanoprompts.space',
    'https://www.nanoprompts.space',

    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5173'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log the rejected origin for debugging
            console.log('CORS rejected origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded media)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add caching for GET requests
app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 mins
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Demo login: demo@nanoprompts.space / demo123`);
});

module.exports = app;
