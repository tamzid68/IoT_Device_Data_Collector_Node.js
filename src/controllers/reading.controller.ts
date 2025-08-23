import { Request, Response } from 'express';
import logger from '../utils/logger.utils';
import { findReadings } from '../services/reading.service';

// This type should match the `GetReadingsParams` in your service.
// It ensures the controller builds the correct object for the service.
type ReadingParams = {
    device_id: string;
    start_time?: Date;
    end_time?: Date;
    limit?: number;
    sort?: 'asc' | 'desc';
};

export const getReadings = async (req: Request, res: Response) => {
    try {
        const { device_id} = req.query;

        // if (!device_id || typeof device_id !== 'string') {
        //     return res.status(400).json({ error: 'device_id query parameter is required.' });
        // }

        const params: ReadingParams = { device_id: device_id as string };

    

        const readings = await findReadings(params);

        res.status(200).json({
            device_id: device_id,
            count: readings.length,
            readings: readings
        });
    } catch (error: any) {
        logger.error(`Error fetching readings: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}