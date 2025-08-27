import { Request, Response } from 'express';
import logger from '../utils/logger.utils';
import { findReadings } from '../services/reading.service';


export const getReadings = async (req: Request, res: Response) => {
    try {
        const queryParams = {
            device_id: req.query.device_id as string,
            start_time: req.query.start_time as Date | undefined,
            end_time: req.query.end_time as Date | undefined,
            limit: req.query.limit as number | undefined,
            sort: req.query.sort as 'asc' | 'desc' | undefined,
        };
        //const { device_id} = req.query;

        // if (!device_id || typeof device_id !== 'string') {
        //     return res.status(400).json({ error: 'device_id query parameter is required.' });
        // }

        //const params: ReadingParams = { device_id: device_id as string };
        const readings = await findReadings(queryParams);

        res.status(200).json({
            device_id: queryParams.device_id,
            count: readings.length,
            readings: readings
        });
    } catch (error: any) {
        logger.error(`Error fetching readings: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export const getAggregateStats = async (req: Request, res: Response) => {
    const queryParams = {
        device_id: req.query.device_id as string,
        start_time: req.query.start_time as Date | undefined,
        end_time: req.query.end_time as Date | undefined,
        interval: req.query.interval as 'hour' | 'day' | 'monthly' | undefined,
    };
    try {
        
        res.status(200).json({
            message: 'Aggregate statistics endpoint - to be implemented',
            query: queryParams
        });
    } catch (error: any) {
        logger.error(`Error fetching aggregate statistics: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}