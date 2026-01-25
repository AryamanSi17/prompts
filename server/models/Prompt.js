const mongoose = require('mongoose');

const PromptSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    type: { type: String, enum: ['photo', 'video'], index: true },
    category: String
});

module.exports = mongoose.model('Prompt', PromptSchema);
