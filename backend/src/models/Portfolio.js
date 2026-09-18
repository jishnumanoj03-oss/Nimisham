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
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: '',
    },
    coverImage: {
      url: String,
      publicId: String,
    },
    websiteUrl: {
      type: String,
      required: [true, 'Website URL is required'],
      trim: true,
      validate: {
        validator: function(v) {
          return /^(https?:\/\/)/i.test(v);
        },
        message: 'Website URL must be a valid HTTP/HTTPS URL',
      }
    },
  },
  {
    timestamps: true,
  }
);

portfolioSchema.index({ creator: 1 });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
