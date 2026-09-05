import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'onModel',
    },
    onModel: {
      type: String,
      required: true,
      enum: ['Artwork', 'Tutorial', 'Resource', 'CreativeProcess'],
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      minlength: [1, 'Comment cannot be empty'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
commentSchema.index({ contentId: 1, onModel: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
