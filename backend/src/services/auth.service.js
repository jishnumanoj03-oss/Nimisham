import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import env from '../config/env.js';

/**
 * Generate JWT token for a user.
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Register a new user.
 */
export const registerUser = async ({ name, username, email, password, creatorType }) => {
  // Check for existing user by email
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new AppError('Email already registered', 409);
  }

  // Check for existing username
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new AppError('Username already taken', 409);
  }

  // Determine role based on creator type
  const role = creatorType ? 'creator' : 'user';

  const user = await User.create({
    name,
    username,
    email,
    password,
    role,
    creatorType: creatorType || null,
  });

  const token = generateToken(user._id);

  return { user, token };
};

/**
 * Login user with email and password.
 */
export const loginUser = async ({ email, password }) => {
  // Find user and explicitly include password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.isActive) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user._id);

  return { user, token };
};

/**
 * Generate password reset token and return it.
 * In production, this token would be emailed to the user.
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal whether email exists — but still return success
    return null;
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // In development, log the token. In production, send via email.
  if (env.NODE_ENV === 'development') {
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  return resetToken;
};

/**
 * Reset password using token.
 */
export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const jwtToken = generateToken(user._id);

  return { user, token: jwtToken };
};
