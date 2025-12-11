const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

router.use(protect);

// @desc    Award XP to student
// @route   POST /api/gamification/award-xp
// @access  Private
router.post('/award-xp', async (req, res) => {
    try {
        const { amount } = req.body;
        const student = await User.findById(req.user._id);

        if (!student.gamification) {
            student.gamification = { xp: 0, level: 1, streak: 0, badges: [] };
        }

        student.gamification.xp += amount;

        // Level up logic (every 100 XP = 1 level)
        const newLevel = Math.floor(student.gamification.xp / 100) + 1;
        const leveledUp = newLevel > student.gamification.level;
        student.gamification.level = newLevel;

        // Update streak
        const today = new Date().toDateString();
        const lastActivity = student.gamification.lastActivityDate?.toDateString();

        if (lastActivity !== today) {
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            if (lastActivity === yesterday) {
                student.gamification.streak += 1;
            } else if (!lastActivity) {
                student.gamification.streak = 1;
            } else {
                student.gamification.streak = 1;
            }
            student.gamification.lastActivityDate = new Date();
        }

        await student.save();

        res.json({
            gamification: student.gamification,
            leveledUp,
            message: leveledUp ? `Congratulations! You reached level ${newLevel}!` : 'XP awarded!'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Award badge to student (mentor only)
// @route   POST /api/gamification/award-badge
// @access  Private
router.post('/award-badge', async (req, res) => {
    try {
        const { studentId, badgeName, icon } = req.body;

        if (req.user.role !== 'mentor') {
            return res.status(403).json({ message: 'Only mentors can award badges' });
        }

        const student = await User.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!student.gamification) {
            student.gamification = { xp: 0, level: 1, streak: 0, badges: [] };
        }

        student.gamification.badges.push({
            name: badgeName,
            icon,
            awardedBy: req.user._id
        });

        await student.save();

        res.json({
            gamification: student.gamification,
            message: `Badge "${badgeName}" awarded to ${student.name}!`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get student gamification data
// @route   GET /api/gamification/stats
// @access  Private
router.get('/stats', async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.gamification || { xp: 0, level: 1, streak: 0, badges: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
