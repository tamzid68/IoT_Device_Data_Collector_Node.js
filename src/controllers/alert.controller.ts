import { Request, Response } from "express";
import * as alertService from "../services/alert.service";
import { CreatesAlertPayload } from "../models/alert.model";
import logger from "../utils/logger.utils";

export const createAlertHandler = async (req: Request, res: Response) => {
    try {
        const payload: CreatesAlertPayload = req.body;
        const newAlert = await alertService.createAlert(payload);

        res.status(201).json(newAlert);
    } catch (error: any) {
        logger.error('Error creating alert:', error.message);

        if (error.code === '23503')
            return res.status(400).json({ message: 'Invalid device_id. Device does not exist.' });

        res.status(500).json({ message: 'Internal Server Error' });
    }
}