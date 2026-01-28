const promptService = require('../services/promptService');

/**
 * Prompt Controller - Handles HTTP requests and responses
 */

exports.getPrompts = async (req, res) => {
    try {
        const result = await promptService.getPrompts(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPromptById = async (req, res) => {
    try {
        const prompt = await promptService.getPromptById(req.params.id);
        res.json({ prompt });
    } catch (error) {
        if (error.message === 'Prompt not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.createPrompt = async (req, res) => {
    try {
        const prompt = await promptService.createPrompt(req.body, req.user._id);
        res.status(201).json({ prompt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePrompt = async (req, res) => {
    try {
        const prompt = await promptService.updatePrompt(req.params.id, req.user._id, req.body);
        res.json({ prompt });
    } catch (error) {
        if (error.message === 'Prompt not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Unauthorized') {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.deletePrompt = async (req, res) => {
    try {
        const result = await promptService.deletePrompt(req.params.id, req.user._id);
        res.json(result);
    } catch (error) {
        if (error.message === 'Prompt not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Unauthorized') {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};
