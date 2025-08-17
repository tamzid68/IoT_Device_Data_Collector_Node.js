import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import deviceRoutes from './routes/device.routes';
import dataRoutes from './routes/data.routes';
import { connectToPostgreSQL, testDatabaseConnection } from './configs/database.config';
import logger from './utils/logger.utils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// A simple health check endpoint to verify the server is running
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/data', dataRoutes);

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
