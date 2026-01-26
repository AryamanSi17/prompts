const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send OTP email
const sendOTPEmail = async (email, otp, username) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Nano Prompts" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - Nano Prompts',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Inter', -apple-system, sans-serif; background: #000; color: #fff; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                        .header { text-align: center; margin-bottom: 40px; }
                        .logo { font-size: 32px; font-weight: 800; text-transform: lowercase; }
                        .accent { color: #ff0000; }
                        .content { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; text-align: center; }
                        .otp-box { background: #ff0000; color: #000; font-size: 36px; font-weight: 800; letter-spacing: 8px; padding: 20px; border-radius: 12px; margin: 30px 0; }
                        .footer { text-align: center; margin-top: 30px; color: rgba(255,255,255,0.4); font-size: 12px; }
                        p { line-height: 1.6; color: rgba(255,255,255,0.8); }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">nano prompts<span class="accent">.</span></div>
                        </div>
                        <div class="content">
                            <h2 style="margin-top: 0;">Welcome, ${username}! 👋</h2>
                            <p>Thanks for joining the nano prompts community. To complete your registration, please verify your email address.</p>
                            <p style="font-size: 14px; margin-bottom: 10px;">Your verification code is:</p>
                            <div class="otp-box">${otp}</div>
                            <p style="color: rgba(255,255,255,0.5); font-size: 13px;">This code will expire in 10 minutes.</p>
                            <p style="margin-top: 30px; font-size: 13px;">If you didn't request this, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} nano prompts. All rights reserved.</p>
                            <p>Powered by YouMind Repo</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return { success: false, error: error.message };
    }
};

// Send welcome email
const sendWelcomeEmail = async (email, username) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Nano Prompts" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to Nano Prompts! 🎉',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Inter', -apple-system, sans-serif; background: #000; color: #fff; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
                        .header { text-align: center; margin-bottom: 40px; }
                        .logo { font-size: 32px; font-weight: 800; text-transform: lowercase; }
                        .accent { color: #ff0000; }
                        .content { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; }
                        .btn { display: inline-block; background: #fff; color: #000; padding: 16px 40px; border-radius: 40px; text-decoration: none; font-weight: 700; margin-top: 20px; }
                        p { line-height: 1.6; color: rgba(255,255,255,0.8); }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">nano prompts<span class="accent">.</span></div>
                        </div>
                        <div class="content">
                            <h2 style="margin-top: 0;">You're all set, ${username}! 🚀</h2>
                            <p>Your email has been verified and your account is now active. You can now:</p>
                            <ul style="text-align: left; color: rgba(255,255,255,0.8);">
                                <li>Upload photos and videos</li>
                                <li>Follow other creators</li>
                                <li>Like and comment on posts</li>
                                <li>Build your profile</li>
                            </ul>
                            <a href="https://nanoprompts.space/dashboard" class="btn">Go to Dashboard</a>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail
};
