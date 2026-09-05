import express from 'express';
import {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} from '../controllers/portfolio.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getPortfolios)
  .post(protect, authorize('creator', 'admin'), upload.single('coverImage'), createPortfolio);

router.route('/:id')
  .get(getPortfolioById)
  .put(protect, authorize('creator', 'admin'), upload.single('coverImage'), updatePortfolio)
  .delete(protect, authorize('creator', 'admin'), deletePortfolio);

export default router;
