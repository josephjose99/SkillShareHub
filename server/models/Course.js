const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true // For text search
  },
  description: {
    type: String,
    required: true,
    index: true // For text search
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true // For price filtering
  },
  thumbnail: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true // For category filtering
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
    index: true // For level filtering
  },
  modules: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    lessons: [{
      title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      duration: {
        type: Number,
        required: true
      },
      videoUrl: String,
      resources: [{
        title: String,
        fileUrl: String,
        type: String
      }],
      quiz: {
        questions: [{
          question: String,
          options: [String],
          correctAnswer: Number,
          points: {
            type: Number,
            default: 1
          }
        }],
        passingScore: {
          type: Number,
          default: 70
        }
      }
    }]
  }],
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    progress: {
      type: Number,
      default: 0
    },
    completedLessons: [{
      lesson: {
        type: mongoose.Schema.Types.ObjectId
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
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    certificateIssued: {
      type: Boolean,
      default: false
    },
    certificateIssuedAt: Date
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: {
      type: String,
      required: true
    },
    helpfulVotes: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    index: true // For rating filtering
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    index: true // For tag-based search
  }]
}, {
  timestamps: true
});

// Create text index for search
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Calculate average rating before saving
courseSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((acc, item) => acc + item.rating, 0) / this.ratings.length;
    this.totalRatings = this.ratings.length;
  }
  next();
});

// Calculate course progress
courseSchema.methods.calculateProgress = function(userId) {
  const enrollment = this.enrolledStudents.find(e => e.student.toString() === userId.toString());
  if (!enrollment) return 0;

  const totalLessons = this.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = enrollment.completedLessons.length;

  return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
};

// Check if user can receive certificate
courseSchema.methods.canIssueCertificate = function(userId) {
  const enrollment = this.enrolledStudents.find(e => e.student.toString() === userId.toString());
  if (!enrollment) return false;

  const progress = this.calculateProgress(userId);
  const allQuizzesPassed = enrollment.completedLessons.every(lesson => 
    lesson.quizScore >= this.modules
      .find(m => m.lessons.some(l => l._id.toString() === lesson.lesson.toString()))
      ?.lessons.find(l => l._id.toString() === lesson.lesson.toString())
      ?.quiz.passingScore
  );

  return progress >= 100 && allQuizzesPassed;
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 