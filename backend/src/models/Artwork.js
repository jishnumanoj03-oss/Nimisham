import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Photography', 'AI Art'],
    },
    subCategory: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    visibility: {
      type: String,
      enum: ['public', 'draft', 'archived'],
      default: 'draft',
    },
    license: {
      type: String,
      default: 'Standard',
    },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      thumbnail: { type: String },
    },
    // Photography specific metadata
    photographyMetadata: {
      camera: { type: String, default: '' },
      lens: { type: String, default: '' },
      iso: { type: String, default: '' },
      aperture: { type: String, default: '' },
      shutterSpeed: { type: String, default: '' },
      focalLength: { type: String, default: '' },
      whiteBalance: { type: String, default: '' },
      location: { type: String, default: '' },
    },
    // AI Art specific metadata
    aiMetadata: {
      aiTool: { type: String, default: '' },
      model: { type: String, default: '' },
      prompt: { type: String, default: '' },
      negativePrompt: { type: String, default: '' },
      generationSteps: { type: Number, default: 0 },
      cfgScale: { type: Number, default: 0 },
      seed: { type: String, default: '' },
      aspectRatio: { type: String, default: '' },
      upscaler: { type: String, default: '' },
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
artworkSchema.index({ title: 'text', description: 'text', tags: 'text' });
artworkSchema.index({ creator: 1, visibility: 1 });
artworkSchema.index({ category: 1, visibility: 1 });

const Artwork = mongoose.model('Artwork', artworkSchema);

export default Artwork;
