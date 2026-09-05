import express from 'express';
import {
  createProcess,
  getProcessByArtworkId,
  updateProcess,
  deleteProcess,
} from '../controllers/process.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('creator', 'admin'), createProcess);

router.route('/artwork/:artworkId')
  .get(getProcessByArtworkId);

router.route('/:id')
  .put(protect, authorize('creator', 'admin'), updateProcess)
  .delete(protect, authorize('creator', 'admin'), deleteProcess);

export default router;
