import { Router } from 'express';
import { ingestData, test } from '../controllers/data.controller';
import { apiKeyAuth  } from '../middleware/auth.middleware';
import { ingestDataValidator } from '../validators/data.validator';

const router = Router();

router.post('/', apiKeyAuth , ingestDataValidator, ingestData);
router.post('/test', apiKeyAuth , test);// test sub-route for testing API key authentication
router.post('/test1' , test);// another test route without authentication for demonstration purposes

export default router;