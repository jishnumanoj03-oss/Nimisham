import api from './api';

export const aiService = {
  /**
   * Send a message to the AI Chatbot
   * @param {string} message - The message from the user
   * @returns {Promise<string>} The response text from AI
   */
  async sendMessage(message) {
    try {
      const response = await api.post('/ai/chat', { message });
      return response.data.data.reply;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to communicate with AI');
    }
  }
};
