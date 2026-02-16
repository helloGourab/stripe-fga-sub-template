import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('MONGO_URI is missing in .env file');
}

/**
 * Singleton connection function
 */
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;

        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

/**
 * Graceful shutdown for Docker/Nodemon
 */
const closeDB = async () => {
    await mongoose.connection.close();
    console.log('🔌 MongoDB Connection Closed');
};

export { connectDB, closeDB };