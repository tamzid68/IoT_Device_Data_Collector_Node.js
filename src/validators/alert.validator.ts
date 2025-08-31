import {body, query} from 'express-validator';
import { handleValidationErrors } from '../middleware/validation.middleware';

const validMetrics = ['temperature', 'humidity'];
const validThresholdTypes = ['min','max'];

export const createAlertValidator = [
    body('device_id').isString().notEmpty().withMessage('device_id is required and must be a non-empty string'),
    body('metric').isIn(validMetrics).withMessage(`metric must be one of: ${validMetrics.join(', ')}`),
    body('threshold_type').isIn(validThresholdTypes).withMessage(`threshold_type must be one of: ${validThresholdTypes.join(', ')}`),
    body('threshold_value').isNumeric().withMessage('threshold_value must be a valid number'),
    handleValidationErrors,
];

export const getAlertsValidator = [
    query('device_id').isString().notEmpty().withMessage('device_id is required and must be a non-empty string'),
    handleValidationErrors,
]; 