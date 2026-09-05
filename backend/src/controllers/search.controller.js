import mongoose from 'mongoose';
import Artwork from '../models/Artwork.js';
import User from '../models/User.js';
import Tutorial from '../models/Tutorial.js';
import Resource from '../models/Resource.js';
import { AppError } from '../middleware/errorHandler.js';

export const globalSearch = async (req, res, next) => {
  try {
    const { 
      q, 
      type = 'all', 
      category, 
      tag, 
      sort = 'newest', 
      page = 1, 
      limit = 20 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    // Build sort object
    let sortObj = {};
    if (sort === 'newest') sortObj = { createdAt: -1 };
    else if (sort === 'oldest') sortObj = { createdAt: 1 };
    else if (sort === 'popular') sortObj = { views: -1 };
    else if (sort === 'most_liked') sortObj = { likes: -1 };
    else sortObj = { createdAt: -1 }; // Default

    // Initialize results arrays
    let results = {
      artworks: [],
      users: [],
      tutorials: [],
      resources: []
    };

    let counts = {
      artworks: 0,
      users: 0,
      tutorials: 0,
      resources: 0
    };

    // Build common filter object based on q, category, tag
    const buildFilter = (searchFields = []) => {
      let filter = {};
      
      // Keyword search (Regex for partial matching)
      if (q) {
        filter.$or = searchFields.map(field => ({
          [field]: { $regex: q, $options: 'i' }
        }));
      }

      // Add category filter if provided
      if (category) {
        filter.category = category;
      }

      // Add tag filter if provided
      if (tag) {
        filter.tags = { $in: [tag] };
      }

      return filter;
    };

    // Helper to fetch paginated data
    const fetchPaginated = async (Model, filter, populateOpt = null) => {
      let query = Model.find(filter).sort(sortObj).skip(skip).limit(parsedLimit);
      if (populateOpt) {
        query = query.populate(populateOpt);
      }
      const data = await query;
      const count = await Model.countDocuments(filter);
      return { data, count };
    };

    // Execute searches based on type
    if (type === 'all' || type === 'artwork') {
      const artFilter = { ...buildFilter(['title', 'description']), visibility: 'public' };
      const { data, count } = await fetchPaginated(Artwork, artFilter, 'creator');
      results.artworks = data;
      counts.artworks = count;
    }

    if (type === 'all' || type === 'user') {
      // Users don't have tags or category like artworks, handle separately
      let userFilter = { isActive: true };
      if (q) {
        userFilter.$or = [
          { name: { $regex: q, $options: 'i' } },
          { username: { $regex: q, $options: 'i' } },
          { bio: { $regex: q, $options: 'i' } }
        ];
      }
      if (category) {
         // Assuming users might have a specific creatorType mapping
         userFilter.creatorType = category === 'Photography' ? 'photographer' : (category === 'AI Art' ? 'ai-artist' : null);
      }
      const { data, count } = await fetchPaginated(User, userFilter);
      results.users = data;
      counts.users = count;
    }

    if (type === 'all' || type === 'tutorial') {
      const tutFilter = { ...buildFilter(['title', 'content']), status: 'published' };
      // Assuming tutorial model exists
      try {
          const { data, count } = await fetchPaginated(Tutorial, tutFilter, 'creator');
          results.tutorials = data;
          counts.tutorials = count;
      } catch(e) {
          // Model might not be fully implemented yet
      }
    }

    if (type === 'all' || type === 'resource') {
      const resFilter = { ...buildFilter(['title', 'description']), visibility: 'public' };
      // Assuming resource model exists
      try {
          const { data, count } = await fetchPaginated(Resource, resFilter, 'creator');
          results.resources = data;
          counts.resources = count;
      } catch(e) {
          // Model might not be fully implemented yet
      }
    }

    res.status(200).json({
      success: true,
      data: results,
      meta: {
        counts,
        page: parseInt(page),
        limit: parsedLimit,
        totalResults: counts.artworks + counts.users + counts.tutorials + counts.resources
      }
    });

  } catch (error) {
    next(error);
  }
};
