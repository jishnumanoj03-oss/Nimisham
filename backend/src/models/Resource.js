import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Resource description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Photography', 'AI Art', 'Design', 'Other'],
    },
    resourceType: {
      type: String,
      required: [true, 'Resource type is required'],
      enum: ['preset', 'lut', 'profile', 'prompt_pack', 'guide', 'asset'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    thumbnail: {
      url: String,
      publicId: String,
    },
    previewImages: [
      {
        url: String,
        publicId: String,
        caption: String, // E.g., 'Before', 'After'
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    version: {
      type: String,
      default: '1.0.0',
    },
    compatibility: [
      {
        type: String, // E.g., 'Lightroom CC', 'Photoshop 2023', 'Midjourney v6'
      },
    ],
    license: {
      type: String,
      enum: ['Free Use', 'Personal Use', 'Commercial Use', 'Editorial Use Only'],
      default: 'Personal Use',
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
      enum: ['public', 'draft', 'private'],
      default: 'public',
    },
    fileUrl: {
      type: String,
      required: true,
      select: false, // Don't expose fileUrl directly in regular queries
    },
    fileId: {
      type: String,
      select: false,
    },
    fileType: {
      type: String, // e.g., 'application/zip', 'application/pdf'
    },
    fileSize: {
      type: Number, // in bytes
    },
    downloadCount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });
resourceSchema.index({ category: 1, resourceType: 1 });
resourceSchema.index({ creator: 1 });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
