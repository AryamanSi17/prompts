const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const uploadService = require('../services/uploadService');

router.get('/', auth, postController.getFeed);
router.post('/', auth, uploadService.uploadPost, postController.createPost);
router.get('/user/:username', postController.getUserPosts);
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
