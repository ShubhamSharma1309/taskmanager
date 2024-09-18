import mongoose from 'mongoose';
import configs from '../configs';

const DB = async () => {
    try {
        const connect = await mongoose.connect(configs.MONGO_URI as string);
        console.log(`Database connected`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default DB;
