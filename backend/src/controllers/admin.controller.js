import User from '../models/User.js';
import Artwork from '../models/Artwork.js';
import Tutorial from '../models/Tutorial.js';
import Portfolio from '../models/Portfolio.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import LiveSession from '../models/LiveSession.js';
import { AppError } from '../middleware/errorHandler.js';
import { v2 as cloudinary } from 'cloudinary';

// GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const [
      users,
      creators,
      artworks,
      tutorials,
      portfolios,
      products,
      orders,
      liveSessions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'creator' }),
      Artwork.countDocuments(),
      Tutorial.countDocuments(),
      Portfolio.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      LiveSession.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        creators,
        artworks,
        tutorials,
        portfolios,
        products,
        orders,
        liveSessions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { username: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.role) {
      query.role = req.query.role;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('_id name username email role avatar createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/content/:type/:id
export const deleteContent = async (req, res, next) => {
  try {
    const { type, id } = req.params;

    const contentModels = {
      artwork: Artwork,
      tutorial: Tutorial,
      portfolio: Portfolio,
      product: Product,
      liveSession: LiveSession,
    };

    const Model = contentModels[type];

    if (!Model) {
      return next(new AppError(`Invalid content type: ${type}`, 400));
    }

    const document = await Model.findById(id);

    if (!document) {
      return next(new AppError(`Content not found`, 404));
    }

    // Try to use a delete method on the model to trigger pre-remove hooks if they exist
    // However, findByIdAndDelete doesn't trigger pre('remove') in mongoose.
    // We should call doc.deleteOne() or handle media here if standard in project.
    
    // For now, doing simple delete as we don't want to break if we can't find a proper way.
    // Let's check if the document has a file/image field with Cloudinary public_id
    if (document.image && document.image.public_id) {
        try {
            await cloudinary.uploader.destroy(document.image.public_id);
        } catch (err) {
            console.error('Cloudinary delete error:', err);
        }
    } else if (document.images && Array.isArray(document.images)) {
        for (const img of document.images) {
            if (img.public_id) {
                 try {
                    await cloudinary.uploader.destroy(img.public_id);
                } catch (err) {
                    console.error('Cloudinary delete error:', err);
                }
            }
        }
    }

    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: `${type} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
