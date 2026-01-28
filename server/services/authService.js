const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/**
 * Auth Service - Business logic layer for authentication
 */
class AuthService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    /**
     * Generate 6-digit OTP
     */
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Send OTP email
     */
    async sendOTPEmail(email, otp) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'nano prompts - verify your email',
            html: `
                <div style="font-family: monospace; padding: 20px; background: #000; color: #fff;">
                    <h2 style="color: #ff0000;">nano prompts.</h2>
                    <p>your verification code is:</p>
                    <h1 style="font-size: 32px; letter-spacing: 8px; color: #ff0000;">${otp}</h1>
                    <p style="color: #888;">this code expires in 10 minutes.</p>
                </div>
            `
        });
    }

    /**
     * Generate JWT token
     */
    generateToken(userId) {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET || 'nanoprompts_secret_fallback_123',
            { expiresIn: '30d' }
        );
    }

    /**
     * Register a new user
     */
    async register(userData) {
        const { email, username, password } = userData;

        if (!email || !username || !password) {
            throw new Error('All fields required');
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username: username.toLowerCase() }]
        });

        if (existingUser) {
            // If user exists with same email but is not verified, allow re-registration
            if (existingUser.email === email) {
                if (!existingUser.isVerified) {
                    // Update the existing unverified user with new details
                    const otp = this.generateOTP();
                    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

                    existingUser.username = username.toLowerCase();
                    existingUser.password = password;
                    existingUser.otp = otp;
                    existingUser.otpExpires = otpExpires;

                    await existingUser.save();
                    await this.sendOTPEmail(email, otp);

                    return {
                        message: 'OTP sent to email',
                        userId: existingUser._id
                    };
                }
                throw new Error('Email already registered');
            }

            // If username is taken (even by unverified user), don't allow
            if (existingUser.username === username.toLowerCase()) {
                throw new Error('Username taken');
            }
        }

        // Generate OTP
        const otp = this.generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Create user
        const user = new User({
            email,
            username: username.toLowerCase(),
            password,
            otp,
            otpExpires,
            isVerified: false
        });

        await user.save();
        await this.sendOTPEmail(email, otp);

        return {
            message: 'OTP sent to email',
            userId: user._id
        };
    }

    /**
     * Verify OTP
     */
    async verifyOtp(userId, otp) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.isVerified) {
            throw new Error('Already verified');
        }

        if (user.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        if (new Date() > user.otpExpires) {
            throw new Error('OTP expired');
        }

        // Mark as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = this.generateToken(user._id);

        return {
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                displayName: user.displayName,
                avatar: user.avatar
            }
        };
    }

    /**
     * Login user
     */
    async login(email, password) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        if (!user.isVerified) {
            throw new Error('Email not verified');
        }

        const token = this.generateToken(user._id);

        return {
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                displayName: user.displayName,
                avatar: user.avatar
            }
        };
    }

    /**
     * Resend OTP
     */
    async resendOtp(userId) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.isVerified) {
            throw new Error('Already verified');
        }

        const otp = this.generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await this.sendOTPEmail(user.email, otp);

        return { message: 'OTP resent' };
    }

    /**
     * Get current user
     */
    async getCurrentUser(userId) {
        const user = await User.findById(userId).select('-password -otp -otpExpires');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}

module.exports = new AuthService();
