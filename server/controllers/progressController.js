const Course = require('../models/Course');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Update lesson progress
exports.updateLessonProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled
    const enrollment = course.enrolledStudents.find(
      e => e.student.toString() === userId
    );
    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    // Check if lesson exists
    const lessonExists = course.modules.some(module =>
      module.lessons.some(lesson => lesson._id.toString() === lessonId)
    );
    if (!lessonExists) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Add lesson to completed lessons if not already completed
    if (!enrollment.completedLessons.some(l => l.lesson.toString() === lessonId)) {
      enrollment.completedLessons.push({
        lesson: lessonId,
        completedAt: new Date()
      });

      // Update overall progress
      enrollment.progress = course.calculateProgress(userId);

      await course.save();

      // Check if certificate can be issued
      if (course.canIssueCertificate(userId)) {
        await generateCertificate(course, userId);
      }
    }

    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress' });
  }
};

// Submit quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find the lesson and its quiz
    const module = course.modules.find(m =>
      m.lessons.some(l => l._id.toString() === lessonId)
    );
    if (!module) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const lesson = module.lessons.find(l => l._id.toString() === lessonId);
    if (!lesson.quiz) {
      return res.status(400).json({ message: 'No quiz found for this lesson' });
    }

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;

    lesson.quiz.questions.forEach((question, index) => {
      totalPoints += question.points;
      if (answers[index] === question.correctAnswer) {
        earnedPoints += question.points;
      }
    });

    const score = (earnedPoints / totalPoints) * 100;

    // Update enrollment with quiz score
    const enrollment = course.enrolledStudents.find(
      e => e.student.toString() === userId
    );
    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const completedLesson = enrollment.completedLessons.find(
      l => l.lesson.toString() === lessonId
    );
    if (completedLesson) {
      completedLesson.quizScore = score;
    } else {
      enrollment.completedLessons.push({
        lesson: lessonId,
        quizScore: score,
        completedAt: new Date()
      });
    }

    // Update overall progress
    enrollment.progress = course.calculateProgress(userId);

    await course.save();

    // Check if certificate can be issued
    if (course.canIssueCertificate(userId)) {
      await generateCertificate(course, userId);
    }

    res.json({
      message: 'Quiz submitted successfully',
      score,
      passed: score >= lesson.quiz.passingScore
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz' });
  }
};

// Generate certificate
async function generateCertificate(course, userId) {
  try {
    const user = await User.findById(userId);
    const enrollment = course.enrolledStudents.find(
      e => e.student.toString() === userId
    );

    if (!enrollment.certificateIssued) {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape'
      });

      const certificatePath = path.join(
        __dirname,
        '../certificates',
        `${course._id}-${userId}.pdf`
      );

      doc.pipe(fs.createWriteStream(certificatePath));

      // Add certificate content
      doc
        .fontSize(40)
        .text('Certificate of Completion', { align: 'center' })
        .moveDown()
        .fontSize(20)
        .text(`This is to certify that`, { align: 'center' })
        .moveDown()
        .fontSize(30)
        .text(user.name, { align: 'center' })
        .moveDown()
        .fontSize(20)
        .text(`has successfully completed the course`, { align: 'center' })
        .moveDown()
        .fontSize(25)
        .text(course.title, { align: 'center' })
        .moveDown()
        .fontSize(15)
        .text(`Issued on: ${new Date().toLocaleDateString()}`, { align: 'center' });

      doc.end();

      // Update enrollment with certificate info
      enrollment.certificateIssued = true;
      enrollment.certificateIssuedAt = new Date();
      await course.save();
    }
  } catch (error) {
    console.error('Error generating certificate:', error);
  }
}

// Get course progress
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollment = course.enrolledStudents.find(
      e => e.student.toString() === userId
    );
    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    const progress = {
      overall: enrollment.progress,
      modules: course.modules.map(module => ({
        title: module.title,
        lessons: module.lessons.map(lesson => ({
          title: lesson.title,
          completed: enrollment.completedLessons.some(
            l => l.lesson.toString() === lesson._id.toString()
          ),
          quizScore: enrollment.completedLessons.find(
            l => l.lesson.toString() === lesson._id.toString()
          )?.quizScore
        }))
      })),
      certificateIssued: enrollment.certificateIssued,
      certificateIssuedAt: enrollment.certificateIssuedAt
    };

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error getting course progress' });
  }
}; 