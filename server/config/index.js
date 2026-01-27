module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/prompts',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: '30d',

    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },

    cors: {
        allowedOrigins: [
            'https://nanoprompts.space',
            'https://www.nanoprompts.space',
            'http://localhost:3000'
        ]
    },

    mongoose: {
        options: {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 5
        }
    },

    pagination: {
        defaultLimit: 10,
        maxLimit: 100
    },

    otp: {
        expirationMinutes: 10
    }
};
