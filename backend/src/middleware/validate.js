import { validationResult } from 'express-validator';
import { sendError } from '../utils/apiResponse.js';

/**
 * Middleware to check express-validator results.
 * Returns 400 with field-level errors if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return sendError(res, 400, 'Validation failed', formattedErrors);
  }
  next();
};

export default validate;
