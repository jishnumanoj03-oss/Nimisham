import React, { useState, useEffect } from 'react';
import { Trash2, MessageCircle } from 'lucide-react';
import interactionService from '../../services/interactionService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';

const CommentSection = ({ contentId, onModel }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (contentId) {
      fetchComments();
    }
  }, [contentId, onModel]);

  const fetchComments = async () => {
    try {
      const data = await interactionService.getComments(onModel, contentId);
      setComments(data.comments);
    } catch (error) {
      console.error('Failed to fetch comments', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    setSubmitting(true);
    try {
      const data = await interactionService.addComment(contentId, onModel, newComment.trim());
      setComments([data.comment, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await interactionService.deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return <div className="py-4 text-center text-gray-500">Loading comments...</div>;
  }

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={24} className="text-gray-400" />
        <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[80px] p-3 text-sm resize-y"
                disabled={submitting}
              />
              <div className="mt-2 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={submitting || !newComment.trim()}
                  isLoading={submitting}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg text-center mb-8 text-gray-600">
          Please login to leave a comment.
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                {comment.user.avatar ? (
                  <img src={comment.user.avatar} alt={comment.user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium text-sm">
                    {comment.user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4 relative group">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-semibold text-gray-900">{comment.user.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {comment.content}
                </p>
                
                {(user?._id === comment.user._id || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Comment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
