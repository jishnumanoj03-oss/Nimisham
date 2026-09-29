import express from 'express';
import { chatWithAI } from '../controllers/ai.controller.js';
// We'll protect it if appropriate, but since we don't know yet, let's use the protect middleware if needed.
// Wait, the prompt says "If authentication is already required for major application functionality, protect the AI endpoint using the EXISTING authentication middleware. DO NOT create a new auth middleware. If the chatbot is intentionally public, do not unnecessarily introduce authentication." 
// I'll check how auth is used before deciding. For now I'll just leave it public or add it later.
const router = express.Router();

router.post('/chat', chatWithAI);

export default router;
