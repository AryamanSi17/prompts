const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', promptController.getPrompts);
router.post('/', authMiddleware, promptController.createPrompt);
router.get('/:id', promptController.getPromptById);
router.put('/:id', authMiddleware, promptController.updatePrompt);
router.delete('/:id', authMiddleware, promptController.deletePrompt);

module.exports = router;
