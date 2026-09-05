import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import interactionService from '../../services/interactionService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const BookmarkButton = ({ contentId, onModel, className = '' }) => {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && contentId) {
      checkBookmarkStatus();
    } else {
      setLoading(false);
    }
  }, [user, contentId, onModel]);

  const checkBookmarkStatus = async () => {
    try {
      const { bookmarked } = await interactionService.getBookmarkStatus(onModel, contentId);
      setBookmarked(bookmarked);
    } catch (error) {
      console.error('Failed to get bookmark status', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to bookmark this content');
      return;
    }

    setBookmarked(!bookmarked);

    try {
      await interactionService.toggleBookmark(contentId, onModel);
      toast.success(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
    } catch (error) {
      setBookmarked(bookmarked);
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={loading}
      className={`flex items-center justify-center p-2 rounded-full transition-colors ${
        bookmarked ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      } ${className}`}
      title={bookmarked ? 'Remove Bookmark' : 'Bookmark'}
    >
      <Bookmark
        size={20}
        className={`transition-all duration-300 ${
          bookmarked ? 'fill-current scale-110' : 'scale-100'
        } active:scale-90`}
      />
    </button>
  );
};

export default BookmarkButton;
