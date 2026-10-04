import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const RatingStars = ({ artworkId, initialAverage, initialCount, currentUser }) => {
  const [ratingAverage, setRatingAverage] = useState(initialAverage || 0);
  const [ratingCount, setRatingCount] = useState(initialCount || 0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await api.get(`/artworks/${artworkId}/rating`);
        setRatingAverage(res.data.data.ratingAverage);
        setRatingCount(res.data.data.ratingCount);
        if (res.data.data.userRating) {
          setUserRating(res.data.data.userRating);
        }
      } catch (error) {
        console.error('Failed to fetch rating', error);
      }
    };
    fetchRating();
  }, [artworkId]);

  const handleRate = async (value) => {
    if (!currentUser) {
      toast.error('Please login to rate this artwork.');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await api.post(`/artworks/${artworkId}/rating`, { rating: value });
      setRatingAverage(res.data.data.ratingAverage);
      setRatingCount(res.data.data.ratingCount);
      setUserRating(res.data.data.userRating);
      toast.success('Your rating has been saved.');
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('You cannot rate your own artwork.');
      } else {
        toast.error('Unable to save your rating. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-3">
        <div className="flex items-center text-accent">
          <Star className="fill-accent w-5 h-5 mr-1" />
          <span className="font-bold text-lg">{ratingAverage.toFixed(1)}</span>
          <span className="text-text-muted text-sm ml-1">/ 5</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-border" />
        <span className="text-sm text-text-muted">
          {ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'}
        </span>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <span className="text-sm font-medium text-text-secondary mr-2">Your rating:</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={isSubmitting || !currentUser}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRate(star)}
              className="p-1 transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
              aria-label={`Rate ${star} out of 5`}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  (hoverRating || userRating) >= star
                    ? 'fill-accent text-accent'
                    : 'text-border hover:text-accent/50'
                }`}
              />
            </button>
          ))}
        </div>
        {userRating > 0 && (
          <span className="text-sm text-accent ml-2">{userRating}/5</span>
        )}
      </div>
    </div>
  );
};

export default RatingStars;
