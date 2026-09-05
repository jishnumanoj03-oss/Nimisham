import mongoose from 'mongoose';
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
import Bookmark from '../models/Bookmark.js';
import Follow from '../models/Follow.js';
import { AppError } from '../middleware/errorHandler.js';

// --- LIKE / UNLIKE ---

export const toggleLike = async (req, res, next) => {
  try {
    const { contentId, onModel } = req.body;
    const userId = req.user._id;

    if (!['Artwork', 'Tutorial', 'Resource', 'CreativeProcess'].includes(onModel)) {
      throw new AppError('Invalid content type for like', 400);
    }

    const Model = mongoose.model(onModel);
    const content = await Model.findById(contentId);

    if (!content) {
      throw new AppError('Content not found', 404);
    }

    const existingLike = await Like.findOne({ user: userId, contentId, onModel });

    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id);
      if (content.likes !== undefined) {
        content.likes = Math.max(0, content.likes - 1);
        await content.save();
      }
      return res.status(200).json({ message: 'Unliked successfully', liked: false });
    } else {
      // Like
      await Like.create({ user: userId, contentId, onModel });
      if (content.likes !== undefined) {
        content.likes += 1;
        await content.save();
      }
      return res.status(200).json({ message: 'Liked successfully', liked: true });
    }
  } catch (error) {
    next(error);
  }
};

export const getLikeStatus = async (req, res, next) => {
  try {
    const { contentId, onModel } = req.params;
    const userId = req.user._id;

    const like = await Like.findOne({ user: userId, contentId, onModel });
    res.status(200).json({ liked: !!like });
  } catch (error) {
    next(error);
  }
};

// --- COMMENTS ---

export const addComment = async (req, res, next) => {
  try {
    const { contentId, onModel, content } = req.body;
    const userId = req.user._id;

    if (!['Artwork', 'Tutorial', 'Resource', 'CreativeProcess'].includes(onModel)) {
      throw new AppError('Invalid content type for comment', 400);
    }

    const Model = mongoose.model(onModel);
    const targetContent = await Model.findById(contentId);

    if (!targetContent) {
      throw new AppError('Content not found', 404);
    }

    const comment = await Comment.create({
      user: userId,
      contentId,
      onModel,
      content
    });

    await comment.populate('user', 'name username avatar');

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { contentId, onModel } = req.params;

    const comments = await Comment.find({ contentId, onModel })
      .populate('user', 'name username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// --- BOOKMARKS ---

export const toggleBookmark = async (req, res, next) => {
  try {
    const { contentId, onModel } = req.body;
    const userId = req.user._id;

    if (!['Artwork', 'Tutorial', 'Resource'].includes(onModel)) {
      throw new AppError('Invalid content type for bookmark', 400);
    }

    const Model = mongoose.model(onModel);
    const content = await Model.findById(contentId);

    if (!content) {
      throw new AppError('Content not found', 404);
    }

    const existingBookmark = await Bookmark.findOne({ user: userId, contentId, onModel });

    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      return res.status(200).json({ message: 'Bookmark removed', bookmarked: false });
    } else {
      await Bookmark.create({ user: userId, contentId, onModel });
      return res.status(200).json({ message: 'Bookmarked successfully', bookmarked: true });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookmarks = await Bookmark.find({ user: userId })
      .populate('contentId') // You might need specific population based on 'onModel' later
      .sort({ createdAt: -1 });
    
    res.status(200).json({ bookmarks });
  } catch (error) {
    next(error);
  }
};

export const getBookmarkStatus = async (req, res, next) => {
  try {
    const { contentId, onModel } = req.params;
    const userId = req.user._id;

    const bookmark = await Bookmark.findOne({ user: userId, contentId, onModel });
    res.status(200).json({ bookmarked: !!bookmark });
  } catch (error) {
    next(error);
  }
};

// --- FOLLOWERS / FOLLOWING ---

export const toggleFollow = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user._id;

    if (targetUserId === userId.toString()) {
      throw new AppError('You cannot follow yourself', 400);
    }

    const targetUser = await mongoose.model('User').findById(targetUserId);
    if (!targetUser) {
      throw new AppError('User to follow not found', 404);
    }

    const existingFollow = await Follow.findOne({ follower: userId, following: targetUserId });

    if (existingFollow) {
      // Unfollow
      await Follow.findByIdAndDelete(existingFollow._id);
      return res.status(200).json({ message: 'Unfollowed successfully', following: false });
    } else {
      // Follow
      await Follow.create({ follower: userId, following: targetUserId });
      return res.status(200).json({ message: 'Followed successfully', following: true });
    }
  } catch (error) {
    next(error);
  }
};

export const getFollowStatus = async (req, res, next) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    const follow = await Follow.findOne({ follower: userId, following: targetUserId });
    res.status(200).json({ following: !!follow });
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followers = await Follow.find({ following: userId })
      .populate('follower', 'name username avatar bio');
    
    res.status(200).json({ followers });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const following = await Follow.find({ follower: userId })
      .populate('following', 'name username avatar bio');
    
    res.status(200).json({ following });
  } catch (error) {
    next(error);
  }
};
