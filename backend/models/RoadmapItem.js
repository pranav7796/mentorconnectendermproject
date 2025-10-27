const mongoose = require('mongoose');

const roadmapItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student reference is required']
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Mentor reference is required']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'evaluated'],
    default: 'pending'
  },
  tasks: [{
    title: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    title: String,
    url: String
  }],
  assignments: [{
    title: String,
    description: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  questions: [{
    question: String,
    answer: String,
    askedAt: {
      type: Date,
      default: Date.now
    }
  }],
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RoadmapItem', roadmapItemSchema);
