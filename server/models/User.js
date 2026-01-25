const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    apiKey: { type: String },
    isGenerating: { type: Boolean, default: false },
    lastGeneration: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
