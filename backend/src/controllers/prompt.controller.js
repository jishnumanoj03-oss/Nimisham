import Prompt from '../models/Prompt.js';
import PromptCollection from '../models/PromptCollection.js';
import { AppError } from '../middleware/errorHandler.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';

// --- Prompts ---

// @desc    Get all prompts
// @route   GET /api/prompts
// @access  Public
export const getPrompts = async (req, res, next) => {
  try {
    const { model, search, difficulty, isPaid, creator } = req.query;
    
    let query = { visibility: 'public' };

    if (req.user && creator === req.user.id.toString()) {
      query.creator = req.user.id;
      delete query.visibility;
    }

    if (model) query.model = model;
    if (difficulty) query.difficulty = difficulty;
    if (isPaid !== undefined) query.isPaid = isPaid === 'true';
    if (creator && !query.creator) query.creator = creator;
    
    if (search) {
      query.$text = { $search: search };
    }

    const prompts = await Prompt.find(query)
      .populate('creator', 'name username avatar')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prompts.length,
      data: prompts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single prompt
// @route   GET /api/prompts/:id
// @access  Public
export const getPrompt = async (req, res, next) => {
  try {
    const prompt = await Prompt.findById(req.params.id)
      .populate('creator', 'name username avatar bio');

    if (!prompt) {
      return next(new AppError('Prompt not found', 404));
    }

    if (prompt.visibility !== 'public') {
      if (!req.user || prompt.creator._id.toString() !== req.user.id) {
        return next(new AppError('Not authorized to access this prompt', 403));
      }
    }

    res.status(200).json({
      success: true,
      data: prompt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new prompt
// @route   POST /api/prompts
// @access  Private (Creator)
export const createPrompt = async (req, res, next) => {
  try {
    req.body.creator = req.user.id;

    if (req.body.tags && typeof req.body.tags === 'string') {
      try { req.body.tags = JSON.parse(req.body.tags); } catch(e) { req.body.tags = req.body.tags.split(','); }
    }

    let sampleImages = [];
    if (req.files && req.files.sampleImages) {
      for (const file of req.files.sampleImages) {
        const result = await uploadImage(file.buffer, 'prompts/samples');
        sampleImages.push({ url: result.secure_url, publicId: result.public_id });
      }
      req.body.sampleImages = sampleImages;
    }

    const prompt = await Prompt.create(req.body);

    res.status(201).json({
      success: true,
      data: prompt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update prompt
// @route   PUT /api/prompts/:id
// @access  Private (Creator)
export const updatePrompt = async (req, res, next) => {
  try {
    let prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return next(new AppError('Prompt not found', 404));
    }

    if (prompt.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this prompt', 403));
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      try { req.body.tags = JSON.parse(req.body.tags); } catch(e) {}
    }

    // Handle new sample images (append for now, deleting old ones requires more complex UI logic)
    if (req.files && req.files.sampleImages) {
      let sampleImages = prompt.sampleImages || [];
      for (const file of req.files.sampleImages) {
        const result = await uploadImage(file.buffer, 'prompts/samples');
        sampleImages.push({ url: result.secure_url, publicId: result.public_id });
      }
      req.body.sampleImages = sampleImages;
    }

    prompt = await Prompt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: prompt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete prompt
// @route   DELETE /api/prompts/:id
// @access  Private (Creator)
export const deletePrompt = async (req, res, next) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return next(new AppError('Prompt not found', 404));
    }

    if (prompt.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this prompt', 403));
    }

    if (prompt.sampleImages && prompt.sampleImages.length > 0) {
      for (const image of prompt.sampleImages) {
        if (image.publicId) await deleteImage(image.publicId);
      }
    }

    await prompt.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// --- Prompt Collections ---

// @desc    Get all prompt collections
// @route   GET /api/prompt-collections
// @access  Public
export const getPromptCollections = async (req, res, next) => {
  try {
    const { search, creator } = req.query;
    
    let query = { isPublic: true };

    if (req.user && creator === req.user.id.toString()) {
      query.creator = req.user.id;
      delete query.isPublic;
    }

    if (creator && !query.creator) query.creator = creator;
    if (search) query.$text = { $search: search };

    const collections = await PromptCollection.find(query)
      .populate('creator', 'name username avatar')
      .populate('prompts', 'title model') // Minimal data for listing
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single prompt collection
// @route   GET /api/prompt-collections/:id
// @access  Public
export const getPromptCollection = async (req, res, next) => {
  try {
    const collection = await PromptCollection.findById(req.params.id)
      .populate('creator', 'name username avatar bio')
      .populate('prompts'); // Full data

    if (!collection) {
      return next(new AppError('Collection not found', 404));
    }

    if (!collection.isPublic) {
      if (!req.user || collection.creator._id.toString() !== req.user.id) {
        return next(new AppError('Not authorized to access this collection', 403));
      }
    }

    // Increment views
    if (collection.isPublic) {
      collection.views += 1;
      await collection.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create prompt collection
// @route   POST /api/prompt-collections
// @access  Private (Creator)
export const createPromptCollection = async (req, res, next) => {
  try {
    req.body.creator = req.user.id;

    if (req.body.tags && typeof req.body.tags === 'string') {
      try { req.body.tags = JSON.parse(req.body.tags); } catch(e) { req.body.tags = req.body.tags.split(','); }
    }
    
    if (req.body.prompts && typeof req.body.prompts === 'string') {
      try { req.body.prompts = JSON.parse(req.body.prompts); } catch(e) { req.body.prompts = req.body.prompts.split(','); }
    }

    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'prompts/collections');
      req.body.coverImage = { url: result.secure_url, publicId: result.public_id };
    }

    const collection = await PromptCollection.create(req.body);

    res.status(201).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update prompt collection
// @route   PUT /api/prompt-collections/:id
// @access  Private (Creator)
export const updatePromptCollection = async (req, res, next) => {
  try {
    let collection = await PromptCollection.findById(req.params.id);

    if (!collection) {
      return next(new ErrorResponse('Collection not found', 404));
    }

    if (collection.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to update this collection', 403));
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      try { req.body.tags = JSON.parse(req.body.tags); } catch(e) {}
    }
    
    if (req.body.prompts && typeof req.body.prompts === 'string') {
      try { req.body.prompts = JSON.parse(req.body.prompts); } catch(e) {}
    }

    if (req.file) {
      if (collection.coverImage && collection.coverImage.publicId) {
        await deleteImage(collection.coverImage.publicId);
      }
      const result = await uploadImage(req.file.buffer, 'prompts/collections');
      req.body.coverImage = { url: result.secure_url, publicId: result.public_id };
    }

    collection = await PromptCollection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete prompt collection
// @route   DELETE /api/prompt-collections/:id
// @access  Private (Creator)
export const deletePromptCollection = async (req, res, next) => {
  try {
    const collection = await PromptCollection.findById(req.params.id);

    if (!collection) {
      return next(new ErrorResponse('Collection not found', 404));
    }

    if (collection.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this collection', 403));
    }

    if (collection.coverImage && collection.coverImage.publicId) {
      await deleteImage(collection.coverImage.publicId);
    }

    await collection.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
