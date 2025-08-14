import { Request, Response } from 'express';
import * as deviceService from '../services/device.service';
import logger from '../utils/logger.utils';

export const registerDevice = async (req: Request, res: Response) => {
    // The body is already validated by the registerDeviceValidator middleware
    const { name, location, owner_email, model, firmware } = req.body;
    try {
        const { newDevice, apiKey } = await deviceService.createDevice({
            name,
            location,
            owner_email,
            model,
            firmware,
        });

        res.status(201).json({ message: 'Device registered successfully', device: newDevice, apiKey });
    } catch (error) {
        logger.error('Error registering device:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};