import express from 'express';
import { globalSearch } from '../controllers/search.controller.js';

const router = express.Router();

// Search endpoint (Publicly accessible, no auth required usually)
router.get('/', globalSearch);

export default router;
