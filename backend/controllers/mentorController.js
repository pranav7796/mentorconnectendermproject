const User = require('../models/User');

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Private
const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    
    res.json({
      success: true,
      count: mentors.length,
      data: mentors
    });
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

module.exports = {
  getMentors,
  getMentorById,
  getStudents
};
