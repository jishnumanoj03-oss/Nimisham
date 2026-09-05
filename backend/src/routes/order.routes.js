import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

router.use(protect);

router.get('/my-orders', orderController.getMyOrders);

export default router;
