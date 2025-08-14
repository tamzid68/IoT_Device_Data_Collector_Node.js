import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';

/**
 * Middleware to handle the results of express-validator.
 * If there are validation errors, it sends a 400 response with details.
 * Otherwise, it passes control to the next middleware in the chain.
 */
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    try {
        validationResult(req).throw();
        return next();
    } catch (error: any) {
        // This is a client-side error, not a server error.
        // The `throw()` method populates the error object, which we send back to the client.
        return res.status(400).json({ errors: error.array() });
    }
};

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