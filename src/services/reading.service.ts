import { ReadingModel, GetReadingsParams, AggregateStat } from '../models/reading.model';
import { executeQuery } from '../configs/database.config';
import logger from '../utils/logger.utils';

// The service can return a partial model to match the desired API response
type ReadingQueryResult = Pick<ReadingModel, 'temperature' | 'humidity' | 'reading_time'>;




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

export const aggregateStats = async (params: GetReadingsParams): Promise<AggregateStat[]> => {
    const {
        device_id,
        start_time,
        end_time,
        interval = 'day',
    } = params;

    if (!device_id) {
        throw new Error('device_id is required to aggregate statistics.');
    }

    //Whitelist interval to prevent SQL injection, as it's injected directly into the query.
    const validIntervals = ['day', 'week', 'month'];
    if (!validIntervals.includes(interval)) {
        throw new Error(`Invalid interval. Must be one of: ${validIntervals.join(', ')}`);
    }
    const queryParams: (string | Date)[] = [device_id];
    let paramIndex = 2;

    let timeFilter = '';
    if (start_time) {
        timeFilter += ` AND reading_time >= $${paramIndex++}`;
        queryParams.push(start_time);
    }
    if (end_time) {
        timeFilter += ` AND reading_time <= $${paramIndex++}`;
        queryParams.push(end_time);
    }

    const queryText = `
        SELECT 
            DATE_TRUNC('${interval}', reading_time) AS date,
            ROUND(AVG(temperature), 2) AS avg_temp,
            MIN(temperature) AS min_temp,
            MAX(temperature) AS max_temp,
            ROUND(AVG(humidity), 2) AS avg_humidity,
            COUNT(*)::INT AS count
        FROM readings
        WHERE device_id = $1 ${timeFilter}
        GROUP BY date
        ORDER BY date ASC;
    `;

    try {
        const { rows } = await executeQuery(queryText, queryParams);
        return rows;
    } catch (error) {
        logger.error(`Database error in aggregateStats for device: ${device_id}`, { error });
        throw new Error('Failed to retrieve aggregate statistics from the database.');
    }
};