import * as userService from '../services/user.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../middleware/errorHandler.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';
import User from '../models/User.js';

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
 * POST /api/users/profile/avatar
 * Upload avatar (protected).
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please select an image to upload', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const result = await uploadImage(req.file.buffer, 'nimisham/profiles');

    if (user.avatar && user.avatar.includes('cloudinary.com')) {
      try {
        const parts = user.avatar.split('/upload/');
        if (parts.length === 2) {
          const pathParts = parts[1].split('/');
          if (pathParts[0].match(/^v\d+$/)) {
            pathParts.shift();
          }
          const publicIdWithExt = pathParts.join('/');
          const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
          if (publicId) {
            await deleteImage(publicId);
          }
        }
      } catch (err) {
        console.error('Failed to delete old avatar:', err);
      }
    }

    user.avatar = result.secure_url;
    await user.save({ validateBeforeSave: false });

    sendSuccess(res, 200, 'Profile photo updated', { user: user.toJSON() });
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
