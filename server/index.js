const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const promptRoutes = require('./routes/prompts');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prompts')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
