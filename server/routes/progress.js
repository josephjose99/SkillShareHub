const express = require('express');
const router = express.Router();
const {
  updateLessonProgress,
  submitQuiz,
  getCourseProgress
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Progress tracking routes
router.post('/courses/:courseId/lessons/:lessonId/progress', updateLessonProgress);
router.post('/courses/:courseId/lessons/:lessonId/quiz', submitQuiz);
router.get('/courses/:courseId/progress', getCourseProgress);

module.exports = router; 