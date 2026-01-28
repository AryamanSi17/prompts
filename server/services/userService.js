const User = require('../models/User');
const Follow = require('../models/Follow');
const Post = require('../models/Post');

/**
 * User Service - Business logic layer for user operations
 */
class UserService {
    /**
     * Search users by username or display name
     */
    async searchUsers(query, limit = 10) {
        if (!query || query.trim().length === 0) {
            return [];
        }

        const searchRegex = new RegExp(query.trim(), 'i');

        const users = await User.find({
            $or: [
                { username: searchRegex },
                { displayName: searchRegex }
            ]
        })
            .select('username displayName avatar bio')
            .limit(parseInt(limit))
            .lean();

        return users;
    }

    /**
     * Get user profile with stats
     */
    async getProfile(username, currentUserId = null) {
        const user = await User.findOne({ username: username.toLowerCase() })
            .select('-password -otp -otpExpires')
            .lean();

        if (!user) {
            throw new Error('User not found');
        }

        const isOwnProfile = currentUserId && user._id.toString() === currentUserId.toString();

        // Check if current user is following this user
        let isFollowing = false;
        if (currentUserId && !isOwnProfile) {
            const follow = await Follow.findOne({
                follower: currentUserId,
                following: user._id
            });
            isFollowing = !!follow;
        }

        // Get counts
        const postsCount = await Post.countDocuments({ userId: user._id });
        const followersCount = await Follow.countDocuments({ following: user._id });
        const followingCount = await Follow.countDocuments({ follower: user._id });

        return {
            ...user,
            postsCount,
            followersCount,
            followingCount,
            isFollowing,
            isOwnProfile
        };
    }

    /**
     * Update user profile
     */
    async updateProfile(userId, updates, avatarFile = null) {
        const updateData = {};

        if (updates.displayName !== undefined) updateData.displayName = updates.displayName;
        if (updates.bio !== undefined) updateData.bio = updates.bio;
        if (updates.website !== undefined) updateData.website = updates.website;

        if (avatarFile) {
            updateData.avatar = `/uploads/${avatarFile.filename}`;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, select: '-password -otp -otpExpires' }
        );

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Follow a user
     */
    async followUser(currentUserId, targetUserId) {
        if (targetUserId === currentUserId.toString()) {
            throw new Error('Cannot follow yourself');
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            throw new Error('User not found');
        }

        const existingFollow = await Follow.findOne({
            follower: currentUserId,
            following: targetUserId
        });

        if (existingFollow) {
            throw new Error('Already following');
        }

        await Follow.create({
            follower: currentUserId,
            following: targetUserId
        });

        return { message: 'Followed successfully' };
    }

    /**
     * Unfollow a user
     */
    async unfollowUser(currentUserId, targetUserId) {
        const follow = await Follow.findOneAndDelete({
            follower: currentUserId,
            following: targetUserId
        });

        if (!follow) {
            throw new Error('Not following this user');
        }

        return { message: 'Unfollowed successfully' };
    }

    /**
     * Get user's followers
     */
    async getFollowers(userId, page = 1, limit = 20) {
        const followers = await Follow.find({ following: userId })
            .sort({ createdAt: -1 })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .populate('follower', 'username displayName avatar bio')
            .lean();

        const total = await Follow.countDocuments({ following: userId });

        return {
            users: followers.map(f => f.follower),
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        };
    }

    /**
     * Get users that a user is following
     */
    async getFollowing(userId, page = 1, limit = 20) {
        const following = await Follow.find({ follower: userId })
            .sort({ createdAt: -1 })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .populate('following', 'username displayName avatar bio')
            .lean();

        const total = await Follow.countDocuments({ follower: userId });

        return {
            users: following.map(f => f.following),
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        };
    }
}

module.exports = new UserService();
