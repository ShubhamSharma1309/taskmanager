import dotenv from 'dotenv';

dotenv.config();

export default {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/taskmanager',
    JWT_SECRET: process.env.JWT_SECRET || 'mysecret',
    JWT_EXPIRE: '1h', 
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development'
};