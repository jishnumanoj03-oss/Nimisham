import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Prompt title is required'],
      trim: true,
    },
    promptText: {
      type: String,
      required: [true, 'Prompt text is required'],
    },
    negativePrompt: {
      type: String,
    },
    model: {
      type: String,
      required: [true, 'AI Model is required'],
      // e.g. 'Midjourney v6', 'Stable Diffusion XL', 'Flux.1'
    },
    aspectRatio: {
      type: String, // e.g. '16:9', '1:1'
    },
    seed: {
      type: String,
    },
    steps: {
      type: Number,
    },
    cfgScale: {
      type: Number,
    },
    recommendedSettings: {
      type: String, // Any other settings or instructions
    },
    sampleImages: [
      {
        url: String,
        publicId: String,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'draft'],
      default: 'public',
    },
  },
  {
    timestamps: true,
  }
);

promptSchema.index({ title: 'text', promptText: 'text', tags: 'text' });
promptSchema.index({ model: 1 });
promptSchema.index({ creator: 1 });

const Prompt = mongoose.model('Prompt', promptSchema);

export default Prompt;
