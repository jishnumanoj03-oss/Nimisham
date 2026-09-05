import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import * as marketplaceController from '../controllers/marketplace.controller.js';

const router = express.Router();

// Public routes
router.get('/products', marketplaceController.getProducts);
router.get('/products/:id', marketplaceController.getProductById);

// Protected routes (Creators and Admins)
router.use(protect);
router.use(authorize('creator', 'admin'));

router.post('/products', marketplaceController.createProduct);
router.put('/products/:id', marketplaceController.updateProduct);
router.get('/seller/products', marketplaceController.getSellerProducts);

export default router;
