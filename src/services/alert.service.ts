import { count } from "console";
import { executeQuery } from "../configs/database.config";
import * as alertModel from "../models/alert.model";
import logger from "../utils/logger.utils";

interface Reading {
    temperature?: number;
    humidity?: number;
}

// Creates a new alert configurtion in the database.
export const createAlert = async (payload: alertModel.CreatesAlertPayload): Promise<alertModel.AlertModel> => {
    const { device_id, metric, threshold_type, threshold_value } = payload;
    const query = `
    INSERT INTO alerts (device_id, metric, threshold_type, threshold_value)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const values = [device_id, metric, threshold_type, threshold_value];
    const { rows } = await executeQuery(query, values);
    return rows[0];
};

// Finds all alert configurations for a specific device.

export const findAlertsByDevice = async (device_id: string): Promise<alertModel.AlertModel[]> => {
    const query = `SELECT * FROM alerts WHERE device_id = $1 ORDER BY created_at ASC;`;
    const { rows } = await executeQuery(query, [device_id]);
    return rows;
};

// Triggers an alert by logging it and savin an event to the database.
const triggerAlert = async (alert: alertModel.AlertModel, currentValue: number) => {

    logger.warn(`ALERT TRIGGERED: Device ${alert.device_id} - ${alert.metric} (${currentValue}) 
            is outside threshold (${alert.threshold_type} ${alert.threshold_value})`);

    const query = `
            INSERT INTO alert_events (alert_id, device_id, metric, current_value)
        VALUES ($1, $2, $3, $4);
            `;
    const values = [alert.alert_id, alert.device_id, alert.metric, currentValue];
    await executeQuery(query, values);
};

// Checks a new reading against all configured alerts for a device.
// This function is designed to not throw errors, ensuring that a failure
// in the alerting system does not prevent data ingestion.

export const checkAlerts = async (device_id: string, reading: Reading) => {
    try {
        const alerts = await findAlertsByDevice(device_id);
        if (alerts.length === 0)
            return;// No alerts configured for this device.

        for (const alert of alerts) {
            //The model should enforce that metric is either 'temperature' or 'humidity'.
            const value = reading[alert.metric as keyof Reading];
            if (value === undefined || value === null) continue;// No relevant data in the reading.

            const isMaxBreached = alert.threshold_type === 'max' && value > alert.threshold_value;
            const isMinBreached = alert.threshold_type === 'min' && value < alert.threshold_value;

            if (isMaxBreached || isMinBreached) {
                await triggerAlert(alert, value);
            }
        }

    } catch (error: any) {
        logger.error(`Error checking alerts for device ${device_id}: ${error.message}`);
    }
}

// Retrieves all alert events for a specific device.
export const findAlertsEventsByDevice = async (device_id: string): Promise<alertModel.AlertEventModel[]> => {
    const query = `SELECT * FROM alert_events WHERE device_id = $1 ORDER BY event_id DESC;`;
    const { rows } = await executeQuery(query, [device_id]);
    return rows;
}