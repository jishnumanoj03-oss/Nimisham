import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// Prevent a user from liking the same content multiple times
likeSchema.index({ user: 1, contentId: 1, onModel: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;
