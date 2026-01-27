const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No authentication token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
        const user = await User.findById(decoded.userId).select('-password -verificationOTP');

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Token is not valid' });
    }
};

// Optional auth (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
            const user = await User.findById(decoded.userId).select('-password -verificationOTP');

            if (user) {
                req.user = user;
                req.userId = user._id;
            }
        }

        next();
    } catch (error) {
        // Silently continue without authentication
        next();
    }
};

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'your_jwt_secret_here',
        { expiresIn: '30d' }
    );
};

module.exports = {
    authMiddleware,
    optionalAuth,
    generateToken
};
