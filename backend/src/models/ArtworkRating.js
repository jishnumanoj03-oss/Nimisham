import mongoose from 'mongoose';

const artworkRatingSchema = new mongoose.Schema(
  {
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artwork',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one user can rate an artwork only once
artworkRatingSchema.index({ artwork: 1, user: 1 }, { unique: true });

const ArtworkRating = mongoose.model('ArtworkRating', artworkRatingSchema);

export default ArtworkRating;
