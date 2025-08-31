import {validationResult} from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * A reusable middleware to handle the results of express-validator.
 * If there are validation errors, it sends a 400 response with details.
 * Otherwise, it passes control to the next middleware in the chain.
 */

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array()});
    }
    next();
}