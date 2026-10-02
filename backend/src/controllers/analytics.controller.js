import mongoose from 'mongoose';
import Artwork from '../models/Artwork.js';
import Tutorial from '../models/Tutorial.js';
import PromptCollection from '../models/PromptCollection.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getCreatorStats = async (req, res, next) => {
  try {
    const creatorId = req.user._id;

    // 1. Total Views
    const artworkViewsResult = await Artwork.aggregate([
      { $match: { creator: creatorId } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const tutorialViewsResult = await Tutorial.aggregate([
      { $match: { creator: creatorId } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const promptViewsResult = await PromptCollection.aggregate([
      { $match: { creator: creatorId } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const totalViews = (artworkViewsResult[0]?.totalViews || 0) +
                       (tutorialViewsResult[0]?.totalViews || 0) +
                       (promptViewsResult[0]?.totalViews || 0);

    // 2. Total Sales & Revenue
    const salesResult = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $unwind: '$products' },
      { $match: { 'products.seller': creatorId } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 }, 
          totalRevenue: { $sum: '$products.priceAtPurchase' }
        }
      }
    ]);

    const totalSales = salesResult[0]?.totalSales || 0;
    const totalRevenue = salesResult[0]?.totalRevenue || 0;

    // 3. Total Products
    const totalProducts = await Product.countDocuments({ seller: creatorId });

    res.status(200).json({
      success: true,
      data: {
        totalViews,
        totalSales,
        totalRevenue,
        totalProducts
      }
    });

  } catch (error) {
    next(error);
  }
};
