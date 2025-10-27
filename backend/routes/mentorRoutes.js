const express = require('express');
const router = express.Router();
const { getMentors, getMentorById, getStudents } = require('../controllers/mentorController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.get('/students', getStudents);  // This must come before /:id route
router.get('/', getMentors);
router.get('/:id', getMentorById);

module.exports = router;
