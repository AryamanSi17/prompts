const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { uploadPost, deleteFile, thumbnailsDir, isS3, uploadFileToS3 } = require('../services/uploadService');
const { compressVideo, generateThumbnail, getVideoDuration } = require('../services/videoService');

// Create post
router.post('/', authMiddleware, (req, res) => {
    uploadPost(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        try {
            const { caption, prompt, guide } = req.body;
            const file = req.file;
            const isVideo = file.mimetype.startsWith('video/');

            // Determine the URL based on storage (S3 vs local)
            const mediaUrl = file.location || `/uploads/posts/${file.filename}`;

            let postData = {
                userId: req.userId,
                type: isVideo ? 'video' : 'photo',
                caption: caption || '',
                prompt: prompt || '',
                guide: guide || '',
                mediaUrl: mediaUrl,
                originalSize: file.size
            };

            // Create post first
            const post = new Post(postData);
            await post.save();

            // Handle video processing only if local storage was used (since FFmpeg needs a local path)
            if (isVideo && file.path) {
                const compressedFilename = `compressed-${file.filename.replace(path.extname(file.filename), '.mp4')}`;
                const compressedPath = path.join(path.dirname(file.path), compressedFilename);
                const thumbnailFilename = `thumb-${file.filename.replace(path.extname(file.filename), '.jpg')}`;
                const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);

                // Get video duration
                const duration = await getVideoDuration(file.path);
                await Post.findByIdAndUpdate(post._id, { duration: Math.round(duration) });

                // Start compression (async)
                compressVideo(file.path, compressedPath)
                    .then(async (result) => {
                        let finalMediaUrl = `/uploads/posts/${compressedFilename}`;

                        // If S3 set up, upload compressed video
                        if (isS3) {
                            const s3Url = await uploadFileToS3(compressedPath, `posts/${compressedFilename}`, 'video/mp4');
                            if (s3Url) {
                                finalMediaUrl = s3Url;
                                deleteFile(compressedPath);
                            }
                        }

                        // Update post with compressed video
                        await Post.findByIdAndUpdate(post._id, {
                            mediaUrl: finalMediaUrl,
                            isCompressed: true,
                            compressedSize: result.compressedSize
                        });

                        // Delete original video
                        deleteFile(file.path);
                    })
                    .catch(err => {
                        console.error('Video compression error:', err);
                    });

                // Generate thumbnail
                try {
                    await generateThumbnail(file.path, thumbnailPath);
                    let finalThumbUrl = `/uploads/thumbnails/${thumbnailFilename}`;

                    if (isS3) {
                        const s3ThumbUrl = await uploadFileToS3(thumbnailPath, `thumbnails/${thumbnailFilename}`, 'image/jpeg');
                        if (s3ThumbUrl) {
                            finalThumbUrl = s3ThumbUrl;
                            deleteFile(thumbnailPath);
                        }
                    }

                    await Post.findByIdAndUpdate(post._id, { thumbnail: finalThumbUrl });
                } catch (thumbErr) {
                    console.error('Thumbnail generation error:', thumbErr);
                }
            }

            // Update user's post count
            await User.findByIdAndUpdate(req.userId, { $inc: { postsCount: 1 } });

            // Populate user info for the response
            await post.populate('userId', 'username displayName avatar');

            res.status(201).json({
                message: isVideo && file.path ? 'Video uploaded. Processing...' : 'Uploaded successfully',
                post
            });
        } catch (error) {
            if (req.file && req.file.path) deleteFile(req.file.path);
            console.error('Create post error:', error);
            res.status(500).json({ error: 'Failed to create post' });
        }

    });
});


// Get feed - Global discovery feed (all posts from all users)
router.get('/feed', authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        // Get ALL posts from ALL users, sorted by newest first
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'username displayName avatar');

        // Check if current user has liked each post
        const postsWithLikeStatus = posts.map(post => {
            const postObj = post.toObject();
            postObj.isLiked = post.likes.some(like => like.toString() === req.userId.toString());
            return postObj;
        });

        res.json({
            posts: postsWithLikeStatus,
            page: parseInt(page),
            hasMore: posts.length === parseInt(limit)
        });
    } catch (error) {
        console.error('Get feed error:', error);
        res.status(500).json({ error: 'Failed to fetch feed' });
    }
});


// Get user's posts
router.get('/user/:username', optionalAuth, async (req, res) => {
    try {
        const { username } = req.params;
        const { page = 1, limit = 12 } = req.query;
        const skip = (page - 1) * limit;

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const posts = await Post.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'username displayName avatar');

        // Check if current user has liked each post
        const postsWithLikeStatus = posts.map(post => {
            const postObj = post.toObject();
            postObj.isLiked = req.userId ? post.likes.some(like => like.toString() === req.userId.toString()) : false;
            return postObj;
        });

        res.json({ posts: postsWithLikeStatus, page: parseInt(page), hasMore: posts.length === parseInt(limit) });
    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Like/Unlike post
router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const likeIndex = post.likes.indexOf(req.userId);

        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
            post.likesCount -= 1;
        } else {
            // Like
            post.likes.push(req.userId);
            post.likesCount += 1;
        }

        await post.save();

        res.json({
            message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
            likesCount: post.likesCount,
            isLiked: likeIndex === -1
        });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
});

// Add comment
router.post('/:id/comment', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Comment cannot be empty' });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = new Comment({
            postId: post._id,
            userId: req.userId,
            content: content.trim()
        });

        await comment.save();

        // Update post's comment count
        post.commentsCount += 1;
        await post.save();

        // Populate user info
        await comment.populate('userId', 'username displayName avatar');

        res.status(201).json({ comment });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Get comments for a post
router.get('/:id/comments', optionalAuth, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const comments = await Comment.find({ postId: req.params.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'username displayName avatar');

        res.json({ comments, page: parseInt(page), hasMore: comments.length === parseInt(limit) });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if user owns the post
        if (post.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ error: 'You can only delete your own posts' });
        }

        // Delete media files
        const mediaPath = path.join(__dirname, '..', post.mediaUrl);
        deleteFile(mediaPath);

        if (post.thumbnail) {
            const thumbnailPath = path.join(__dirname, '..', post.thumbnail);
            deleteFile(thumbnailPath);
        }

        // Delete comments
        await Comment.deleteMany({ postId: post._id });

        // Delete post
        await Post.findByIdAndDelete(post._id);

        // Update user's post count
        await User.findByIdAndUpdate(req.userId, { $inc: { postsCount: -1 } });

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

module.exports = router;
