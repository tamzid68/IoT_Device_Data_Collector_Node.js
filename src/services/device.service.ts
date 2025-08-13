import crypto from 'crypto';
//import pool from '../config/db';

interface DeviceRegistrationData {
    name: string;
    location?: string;
    owner_email: string;
}

/**
 * Creates a new device, generates a deviceId and apiKey, and saves it to the database.
 * @param deviceData - The data for the new device.
 * @returns The newly created device and its API key.
 */
export const createDevice = async (deviceData: DeviceRegistrationData) => {
    const { name, location, owner_email } = deviceData;

    const deviceId = `iot-${crypto.randomBytes(8).toString('hex')}`;
    const apiKey = crypto.randomBytes(32).toString('hex');

    const query = `
        INSERT INTO devices (device_id, name, location, owner_email, api_key)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, device_id, name, created_at;
    `;
    const values = [deviceId, name, location, owner_email, apiKey];

    const result = await pool.query(query, values);
    return { newDevice: result.rows[0], apiKey };
};