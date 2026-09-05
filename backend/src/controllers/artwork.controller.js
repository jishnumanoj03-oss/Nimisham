import Artwork from '../models/Artwork.js';
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
import Bookmark from '../models/Bookmark.js';
import Portfolio from '../models/Portfolio.js';
import CreativeProcess from '../models/CreativeProcess.js';
import Product from '../models/Product.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

export const uploadArtwork = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    // Parse JSON fields from formData
    const {
      title,
      description,
      category,
      subCategory,
      tags,
      visibility,
      license,
      photographyMetadata,
      aiMetadata,
    } = req.body;

    // Upload image to Cloudinary
    const result = await uploadImage(req.file.buffer, `nimisham/artworks/${req.user.id}`);

    const artworkData = {
      creator: req.user.id,
      title,
      description,
      category,
      subCategory,
      tags: tags ? JSON.parse(tags) : [],
      visibility: visibility || 'draft',
      license: license || 'Standard',
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        // Using cloudinary transformations for thumbnail
        thumbnail: result.secure_url.replace('/upload/', '/upload/c_thumb,w_400,h_400/'),
      },
    };

    if (category === 'Photography' && photographyMetadata) {
      artworkData.photographyMetadata = JSON.parse(photographyMetadata);
    } else if (category === 'AI Art' && aiMetadata) {
      artworkData.aiMetadata = JSON.parse(aiMetadata);
    }

    const artwork = await Artwork.create(artworkData);

    res.status(201).json({
      success: true,
      data: artwork,
    });
  } catch (error) {
    next(error);
  }
};

export const getArtworks = async (req, res, next) => {
  try {
    const { category, creator, visibility, limit = 20, page = 1 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (creator) query.creator = creator;
    
    // Only return public artworks unless it's the creator asking for their own
    if (creator === req.user?.id) {
      if (visibility) query.visibility = visibility;
    } else {
      query.visibility = 'public';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const artworks = await Artwork.find(query)
      .populate('creator', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Artwork.countDocuments(query);

    res.status(200).json({
      success: true,
      count: artworks.length,
      total,
      data: artworks,
    });
  } catch (error) {
    next(error);
  }
};

export const getArtworkById = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('creator', 'name username avatar bio socialLinks');

    if (!artwork) {
      return res.status(404).json({ success: false, message: 'Artwork not found' });
    }

    // Check visibility
    if (artwork.visibility !== 'public') {
      if (!req.user || artwork.creator._id.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this artwork' });
      }
    }

    // Increment views
    artwork.views += 1;
    await artwork.save();

    res.status(200).json({
      success: true,
      data: artwork,
    });
  } catch (error) {
    next(error);
  }
};

export const updateArtwork = async (req, res, next) => {
  try {
    let artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ success: false, message: 'Artwork not found' });
    }

    // Make sure user is artwork owner
    if (artwork.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'User not authorized to update this artwork' });
    }

    // Handle optional image replacement
    if (req.file) {
      await deleteImage(artwork.image.publicId);
      const result = await uploadImage(req.file.buffer, `nimisham/artworks/${req.user.id}`);
      req.body.image = {
        url: result.secure_url,
        publicId: result.public_id,
        thumbnail: result.secure_url.replace('/upload/', '/upload/c_thumb,w_400,h_400/'),
      };
    }

    // Handle parsed JSON fields if they are sent as strings
    ['tags', 'photographyMetadata', 'aiMetadata'].forEach(field => {
      if (typeof req.body[field] === 'string') {
        req.body[field] = JSON.parse(req.body[field]);
      }
    });

    artwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: artwork,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ success: false, message: 'Artwork not found' });
    }

    // Make sure user is artwork owner
    if (artwork.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'User not authorized to delete this artwork' });
    }

    // Handle Related Data Cleanup
    // 1. Delete associated Creative Process and its images
    const process = await CreativeProcess.findOne({ artwork: artwork._id });
    if (process) {
      if (process.workflowSteps && process.workflowSteps.length > 0) {
        for (const step of process.workflowSteps) {
          if (step.image && step.image.publicId) {
            await deleteImage(step.image.publicId);
          }
        }
      }
      await process.deleteOne();
    }

    // 2. Delete Interactions (Likes, Comments, Bookmarks)
    await Like.deleteMany({ contentId: artwork._id, onModel: 'Artwork' });
    await Comment.deleteMany({ contentId: artwork._id, onModel: 'Artwork' });
    await Bookmark.deleteMany({ contentId: artwork._id, onModel: 'Artwork' });

    // 3. Remove from Portfolios
    await Portfolio.updateMany(
      {},
      { $pull: { featuredWorks: artwork._id, items: artwork._id } }
    );

    // 4. Nullify Product references (Preserve historical purchase records)
    await Product.updateMany(
      { relatedContentId: artwork._id, relatedContentType: 'Artwork' },
      { $set: { relatedContentId: null, relatedContentType: null } }
    );

    // Delete image from cloudinary
    if (artwork.image.publicId) {
      await deleteImage(artwork.image.publicId);
    }

    await artwork.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
