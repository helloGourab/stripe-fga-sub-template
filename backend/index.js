import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, closeDB } from './src/lib/mongoClient.js';

// Route Imports
import userRouter from './src/modules/user/user.routes.js';
import blogRouter from './src/modules/blog/blog.routes.js';
import paymentRouter from './src/modules/payment/payment.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Database Connection
connectDB();

// 2. Cross-Origin Resource Sharing
app.use(cors());

/** * 3. Specialized Routes 
 * We mount paymentRouter BEFORE express.json() because the webhook 
 * endpoint needs the raw body to verify Stripe signatures.
 */
app.use('/api/payment', paymentRouter);

// 4. Global Middleware for other routes
app.use(express.json());

// 5. Standard API Routes
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is spitting fire' });
});

// 6. Start Server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Webhook tunnel should point to http://localhost:${PORT}/api/payment/webhook`);
});

/**
 * 7. Graceful Shutdown
 * Handles Ctrl+C (SIGINT) and Nodemon restarts (SIGTERM)
 */
const handleShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Shutting down...`);
    await closeDB();
    server.close(() => {
        console.log('Process terminated.');
        process.exit(0);
    });
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));