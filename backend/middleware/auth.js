const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is a mentor
const mentorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'mentor') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Mentors only.' });
  }
};

// Middleware to check if user is a student
const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Students only.' });
  }
};

module.exports = { protect, mentorOnly, studentOnly };
