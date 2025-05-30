const express = require('express');
const router = express.Router();
const {
  searchCourses,
  getSearchSuggestions,
  getPopularSearches
} = require('../controllers/searchController');

// Public routes
router.get('/suggestions', getSearchSuggestions);
router.get('/popular', getPopularSearches);
router.get('/courses', searchCourses);

module.exports = router; 