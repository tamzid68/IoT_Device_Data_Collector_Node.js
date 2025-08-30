
// Represents an alert configuration/threshold stored in the database.

export interface AlertModel {
    alert_id: number;
    device_id: string;
    metric: 'temperature' | 'humidity';
    threshold_type: 'min' | 'max';
    threshould_value: number;
    created_at: Date;   
}

// Represents the payload for creating a new alert configuration.

export interface CreatesAlertPayload {
    device_id: string;
    metric: 'temperature' | 'humidity';
    threshold_type: 'min' | 'max';
    threshold_value: number;
}