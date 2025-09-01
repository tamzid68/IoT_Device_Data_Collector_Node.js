import { Router } from "express";
import { createAlertHandler, getAlertsHandler } from "../controllers/alert.controller";
import { createAlertValidator, getAlertsValidator } from "../validators/alert.validator";
const router = Router();

// Note: These endpoints are typically protected by a different authentication
// mechanism (e.g., JWT for a logged-in user) than the device-specific x-api-key.
// For simplicity, we are omitting that middleware here.

// router.post('/create', createAlertValidator, createAlertHandler);
// router.get('/get', getAlertsValidator, getAlertsHandler);
router.post('/', createAlertValidator, createAlertHandler);
router.get('/', getAlertsValidator, getAlertsHandler);


export default router;