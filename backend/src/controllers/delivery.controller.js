import Product from '../models/Product.js';
import PurchaseAccess from '../models/PurchaseAccess.js';
import { AppError } from '../middleware/errorHandler.js';

export const getMyPurchases = async (req, res, next) => {
  try {
    const accessRecords = await PurchaseAccess.find({ 
      user: req.user._id, 
      isActive: true 
    })
    .populate({
      path: 'product',
      populate: { path: 'seller', select: 'name username avatar' }
    })
    .populate('order', 'totalAmount createdAt transactionId')
    .sort({ grantedAt: -1 });

    res.status(200).json({ success: true, count: accessRecords.length, data: accessRecords });
  } catch (error) {
    next(error);
  }
};

export const downloadProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.status !== 'active') {
      throw new AppError('This product is no longer active', 400);
    }

    // Determine access
    let hasAccess = false;

    // 1. If it's a free product, anyone logged in can download
    if (product.isFree) {
      hasAccess = true;
    } 
    // 2. If it's the seller themselves downloading their own product
    else if (product.seller.toString() === userId.toString() || req.user.role === 'admin') {
      hasAccess = true;
    }
    // 3. Otherwise, check for valid purchase access
    else {
      const access = await PurchaseAccess.findOne({
        user: userId,
        product: productId,
        isActive: true
      });

      if (access) {
        hasAccess = true;
        // Track download
        access.downloadCount += 1;
        access.lastDownloadedAt = new Date();
        await access.save();
      }
    }

    if (!hasAccess) {
      throw new AppError('You do not have access to download this product. Please purchase it first.', 403);
    }

    // In a production app, we would generate a signed temporary URL from Cloudinary or S3 here.
    // For this implementation, we return the stored download URL.
    const downloadUrl = product.downloadUrl;

    if (!downloadUrl) {
      throw new AppError('Download asset is missing or not properly configured by the seller', 500);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Download authorized',
      url: downloadUrl 
    });

  } catch (error) {
    next(error);
  }
};
