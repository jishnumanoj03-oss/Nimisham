import express from 'express';
import {
  uploadArtwork,
  getArtworks,
  getArtworkById,
  updateArtwork,
  deleteArtwork,
} from '../controllers/artwork.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router
  .route('/')
  .get(getArtworks)
  .post(protect, authorize('creator', 'admin'), upload.single('image'), uploadArtwork);

router
  .route('/:id')
  .get(getArtworkById)
  .put(protect, authorize('creator', 'admin'), upload.single('image'), updateArtwork)
  .delete(protect, authorize('creator', 'admin'), deleteArtwork);

export default router;
