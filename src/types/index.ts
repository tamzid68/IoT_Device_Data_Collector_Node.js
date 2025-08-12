export interface Device {
    id: string;
    name: string;
    type: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface Data {
    deviceId: string;
    timestamp: Date;
    value: number;
    metadata?: Record<string, any>;
}

export interface Alert {
    id: string;
    deviceId: string;
    threshold: number;
    triggered: boolean;
    createdAt: Date;
    updatedAt: Date;
}