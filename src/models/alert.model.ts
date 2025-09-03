
// Represents an alert configuration/threshold stored in the database.

export interface AlertModel {
    alert_id: number;
    device_id: string;
    metric: 'temperature' | 'humidity';
    threshold_type: 'min' | 'max';
    threshold_value: number;
    created_at: Date;   
}

// Represents the payload for creating a new alert configuration.

export interface CreatesAlertPayload {
    device_id: string;
    metric: 'temperature' | 'humidity';
    threshold_type: 'min' | 'max';
    threshold_value: number;
}

// Represents a triggered alert event.

export interface AlertEventModel {
    event_id: number;
    alert_id: number;
    device_id: string;
    metric: 'temperature' | 'humidity';
    current_value: number;
    triggered_at: Date;
}