import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Photography', 'AI Art', 'Presets', 'AI Prompts', 'Digital Resource'],
    },
    tags: {
      type: [String],
      default: [],
    },
    previewImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    // Reference to existing content if this product wraps an Artwork or Resource
    relatedContentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedContentType',
      default: null,
    },
    relatedContentType: {
      type: String,
      enum: ['Artwork', 'Resource', 'Tutorial', 'Prompt'],
      default: null,
    },
    // Digital delivery information
    downloadUrl: {
      type: String, // Secure/internal URL or cloudinary ID for the actual deliverable asset
      required: true, 
      select: false, // Never return to frontend directly
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ['public', 'draft', 'archived'],
      default: 'draft',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for searching
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ seller: 1, visibility: 1, status: 1 });
productSchema.index({ category: 1, visibility: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
