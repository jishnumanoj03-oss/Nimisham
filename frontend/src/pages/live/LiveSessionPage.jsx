import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { sessionService } from '../../services/sessionService';
import socketService from '../../services/socketService';
import { Loader, Send, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LiveSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let socket;
    
    const initSession = async () => {
      try {
        const response = await sessionService.getSession(id);
        setSession(response.data.data);
        
        socket = socketService.connect();
        
        socket.emit('join-room', {
          sessionId: id,
          user: {
            _id: user._id,
            name: user.name,
            username: user.username
          }
        });
        
        socket.on('receive-message', (msg) => {
          setMessages(prev => [...prev, msg]);
        });
        
        setLoading(false);
      } catch (err) {
        setError('Live session not found or unable to connect.');
        setLoading(false);
        toast.error('Unable to connect to live session.');
      }
    };
    
    initSession();
    
    return () => {
      if (socket) {
        socket.emit('leave-room', {
          sessionId: id,
          user: {
            name: user.name,
            username: user.username
          }
        });
        socket.off('receive-message');
        socketService.disconnect();
      }
    };
  }, [id, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('send-message', {
        sessionId: id,
        message: inputValue,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username
        }
      });
      
      // Optimistic append
      setMessages(prev => [...prev, {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        userId: user._id,
        username: user.name || user.username,
        message: inputValue,
        timestamp: new Date()
      }]);
      
      setInputValue('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-8 h-8 animate-spin text-[var(--accent)]" />
        <span className="ml-2">Loading session...</span>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex justify-center items-center h-96 text-red-500">
        <p>{error || 'Live session not found.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-80px)] p-4">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-t-lg">
        <div>
          <h1 className="text-xl font-bold">{session.title}</h1>
          <p className="text-sm text-[var(--text-secondary)]">Host: {session.host.name || session.host.username}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium animate-pulse">
            LIVE
          </span>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Leave Session
          </button>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 bg-[var(--bg-secondary)] border-x border-[var(--border)] overflow-y-auto p-4 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)]">
            No messages yet. Be the first to say hello!
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.isSystemMessage) {
              return (
                <div key={msg.id} className="text-center text-sm text-[var(--text-secondary)] my-2">
                  <span className="px-2">──────── {msg.message} ────────</span>
                </div>
              );
            }
            
            const isMe = msg.userId === user._id;
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%] ${isMe ? 'ml-auto' : ''}`}>
                <span className="text-xs text-[var(--text-secondary)] mb-1">
                  {msg.username} • {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className={`px-4 py-2 rounded-2xl ${isMe ? 'bg-[var(--accent)] text-white rounded-tr-sm' : 'bg-[var(--bg-elevated)] border border-[var(--border)] rounded-tl-sm'}`}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            maxLength={500}
            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--accent)]"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg disabled:opacity-50 flex items-center justify-center transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
