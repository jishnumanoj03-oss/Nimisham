import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get user's own profile.
 */
export const getOwnProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

/**
 * Update user profile.
 */
export const updateProfile = async (userId, updates) => {
  const allowedFields = ['name', 'username', 'bio', 'avatar', 'creatorType', 'skills', 'socialLinks'];

  // Filter to only allowed fields
  const filteredUpdates = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  }

  // If username is being changed, check uniqueness
  if (filteredUpdates.username) {
    const existing = await User.findOne({
      username: filteredUpdates.username,
      _id: { $ne: userId },
    });
    if (existing) {
      throw new AppError('Username already taken', 409);
    }
  }

  // If setting creatorType, update role to creator
  if (filteredUpdates.creatorType && filteredUpdates.creatorType !== null) {
    filteredUpdates.role = 'creator';
  }

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * Get public profile by username.
 */
export const getPublicProfile = async (username) => {
  const user = await User.findOne({ username, isActive: true }).select(
    'name username avatar bio creatorType skills socialLinks role createdAt'
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * List users (admin only).
 */
export const listUsers = async ({ page = 1, limit = 20, role, search }) => {
  const query = {};

  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
