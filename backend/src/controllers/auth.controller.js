import * as authService from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, username, email, password, creatorType } = req.body;
    const { user, token } = await authService.registerUser({
      name,
      username,
      email,
      password,
      creatorType,
    });

    sendSuccess(res, 201, 'Registration successful', { user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser({ email, password });

    sendSuccess(res, 200, 'Login successful', { user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Client-side token removal — server acknowledges.
 */
export const logout = async (req, res) => {
  sendSuccess(res, 200, 'Logout successful');
};

/**
 * GET /api/auth/me
 * Get current authenticated user.
 */
export const getMe = async (req, res) => {
  sendSuccess(res, 200, 'User retrieved', { user: req.user });
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    // Always return success to not reveal whether email exists
    sendSuccess(res, 200, 'If an account with that email exists, a reset link has been sent');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/reset-password/:token
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const result = await authService.resetPassword(token, password);

    sendSuccess(res, 200, 'Password reset successful', {
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};
