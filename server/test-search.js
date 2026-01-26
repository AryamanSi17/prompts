// Quick test script to check if msinha1812 exists in database
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prompts')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Search for the user
        const searchQuery = 'msinha1812';
        const users = await User.find({
            $or: [
                { username: { $regex: searchQuery, $options: 'i' } },
                { displayName: { $regex: searchQuery, $options: 'i' } }
            ]
        }).select('username displayName email isVerified');

        console.log('Search results for "msinha1812":');
        console.log(users);

        // Also try exact match
        const exactUser = await User.findOne({ username: 'msinha1812' });
        console.log('\nExact match for username "msinha1812":');
        console.log(exactUser);

        // List all users
        const allUsers = await User.find({}).select('username displayName').limit(10);
        console.log('\nFirst 10 users in database:');
        console.log(allUsers);

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
