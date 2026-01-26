const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');

// Demo credentials
const DEMO_EMAIL = 'demo@nanoprompts.space';
const DEMO_PASSWORD = 'demo123';

// Register - Send OTP
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Validation
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Create user (not saved yet)
        const user = new User({
            email: email.toLowerCase(),
            password,
            username: username.toLowerCase(),
            displayName: username,
            isVerified: false
        });

        // Generate and save OTP
        const otp = user.generateOTP();
        await user.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, username);

        if (!emailResult.success) {
            // If email fails, delete the user
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
        }

        res.status(201).json({
            message: 'Registration successful. Please check your email for OTP.',
            userId: user._id,
            email: user.email
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({ error: 'User ID and OTP are required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Verify OTP
        if (!user.verifyOTP(otp)) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Mark as verified
        user.isVerified = true;
        user.verificationOTP = undefined;
        user.otpExpiry = undefined;
        user.lastLogin = new Date();
        await user.save();

        // Send welcome email (non-blocking)
        sendWelcomeEmail(user.email, user.username).catch(err =>
            console.error('Welcome email error:', err)
        );

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Email verified successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                avatar: user.avatar,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ error: 'Verification failed. Please try again.' });
    }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: 'Email already verified' });
        }

        // Generate new OTP
        const otp = user.generateOTP();
        await user.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(user.email, otp, user.username);

        if (!emailResult.success) {
            return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
        }

        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Failed to resend OTP. Please try again.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check for demo login
        if (email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
            // Find or create demo user
            let demoUser = await User.findOne({ email: DEMO_EMAIL });

            if (!demoUser) {
                demoUser = new User({
                    email: DEMO_EMAIL,
                    password: DEMO_PASSWORD,
                    username: 'demo',
                    displayName: 'Demo User',
                    bio: 'This is a demo account for testing the platform 🚀',
                    isVerified: true,
                    avatar: ''
                });
                await demoUser.save();
            }

            const token = generateToken(demoUser._id);

            return res.json({
                token,
                user: {
                    id: demoUser._id,
                    email: demoUser.email,
                    username: demoUser.username,
                    displayName: demoUser.displayName,
                    avatar: demoUser.avatar,
                    isVerified: demoUser.isVerified,
                    bio: demoUser.bio
                }
            });
        }

        // Regular login
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                error: 'Please verify your email first',
                requiresVerification: true,
                userId: user._id
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                avatar: user.avatar,
                isVerified: user.isVerified,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// Get current user (for token refresh)
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');

        const user = await User.findById(decoded.userId).select('-password -verificationOTP');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                avatar: user.avatar,
                bio: user.bio,
                isVerified: user.isVerified,
                followersCount: user.followersCount,
                followingCount: user.followingCount,
                postsCount: user.postsCount
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;
