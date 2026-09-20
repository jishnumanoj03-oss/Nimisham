import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.js';
import { updateProfileValidator } from '../validators/user.validator.js';
import upload from '../middleware/upload.js';

const router = Router();

// Protected routes — require authentication
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, updateProfileValidator, validate, userController.updateProfile);
router.post('/profile/avatar', protect, upload.single('avatar'), userController.uploadAvatar);

// Admin-only route
router.get('/', protect, authorize('admin'), userController.listUsers);

// Public route — get profile by username
router.get('/:username', userController.getPublicProfile);

export default router;
