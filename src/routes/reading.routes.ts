import {Router} from 'express';
import {getReadings, getAggregateStats} from '../controllers/reading.controller';
import {getReadingsValidator} from '../validators/reading.validator';
import {apiKeyAuth} from '../middleware/auth.middleware';

const router = Router();

router.get('/',apiKeyAuth,getReadingsValidator, getReadings);
router.get('/stats',getAggregateStats);


export default router;