import {Router} from 'express';
import {getReadings} from '../controllers/reading.controller';
import {getReadingsValidator} from '../validators/reading.validator';
const router = Router();

router.get('/',getReadingsValidator, getReadings);


export default router;