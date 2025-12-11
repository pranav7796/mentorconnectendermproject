const User = require('../models/User');

const updateLastActive = async (req, res, next) => {
    if (req.user && req.user._id) {
        try {
            await User.findByIdAndUpdate(req.user._id, { lastActive: new Date() });
        } catch (error) {
            console.error('Error updating last active:', error);
        }
    }
    next();
};

module.exports = updateLastActive;
