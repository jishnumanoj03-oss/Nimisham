import express from 'express';
import { getCreatorStats } from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.get('/creator', getCreatorStats);

export default router;
