const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
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
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired', 'cancelled'],
    default: 'active'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  expiryDate: Date,
  accessExpired: {
    type: Boolean,
    default: false
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  notes: String
}, {
  timestamps: true
});

// Ensure one enrollment per user per course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Update lastAccessedAt on each access
enrollmentSchema.pre('save', function(next) {
  if (this.isModified('lastAccessedAt')) {
    this.lastAccessedAt = new Date();
  }
  next();
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment; 