// Define constants for valid alert properties. This creates a single source of truth.
export const ALERT_METRICS = ['temperature', 'humidity'] as const;
export const ALERT_THRESHOLD_TYPES = ['min', 'max'] as const;

// Derive TypeScript types from the constants.
export type AlertMetric = typeof ALERT_METRICS[number];
export type AlertThresholdType = typeof ALERT_THRESHOLD_TYPES[number];


// Represents an alert configuration/threshold stored in the database.

export interface AlertModel {
    alert_id: number;
    device_id: string;
    metric: AlertMetric;
    threshold_type: AlertThresholdType;
    threshold_value: number;
    created_at: Date;   
}

// Represents the payload for creating a new alert configuration.

export type CreatesAlertPayload = Omit<AlertModel, 'alert_id' | 'created_at'>;

// Represents a triggered alert event.

export interface AlertEventModel {
    event_id: number;
    alert_id: number;
    device_id: string;
    metric: AlertMetric;
    current_value: number;
    triggered_at: Date;
}