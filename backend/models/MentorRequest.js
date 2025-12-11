const mongoose = require('mongoose');

const mentorRequestSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    message: {
        type: String,
        maxlength: 500
    },
    responseMessage: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    respondedAt: Date
}, {
    timestamps: true
});

// Prevent duplicate requests
mentorRequestSchema.index({ studentId: 1, mentorId: 1 }, { unique: true });

module.exports = mongoose.model('MentorRequest', mentorRequestSchema);
