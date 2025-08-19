import { Request, Response, NextFunction } from 'express';
import { findDeviceByApiKey } from '../services/device.service';
import logger from '../utils/logger.utils';

export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
        return res.status(401).json({ message: 'Unauthorized: API key is missing or invalid.' });
    }

    try{
        const result = await findDeviceByApiKey(apiKey);
        if (!result) {
            return res.status(403).json({ message: 'Forbidden: Invalid API key.' });
        }
        // Attach the found device to the request object. This is type-safe due to the
        // declaration merging in `src/types/index.ts`.
        req.device = result;
        next();

    }catch (error:any) {
        logger.error('Error authenticating device:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}