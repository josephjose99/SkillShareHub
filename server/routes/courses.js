const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addRating,
  getInstructorCourses
} = require('../controllers/courseController');

// Validation middleware
const courseValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price is required and must be a positive number').isFloat({ min: 0 }),
  check('category', 'Category is required').not().isEmpty(),
  check('level', 'Level must be beginner, intermediate, or advanced').isIn(['beginner', 'intermediate', 'advanced'])
];

const ratingValidation = [
  check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('review', 'Review is required').not().isEmpty()
];

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes
router.use(protect);

// Instructor routes
router.get('/instructor/courses', authorize('instructor'), getInstructorCourses);
router.post('/', authorize('instructor'), upload.single('thumbnail'), courseValidation, createCourse);
router.put('/:id', authorize('instructor'), upload.single('thumbnail'), courseValidation, updateCourse);
router.delete('/:id', authorize('instructor'), deleteCourse);

router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/ratings', protect, ratingValidation, addRating);

module.exports = router; 