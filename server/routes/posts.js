const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authMiddleware } = require('../middleware/auth');
const uploadService = require('../services/uploadService');

router.get('/feed', authMiddleware, postController.getFeed);
router.post('/', authMiddleware, uploadService.uploadPost, postController.createPost);
router.get('/user/:username', postController.getUserPosts);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;
