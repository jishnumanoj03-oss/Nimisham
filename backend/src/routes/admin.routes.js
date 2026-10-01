import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { getStats, getUsers, deleteContent } from '../controllers/admin.controller.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/content/:type/:id', deleteContent);

export default router;
