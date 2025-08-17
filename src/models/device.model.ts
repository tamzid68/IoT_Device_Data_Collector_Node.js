export interface DeviceModel {
    id: number;
    device_id: string;
    name: string;
    location: string | null;
    owner_email: string;
    api_key: string;
    model: string | null;
    firmware: string | null;
    created_at: Date;
    last_seen: Date | null;
}
