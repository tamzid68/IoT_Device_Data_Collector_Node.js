import { Router } from 'express';
import { ingestData } from '../controllers/data.controller';
import { authenticateDevice } from '../middleware/auth.middleware';
import { ingestDataValidator } from '../validators/data.validator';

const router = Router();

router.post('/', authenticateDevice, ingestDataValidator, ingestData);

export default router;