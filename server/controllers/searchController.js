const Course = require('../models/Course');

// Get search suggestions
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const suggestions = await Course.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
    .select('title category tags')
    .sort({ score: { $meta: 'textScore' } })
    .limit(5);

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Error getting search suggestions' });
  }
};

// Advanced search with filters
exports.searchCourses = async (req, res) => {
  try {
    const {
      query,
      category,
      level,
      minPrice,
      maxPrice,
      minRating,
      sortBy = 'relevance',
      page = 1,
      limit = 10
    } = req.query;

    // Build search query
    const searchQuery = {};

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Filters
    if (category) {
      searchQuery.category = category;
    }
    if (level) {
      searchQuery.level = level;
    }
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }
    if (minRating) {
      searchQuery.averageRating = { $gte: Number(minRating) };
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { averageRating: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = query ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
    }

    // Execute search
    const courses = await Course.find(searchQuery, query ? { score: { $meta: 'textScore' } } : {})
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('instructor', 'name email')
      .lean();

    // Get total count for pagination
    const total = await Course.countDocuments(searchQuery);

    res.json({
      courses,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching courses' });
  }
};

// Get popular search terms
exports.getPopularSearches = async (req, res) => {
  try {
    const popularSearches = await Course.aggregate([
      { $match: { isPublished: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json(popularSearches.map(term => term._id));
  } catch (error) {
    res.status(500).json({ message: 'Error getting popular searches' });
  }
}; 