import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validate, authController.resetPassword);

export default router;
