import {Request, Response} from 'express';
import logger from '../utils/logger.utils';
import {findReadings} from '../services/reading.service';

export const getReadings = async (req: Request, res: Response)=>{
    const queryParams = {
        device_id: req.query.device_id as string,
        start_date: req.query.start_date as Date | undefined,
        end_time: req.query.end_time as Date | undefined,
        limit: req.query.limit as string | undefined,
        sort: req.query.sort as string | undefined
    };
    try{

        const readings = await findReadings(queryParams);

        res.status(200).json({
            device_id:  queryParams.device_id,
            count: readings.length,
            readings: readings
        });

    }catch(error:any){
        logger.error(`Error fetching readings: ${error.message}`);
        res.status(500).json({error: 'Internal Server Error'});
    }
    
}