import Tutorial from '../models/Tutorial.js';
import { AppError } from '../middleware/errorHandler.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

// @desc    Get all tutorials
// @route   GET /api/tutorials
// @access  Public (for published), Private (for drafts)
export const getTutorials = async (req, res, next) => {
  try {
    const { category, difficulty, search, status, creator } = req.query;
    
    // Base query for public users: only published
    let query = { status: 'published' };

    if (creator) {
      query.creator = creator;
      // If the requester is the creator, they can see all statuses
      if (req.user && req.user.id.toString() === creator) {
        if (status) {
          query.status = status;
        } else {
          delete query.status;
        }
      }
    } else {
      // No creator specified in query
      if (req.user && (status === 'draft' || status === 'archived')) {
        query.creator = req.user.id;
        query.status = status;
      }
    }

    if (category) query.category = category;
    if (difficulty) query.difficultyLevel = difficulty;
    
    // Full text search if search query exists
    if (search) {
      query.$text = { $search: search };
    }

    const tutorials = await Tutorial.find(query)
      .populate('creator', 'name username avatar')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tutorials.length,
      data: tutorials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single tutorial
// @route   GET /api/tutorials/:id
// @access  Public
export const getTutorial = async (req, res, next) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id)
      .populate('creator', 'name username avatar bio')
      .populate('resources', 'title category resourceType isPaid price thumbnail');

    if (!tutorial) {
      return next(new AppError('Tutorial not found', 404));
    }

    // Check if draft and user is not owner
    if (tutorial.status !== 'published') {
      if (!req.user || tutorial.creator._id.toString() !== req.user.id) {
        return next(new AppError('Not authorized to access this tutorial', 403));
      }
    }

    // Increment views if public
    if (tutorial.status === 'published') {
      tutorial.views += 1;
      await tutorial.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      data: tutorial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new tutorial
// @route   POST /api/tutorials
// @access  Private (Creator/Admin)
export const createTutorial = async (req, res, next) => {
  try {
    req.body.creator = req.user.id;

    // Handle sections parsing if sent as string
    if (req.body.sections && typeof req.body.sections === 'string') {
      try {
        req.body.sections = JSON.parse(req.body.sections);
      } catch (err) {
        return next(new AppError('Invalid sections format', 400));
      }
    }
    
    // Handle tags parsing
    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (err) {
        // Fallback to split
        req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
      }
    }

    let featuredImage = {};

    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'tutorials');
      featuredImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      req.body.featuredImage = featuredImage;
    }

    const tutorial = await Tutorial.create(req.body);

    res.status(201).json({
      success: true,
      data: tutorial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update tutorial
// @route   PUT /api/tutorials/:id
// @access  Private (Creator)
export const updateTutorial = async (req, res, next) => {
  try {
    let tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return next(new AppError('Tutorial not found', 404));
    }

    if (tutorial.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this tutorial', 403));
    }

    // Handle stringified JSON
    if (req.body.sections && typeof req.body.sections === 'string') {
      try { req.body.sections = JSON.parse(req.body.sections); } catch(e) {}
    }
    if (req.body.tags && typeof req.body.tags === 'string') {
      try { req.body.tags = JSON.parse(req.body.tags); } catch(e) {}
    }

    if (req.file) {
      // Delete old image if exists
      if (tutorial.featuredImage && tutorial.featuredImage.publicId) {
        await deleteImage(tutorial.featuredImage.publicId);
      }
      
      const result = await uploadImage(req.file.buffer, 'tutorials');
      req.body.featuredImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    // If status is changing to published, set publishedAt
    if (req.body.status === 'published' && tutorial.status !== 'published') {
      req.body.publishedAt = Date.now();
    }

    tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: tutorial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tutorial
// @route   DELETE /api/tutorials/:id
// @access  Private (Creator)
export const deleteTutorial = async (req, res, next) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return next(new ErrorResponse('Tutorial not found', 404));
    }

    if (tutorial.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this tutorial', 403));
    }

    if (tutorial.featuredImage && tutorial.featuredImage.publicId) {
      await deleteImage(tutorial.featuredImage.publicId);
    }

    await tutorial.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
