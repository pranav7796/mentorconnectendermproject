const User = require('../models/User');

// @desc    Get mentors with restricted visibility
// @route   GET /api/mentors
// @access  Private
const getMentors = async (req, res) => {
  try {
    // Students only see their assigned mentor if they have one
    if (req.user.role === 'student') {
      if (!req.user.assignedMentor) {
        // If no mentor assigned, show ALL mentors so they can choose
        const mentors = await User.find({ role: 'mentor' }).select('-password');
        return res.json({
          success: true,
          count: mentors.length,
          data: mentors
        });
      }

      // If mentor assigned, show that mentor
      const mentor = await User.findById(req.user.assignedMentor).select('-password');
      return res.json({
        success: true,
        count: mentor ? 1 : 0,
        data: mentor ? [mentor] : []
      });
    }

    // Mentors see their assigned students
    if (req.user.role === 'mentor') {
      const students = await User.find({
        role: 'student',
        assignedMentor: req.user._id
      }).select('-password');

      return res.json({
        success: true,
        count: students.length,
        data: students
      });
    }

    res.status(403).json({ success: false, message: 'Unauthorized' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get mentor by ID
// @route   GET /api/mentors/:id
// @access  Private
const getMentorById = async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id).select('-password');

    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    res.json({
      success: true,
      data: mentor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/mentors/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rate a mentor
// @route   POST /api/mentors/:id/rate
// @access  Private
const rateMentor = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const mentorId = req.params.id;
    const studentId = req.user._id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'mentor') {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if student already rated
    const existingReview = mentor.reviews.find(
      r => r.studentId.toString() === studentId.toString()
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      mentor.reviews.push({ studentId, rating, comment });
      mentor.totalRatings += 1;
    }

    // Recalculate average rating
    const totalScore = mentor.reviews.reduce((sum, r) => sum + r.rating, 0);
    mentor.rating = totalScore / mentor.reviews.length;

    await mentor.save();

    res.json({
      message: 'Rating submitted successfully',
      rating: mentor.rating,
      totalRatings: mentor.totalRatings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform stats
// @route   GET /api/mentors/stats/overview
// @access  Private
const getStats = async (req, res) => {
  try {
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeMentors = await User.countDocuments({
      role: 'mentor',
      lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const topMentors = await User.find({ role: 'mentor' })
      .sort({ rating: -1 })
      .limit(5)
      .select('name domain rating totalRatings');

    res.json({
      totalMentors,
      totalStudents,
      activeMentors,
      topMentors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle favorite mentor
// @route   POST /api/mentors/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const mentorId = req.params.id;
    const student = await User.findById(req.user._id);

    const index = student.favoriteMentors.indexOf(mentorId);

    if (index > -1) {
      student.favoriteMentors.splice(index, 1);
    } else {
      student.favoriteMentors.push(mentorId);
    }

    await student.save();

    res.json({
      message: index > -1 ? 'Removed from favorites' : 'Added to favorites',
      favorites: student.favoriteMentors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get favorite mentors
// @route   GET /api/mentors/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const student = await User.findById(req.user._id)
      .populate('favoriteMentors', '-password');

    res.json(student.favoriteMentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update mentor availability
// @route   PATCH /api/mentors/availability
// @access  Private
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const mentor = await User.findByIdAndUpdate(
      req.user._id,
      { availability },
      { new: true }
    ).select('-password');

    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMentors,
  getMentorById,
  getStudents,
  rateMentor,
  getStats,
  toggleFavorite,
  getFavorites,
  updateAvailability
};
