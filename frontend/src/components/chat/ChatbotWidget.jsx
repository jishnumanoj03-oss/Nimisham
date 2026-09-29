import { useState, useRef, useEffect } from 'react';
import { aiService } from '../../services/aiService';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Nimisham AI. I can help with photography, AI art, tutorials, creative workflows, and using the platform. How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await aiService.sendMessage(userMessage.content);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, I encountered an error: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col bg-nim-bg-elevated border border-nim-border rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-nim-primary text-white flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Bot size={20} />
                  Nimisham AI
                </h3>
                <p className="text-xs opacity-80">Ask me anything about Nimisham</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-nim-bg">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-nim-primary/20 text-nim-primary'
                        : 'bg-nim-bg-elevated border border-nim-border text-nim-text'
                    }`}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-nim-primary text-white rounded-tr-none'
                        : 'bg-nim-bg-elevated border border-nim-border text-nim-text rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-nim-bg-elevated border border-nim-border text-nim-text">
                    <Bot size={16} />
                  </div>
                  <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-nim-bg-elevated border border-nim-border text-nim-text rounded-tl-none flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-nim-primary" />
                    <span className="text-sm opacity-70">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-nim-bg-elevated border-t border-nim-border">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full bg-nim-bg border border-nim-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nim-primary resize-none h-[50px] custom-scrollbar"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-nim-primary text-white rounded-lg hover:bg-nim-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send Message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-nim-primary text-white rounded-full shadow-xl flex items-center justify-center hover:bg-nim-primary-hover transition-colors"
        aria-label="Toggle AI Chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
}
