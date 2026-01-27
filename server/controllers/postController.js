const Post = require('../models/Post');
const videoService = require('../services/videoService');
const fs = require('fs').promises;
const path = require('path');

exports.getFeed = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'username displayName avatar')
            .lean();

        const total = await Post.countDocuments();

        res.json({
            posts,
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            hasMore: skip + posts.length < total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const User = require('../models/User');

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const posts = await Post.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .populate('userId', 'username displayName avatar')
            .lean();

        res.json({ posts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Media file required' });
        }

        const { caption, prompt, guide } = req.body;
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        const isVideo = ['.mp4', '.mov', '.avi', '.webm'].includes(fileExt);

        let thumbnailPath = null;
        if (isVideo) {
            thumbnailPath = await videoService.generateThumbnail(req.file.path);
        }

        const post = new Post({
            userId: req.user._id,
            type: isVideo ? 'video' : 'photo',
            mediaUrl: `/uploads/${req.file.filename}`,
            thumbnail: thumbnailPath ? `/uploads/${path.basename(thumbnailPath)}` : null,
            caption: caption || '',
            prompt: prompt || '',
            guide: guide || ''
        });

        await post.save();

        const User = require('../models/User');
        await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });

        const populatedPost = await Post.findById(post._id)
            .populate('userId', 'username displayName avatar')
            .lean();

        res.status(201).json({ post: populatedPost });
    } catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => { });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (post.mediaUrl) {
            const mediaPath = path.join(__dirname, '..', post.mediaUrl);
            await fs.unlink(mediaPath).catch(() => { });
        }

        if (post.thumbnail) {
            const thumbPath = path.join(__dirname, '..', post.thumbnail);
            await fs.unlink(thumbPath).catch(() => { });
        }

        await post.deleteOne();

        const User = require('../models/User');
        await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: -1 } });

        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
