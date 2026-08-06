import { body } from 'express-validator';

export const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 80 }).withMessage('Name cannot exceed 80 characters'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters')
    .matches(/^[a-z0-9_]+$/).withMessage('Username can only contain lowercase letters, numbers, and underscores'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),

  body('creatorType')
    .optional()
    .isIn(['photographer', 'ai-artist', 'both']).withMessage('Invalid creator type'),

  body('skills')
    .optional()
    .isArray().withMessage('Skills must be an array'),

  body('skills.*')
    .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('Each skill cannot exceed 30 characters'),

  body('avatar')
    .optional()
    .trim(),

  body('socialLinks')
    .optional()
    .isObject().withMessage('Social links must be an object'),
];
