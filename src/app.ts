import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import deviceRoutes from './routes/device.routes';
import { connectToPostgreSQL, testDatabaseConnection } from './config/database.config';

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

// Start the server
app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
    console.log(`🔗 Try: http://localhost:${PORT}/api/hello`);

    // Connect to PostgreSQL database
    try {
        await connectToPostgreSQL();
        await testDatabaseConnection();

    } catch (error: any) {
        console.error('Error connecting to PostgreSQL:', error);
    }
});
