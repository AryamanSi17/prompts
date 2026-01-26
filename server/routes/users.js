const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Follow = require('../models/Follow');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { uploadAvatar, deleteFile } = require('../services/uploadService');
const path = require('path');

// Get user profile
router.get('/:username', optionalAuth, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username.toLowerCase() })
            .select('-password -verificationOTP -otpExpiry -apiKey');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let isFollowing = false;
        if (req.userId) {
            const follow = await Follow.findOne({
                follower: req.userId,
                following: user._id
            });
            isFollowing = !!follow;
        }

        const userProfile = {
            ...user.toObject(),
            isFollowing,
            isOwnProfile: req.userId?.toString() === user._id.toString()
        };

        res.json({ user: userProfile });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { displayName, bio, website } = req.body;

        const updates = {};
        if (displayName !== undefined) updates.displayName = displayName.trim();
        if (bio !== undefined) updates.bio = bio.trim();
        if (website !== undefined) updates.website = website.trim();

        const user = await User.findByIdAndUpdate(
            req.userId,
            updates,
            { new: true }
        ).select('-password -verificationOTP -otpExpiry');

        res.json({ user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Update avatar
router.post('/avatar', authMiddleware, (req, res) => {
    uploadAvatar(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            const user = await User.findById(req.userId);

            // Delete old avatar if exists
            if (user.avatar) {
                const oldAvatarPath = path.join(__dirname, '..', user.avatar);
                deleteFile(oldAvatarPath);
            }

            // Update avatar
            user.avatar = `/uploads/avatars/${req.file.filename}`;
            await user.save();

            res.json({ avatar: user.avatar });
        } catch (error) {
            // Clean up uploaded file on error
            if (req.file) {
                deleteFile(req.file.path);
            }
            console.error('Update avatar error:', error);
            res.status(500).json({ error: 'Failed to update avatar' });
        }
    });
});

// Follow user
router.post('/:userId/follow', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === req.userId.toString()) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }

        const userToFollow = await User.findById(userId);
        if (!userToFollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if already following
        const existingFollow = await Follow.findOne({
            follower: req.userId,
            following: userId
        });

        if (existingFollow) {
            return res.status(400).json({ error: 'Already following this user' });
        }

        // Create follow relationship
        const follow = new Follow({
            follower: req.userId,
            following: userId
        });
        await follow.save();

        // Update counts
        await User.findByIdAndUpdate(req.userId, { $inc: { followingCount: 1 } });
        await User.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } });

        res.json({ message: 'Successfully followed user', isFollowing: true });
    } catch (error) {
        console.error('Follow user error:', error);
        res.status(500).json({ error: 'Failed to follow user' });
    }
});

// Unfollow user
router.post('/:userId/unfollow', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        const follow = await Follow.findOneAndDelete({
            follower: req.userId,
            following: userId
        });

        if (!follow) {
            return res.status(400).json({ error: 'You are not following this user' });
        }

        // Update counts
        await User.findByIdAndUpdate(req.userId, { $inc: { followingCount: -1 } });
        await User.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } });

        res.json({ message: 'Successfully unfollowed user', isFollowing: false });
    } catch (error) {
        console.error('Unfollow user error:', error);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
});

// Get followers
router.get('/:userId/followers', optionalAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const followers = await Follow.find({ following: req.params.userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('follower', 'username displayName avatar');

        const followerUsers = followers.map(f => f.follower);

        res.json({
            users: followerUsers,
            page: parseInt(page),
            hasMore: followers.length === parseInt(limit)
        });
    } catch (error) {
        console.error('Get followers error:', error);
        res.status(500).json({ error: 'Failed to fetch followers' });
    }
});

// Get following
router.get('/:userId/following', optionalAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const following = await Follow.find({ follower: req.params.userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('following', 'username displayName avatar');

        const followingUsers = following.map(f => f.following);

        res.json({
            users: followingUsers,
            page: parseInt(page),
            hasMore: following.length === parseInt(limit)
        });
    } catch (error) {
        console.error('Get following error:', error);
        res.status(500).json({ error: 'Failed to fetch following' });
    }
});

// Search users
router.get('/search', optionalAuth, async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;
        console.log('[DEBUG] Search Query Received:', q);

        if (!q || q.trim().length === 0) {
            console.log('[DEBUG] Empty query, returning []');



            return res.json({ users: [] });
        }

        const searchQuery = q.trim();
        const users = await User.find({
            $or: [
                { username: { $regex: searchQuery, $options: 'i' } },
                { displayName: { $regex: searchQuery, $options: 'i' } }
            ]

        })
            .select('username displayName avatar followersCount')
            .limit(parseInt(limit));


        res.json({ users });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
});

module.exports = router;
