import { Router } from 'express';
import { registerDevice } from '../controllers/device.controller';
import { registerDeviceValidator } from '../validators/device.validator';

const router = Router();

router.post('/register', registerDeviceValidator, registerDevice);

export default router;