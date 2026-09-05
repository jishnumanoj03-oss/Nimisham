import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Portfolio title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    theme: {
      type: String,
      default: 'default',
    },
    coverImage: {
      url: String,
      publicId: String,
    },
    categories: {
      type: [String],
      default: [],
    },
    featuredWorks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
      },
    ],
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

portfolioSchema.index({ creator: 1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
