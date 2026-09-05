import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import * as paymentController from '../controllers/payment.controller.js';

const router = express.Router();

// Protected routes
router.use(protect);

router.post('/checkout-session', paymentController.createCheckoutSession);

export default router;
