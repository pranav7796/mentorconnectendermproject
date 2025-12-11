const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

router.use(protect);

// @desc    Get chat history with a specific user
// @route   GET /api/chat/:userId
// @access  Private
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Mark messages as read
// @route   PUT /api/chat/:userId/read
// @access  Private
router.put('/:userId/read', async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user._id;

        await Message.updateMany(
            { sender: userId, receiver: myId, read: false },
            { read: true }
        );

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
