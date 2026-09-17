import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
} from '../controllers/session.controller.js';

const router = express.Router();

router.route('/')
  .post(protect, createSession)
  .get(getSessions);

router.route('/:id')
  .get(getSession)
  .put(protect, updateSession)
  .delete(protect, deleteSession);



export default router;
