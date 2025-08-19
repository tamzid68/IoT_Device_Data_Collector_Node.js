import { Router } from 'express';
import { ingestData, test } from '../controllers/data.controller';
import { apiKeyAuth  } from '../middleware/auth.middleware';
import { ingestDataValidator } from '../validators/data.validator';

const router = Router();

router.post('/', apiKeyAuth , ingestDataValidator, ingestData);
router.post('/test', apiKeyAuth , test);

export default router;