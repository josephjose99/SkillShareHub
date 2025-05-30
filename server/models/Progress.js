const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    quizScore: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  currentModule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course.modules'
  },
  currentLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course.modules.lessons'
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  overallProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: Date
}, {
  timestamps: true
});

// Ensure one progress record per user per course
progressSchema.index({ user: 1, course: 1 }, { unique: true });

// Calculate overall progress before saving
progressSchema.pre('save', function(next) {
  if (this.completedLessons.length > 0) {
    // This will be updated when we have the total number of lessons
    // from the course model
    this.overallProgress = (this.completedLessons.length / this.totalLessons) * 100;
  }
  next();
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress; 