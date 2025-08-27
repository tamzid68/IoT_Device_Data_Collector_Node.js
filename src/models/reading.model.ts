export interface ReadingModel {
    reading_id: number;
    device_id: string;
    temperature: number | null;
    humidity: number | null;
    reading_time: Date;
    created_at: Date;
}

// export interface ReadingParams = {
//     device_id: string;
//     start_time?: Date;
//     end_time?: Date;
//     limit?: number;
//     sort?: 'asc' | 'desc';
// }
export interface ReadingParams {
    device_id: string;
    start_time?: Date;
    end_time?: Date;
    limit?: number;
    sort?: 'asc' | 'desc';
}

export interface ReadingPayload {
    temperature?: number;
    humidity?: number;
    timestamp?: Date;
    [key: string]: any; // Allow additional properties 
}

export interface GetReadingsParams {
    device_id: string;
    start_time?: Date;
    end_time?: Date;
    limit?: number;
    sort?: 'asc' | 'desc';
}
