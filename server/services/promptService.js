const Prompt = require('../models/Prompt');

/**
 * Prompt Service - Business logic layer for prompts
 */
class PromptService {
    /**
     * Get prompts with filtering, searching, and pagination
     */
    async getPrompts(filters = {}) {
        const {
            page = 1,
            limit = 10,
            search = '',
            type = '',
            isLibrary = null,
            sort = 'newest'
        } = filters;

        const query = {};

        if (isLibrary !== null) {
            query.isLibrary = isLibrary === 'true' || isLibrary === true;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { prompt: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Type filter
        if (type && type !== 'all') {
            query.type = type;
        }

        // Sort options
        const sortOptions = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            popular: { usageCount: -1 }
        };

        const prompts = await Prompt.find(query)
            .sort(sortOptions[sort] || sortOptions.newest)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .lean();

        const total = await Prompt.countDocuments(query);

        return {
            prompts,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        };
    }

    /**
     * Get a single prompt by ID and increment usage count
     */
    async getPromptById(promptId) {
        const prompt = await Prompt.findById(promptId);

        if (!prompt) {
            throw new Error('Prompt not found');
        }

        // Increment usage count
        prompt.usageCount += 1;
        await prompt.save();

        return prompt;
    }

    /**
     * Create a new prompt
     */
    async createPrompt(promptData, userId) {
        const { title, prompt, type, tags, category } = promptData;

        const newPrompt = new Prompt({
            title,
            prompt,
            type,
            tags: tags || [],
            category,
            userId
        });

        await newPrompt.save();
        return newPrompt;
    }

    /**
     * Update an existing prompt
     */
    async updatePrompt(promptId, userId, updateData) {
        const prompt = await Prompt.findById(promptId);

        if (!prompt) {
            throw new Error('Prompt not found');
        }

        // Check ownership
        if (prompt.userId && prompt.userId.toString() !== userId.toString()) {
            throw new Error('Unauthorized');
        }

        Object.assign(prompt, updateData);
        await prompt.save();

        return prompt;
    }

    /**
     * Delete a prompt
     */
    async deletePrompt(promptId, userId) {
        const prompt = await Prompt.findById(promptId);

        if (!prompt) {
            throw new Error('Prompt not found');
        }

        // Check ownership
        if (prompt.userId && prompt.userId.toString() !== userId.toString()) {
            throw new Error('Unauthorized');
        }

        await prompt.deleteOne();
        return { message: 'Prompt deleted successfully' };
    }
}

module.exports = new PromptService();
