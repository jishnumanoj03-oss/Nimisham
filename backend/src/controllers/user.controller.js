import * as userService from '../services/user.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * GET /api/users/profile
 * Get own profile (protected).
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getOwnProfile(req.user._id);
    sendSuccess(res, 200, 'Profile retrieved', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile
 * Update own profile (protected).
 */
export const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    sendSuccess(res, 200, 'Profile updated', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:username
 * Get public profile by username.
 */
export const getPublicProfile = async (req, res, next) => {
  try {
    const user = await userService.getPublicProfile(req.params.username);
    sendSuccess(res, 200, 'Profile retrieved', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users
 * List users (admin only).
 */
export const listUsers = async (req, res, next) => {
  try {
    const { page, limit, role, search } = req.query;
    const result = await userService.listUsers({ page, limit, role, search });
    sendSuccess(res, 200, 'Users retrieved', result);
  } catch (error) {
    next(error);
  }
};
