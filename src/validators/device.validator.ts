import { body } from 'express-validator';
import {handleValidationErrors} from '../middleware/validation.middleware';

/**
 * An array of validation middleware for the device registration endpoint.
 * It checks for required fields, validates formats, and sanitizes input.
 */
export const registerDeviceValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Device name is required.')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters.'),

    body('owner_email').isEmail().withMessage('A valid owner email is required.').normalizeEmail(),

    body('location').optional().trim().isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters.'),

    body('model').optional().trim().isLength({ max: 50 }).withMessage('Model cannot exceed 50 characters.'),

    body('firmware').optional().trim().isLength({ max: 50 }).withMessage('Firmware cannot exceed 50 characters.'),

    // This must be the last item in the array to process the validation results.
    handleValidationErrors,
];