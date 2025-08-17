export interface ReadingModel {
    reading_id: number;
    device_id: string;
    temperature: number | null;
    humidity: number | null;
    reading_time: Date;
    created_at: Date;
}