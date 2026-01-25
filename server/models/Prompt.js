const mongoose = require('mongoose');

const PromptSchema = new mongoose.Schema({
    title: { type: String, index: true },
    description: String,
    content: String,
    type: { type: String, enum: ['photo', 'video'], index: true },
    category: { type: String, index: true }
});

// Add text index for fast search
PromptSchema.index({
    title: 'text',
    description: 'text',
    content: 'text'
}, {
    weights: {
        title: 10,
        description: 5,
        content: 1
    }
});

module.exports = mongoose.model('Prompt', PromptSchema);
