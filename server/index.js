const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const promptRoutes = require('./routes/prompts');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prompts')
    .then(() => {
        console.log('Connected to MongoDB');
        // Ensure indexes are created/synced for high-performance searching
        mongoose.model('Prompt').syncIndexes();
    })
    .catch(err => console.error(err));

const allowedOrigins = [
    'https://prompts-collect.vercel.app',
    'https://nanoprompts.space'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Add caching for responses to reduce server load
app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 mins
    }
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
