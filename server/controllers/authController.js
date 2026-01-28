const authService = require('../services/authService');

/**
 * Auth Controller - Handles HTTP requests and responses for authentication
 */

exports.register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        res.json(result);
    } catch (error) {
        if (error.message === 'All fields required' ||
            error.message === 'Email already registered' ||
            error.message === 'Username taken') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const result = await authService.verifyOtp(userId, otp);
        res.json(result);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Already verified' ||
            error.message === 'Invalid OTP' ||
            error.message === 'OTP expired') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ error: error.message });
        }
        if (error.message === 'Email not verified') {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const result = await authService.resendOtp(userId);
        res.json(result);
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Already verified') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await authService.getCurrentUser(req.user._id);
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
