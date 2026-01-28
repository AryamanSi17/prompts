const postService = require('../services/postService');

/**
 * Post Controller - Handles HTTP requests and responses for posts
 */

exports.getFeed = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await postService.getFeed(page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;
        const posts = await postService.getUserPosts(username);
        res.json({ posts });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const post = await postService.createPost(req.user._id, req.file, req.body);
        res.status(201).json({ post });
    } catch (error) {
        if (error.message === 'Media file required') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const result = await postService.deletePost(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.message === 'Post not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Unauthorized') {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};
