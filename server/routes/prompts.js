const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');
const auth = require('../middleware/auth');

router.get('/', promptController.getPrompts);
router.post('/', auth, promptController.createPrompt);
router.get('/:id', promptController.getPromptById);
router.put('/:id', auth, promptController.updatePrompt);
router.delete('/:id', auth, promptController.deletePrompt);

module.exports = router;
