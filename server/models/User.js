const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    otpExpiry: { type: Date },
    displayName: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 300 },
    avatar: { type: String, default: '' },
    website: { type: String, default: '' },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    apiKey: { type: String },
    isGenerating: { type: Boolean, default: false },
    lastGeneration: { type: String },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date }
}, {
    timestamps: true
});

UserSchema.index({ username: 'text', displayName: 'text' });


UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationOTP = otp;
    this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    return otp;
};

UserSchema.methods.verifyOTP = function (otp) {
    if (!this.verificationOTP || !this.otpExpiry) return false;
    if (Date.now() > this.otpExpiry) return false;
    return this.verificationOTP === otp;
};

module.exports = mongoose.model('User', UserSchema);
