import { Router } from "express";
import { createAlertHandler } from "../controllers/alert.controller";

const router = Router();

// Note: These endpoints are typically protected by a different authentication
// mechanism (e.g., JWT for a logged-in user) than the device-specific x-api-key.
// For simplicity, we are omitting that middleware here.

router.post('/create', createAlertHandler);

export default router;