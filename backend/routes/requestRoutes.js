const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const MentorRequest = require('../models/MentorRequest');
const User = require('../models/User');

// All routes require authentication
router.use(protect);

// @desc    Send mentor request
// @route   POST /api/requests/send
// @access  Private
router.post('/send', async (req, res) => {
    try {
        const { mentorId, message } = req.body;
        const studentId = req.user._id;

        // Check if mentor exists
        const mentor = await User.findById(mentorId);
        if (!mentor || mentor.role !== 'mentor') {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        // Check for existing request
        const existing = await MentorRequest.findOne({ studentId, mentorId });
        if (existing) {
            return res.status(400).json({
                message: 'Request already sent',
                status: existing.status
            });
        }

        const request = await MentorRequest.create({
            studentId,
            mentorId,
            message
        });

        // Increment mentor's unread notifications
        await User.findByIdAndUpdate(mentorId, { $inc: { unreadNotifications: 1 } });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get my requests (for students)
// @route   GET /api/requests/my-requests
// @access  Private
router.get('/my-requests', async (req, res) => {
    try {
        const requests = await MentorRequest.find({ studentId: req.user._id })
            .populate('mentorId', 'name domain rating')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get pending requests (for mentors)
// @route   GET /api/requests/pending
// @access  Private
router.get('/pending', async (req, res) => {
    try {
        const requests = await MentorRequest.find({
            mentorId: req.user._id,
            status: 'pending'
        })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Accept/Reject request
// @route   PATCH /api/requests/:id/respond
// @access  Private
router.patch('/:id/respond', async (req, res) => {
    try {
        const { status, responseMessage } = req.body;

        const request = await MentorRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.mentorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        request.status = status;
        request.responseMessage = responseMessage;
        request.respondedAt = new Date();

        await request.save();

        // Auto-assign mentor if accepted
        if (status === 'accepted') {
            await User.findByIdAndUpdate(request.studentId, {
                assignedMentor: request.mentorId,
                mentorshipStatus: 'active'
            });
        }

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
