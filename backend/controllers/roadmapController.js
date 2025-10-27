const RoadmapItem = require('../models/RoadmapItem');
const { validationResult } = require('express-validator');

// @desc    Get all roadmap items for current user
// @route   GET /api/roadmap
// @access  Private
const getRoadmapItems = async (req, res) => {
  try {
    let query;
    
    // If student, get their assigned roadmap items
    if (req.user.role === 'student') {
      query = { student: req.user._id };
    } 
    // If mentor, get roadmap items they created
    else if (req.user.role === 'mentor') {
      query = { mentor: req.user._id };
    }

    const roadmapItems = await RoadmapItem.find(query)
      .populate('student', 'name email')
      .populate('mentor', 'name email domain');
    
    res.json({
      success: true,
      count: roadmapItems.length,
      data: roadmapItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single roadmap item
// @route   GET /api/roadmap/:id
// @access  Private
const getRoadmapItem = async (req, res) => {
  try {
    const roadmapItem = await RoadmapItem.findById(req.params.id)
      .populate('student', 'name email')
      .populate('mentor', 'name email domain');
    
    if (!roadmapItem) {
      return res.status(404).json({ success: false, message: 'Roadmap item not found' });
    }

    // Check if user is authorized to view this roadmap item
    if (roadmapItem.student._id.toString() !== req.user._id.toString() &&
        roadmapItem.mentor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this roadmap item' });
    }

    res.json({
      success: true,
      data: roadmapItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create roadmap item
// @route   POST /api/roadmap
// @access  Private (Mentor only)
const createRoadmapItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, student, tasks, videos, assignments, deadline } = req.body;

    const roadmapItem = await RoadmapItem.create({
      title,
      description,
      student,
      mentor: req.user._id,
      tasks: tasks || [],
      videos: videos || [],
      assignments: assignments || [],
      deadline
    });

    const populatedItem = await RoadmapItem.findById(roadmapItem._id)
      .populate('student', 'name email')
      .populate('mentor', 'name email domain');

    res.status(201).json({
      success: true,
      data: populatedItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update roadmap item
// @route   PUT /api/roadmap/:id
// @access  Private
const updateRoadmapItem = async (req, res) => {
  try {
    let roadmapItem = await RoadmapItem.findById(req.params.id);

    if (!roadmapItem) {
      return res.status(404).json({ success: false, message: 'Roadmap item not found' });
    }

    // Check authorization
    if (roadmapItem.student.toString() !== req.user._id.toString() &&
        roadmapItem.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this roadmap item' });
    }

    // Students can update status, tasks, questions
    // Mentors can update everything including score and feedback
    roadmapItem = await RoadmapItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('student', 'name email')
    .populate('mentor', 'name email domain');

    res.json({
      success: true,
      data: roadmapItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete roadmap item
// @route   DELETE /api/roadmap/:id
// @access  Private (Mentor only)
const deleteRoadmapItem = async (req, res) => {
  try {
    const roadmapItem = await RoadmapItem.findById(req.params.id);

    if (!roadmapItem) {
      return res.status(404).json({ success: false, message: 'Roadmap item not found' });
    }

    // Only mentor who created it can delete
    if (roadmapItem.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this roadmap item' });
    }

    await roadmapItem.deleteOne();

    res.json({
      success: true,
      message: 'Roadmap item deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add question to roadmap item
// @route   POST /api/roadmap/:id/question
// @access  Private (Student only)
const addQuestion = async (req, res) => {
  try {
    const roadmapItem = await RoadmapItem.findById(req.params.id);

    if (!roadmapItem) {
      return res.status(404).json({ success: false, message: 'Roadmap item not found' });
    }

    if (roadmapItem.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    roadmapItem.questions.push({
      question: req.body.question,
      answer: '',
      askedAt: Date.now()
    });

    await roadmapItem.save();

    res.json({
      success: true,
      data: roadmapItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Answer question on roadmap item
// @route   PUT /api/roadmap/:id/question/:questionId
// @access  Private (Mentor only)
const answerQuestion = async (req, res) => {
  try {
    const roadmapItem = await RoadmapItem.findById(req.params.id);

    if (!roadmapItem) {
      return res.status(404).json({ success: false, message: 'Roadmap item not found' });
    }

    if (roadmapItem.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const question = roadmapItem.questions.id(req.params.questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    question.answer = req.body.answer;
    await roadmapItem.save();

    res.json({
      success: true,
      data: roadmapItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRoadmapItems,
  getRoadmapItem,
  createRoadmapItem,
  updateRoadmapItem,
  deleteRoadmapItem,
  addQuestion,
  answerQuestion
};
