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