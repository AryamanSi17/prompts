const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No authentication token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nanoprompts_secret_fallback_123');
        const user = await User.findById(decoded.userId).select('-password -otp -otpExpires');

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nanoprompts_secret_fallback_123');
            const user = await User.findById(decoded.userId).select('-password -otp -otpExpires');

            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        next();
    }
};

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuth;
