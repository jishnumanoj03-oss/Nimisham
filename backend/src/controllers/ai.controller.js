import { GoogleGenAI } from '@google/genai';
import env from '../config/env.js';

let ai = null;
if (env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY
  });
}

const SYSTEM_INSTRUCTION = `You are the Nimisham AI Assistant. Your primary purpose is to help users with photography, AI art, image editing, creative workflows, camera settings, photography techniques, tutorials, presets, AI prompts, portfolio creation, marketplace usage, buying/selling digital creative resources, live sessions, and general navigation/use of the Nimisham platform. 

Tone: friendly, concise, helpful, professional, and creator-focused.
Do not pretend that you have access to the user's private database information (e.g., "I can see your portfolio", "I checked your orders", or "I accessed your account") unless explicitly supplied in the prompt.
If the user asks something unrelated, answer normally when appropriate, but try to keep the assistant focused on its role.`;

export const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length > 2000) {
      return res.status(400).json({ success: false, message: 'Message is too long' });
    }

    console.log(`[AI Controller] Received chat request. Message length: ${trimmedMessage.length}`);
    console.log(`[AI Controller] GEMINI_API_KEY configured: ${!!ai}`);

    if (!ai) {
      console.error('[AI Controller] AI chat requested but GEMINI_API_KEY is missing');
      return res.status(500).json({ success: false, message: 'AI service is currently unavailable (Missing API Key configuration)' });
    }

    console.log('[AI Controller] Starting Gemini API request...');
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: trimmedMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    console.log('[AI Controller] Gemini API request completed successfully.');

    const reply = response.text || '';

    return res.status(200).json({
      success: true,
      data: {
        reply
      }
    });

  } catch (error) {
    console.error('[AI Controller] Gemini API error:', error.message);
    if (error.status) {
      console.error('[AI Controller] Gemini API error status:', error.status);
    }
    
    // Check for rate limit or specific Gemini errors if possible
    if (error.status === 429 || error?.message?.includes('429')) {
       return res.status(429).json({ success: false, message: 'AI quota exceeded. Please try again later.' });
    }
    
    // Fallback error
    res.status(500).json({ success: false, message: 'An error occurred while communicating with the AI service' });
  }
};
