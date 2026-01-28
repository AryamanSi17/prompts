const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const uploadService = require('../services/uploadService');

router.get('/search', userController.searchUsers);
router.get('/:username', optionalAuth, userController.getProfile);
router.put('/profile', authMiddleware, uploadService.uploadAvatar, userController.updateProfile);
router.post('/avatar', authMiddleware, uploadService.uploadAvatar, userController.updateProfile);
router.post('/:id/follow', authMiddleware, userController.followUser);
router.post('/:id/unfollow', authMiddleware, userController.unfollowUser);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

module.exports = router;
