const Course = require('../models/Course');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Get instructor dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Get total courses
    const totalCourses = await Course.countDocuments({ instructor: instructorId });

    // Get total students across all courses
    const courses = await Course.find({ instructor: instructorId });
    const totalStudents = courses.reduce((acc, course) => acc + course.enrolledStudents.length, 0);

    // Get total revenue
    const payments = await Payment.find({
      course: { $in: courses.map(course => course._id) },
      status: 'completed'
    });
    const totalRevenue = payments.reduce((acc, payment) => acc + payment.amount, 0);

    // Get recent enrollments
    const recentEnrollments = await Payment.find({
      course: { $in: courses.map(course => course._id) },
      status: 'completed'
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('course', 'title');

    // Get course performance
    const coursePerformance = await Course.find({ instructor: instructorId })
      .select('title enrolledStudents averageRating totalRatings')
      .sort({ enrolledStudents: -1 })
      .limit(5);

    res.json({
      stats: {
        totalCourses,
        totalStudents,
        totalRevenue
      },
      recentEnrollments,
      coursePerformance
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Error retrieving dashboard statistics' });
  }
};

// Get instructor's courses
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courses = await Course.find({ instructor: instructorId })
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({ message: 'Error retrieving instructor courses' });
  }
};

// Get course analytics
exports.getCourseAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user.id;

    // Verify course belongs to instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get enrollment data
    const enrollments = await Payment.find({
      course: courseId,
      status: 'completed'
    }).sort({ createdAt: -1 });

    // Get student progress
    const enrolledStudents = await User.find({
      enrolledCourses: courseId
    }).select('name email');

    // Calculate completion rates
    const totalLessons = course.modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0
    );

    res.json({
      course,
      enrollments,
      enrolledStudents,
      totalLessons,
      // Add more analytics as needed
    });
  } catch (error) {
    console.error('Get course analytics error:', error);
    res.status(500).json({ message: 'Error retrieving course analytics' });
  }
};

// Get instructor profile
exports.getInstructorProfile = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const instructor = await User.findById(instructorId)
      .select('-password')
      .populate({
        path: 'createdCourses',
        select: 'title thumbnail enrolledStudents averageRating'
      });

    res.json(instructor);
  } catch (error) {
    console.error('Get instructor profile error:', error);
    res.status(500).json({ message: 'Error retrieving instructor profile' });
  }
};

// Update instructor profile
exports.updateInstructorProfile = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const { name, bio, profilePicture } = req.body;

    const instructor = await User.findByIdAndUpdate(
      instructorId,
      {
        name,
        bio,
        profilePicture
      },
      { new: true }
    ).select('-password');

    res.json(instructor);
  } catch (error) {
    console.error('Update instructor profile error:', error);
    res.status(500).json({ message: 'Error updating instructor profile' });
  }
}; 