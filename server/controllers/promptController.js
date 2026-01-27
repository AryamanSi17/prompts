const Prompt = require('../models/Prompt');

exports.getPrompts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            type = '',
            sort = 'newest'
        } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { prompt: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (type && type !== 'all') {
            query.type = type;
        }

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

        res.json({
            prompts,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPromptById = async (req, res) => {
    try {
        const prompt = await Prompt.findById(req.params.id);
        if (!prompt) {
            return res.status(404).json({ error: 'Prompt not found' });
        }

        prompt.usageCount += 1;
        await prompt.save();

        res.json({ prompt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPrompt = async (req, res) => {
    try {
        const { title, prompt, type, tags, category } = req.body;

        const newPrompt = new Prompt({
            title,
            prompt,
            type,
            tags: tags || [],
            category,
            userId: req.user._id
        });

        await newPrompt.save();
        res.status(201).json({ prompt: newPrompt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePrompt = async (req, res) => {
    try {
        const prompt = await Prompt.findById(req.params.id);
        if (!prompt) {
            return res.status(404).json({ error: 'Prompt not found' });
        }

        if (prompt.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        Object.assign(prompt, req.body);
        await prompt.save();

        res.json({ prompt });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePrompt = async (req, res) => {
    try {
        const prompt = await Prompt.findById(req.params.id);
        if (!prompt) {
            return res.status(404).json({ error: 'Prompt not found' });
        }

        if (prompt.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await prompt.deleteOne();
        res.json({ message: 'Prompt deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
