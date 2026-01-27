const User = require('../models/User');
const Follow = require('../models/Follow');
const Post = require('../models/Post');

exports.searchUsers = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q || q.trim().length === 0) {
            return res.json({ users: [] });
        }

        const searchRegex = new RegExp(q.trim(), 'i');

        const users = await User.find({
            $or: [
                { username: searchRegex },
                { displayName: searchRegex }
            ]
        })
            .select('username displayName avatar bio')
            .limit(parseInt(limit))
            .lean();

        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const currentUserId = req.user?._id;

        const user = await User.findOne({ username: username.toLowerCase() })
            .select('-password -otp -otpExpires')
            .lean();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isOwnProfile = currentUserId && user._id.toString() === currentUserId.toString();

        let isFollowing = false;
        if (currentUserId && !isOwnProfile) {
            const follow = await Follow.findOne({
                follower: currentUserId,
                following: user._id
            });
            isFollowing = !!follow;
        }

        const postsCount = await Post.countDocuments({ userId: user._id });
        const followersCount = await Follow.countDocuments({ following: user._id });
        const followingCount = await Follow.countDocuments({ follower: user._id });

        res.json({
            user: {
                ...user,
                postsCount,
                followersCount,
                followingCount,
                isFollowing,
                isOwnProfile
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { displayName, bio, website } = req.body;
        const updates = {};

        if (displayName !== undefined) updates.displayName = displayName;
        if (bio !== undefined) updates.bio = bio;
        if (website !== undefined) updates.website = website;

        if (req.file) {
            updates.avatar = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, select: '-password -otp -otpExpires' }
        );

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.followUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user._id;

        if (targetUserId === currentUserId.toString()) {
            return res.status(400).json({ error: 'Cannot follow yourself' });
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingFollow = await Follow.findOne({
            follower: currentUserId,
            following: targetUserId
        });

        if (existingFollow) {
            return res.status(400).json({ error: 'Already following' });
        }

        await Follow.create({
            follower: currentUserId,
            following: targetUserId
        });

        res.json({ message: 'Followed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.user._id;

        const follow = await Follow.findOneAndDelete({
            follower: currentUserId,
            following: targetUserId
        });

        if (!follow) {
            return res.status(404).json({ error: 'Not following this user' });
        }

        res.json({ message: 'Unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
