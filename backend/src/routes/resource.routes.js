import express from 'express';
const router = express.Router();

import {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
} from '../controllers/resource.controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadRaw } from '../middleware/upload.js';

// Public routes
router.get('/', getResources);
router.get('/:id', getResource);
router.get('/:id/download', downloadResource);

// Protected routes (Creators and Admins only)
router.use(protect);
router.use(authorize('creator', 'admin'));

router.post(
  '/',
  uploadRaw.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  createResource
);

router.put(
  '/:id',
  uploadRaw.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
  updateResource
);

router.delete('/:id', deleteResource);

export default router;
