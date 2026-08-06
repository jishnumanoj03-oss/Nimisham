import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Try loading from root directory first, then fallback to backend directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/nimisham',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Validate critical env vars in production
if (env.NODE_ENV === 'production') {
  const required = ['JWT_SECRET', 'MONGODB_URI'];
  const missing = required.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Fallback JWT_SECRET for development only
if (!env.JWT_SECRET && env.NODE_ENV === 'development') {
  env.JWT_SECRET = 'dev-secret-change-in-production';
  console.warn('⚠ Using default JWT_SECRET — set a proper secret in .env');
}

export default env;
