const mongoose = require('mongoose');

const PromptSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    prompt: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['photo', 'video', 'text', 'all'],
        default: 'text',
        index: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    category: {
        type: String,
        index: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    usageCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add text index for fast search
PromptSchema.index({
    title: 'text',
    prompt: 'text',
    tags: 'text'
}, {
    weights: {
        title: 10,
        tags: 5,
        prompt: 1
    }
});

// Index for filtering
PromptSchema.index({ type: 1, category: 1 });
PromptSchema.index({ userId: 1 });
PromptSchema.index({ createdAt: -1 });
PromptSchema.index({ usageCount: -1 });

module.exports = mongoose.model('Prompt', PromptSchema);

