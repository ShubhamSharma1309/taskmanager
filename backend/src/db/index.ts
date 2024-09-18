import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

const DB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`Database connected`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default DB;
