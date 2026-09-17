import Portfolio from '../models/Portfolio.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

export const createPortfolio = async (req, res, next) => {
  let coverImage = null;
  try {
    const { title, description, websiteUrl } = req.body;

    if (!websiteUrl || !/^(https?:\/\/)/i.test(websiteUrl)) {
      return res.status(400).json({ success: false, message: 'A valid HTTP/HTTPS website URL is required.' });
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
      websiteUrl,
      coverImage,
    });

    res.status(201).json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    if (coverImage && coverImage.publicId) {
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
    }

    const portfolios = await Portfolio.find(query)
      .populate('creator', 'name username avatar bio')
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
      .populate('creator', 'name username avatar bio socialLinks');

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
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

    if (updates.websiteUrl && !/^(https?:\/\/)/i.test(updates.websiteUrl)) {
      return res.status(400).json({ success: false, message: 'A valid HTTP/HTTPS website URL is required.' });
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
