import React, { useState, useEffect } from 'react';
import interactionService from '../../services/interactionService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const FollowButton = ({ targetUserId, className = '', onFollowChange }) => {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && targetUserId && user._id !== targetUserId) {
      checkFollowStatus();
    } else {
      setLoading(false);
    }
  }, [user, targetUserId]);

  const checkFollowStatus = async () => {
    try {
      const { following } = await interactionService.getFollowStatus(targetUserId);
      setFollowing(following);
    } catch (error) {
      console.error('Failed to get follow status', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to follow creators');
      return;
    }

    if (user._id === targetUserId) {
      toast.error('You cannot follow yourself');
      return;
    }

    setFollowing(!following);
    if (onFollowChange) onFollowChange(!following);

    try {
      await interactionService.toggleFollow(targetUserId);
    } catch (error) {
      setFollowing(following);
      if (onFollowChange) onFollowChange(following);
      toast.error('Failed to update follow status');
    }
  };

  if (!user || user._id === targetUserId) {
    return null; // Don't show button for yourself or logged out
  }

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors border ${
        following 
          ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' 
          : 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700'
      } ${className}`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
