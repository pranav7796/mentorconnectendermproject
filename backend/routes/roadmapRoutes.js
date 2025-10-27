const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getRoadmapItems,
  getRoadmapItem,
  createRoadmapItem,
  updateRoadmapItem,
  deleteRoadmapItem,
  addQuestion,
  answerQuestion
} = require('../controllers/roadmapController');
const { protect, mentorOnly, studentOnly } = require('../middleware/auth');

// Validation rules
const createRoadmapValidation = [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('student').notEmpty().withMessage('Student ID is required'),
  body('deadline').isISO8601().withMessage('Valid deadline is required')
];

// All routes require authentication
router.use(protect);

// General routes
router.route('/')
  .get(getRoadmapItems)
  .post(mentorOnly, createRoadmapValidation, createRoadmapItem);

router.route('/:id')
  .get(getRoadmapItem)
  .put(updateRoadmapItem)
  .delete(mentorOnly, deleteRoadmapItem);

// Question routes
router.post('/:id/question', studentOnly, addQuestion);
router.put('/:id/question/:questionId', mentorOnly, answerQuestion);

module.exports = router;
