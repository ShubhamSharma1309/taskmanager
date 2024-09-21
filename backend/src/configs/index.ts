import dotenv from 'dotenv';

dotenv.config();

export default {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/taskmanager',
    JWT_SECRET: process.env.JWT_SECRET || 'mysecret',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d', 
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'myrefreshsecret',
    REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || '30d',
    CORS_ORIGIN: (process.env.CLIENT_URL || 'http://localhost:3000').split(',')
};