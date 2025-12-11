const express = require('express');
const router = express.Router();
const {
    getMentors,
    getMentorById,
    getStudents,
    rateMentor,
    getStats,
    toggleFavorite,
    getFavorites,
    updateAvailability
} = require('../controllers/mentorController');
const { protect } = require('../middleware/auth');
const updateLastActive = require('../middleware/updateLastActive');

// All routes require authentication
router.use(protect);
router.use(updateLastActive);

// Stats route (must come before /:id)
router.get('/stats/overview', getStats);

// Favorites routes
router.get('/favorites', getFavorites);
router.post('/:id/favorite', toggleFavorite);

// Rating route
router.post('/:id/rate', rateMentor);

// Availability route
router.patch('/availability', updateAvailability);

// General routes
router.get('/students', getStudents);
router.get('/', getMentors);
router.get('/:id', getMentorById);

module.exports = router;
