import { Request, Response } from 'express';
import logger from '../utils/logger.utils';
import { findReadings } from '../services/reading.service';
import { ReadingParams } from '../models/reading.model';


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