import express from 'express';
const router = express.Router();

import {
  getPrompts,
  getPrompt,
  createPrompt,
  updatePrompt,
  deletePrompt,
  getPromptCollections,
  getPromptCollection,
  createPromptCollection,
  updatePromptCollection,
  deletePromptCollection,
} from '../controllers/prompt.controller.js';

import { protect, authorize } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.js';

// --- Prompts ---
router.get('/', getPrompts);
router.get('/:id', getPrompt);

// --- Prompt Collections ---
router.get('/collections/all', getPromptCollections); // Changed route path to avoid conflict with /:id
router.get('/collections/:id', getPromptCollection);

// Protected routes (Creators and Admins only)
router.use(protect);
router.use(authorize('creator', 'admin'));

// Prompts
router.post('/', upload.fields([{ name: 'sampleImages', maxCount: 4 }]), createPrompt);
router.put('/:id', upload.fields([{ name: 'sampleImages', maxCount: 4 }]), updatePrompt);
router.delete('/:id', deletePrompt);

// Prompt Collections
router.post('/collections', upload.single('coverImage'), createPromptCollection);
router.put('/collections/:id', upload.single('coverImage'), updatePromptCollection);
router.delete('/collections/:id', deletePromptCollection);

export default router;
