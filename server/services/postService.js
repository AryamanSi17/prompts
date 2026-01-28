const Post = require('../models/Post');
const User = require('../models/User');
const videoService = require('./videoService');
const fs = require('fs').promises;
const path = require('path');

/**
 * Post Service - Business logic layer for posts
 */
class PostService {
    /**
     * Get feed posts with pagination
     */
    async getFeed(page = 1, limit = 10) {
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'username displayName avatar')
            .lean();

        const total = await Post.countDocuments();

        return {
            posts,
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            hasMore: skip + posts.length < total
        };
    }

    /**
     * Get posts by username
     */
    async getUserPosts(username) {
        const user = await User.findOne({ username: username.toLowerCase() });

        if (!user) {
            throw new Error('User not found');
        }

        const posts = await Post.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .populate('userId', 'username displayName avatar')
            .lean();

        return posts;
    }

    /**
     * Create a new post
     */
    async createPost(userId, file, postData) {
        if (!file) {
            throw new Error('Media file required');
        }

        const { caption, prompt, guide } = postData;
        const fileExt = path.extname(file.originalname).toLowerCase();
        const isVideo = ['.mp4', '.mov', '.avi', '.webm'].includes(fileExt);

        let thumbnailPath = null;
        if (isVideo) {
            try {
                thumbnailPath = await videoService.generateThumbnail(file.path);
            } catch (error) {
                console.error('Thumbnail generation failed:', error);
                // Continue without thumbnail
            }
        }

        const post = new Post({
            userId,
            type: isVideo ? 'video' : 'photo',
            mediaUrl: `/uploads/${file.filename}`,
            thumbnail: thumbnailPath ? `/uploads/${path.basename(thumbnailPath)}` : null,
            caption: caption || '',
            prompt: prompt || '',
            guide: guide || ''
        });

        await post.save();

        // Increment user's post count
        await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

        const populatedPost = await Post.findById(post._id)
            .populate('userId', 'username displayName avatar')
            .lean();

        return populatedPost;
    }

    /**
     * Delete a post
     */
    async deletePost(postId, userId) {
        const post = await Post.findById(postId);

        if (!post) {
            throw new Error('Post not found');
        }

        if (post.userId.toString() !== userId.toString()) {
            throw new Error('Unauthorized');
        }

        // Delete media files
        if (post.mediaUrl) {
            const mediaPath = path.join(__dirname, '..', post.mediaUrl);
            await fs.unlink(mediaPath).catch(() => { });
        }

        if (post.thumbnail) {
            const thumbPath = path.join(__dirname, '..', post.thumbnail);
            await fs.unlink(thumbPath).catch(() => { });
        }

        await post.deleteOne();

        // Decrement user's post count
        await User.findByIdAndUpdate(userId, { $inc: { postsCount: -1 } });

        return { message: 'Post deleted' };
    }
}

module.exports = new PostService();
