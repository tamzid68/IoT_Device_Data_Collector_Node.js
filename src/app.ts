import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import deviceRoutes from './routes/device.routes';
import dataRoutes from './routes/data.routes';
import readingRoutes from './routes/reading.routes';
import alertRoutes from './routes/alert.routes';
import logger from './utils/logger.utils';
import rateLimitMiddleware from './middleware/rateLimit';
import { connectToPostgreSQL, testDatabaseConnection } from './configs/database.config';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimitMiddleware); // Apply rate limiting to all requests
app.use(express.urlencoded({ extended: true }));

// A simple health check endpoint to verify the server is running
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/data', dataRoutes);
app.use('/api/v1/readings', readingRoutes);
app.use('/api/v1/alerts', alertRoutes);

// Start the server
app.listen(PORT, async () => {
    logger.log(`🚀 Server is running on port ${PORT}`);
    logger.log(`📡 API available at http://localhost:${PORT}`);
    logger.log(`🔗 Try: http://localhost:${PORT}/health`);

    // Connect to PostgreSQL database
    try {
        await connectToPostgreSQL();
        await testDatabaseConnection();

    } catch (error: any) {
        console.error('Error connecting to PostgreSQL:', error);
    }
});
