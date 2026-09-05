import api from './api';

const interactionService = {
  // LIKES
  toggleLike: async (contentId, onModel) => {
    const response = await api.post('/interactions/like', { contentId, onModel });
    return response.data;
  },
  getLikeStatus: async (onModel, contentId) => {
    const response = await api.get(`/interactions/like-status/${onModel}/${contentId}`);
    return response.data;
  },

  // BOOKMARKS
  toggleBookmark: async (contentId, onModel) => {
    const response = await api.post('/interactions/bookmark', { contentId, onModel });
    return response.data;
  },
  getBookmarkStatus: async (onModel, contentId) => {
    const response = await api.get(`/interactions/bookmark-status/${onModel}/${contentId}`);
    return response.data;
  },
  getUserBookmarks: async () => {
    const response = await api.get('/interactions/bookmarks');
    return response.data;
  },

  // COMMENTS
  addComment: async (contentId, onModel, content) => {
    const response = await api.post('/interactions/comment', { contentId, onModel, content });
    return response.data;
  },
  getComments: async (onModel, contentId) => {
    const response = await api.get(`/interactions/comments/${onModel}/${contentId}`);
    return response.data;
  },
  deleteComment: async (commentId) => {
    const response = await api.delete(`/interactions/comment/${commentId}`);
    return response.data;
  },

  // FOLLOWS
  toggleFollow: async (targetUserId) => {
    const response = await api.post('/interactions/follow', { targetUserId });
    return response.data;
  },
  getFollowStatus: async (targetUserId) => {
    const response = await api.get(`/interactions/follow-status/${targetUserId}`);
    return response.data;
  },
  getFollowers: async (userId) => {
    const response = await api.get(`/interactions/followers/${userId}`);
    return response.data;
  },
  getFollowing: async (userId) => {
    const response = await api.get(`/interactions/following/${userId}`);
    return response.data;
  }
};

export default interactionService;
