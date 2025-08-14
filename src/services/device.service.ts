import crypto from 'crypto';
import {executeQuery} from '../configs/database.config';
import logger from '../utils/logger.utils';

interface DeviceRegistrationData {
    name: string;
    location?: string;
    owner_email: string;
    model?: string;
    firmware?: string;
}

/**
 * Creates a new device, generates a deviceId and apiKey, and saves it to the database.
 * @param deviceData - The data for the new device.
 * @returns The newly created device and its API key.
 */
export const createDevice = async (deviceData: DeviceRegistrationData) => {
    const { name, location, owner_email, model, firmware } = deviceData; // model and firmware are now available
    try {
        const deviceId = `iot-${crypto.randomBytes(8).toString('hex')}`;
        const apiKey = crypto.randomBytes(32).toString('hex');

        const query = `
        INSERT INTO devices (device_id, name, location, owner_email, api_key, model, firmware)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, device_id, name, created_at;
    `;
        const values = [deviceId, name, location, owner_email, apiKey, model, firmware];

        const result = await executeQuery(query, values);
        return { newDevice: result.rows[0], apiKey };
    }
    catch (error: any) {
        logger.error('Error creating device:', error);
        throw error;
    }
};