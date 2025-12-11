import React, { useState } from 'react';
import { roadmapAPI } from '../services/api';

const RoadmapCard = ({ roadmap, userRole, onUpdate }) => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [submission, setSubmission] = useState('');
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);

    // Calculate progress stats
    const totalTasks = roadmap.tasks?.length || 0;
    const pendingTasks = roadmap.tasks?.filter(t => t.status === 'pending').length || 0;
    const submittedTasks = roadmap.tasks?.filter(t => t.status === 'submitted').length || 0;
    const approvedTasks = roadmap.tasks?.filter(t => t.status === 'approved').length || 0;
    const rejectedTasks = roadmap.tasks?.filter(t => t.status === 'rejected').length || 0;

    const progressPercentage = totalTasks > 0 ? Math.round((approvedTasks / totalTasks) * 100) : 0;

    const handleSubmitTask = async (taskId) => {
        if (!submission.trim()) {
            alert('Please provide your work submission');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await roadmapAPI.submitTask(roadmap._id, taskId, {
                submissionText: submission,
                comment: comments
            });

            setSubmission('');
            setComments('');
            setSelectedTask(null);
            onUpdate && onUpdate();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit task');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewTask = async (taskId, status, reviewComments) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await roadmapAPI.reviewTask(roadmap._id, taskId, {
                status,
                feedback: reviewComments
            });

            onUpdate && onUpdate();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to review task');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-gray-500/20', text: 'text-gray-300', label: '⏳ Pending' },
            submitted: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: '📨 Submitted' },
            approved: { bg: 'bg-green-500/20', text: 'text-green-300', label: '✅ Approved' },
            rejected: { bg: 'bg-red-500/20', text: 'text-red-300', label: '❌ Rejected' }
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${badge.bg} ${badge.text} border border-current`}>
                {badge.label}
            </span>
        );
    };

    // Debug logging
    console.log('RoadmapCard rendering:', {
        title: roadmap.title,
        userRole,
        tasksCount: roadmap.tasks?.length || 0,
        tasks: roadmap.tasks,
        videosCount: roadmap.videos?.length || 0
    });

    return (
        <div className="glass p-6 rounded-2xl border border-purple-500/30 hover:shadow-neon transition-all animate-slideUp">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{roadmap.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{roadmap.description}</p>
                </div>
                <div className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 border border-purple-500/50 ml-4">
                    Due: {new Date(roadmap.deadline).toLocaleDateString()}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-purple-300 font-bold">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                {userRole === 'mentor' && (
                    <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-blue-400">⚡ Submitted: {submittedTasks}</span>
                        <span className="text-green-400">✓ Approved: {approvedTasks}</span>
                        <span className="text-gray-400">○ Pending: {pendingTasks}</span>
                    </div>
                )}
            </div>

            {/* Debug info - remove after testing */}
            <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-300">
                <strong>DEBUG:</strong> Tasks: {roadmap.tasks?.length || 0}, Videos: {roadmap.videos?.length || 0}
            </div>

            {/* Tasks Section - Always show, with message if empty */}
            {roadmap.tasks?.length > 0 ? (
                <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 space-y-3">
                    <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">Tasks</h4>

                    {roadmap.tasks.map(task => (
                        <div
                            key={task._id}
                            className={`p-3 rounded-lg border transition-all ${task.status === 'approved' ? 'bg-green-500/5 border-green-500/30' :
                                task.status === 'submitted' ? 'bg-blue-500/5 border-blue-500/30' :
                                    task.status === 'rejected' ? 'bg-red-500/5 border-red-500/30' :
                                        'bg-gray-700/30 border-gray-600/30'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-200">{task.title}</p>
                                    {task.description && (
                                        <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                                    )}
                                </div>
                                {getStatusBadge(task.status)}
                            </div>

                            {/* Student View */}
                            {userRole === 'student' && (
                                <>
                                    {task.status === 'pending' && (
                                        <div className="mt-3 space-y-2">
                                            <textarea
                                                placeholder="Describe your work or paste your solution..."
                                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-purple-500 outline-none min-h-[80px]"
                                                value={selectedTask === task._id ? submission : ''}
                                                onChange={(e) => {
                                                    setSelectedTask(task._id);
                                                    setSubmission(e.target.value);
                                                }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Optional comments..."
                                                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"
                                                value={selectedTask === task._id ? comments : ''}
                                                onChange={(e) => {
                                                    setSelectedTask(task._id);
                                                    setComments(e.target.value);
                                                }}
                                            />
                                            <button
                                                onClick={() => handleSubmitTask(task._id)}
                                                disabled={loading || !submission.trim()}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                {loading ? 'Submitting...' : '📨 Submit Task'}
                                            </button>
                                        </div>
                                    )}

                                    {task.status === 'submitted' && (
                                        <div className="mt-2 text-xs text-blue-300 bg-blue-500/10 p-2 rounded">
                                            ⏳ Waiting for mentor review...
                                        </div>
                                    )}

                                    {task.status === 'approved' && task.mentorComments && (
                                        <div className="mt-2 text-xs text-green-300 bg-green-500/10 p-2 rounded border border-green-500/30">
                                            <strong>Mentor:</strong> {task.mentorComments}
                                        </div>
                                    )}

                                    {task.status === 'rejected' && (
                                        <div className="mt-2 space-y-2">
                                            {task.mentorComments && (
                                                <div className="text-xs text-red-300 bg-red-500/10 p-2 rounded border border-red-500/30">
                                                    <strong>Mentor:</strong> {task.mentorComments}
                                                </div>
                                            )}
                                            <button
                                                onClick={() => {
                                                    task.status = 'pending';
                                                    setSelectedTask(task._id);
                                                }}
                                                className="text-xs text-purple-400 hover:text-purple-300 underline"
                                            >
                                                Resubmit task
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Mentor View */}
                            {userRole === 'mentor' && (
                                <>
                                    {task.submission && (
                                        <div className="mt-2 text-xs">
                                            <div className="bg-gray-900/50 p-2 rounded border border-gray-700 mb-2">
                                                <p className="text-gray-300"><strong className="text-blue-400">Submission:</strong> {task.submission}</p>
                                                {task.studentComments && (
                                                    <p className="text-gray-400 mt-1"><em>Comments: {task.studentComments}</em></p>
                                                )}
                                                {task.submittedAt && (
                                                    <p className="text-gray-500 mt-1">Submitted: {new Date(task.submittedAt).toLocaleString()}</p>
                                                )}
                                            </div>

                                            {task.status === 'submitted' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const comment = prompt('(Optional) Add feedback:');
                                                            handleReviewTask(task._id, 'approved', comment || 'Well done!');
                                                        }}
                                                        disabled={loading}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition-all"
                                                    >
                                                        ✅ Approve
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const comment = prompt('(Required) Explain what needs improvement:');
                                                            if (comment) handleReviewTask(task._id, 'rejected', comment);
                                                        }}
                                                        disabled={loading}
                                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition-all"
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                </div>
                                            )}

                                            {task.mentorComments && (
                                                <div className="mt-2 text-xs text-purple-300 bg-purple-500/10 p-2 rounded">
                                                    <strong>Your Feedback:</strong> {task.mentorComments}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50 text-center">
                    <p className="text-gray-400 text-sm">No tasks in this roadmap yet. Ask your mentor to add tasks!</p>
                </div>
            )}

            {/* Videos Section (unchanged from before) */}
            {roadmap.videos?.length > 0 && (
                <div className="bg-gray-800/40 p-3 rounded-xl border border-gray-700/50 mt-4">
                    <h4 className="text-sm font-bold text-blue-300 mb-2 uppercase tracking-wider">Videos</h4>
                    <div className="space-y-2">
                        {roadmap.videos.map(video => (
                            <div key={video._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/30">
                                <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 hover:underline flex-1">
                                    {video.title} ↗
                                </a>
                                {video.isCompleted && <span className="text-green-400 text-xs">✓</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {userRole === 'mentor' && (
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                    <span>Assigned to: <span className="text-purple-300 font-semibold">{roadmap.student?.name}</span></span>
                    <span>Created: {new Date(roadmap.createdAt).toLocaleDateString()}</span>
                </div>
            )}
        </div>
    );
};

export default RoadmapCard;
