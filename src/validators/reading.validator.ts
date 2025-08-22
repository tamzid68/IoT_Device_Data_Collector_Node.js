import { query } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.middleware';

/**
 * An array of validation middleware for the get readings endpoint.
 * It validates the query parameters for fetching historical data.
 */
export const getReadingsValidator = [
    query('device_id')
        .notEmpty().withMessage('device_id is a required query parameter.')
        .isString().withMessage('device_id must be a string.'),

    query('start_time')
        .optional()
        .isISO8601().withMessage('start_time must be a valid ISO 8601 date string.')
        .toDate(), // Sanitizer to convert to a Date object

    query('end_time')
        .optional()
        .isISO8601().withMessage('end_time must be a valid ISO 8601 date string.')
        .toDate(), // Sanitizer to convert to a Date object

    query('limit')
        .optional()
        .isInt({ min: 1, max: 1000 }).withMessage('limit must be an integer between 1 and 1000.')
        .toInt(), // Sanitizer to convert to an integer

    query('sort')
        .optional()
        .isIn(['asc', 'desc']).withMessage('sort must be either "asc" or "desc".')
        .toLowerCase(),

    // This must be the last item in the array to process the validation results.
    handleValidationErrors,
];