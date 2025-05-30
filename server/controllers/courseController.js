const Course = require('../models/Course');
const { validationResult } = require('express-validator');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Instructor only)
exports.createCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const courseData = {
      ...req.body,
      instructor: req.user._id
    };

    const course = await Course.create(courseData);
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const { category, level, search, sort } = req.query;
    let query = { isPublished: true };

    // Apply filters
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply sorting
    let sortOption = {};
    if (sort === 'price') sortOption = { price: 1 };
    else if (sort === '-price') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { averageRating: -1 };
    else sortOption = { createdAt: -1 };

    const courses = await Course.find(query)
      .sort(sortOption)
      .populate('instructor', 'name email')
      .select('-modules.quiz');

    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('ratings.user', 'name');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Instructor only)
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Instructor only)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.remove();
    res.json({ message: 'Course removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const isEnrolled = course.enrolledStudents.some(
      student => student.student.toString() === req.user._id.toString()
    );

    if (isEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push({
      student: req.user._id,
      progress: 0,
      completedModules: []
    });

    await course.save();
    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add rating and review
// @route   POST /api/courses/:id/ratings
// @access  Private
exports.addRating = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user has already rated
    const existingRating = course.ratings.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
    } else {
      course.ratings.push({
        user: req.user._id,
        rating,
        review
      });
    }

    await course.save();
    res.json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Get courses created by the instructor
// @route   GET /api/courses/instructor/courses
// @access  Private (Instructor only)
exports.getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    next(error);
  }
}; 