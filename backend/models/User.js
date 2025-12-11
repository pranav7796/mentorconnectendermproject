const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['student', 'mentor'],
    required: [true, 'Role is required']
  },
  // Mentor-specific fields
  domain: {
    type: String,
    required: function () {
      return this.role === 'mentor';
    }
  },
  experience: {
    type: Number,
    required: function () {
      return this.role === 'mentor';
    }
  },
  bio: {
    type: String,
    required: function () {
      return this.role === 'mentor';
    }
  },
  // Rating system
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  reviews: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  // Activity tracking
  lastActive: {
    type: Date,
    default: Date.now
  },
  // Mentor availability
  availability: {
    type: String,
    enum: ['available', 'busy', 'unavailable'],
    default: 'available'
  },
  // Session tracking
  sessionsCompleted: {
    type: Number,
    default: 0
  },
  // Student favorites
  favoriteMentors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Assigned mentor (for students)
  assignedMentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Mentorship status
  mentorshipStatus: {
    type: String,
    enum: ['none', 'pending', 'active', 'completed'],
    default: 'none'
  },
  // Gamification (for students)
  gamification: {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActivityDate: Date,
    badges: [{
      name: String,
      icon: String,
      awardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      awardedAt: { type: Date, default: Date.now }
    }]
  },
  // Notifications
  unreadNotifications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual field for profile completion
userSchema.virtual('profileCompletion').get(function () {
  let completion = 0;
  const fields = this.role === 'mentor'
    ? ['name', 'email', 'domain', 'experience', 'bio']
    : ['name', 'email'];

  fields.forEach(field => {
    if (this[field]) completion += 100 / fields.length;
  });

  return Math.round(completion);
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });


module.exports = mongoose.model('User', userSchema);
