const userService = require('../services/userService');

/**
 * User Controller - Handles HTTP requests and responses for user operations
 */

exports.searchUsers = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;
        const users = await userService.searchUsers(q, limit);
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const currentUserId = req.user?._id;
        const profile = await userService.getProfile(username, currentUserId);
        res.json({ user: profile });
    } catch (error) {
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await userService.updateProfile(req.user._id, req.body, req.file);
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.followUser = async (req, res) => {
    try {
        const result = await userService.followUser(req.user._id, req.params.id);
        res.json(result);
    } catch (error) {
        if (error.message === 'Cannot follow yourself') {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === 'User not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Already following') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const result = await userService.unfollowUser(req.user._id, req.params.id);
        res.json(result);
    } catch (error) {
        if (error.message === 'Not following this user') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const result = await userService.getFollowers(id, page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFollowing = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const result = await userService.getFollowing(id, page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
