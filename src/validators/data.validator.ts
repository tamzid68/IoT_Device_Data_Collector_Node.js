import {body} from 'express-validator';
import {handleValidationErrors} from '../middleware/validation.middleware';

/**
 * An array of validation middleware for the data ingestion endpoint.
 */
export const ingestDataValidator =[
    //Custom validator to ensure at least one sensor reading is present
    body().custom((value, {req})=>{
        const {temperature, humidity} = req.body;
        if(temperature === undefined && humidity === undefined){
            throw new Error('Payload must contain at least one sensor reading (e.g., temperature, humidity).');
        }
        return true;
    }),

     // Validate 'temperature' if it exists. `checkFalsy: true` allows 0 as a valid value.
    body('temperature').optional({ checkFalsy: true }).isNumeric().withMessage('Temperature must be a number.'),

    // Validate 'humidity' if it exists.
    body('humidity').optional({ checkFalsy: true }).isNumeric().withMessage('Humidity must be a number.'),

    // Validate 'timestamp' if it exists and convert it to a Date object.
    body('timestamp').optional().isISO8601().withMessage('If provided, timestamp must be a valid ISO 8601 date string.').toDate(),

    // This must be the last item in the array to process the validation results.
    handleValidationErrors,
];