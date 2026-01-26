const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['photo', 'video'],
        required: true
    },
    caption: {
        type: String,
        default: '',
        maxlength: 2200
    },
    prompt: {
        type: String,
        default: '',
        maxlength: 5000
    },
    guide: {
        type: String,
        default: '',
        maxlength: 5000
    },

    mediaUrl: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    duration: { type: Number },
    isCompressed: { type: Boolean, default: false },
    originalSize: { type: Number },
    compressedSize: { type: Number },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
