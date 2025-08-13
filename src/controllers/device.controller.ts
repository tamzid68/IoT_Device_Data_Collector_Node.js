import { Request, Response } from 'express';
import * as deviceService from '../services/device.service';

export const registerDevice = async (req: Request, res: Response) => {
    const { name, location, owner_email } = req.body;

    if (!name || !owner_email) {
        return res.status(400).json({ message: 'Name and owner_email are required' });
    }

    try {
        const { newDevice, apiKey } = await deviceService.createDevice({
            name,
            location,
            owner_email,
        });

        res.status(201).json({ message: 'Device registered successfully', device: newDevice, apiKey });
    } catch (error) {
        console.error('Error registering device:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};