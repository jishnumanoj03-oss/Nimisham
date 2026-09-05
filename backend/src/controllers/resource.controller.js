import Resource from '../models/Resource.js';
import { AppError } from '../middleware/errorHandler.js';
import { uploadImage, deleteImage, uploadRaw, deleteRaw } from '../utils/cloudinary.js';

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
export const getResources = async (req, res, next) => {
  try {
    const { category, resourceType, search, isPaid, creator } = req.query;
    
    let query = { visibility: 'public' };

    // If user is logged in, they can see their own drafts/private
    if (req.user && creator === req.user.id.toString()) {
      query.creator = req.user.id;
      delete query.visibility; // get all visibilities for owner
    }

    if (category) query.category = category;
    if (resourceType) query.resourceType = resourceType;
    if (isPaid !== undefined) query.isPaid = isPaid === 'true';
    if (creator && !query.creator) query.creator = creator;
    
    if (search) {
      query.$text = { $search: search };
    }

    const resources = await Resource.find(query)
      .populate('creator', 'name username avatar')
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
export const getResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('creator', 'name username avatar bio');

    if (!resource) {
      return next(new AppError('Resource not found', 404));
    }

    if (resource.visibility !== 'public') {
      if (!req.user || resource.creator._id.toString() !== req.user.id) {
        return next(new AppError('Not authorized to access this resource', 403));
      }
    }

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new resource
// @route   POST /api/resources
// @access  Private (Creator)
export const createResource = async (req, res, next) => {
  try {
    req.body.creator = req.user.id;

    if (req.body.tags && typeof req.body.tags === 'string') {
      try { req.body.tags = JSON.parse(req.body.tags); } catch(e) { req.body.tags = req.body.tags.split(','); }
    }
    if (req.body.compatibility && typeof req.body.compatibility === 'string') {
      try { req.body.compatibility = JSON.parse(req.body.compatibility); } catch(e) { req.body.compatibility = req.body.compatibility.split(','); }
    }

    // Handle files: thumbnail (image) and file (raw)
    // For this implementation, we assume `req.files.thumbnail` and `req.files.file` are used if we use multer.fields
    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        const result = await uploadImage(req.files.thumbnail[0].buffer, 'resources/thumbnails');
        req.body.thumbnail = { url: result.secure_url, publicId: result.public_id };
      }
      
      if (req.files.file && req.files.file[0]) {
        const file = req.files.file[0];
        const result = await uploadRaw(file.buffer, 'resources/files', file.originalname);
        req.body.fileUrl = result.secure_url;
        req.body.fileId = result.public_id;
        req.body.fileType = file.mimetype;
        req.body.fileSize = file.size;
      }
    }

    if (!req.body.fileUrl) {
      return next(new AppError('Please upload a resource file', 400));
    }

    const resource = await Resource.create(req.body);

    res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private (Creator)
export const updateResource = async (req, res, next) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return next(new AppError('Resource not found', 404));
    }

    if (resource.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this resource', 403));
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      try { req.body.tags = JSON.parse(req.body.tags); } catch(e) {}
    }
    if (req.body.compatibility && typeof req.body.compatibility === 'string') {
      try { req.body.compatibility = JSON.parse(req.body.compatibility); } catch(e) {}
    }

    if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        if (resource.thumbnail && resource.thumbnail.publicId) await deleteImage(resource.thumbnail.publicId);
        const result = await uploadImage(req.files.thumbnail[0].buffer, 'resources/thumbnails');
        req.body.thumbnail = { url: result.secure_url, publicId: result.public_id };
      }
      
      if (req.files.file && req.files.file[0]) {
        // Find existing raw file and delete if possible (though we'd need to fetch fileId which is select:false)
        const fullResource = await Resource.findById(req.params.id).select('+fileId');
        if (fullResource.fileId) await deleteRaw(fullResource.fileId);
        
        const file = req.files.file[0];
        const result = await uploadRaw(file.buffer, 'resources/files', file.originalname);
        req.body.fileUrl = result.secure_url;
        req.body.fileId = result.public_id;
        req.body.fileType = file.mimetype;
        req.body.fileSize = file.size;
      }
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (Creator)
export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).select('+fileId');

    if (!resource) {
      return next(new ErrorResponse('Resource not found', 404));
    }

    if (resource.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to delete this resource', 403));
    }

    if (resource.thumbnail && resource.thumbnail.publicId) {
      await deleteImage(resource.thumbnail.publicId);
    }
    if (resource.fileId) {
      await deleteRaw(resource.fileId);
    }

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download resource
// @route   GET /api/resources/:id/download
// @access  Public (for free resources), Private (for paid - future)
export const downloadResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).select('+fileUrl +fileId');

    if (!resource) {
      return next(new ErrorResponse('Resource not found', 404));
    }

    // Temporary logic: Allow downloading all resources until marketplace is built
    if (resource.isPaid) {
      // In Phase 4, we'll verify purchase here
      // For now, we just log a message or allow it for testing
    }

    // Increment download count
    resource.downloadCount += 1;
    await resource.save({ validateBeforeSave: false });

    // Redirect to the actual file URL
    res.redirect(resource.fileUrl);
  } catch (error) {
    next(error);
  }
};
