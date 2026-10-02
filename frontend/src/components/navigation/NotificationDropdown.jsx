import { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import Avatar from '../ui/Avatar';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      if (res.success) {
        setUnreadCount(res.data.count);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch (err) {
      setError('Unable to load notifications.');
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, isRead, entityType, entityId) => {
    if (!isRead) {
      try {
        await notificationService.markAsRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
    
    // Navigate if possible
    if (entityType && entityId) {
      setIsOpen(false);
      if (entityType === 'Artwork') {
        navigate(`/artwork/${entityId}`);
      } else if (entityType === 'Tutorial') {
        navigate(`/tutorials/${entityId}`);
      } else if (entityType === 'Resource') {
        navigate(`/resources/${entityId}`);
      } else if (entityType === 'User') {
        // Just close dropdown for users
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-nim-md text-nim-text-muted hover:text-nim-text hover:bg-nim-hover transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-nim-error rounded-full px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-nim-elevated border border-nim-border rounded-nim-lg shadow-nim-lg overflow-hidden z-50 flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-nim-border flex items-center justify-between">
              <h3 className="text-body font-semibold text-nim-text">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-small text-nim-accent hover:text-nim-accent-hover transition-colors flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 min-h-[100px]">
              {loading ? (
                <div className="p-4 text-center text-nim-text-muted text-small">
                  Loading...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-nim-error text-small">
                  {error}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-nim-text-muted text-small">
                  No notifications yet.
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleMarkAsRead(notif._id, notif.isRead, notif.entityType, notif.entityId)}
                      className={`px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors border-b border-nim-border last:border-0 ${
                        !notif.isRead ? 'bg-nim-accent/5 hover:bg-nim-accent/10' : 'hover:bg-nim-hover'
                      }`}
                    >
                      <Avatar
                        src={notif.sender?.avatar}
                        name={notif.sender?.name || notif.sender?.username || '?'}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-small ${!notif.isRead ? 'text-nim-text font-medium' : 'text-nim-text-secondary'}`}>
                          {notif.message}
                        </p>
                        <p className="text-caption text-nim-text-muted mt-1">
                          {formatRelativeTime(notif.createdAt)}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-nim-accent mt-2 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
