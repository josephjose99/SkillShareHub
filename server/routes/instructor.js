const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const instructorController = require('../controllers/instructorController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);
router.use(authorize('instructor'));

// Get dashboard statistics
router.get('/dashboard', instructorController.getDashboardStats);

// Get instructor's courses
router.get('/courses', instructorController.getInstructorCourses);

// Get course analytics
router.get('/courses/:courseId/analytics', instructorController.getCourseAnalytics);

// Get instructor profile
router.get('/profile', instructorController.getInstructorProfile);

// Update instructor profile
router.put(
  '/profile',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('bio', 'Bio is required').not().isEmpty()
  ],
  instructorController.updateInstructorProfile
);

module.exports = router; 