import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import * as deliveryController from '../controllers/delivery.controller.js';

const router = express.Router();

router.use(protect);

router.get('/purchases', deliveryController.getMyPurchases);
router.get('/download/:productId', deliveryController.downloadProduct);

export default router;
