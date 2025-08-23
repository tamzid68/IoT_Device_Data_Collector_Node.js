import {ReadingModel} from '../models/reading.model';
import {executeQuery} from '../configs/database.config';
import logger from '../utils/logger.utils';

// The service can return a partial model to match the desired API response
type ReadingQueryResult = Pick<ReadingModel, 'temperature' | 'humidity' | 'reading_time'>;

interface GetReadingsParams {
    device_id: string;
    start_time?: Date;
    end_time?: Date;
    limit?: number;
    sort?: 'asc' | 'desc';
}


export const findReadings = async (params: GetReadingsParams): Promise<ReadingQueryResult[]> => {
    const {
        device_id,
        start_time,
        end_time,
        limit = 50,
        sort = 'desc',
    } = params;

    if (!device_id) {
        throw new Error('device_id is required to find readings.');
    }

    let queryText = `SELECT temperature, humidity, reading_time
        FROM readings
        WHERE device_id = $1`;

    const queryParams: (string | Date | number)[] = [device_id];
    let paramIndex = 2;

    if (start_time) {
        queryText += ` AND reading_time >= $${paramIndex++}`;
        queryParams.push(start_time);
    }

    if (end_time) {
        queryText += ` AND reading_time <= $${paramIndex++}`;
        queryParams.push(end_time);
    }

    const sortOrder = sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    queryText += ` ORDER BY reading_time ${sortOrder} LIMIT $${paramIndex++}`;
    queryParams.push(limit);

    try {
        const { rows } = await executeQuery(queryText, queryParams);
        return rows;
    } catch (error) {
        logger.error(`Database error in findReadings for device: ${device_id}`, { error });
        // Re-throw a more generic error to avoid leaking database-specific details to the caller.
        throw new Error('Failed to retrieve readings from the database.');
    }
};