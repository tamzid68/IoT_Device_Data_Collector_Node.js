import { pool } from '../configs/database.config';
import { ReadingModel } from '../models/reading.model';
import logger from "../utils/logger.utils";
import { Request } from "express";

interface ReadingPayload {
    temperature?: number;
    humidity?: number;
    timestamp?: Date;
    [key: string]: any; // Allow additional properties 
}

export const saveReading = async (deviceId: string, payload: ReadingPayload): Promise<Pick<ReadingModel, 'reading_id'>> => {

    const { temperature, humidity } = payload;
    // The timestamp is already a Date object thanks to the validator's .toDate() sanitizer.
    const readingTime = payload.timestamp || new Date();
    
    // Get a client from the pool to run multiple queries in a transaction
    const client = await pool.connect();

    try {
        // Start the transaction
        await client.query('BEGIN');

        // 1. Insert the new reading, returning the new reading_id
        const insertReadingQuery = `
            INSERT INTO readings (device_id, temperature, humidity, reading_time)
            VALUES ($1, $2, $3, $4)
            RETURNING reading_id;
        `;
        const readingValues = [deviceId, temperature, humidity, readingTime];
        const readingResult = await client.query(insertReadingQuery, readingValues);
        const newReading = readingResult.rows[0];

        // 2. Update the device's last_seen timestamp to the current time
        const updateDeviceQuery = `UPDATE devices SET last_seen = NOW() WHERE device_id = $1;`;
        await client.query(updateDeviceQuery, [deviceId]);

        // Commit the transaction
        await client.query('COMMIT');

        logger.info(`Saved new reading ${newReading.reading_id} and updated last_seen for device ${deviceId}.`);
        return newReading;
    } catch (error) {
        // If any query fails, roll back the entire transaction
        await client.query('ROLLBACK');
        logger.error(`Transaction failed for device ${deviceId}. Rolling back.`, error);
        throw error; // Re-throw the error to be caught by the controller
    } finally {
        // Always release the client back to the pool
        client.release();
    }
}