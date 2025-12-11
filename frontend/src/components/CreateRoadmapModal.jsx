import React, { useState } from 'react';
import axios from 'axios';

const CreateRoadmapModal = ({ isOpen, onClose, students, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        student: '',
        deadline: '',
        tasks: [],
        videos: [],
        assignments: []
    });

    // Temp inputs for adding items
    const [tempTask, setTempTask] = useState('');
    const [tempVideo, setTempVideo] = useState({ title: '', url: '' });
    const [tempAssignment, setTempAssignment] = useState({ title: '', description: '' });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // Format tasks to match backend schema (array of objects)
            const payload = {
                ...formData,
                tasks: formData.tasks.map(t => ({ title: t })),
                // videos and assignments already objects
            };

            await axios.post('/api/roadmap', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onSuccess();
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating roadmap');
        }
    };

    const addTask = () => {
        if (tempTask.trim()) {
            setFormData({ ...formData, tasks: [...formData.tasks, tempTask] });
            setTempTask('');
        }
    };

    const addVideo = () => {
        if (tempVideo.title && tempVideo.url) {
            setFormData({ ...formData, videos: [...formData.videos, tempVideo] });
            setTempVideo({ title: '', url: '' });
        }
    };

    const addAssignment = () => {
        if (tempAssignment.title) {
            setFormData({ ...formData, assignments: [...formData.assignments, tempAssignment] });
            setTempAssignment({ title: '', description: '' });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="glass-dark border border-purple-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">🚀 Create Learning Roadmap</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Title</label>
                                <input
                                    required
                                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., React Fundamentals"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Assign To</label>
                                <select
                                    required
                                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                    value={formData.student}
                                    onChange={e => setFormData({ ...formData, student: e.target.value })}
                                >
                                    <option value="">Select Student</option>
                                    {students.map(s => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea
                                required
                                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none h-24"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Deadline</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                value={formData.deadline}
                                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>

                        {/* Tasks */}
                        <div className="border border-purple-500/20 rounded-xl p-4 bg-purple-500/5">
                            <h3 className="font-bold text-white mb-2">✅ Tasks</h3>
                            <div className="flex gap-2 mb-2">
                                <input
                                    className="flex-1 bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white"
                                    placeholder="Add task..."
                                    value={tempTask}
                                    onChange={e => setTempTask(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTask())}
                                />
                                <button type="button" onClick={addTask} className="bg-purple-600 px-3 rounded text-white">+</button>
                            </div>
                            <ul className="space-y-1">
                                {formData.tasks.map((t, i) => (
                                    <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                        <span className="text-green-400">✓</span> {t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Videos */}
                        <div className="border border-blue-500/20 rounded-xl p-4 bg-blue-500/5">
                            <h3 className="font-bold text-white mb-2">📺 Videos</h3>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <input
                                    className="bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white"
                                    placeholder="Video Title"
                                    value={tempVideo.title}
                                    onChange={e => setTempVideo({ ...tempVideo, title: e.target.value })}
                                />
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white"
                                        placeholder="URL"
                                        value={tempVideo.url}
                                        onChange={e => setTempVideo({ ...tempVideo, url: e.target.value })}
                                    />
                                    <button type="button" onClick={addVideo} className="bg-blue-600 px-3 rounded text-white">+</button>
                                </div>
                            </div>
                            <ul className="space-y-1">
                                {formData.videos.map((v, i) => (
                                    <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                        <span className="text-blue-400">▶</span> {v.title}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-neon transition-all"
                        >
                            Create Roadmap Item
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateRoadmapModal;
