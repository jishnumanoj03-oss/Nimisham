import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

// --- PRODUCTS API ---

export const createProduct = async (req, res, next) => {
  try {
    const { title, description, category, tags, previewImage, relatedContentId, relatedContentType, downloadUrl, price, isFree, visibility } = req.body;
    const seller = req.user._id;

    if (!isFree && price <= 0) {
      throw new AppError('Paid products must have a price greater than 0', 400);
    }

    const product = await Product.create({
      seller,
      title,
      description,
      category,
      tags,
      previewImage,
      relatedContentId,
      relatedContentType,
      downloadUrl,
      price: isFree ? 0 : price,
      isFree,
      visibility,
      status: 'active'
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ visibility: 'public', status: 'active' })
      .populate('seller', 'name username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name username avatar bio');
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Only seller or admin can view draft/inactive products
    if (product.status !== 'active' || product.visibility !== 'public') {
      if (!req.user || (req.user._id.toString() !== product.seller._id.toString() && req.user.role !== 'admin')) {
        throw new AppError('Product is not available', 403);
      }
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this product', 403);
    }

    // Do not allow updating downloadUrl here if it requires re-upload logic, 
    // but for simplicity we allow standard updates.
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};
