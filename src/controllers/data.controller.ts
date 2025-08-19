import { Request, Response } from "express";
import { saveReading } from "../services/data.service";
import logger from '../utils/logger.utils';

export const ingestData = async (req: Request, res: Response) => {
    // The `apiKeyAuth` middleware guarantees `req.device` exists.
    // We use the non-null assertion operator `!` to tell TypeScript this and
    // access the `device_id` from the device object.
    const deviceId = req.device!.device_id;
    const payload = req.body;

    try {
        const newReading = await saveReading(deviceId, payload);
        // 201 Created is the appropriate response, indicating a new resource was successfully created.
        // We return the ID of the new reading for client-side reference.
        res.status(201).json({ message: 'Reading saved successfully', readingId: newReading.reading_id });
        
    } catch (error: any) {
        logger.error(`Error saving reading for device ${deviceId}:`, error);
        res.status(500).json({ message: 'Internal server error while saving data.' });
    }
};

export const test = async(req: Request, res: Response) => {
    try{
        const result = req.device; // This will contain the authenticated device information
        console.log('Test route hit',result);
        res.status(201).json({
            message: 'Test route hit successfully',
            device: req.device // This will contain the authenticated device information
        });

    }catch (error: any) {
        logger.error('Error in test route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}