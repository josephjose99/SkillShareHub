const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');

// Test route to create a sample course
router.post('/create-course', async (req, res) => {
  try {
    const testCourse = new Course({
      title: 'Test Course',
      description: 'This is a test course to verify database connection',
      instructor: '65f1a2b3c4d5e6f7g8h9i0j1', // This will be replaced with actual instructor ID
      price: 29.99,
      thumbnail: 'https://source.unsplash.com/random/300x200?course',
      category: 'development',
      level: 'beginner',
      modules: [
        {
          title: 'Test Module',
          description: 'Test module description',
          lessons: [
            {
              title: 'Test Lesson',
              content: 'Test lesson content',
              duration: 30
            }
          ]
        }
      ]
    });

    const savedCourse = await testCourse.save();
    res.status(201).json({
      success: true,
      message: 'Test course created successfully',
      data: savedCourse
    });
  } catch (error) {
    console.error('Error creating test course:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test course',
      error: error.message
    });
  }
});

// Test route to get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
});

// Test route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

module.exports = router; 