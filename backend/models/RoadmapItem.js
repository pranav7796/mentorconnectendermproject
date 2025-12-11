const mongoose = require('mongoose');

const roadmapItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  tasks: [{
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'submitted', 'approved', 'rejected'],
      default: 'pending'
    },
    submission: String,
    studentComments: String,
    mentorComments: String,
    submittedAt: Date,
    reviewedAt: Date,
    isCompleted: { type: Boolean, default: false }
  }],
  videos: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'watched', 'verified'],
      default: 'pending'
    },
    studentComments: String,
    watchedAt: Date,
    isCompleted: { type: Boolean, default: false }
  }],
  assignments: [{
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'submitted', 'approved', 'rejected'],
      default: 'pending'
    },
    submission: String,
    submissionLink: String,
    studentComments: String,
    mentorComments: String,
    submittedAt: Date,
    reviewedAt: Date
  }],
  questions: [{
    question: String,
    answer: String,
    askedAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Virtual for progress percentage
roadmapItemSchema.virtual('progressPercentage').get(function () {
  const totalItems = this.tasks.length + this.videos.length + this.assignments.length;
  if (totalItems === 0) return 0;

  const completedTasks = this.tasks.filter(t => t.status === 'approved').length;
  const completedVideos = this.videos.filter(v => v.isCompleted).length;
  const completedAssignments = this.assignments.filter(a => a.status === 'approved').length;

  const completed = completedTasks + completedVideos + completedAssignments;
  return Math.round((completed / totalItems) * 100);
});

roadmapItemSchema.set('toJSON', { virtuals: true });
roadmapItemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('RoadmapItem', roadmapItemSchema);
