import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import * as interactionController from '../controllers/interaction.controller.js';

const router = express.Router();

// --- LIKES ---
router.post('/like', protect, interactionController.toggleLike);
router.get('/like-status/:onModel/:contentId', protect, interactionController.getLikeStatus);

// --- COMMENTS ---
router.post('/comment', protect, interactionController.addComment);
router.get('/comments/:onModel/:contentId', interactionController.getComments);
router.delete('/comment/:commentId', protect, interactionController.deleteComment);

// --- BOOKMARKS ---
router.post('/bookmark', protect, interactionController.toggleBookmark);
router.get('/bookmarks', protect, interactionController.getUserBookmarks);
router.get('/bookmark-status/:onModel/:contentId', protect, interactionController.getBookmarkStatus);

// --- FOLLOWS ---
router.post('/follow', protect, interactionController.toggleFollow);
router.get('/follow-status/:targetUserId', protect, interactionController.getFollowStatus);
router.get('/followers/:userId', interactionController.getFollowers);
router.get('/following/:userId', interactionController.getFollowing);

export default router;
