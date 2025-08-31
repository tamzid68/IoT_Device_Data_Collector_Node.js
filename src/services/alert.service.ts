import { executeQuery } from "../configs/database.config";
import * as alertModel from "../models/alert.model";
import logger from "../utils/logger.utils";

// Creates a new alert configurtion in the database.
export const createAlert = async (payload: alertModel.CreatesAlertPayload): Promise<alertModel.AlertModel>=> {
    const { device_id, metric, threshold_type, threshold_value } = payload;
    const query = `
    INSERT INTO alerts (device_id, metric, threshold_type, threshold_value)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const values = [device_id, metric, threshold_type, threshold_value ];
    const {rows} = await executeQuery(query, values);
    return rows[0];
};

// Finds all alert configurations for a specific device.

export const getAlerts = async (device_id: string): Promise<alertModel.AlertModel[]> => {
    const query = `SELECT * FROM alerts WHERE device_id = $1 ORDER BY created_at ASC;`;
    const {rows} = await executeQuery(query, [device_id]);
    return rows;
};