import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.js';
import { updateProfileValidator } from '../validators/user.validator.js';

const router = Router();

// Protected routes — require authentication
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, updateProfileValidator, validate, userController.updateProfile);

// Admin-only route
router.get('/', protect, authorize('admin'), userController.listUsers);

// Public route — get profile by username
router.get('/:username', userController.getPublicProfile);

export default router;
