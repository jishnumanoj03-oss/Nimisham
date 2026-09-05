import Portfolio from '../models/Portfolio.js';
import Artwork from '../models/Artwork.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

// Function to safely parse JSON arrays
const safeParseArray = (value) => {
  if (!value) return [];
  if (typeof value !== 'string') return Array.isArray(value) ? value : [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    throw new Error('Invalid array format');
  }
};

// Function to safely parse boolean
const safeParseBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return Boolean(value);
};

export const createPortfolio = async (req, res, next) => {
  let coverImage = null;
  try {
    const { title, description, theme, categories, featuredWorks, items, isPublic } = req.body;

    let parsedCategories, parsedFeaturedWorks, parsedItems;
    try {
      parsedCategories = safeParseArray(categories);
      parsedFeaturedWorks = safeParseArray(featuredWorks);
      parsedItems = safeParseArray(items);
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }

    const parsedIsPublic = safeParseBoolean(isPublic, true);

    // Verify ownership of referenced artworks
    const allArtworkIds = [...new Set([...parsedFeaturedWorks, ...parsedItems])];
    if (allArtworkIds.length > 0) {
      const artworksCount = await Artwork.countDocuments({
        _id: { $in: allArtworkIds },
        creator: req.user.id
      });
      if (artworksCount !== allArtworkIds.length) {
        return res.status(403).json({ success: false, message: 'Unauthorized: One or more selected artworks do not belong to you or do not exist.' });
      }
    }

    if (req.file) {
      const result = await uploadImage(req.file.buffer, `nimisham/portfolios/${req.user.id}`);
      coverImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    const portfolio = await Portfolio.create({
      creator: req.user.id,
      title,
      description,
      theme,
      categories: parsedCategories,
      featuredWorks: parsedFeaturedWorks,
      items: parsedItems,
      isPublic: parsedIsPublic,
      coverImage,
    });

    res.status(201).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    if (coverImage && coverImage.publicId) {
      // Orphan cleanup
      try {
        await deleteImage(coverImage.publicId);
      } catch (e) {
        console.error('Failed to clean up orphan portfolio image:', e);
      }
    }
    next(error);
  }
};

export const getPortfolios = async (req, res, next) => {
  try {
    const { creator } = req.query;
    const query = {};

    if (creator) {
      query.creator = creator;
      // Only show public portfolios unless looking at own
      if (creator !== req.user?.id) {
        query.isPublic = true;
      }
    } else {
      query.isPublic = true;
    }

    const portfolios = await Portfolio.find(query)
      .populate('creator', 'name username avatar bio')
      .populate('featuredWorks', 'title image category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: portfolios,
    });
  } catch (error) {
    next(error);
  }
};

export const getPortfolioById = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id)
      .populate('creator', 'name username avatar bio socialLinks')
      .populate('featuredWorks')
      .populate('items');

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    if (!portfolio.isPublic && (!req.user || portfolio.creator._id.toString() !== req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this portfolio' });
    }

    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePortfolio = async (req, res, next) => {
  let newCoverImage = null;
  try {
    const existingPortfolio = await Portfolio.findById(req.params.id);

    if (!existingPortfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    if (existingPortfolio.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this portfolio' });
    }

    const updates = { ...req.body };

    // Safe parsing
    try {
      if (updates.categories !== undefined) updates.categories = safeParseArray(updates.categories);
      if (updates.featuredWorks !== undefined) updates.featuredWorks = safeParseArray(updates.featuredWorks);
      if (updates.items !== undefined) updates.items = safeParseArray(updates.items);
    } catch (e) {
      return res.status(400).json({ success: false, message: e.message });
    }

    if (updates.isPublic !== undefined) {
      updates.isPublic = safeParseBoolean(updates.isPublic, existingPortfolio.isPublic);
    }

    // Verify ownership of referenced artworks
    let allArtworkIds = [];
    if (updates.featuredWorks) allArtworkIds = [...allArtworkIds, ...updates.featuredWorks];
    if (updates.items) allArtworkIds = [...allArtworkIds, ...updates.items];
    allArtworkIds = [...new Set(allArtworkIds)];
    
    if (allArtworkIds.length > 0) {
      const artworksCount = await Artwork.countDocuments({
        _id: { $in: allArtworkIds },
        creator: req.user.id
      });
      if (artworksCount !== allArtworkIds.length) {
        return res.status(403).json({ success: false, message: 'Unauthorized: One or more selected artworks do not belong to you or do not exist.' });
      }
    }

    if (req.file) {
      const result = await uploadImage(req.file.buffer, `nimisham/portfolios/${req.user.id}`);
      newCoverImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      updates.coverImage = newCoverImage;
    }

    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    // Successfully updated! Now delete old image if it was replaced
    if (newCoverImage && existingPortfolio.coverImage && existingPortfolio.coverImage.publicId) {
      try {
        await deleteImage(existingPortfolio.coverImage.publicId);
      } catch (e) {
        console.error('Failed to clean up old portfolio image:', e);
      }
    }

    res.status(200).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    if (newCoverImage && newCoverImage.publicId) {
      // Orphan cleanup
      try {
        await deleteImage(newCoverImage.publicId);
      } catch (e) {
        console.error('Failed to clean up orphan portfolio image:', e);
      }
    }
    next(error);
  }
};

export const deletePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }

    if (portfolio.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this portfolio' });
    }

    if (portfolio.coverImage && portfolio.coverImage.publicId) {
      await deleteImage(portfolio.coverImage.publicId);
    }

    await portfolio.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
