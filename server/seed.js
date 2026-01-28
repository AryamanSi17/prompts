const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Prompt = require('./models/Prompt');
const { videoPromptTemplate } = require('./data/videoPrompts');
require('dotenv').config();

const seed = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected. Cleaning existing prompts...');
        await Prompt.deleteMany({});

        // Seed Video Prompts
        console.log('Seeding video prompts...');
        const videoPrompts = videoPromptTemplate.flatMap(cat =>
            cat.prompts.map(p => ({
                title: cat.category,
                prompt: p, // Corrected from content to prompt
                type: 'video',
                category: cat.category
            }))
        );
        await Prompt.insertMany(videoPrompts);
        console.log(`Inserts ${videoPrompts.length} video prompts.`);

        // Seed CSV Prompts as "text" type for the engine library
        console.log('Seeding text prompts from CSV...');
        const textPrompts = [];
        let count = 0;

        fs.createReadStream('./nano-banana-pro-prompts-20260124.csv')
            .pipe(csv())
            .on('data', (data) => {
                if (count < 10000) {
                    textPrompts.push({
                        title: data.title || 'Untitled Engine',
                        description: data.description || '',
                        prompt: data.content || '', // Corrected from content to prompt
                        type: 'text',
                        category: data.category || 'general'
                    });
                    count++;
                }
            })
            .on('end', async () => {
                // Batch insert to be efficient
                const batchSize = 1000;
                for (let i = 0; i < textPrompts.length; i += batchSize) {
                    const batch = textPrompts.slice(i, i + batchSize);
                    await Prompt.insertMany(batch);
                    console.log(`Inserted batch ${i / batchSize + 1}...`);
                }

                console.log(`Seeding completed. Total prompts: ${await Prompt.countDocuments()}`);
                process.exit();
            });
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seed();
