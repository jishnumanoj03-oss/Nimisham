import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from './errorHandler.js';
import env from '../config/env.js';

/**
 * Protect routes — verify JWT token and attach user to request.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized — no token provided', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Find user and attach to request
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account has been deactivated', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorize specific roles.
 * Must be used AFTER protect middleware.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized — insufficient permissions', 403));
    }

    next();
  };
};
