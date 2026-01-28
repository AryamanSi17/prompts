const Post = require('../models/Post');
const User = require('../models/User');
const videoService = require('./videoService');
const uploadService = require('./uploadService');
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
                const videoInput = file.location || file.path;
                const thumbName = `thumb-${Date.now()}.jpg`;
                const tempThumbPath = path.join(uploadService.thumbnailsDir, thumbName);

                await videoService.generateThumbnail(videoInput, tempThumbPath);

                if (uploadService.isS3) {
                    thumbnailPath = await uploadService.uploadFileToS3(tempThumbPath, `thumbnails/${thumbName}`, 'image/jpeg');
                    // Delete local temp thumbnail
                    require('fs').unlinkSync(tempThumbPath);
                } else {
                    thumbnailPath = `/uploads/thumbnails/${thumbName}`;
                }
            } catch (error) {
                console.error('Thumbnail generation failed:', error);
            }
        }

        const post = new Post({
            userId,
            type: isVideo ? 'video' : 'photo',
            mediaUrl: file.location || `/uploads/${file.filename}`,
            thumbnail: thumbnailPath,
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
            await uploadService.deleteFile(post.mediaUrl);
        }
        if (post.thumbnail) {
            await uploadService.deleteFile(post.thumbnail);
        }

        await post.deleteOne();

        // Decrement user's post count
        await User.findByIdAndUpdate(userId, { $inc: { postsCount: -1 } });

        return { message: 'Post deleted' };
    }
}

module.exports = new PostService();
