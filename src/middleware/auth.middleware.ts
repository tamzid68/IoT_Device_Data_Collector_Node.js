import { Request, Response, NextFunction } from 'express';
import { executeQuery } from '../configs/database.config';
import { DeviceModel } from '../models/device.model';
import logger from '../utils/logger.utils';

export const authenticateDevice = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
        return res.status(401).json({ message: 'Unauthorized: API key is missing or invalid.' });
    }

    try{
        const query = 'SELECT * FROM devices WHERE api_key = $1';
        // The executeQuery function is not generic, so we call it without type arguments.
        const result = await executeQuery(query, [apiKey]);

        if (result.rows.length === 0) {
            return res.status(403).json({ message: 'Forbidden: Invalid API key.' });
        }
        // Attach the found device to the request object for use in subsequent handlers.
        // We use a type assertion here to ensure type safety.
        req.device = result.rows[0] as DeviceModel;
        next();

    }catch (error:any) {
        logger.error('Error authenticating device:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}