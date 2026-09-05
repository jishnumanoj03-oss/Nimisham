import express from 'express';
const router = express.Router();

import {
  getTutorials,
  getTutorial,
  createTutorial,
  updateTutorial,
  deleteTutorial,
} from '../controllers/tutorial.controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';

// Public routes (though draft logic is inside controller if user logged in)
router.get('/', getTutorials);
router.get('/:id', getTutorial);

// Protected routes (Creators and Admins only)
router.use(protect);
router.use(authorize('creator', 'admin'));

router.post('/', upload.single('featuredImage'), createTutorial);
router.put('/:id', upload.single('featuredImage'), updateTutorial);
router.delete('/:id', deleteTutorial);

export default router;
