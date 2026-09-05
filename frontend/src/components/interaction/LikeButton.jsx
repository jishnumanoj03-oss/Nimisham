import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import interactionService from '../../services/interactionService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const LikeButton = ({ contentId, onModel, initialLikes = 0, className = '' }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && contentId) {
      checkLikeStatus();
    } else {
      setLoading(false);
    }
  }, [user, contentId, onModel]);

  const checkLikeStatus = async () => {
    try {
      const { liked } = await interactionService.getLikeStatus(onModel, contentId);
      setLiked(liked);
    } catch (error) {
      console.error('Failed to get like status', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (e) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to like this content');
      return;
    }

    // Optimistic UI update
    setLiked(!liked);
    setLikesCount(prev => liked ? Math.max(0, prev - 1) : prev + 1);

    try {
      await interactionService.toggleLike(contentId, onModel);
    } catch (error) {
      // Revert on failure
      setLiked(liked);
      setLikesCount(prev => liked ? prev + 1 : Math.max(0, prev - 1));
      toast.error('Failed to update like');
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 transition-colors ${
        liked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
      } ${className}`}
      title={liked ? 'Unlike' : 'Like'}
    >
      <Heart
        size={20}
        className={`transition-all duration-300 ${
          liked ? 'fill-current scale-110' : 'scale-100'
        } active:scale-90`}
      />
      <span className="text-sm font-medium">{likesCount}</span>
    </button>
  );
};

export default LikeButton;
