const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Prompt = require('../models/Prompt');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

// Auth middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) throw new Error();
        req.user = user;
        next();
    } catch (e) {
        res.status(401).json({ error: 'please authenticate' });
    }
};

router.get('/', async (req, res) => {
    try {
        const { type, search, category, page = 1, limit = 50 } = req.query;
        const query = {};
        if (type) query.type = type;
        if (category) query.category = category;

        if (search) {
            if (search.length > 2) {
                // Use high-performance text search for longer queries
                query.$text = { $search: search };
            } else {
                // Basic regex fallback for very short strings
                query.title = { $regex: search, $options: 'i' };
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let mongoQuery = Prompt.find(query);

        // If searching, sort by text relevance score
        if (query.$text) {
            mongoQuery = mongoQuery
                .select({ score: { $meta: 'textScore' } })
                .sort({ score: { $meta: 'textScore' } });
        } else {
            mongoQuery = mongoQuery.sort({ _id: -1 }); // Default to newest
        }

        const prompts = await mongoQuery
            .select('title category content description')
            .limit(parseInt(limit))
            .skip(skip)
            .lean();
        res.json(prompts);
    } catch (error) {
        console.error('Fetch prompts error:', error);
        res.status(500).json({ error: 'Failed to fetch prompts' });
    }
});

router.get('/status', auth, async (req, res) => {
    res.json({ isGenerating: req.user.isGenerating, lastGeneration: req.user.lastGeneration });
});

router.post('/generate', auth, async (req, res) => {
    try {
        const { apiKey, promptType } = req.body;
        const finalApiKey = apiKey || req.user.apiKey;

        if (!finalApiKey) return res.status(400).json({ error: 'api key is required' });
        if (req.user.isGenerating) return res.status(400).json({ error: 'generation already in progress' });

        // Set generating state
        req.user.isGenerating = true;
        await req.user.save();

        const genAI = new GoogleGenerativeAI(finalApiKey);
        const model = genAI.getGenerativeModel({ model: "nano-banana-pro-preview" });
        const prompt = `Act as an AI media generator. Based on this request: "${promptType}", describe the transformation for the provided media. Return a success confirmation.`;

        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const text = response.text();

        // Update user state
        req.user.isGenerating = false;
        req.user.lastGeneration = text;
        await req.user.save();

        res.json({ success: true, message: text });
    } catch (error) {
        console.error(error);
        // Reset state on error
        if (req.user) {
            req.user.isGenerating = false;
            await req.user.save();
        }
        const status = error.status || 500;
        const message = error.message || 'generation failed';
        res.status(status).json({ error: message, details: error.errorDetails });
    }
});

module.exports = router;
