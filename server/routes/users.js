const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const uploadService = require('../services/uploadService');

router.get('/search', userController.searchUsers);
router.get('/:username', userController.getProfile);
router.put('/profile', auth, uploadService.upload.single('avatar'), userController.updateProfile);
router.post('/:id/follow', auth, userController.followUser);
router.delete('/:id/follow', auth, userController.unfollowUser);

module.exports = router;
