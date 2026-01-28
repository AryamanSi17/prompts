const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Prompt = require('./models/Prompt');
const { videoPromptTemplate } = require('./data/videoPrompts');
require('dotenv').config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Prompt.deleteMany({});

        // Seed Video Prompts
        const videoPrompts = videoPromptTemplate.flatMap(cat =>
            cat.prompts.map(p => ({
                title: cat.category,
                prompt: p,
                type: 'video',
                category: cat.category
            }))
        );
        await Prompt.insertMany(videoPrompts);

        // Seed Photo Prompts from CSV
        const photoPrompts = [];
        fs.createReadStream('./nano-banana-pro-prompts-20260124.csv')
            .pipe(csv())
            .on('data', (data) => {
                if (photoPrompts.length < 10000) { // Increased for better library experience
                    photoPrompts.push({
                        title: data.title,
                        prompt: data.content,
                        type: 'photo',
                        category: data.category || 'photo styles'
                    });
                }
            })
            .on('end', async () => {
                await Prompt.insertMany(photoPrompts);
                console.log('Seeding completed');
                process.exit();
            });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
