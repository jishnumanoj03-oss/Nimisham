import mongoose from 'mongoose';

const tutorialSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
});

const tutorialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tutorial title is required'],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Photography', 'Editing', 'AI Art', 'Creative Business', 'Other'],
    },
    subCategory: {
      type: String,
    },
    difficultyLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
      default: 'Beginner',
    },
    estimatedReadTime: {
      type: Number,
      default: 5, // in minutes
    },
    featuredImage: {
      url: String,
      publicId: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    summary: {
      type: String,
      required: [true, 'Tutorial summary is required'],
      maxLength: [500, 'Summary cannot exceed 500 characters'],
    },
    sections: [tutorialSectionSchema],
    references: [
      {
        title: String,
        url: String,
      }
    ],
    resources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
      }
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Index for search capabilities
tutorialSchema.index({ title: 'text', summary: 'text', tags: 'text' });
tutorialSchema.index({ category: 1, status: 1 });
tutorialSchema.index({ creator: 1 });

const Tutorial = mongoose.model('Tutorial', tutorialSchema);

export default Tutorial;
