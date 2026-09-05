import mongoose from 'mongoose';

const promptCollectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Collection title is required'],
      trim: true,
    },
    description: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prompt',
      }
    ],
    coverImage: {
      url: String,
      publicId: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
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

promptCollectionSchema.index({ creator: 1 });
promptCollectionSchema.index({ title: 'text', description: 'text' });

const PromptCollection = mongoose.model('PromptCollection', promptCollectionSchema);

export default PromptCollection;
