import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BadgeAwardModal from '../components/BadgeAwardModal';
import CreateRoadmapModal from '../components/CreateRoadmapModal';
import RoadmapCard from '../components/RoadmapCard';

const MentorDashboardNew = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [requests, setRequests] = useState([]);
    const [roadmaps, setRoadmaps] = useState([]);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showBadgeModal, setShowBadgeModal] = useState(false);
    const [showRoadmapModal, setShowRoadmapModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [studentsRes, requestsRes, roadmapsRes] = await Promise.all([
                axios.get('/api/mentors', { headers }),
                axios.get('/api/requests/pending', { headers }),
                axios.get('/api/roadmap', { headers })
            ]);

            setStudents(studentsRes.data.data || []);
            setRequests(requestsRes.data || []);
            setRoadmaps(roadmapsRes.data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/requests/${requestId}/respond`,
                { status: 'accepted' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/requests/${requestId}/respond`,
                { status: 'rejected' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
                <div className="text-2xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {/* Header */}
            <div className="glass-dark backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Mentor Dashboard 🎓</h1>
                            <p className="text-sm text-purple-300">Manage your students and track their progress</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRoadmapModal(true)}
                                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-neon transition-all hover:scale-105"
                            >
                                + Create Roadmap
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    window.location.href = '/login';
                                }}
                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 rounded-lg font-semibold transition-all flex items-center gap-2"
                            >
                                <span>🚪</span>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* 1. Pending Requests */}
                {requests.length > 0 && (
                    <div className="animate-slideUp">
                        <div className="glass p-6 rounded-2xl border border-purple-500/30">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                                <span>📩</span>
                                Pending Requests ({requests.length})
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {requests.map(request => (
                                    <div key={request._id} className="glass p-4 rounded-xl border border-purple-500/30 shadow-sm hover:border-purple-500/60 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                                {request.studentId.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{request.studentId.name}</p>
                                                <p className="text-xs text-purple-300">{request.studentId.email}</p>
                                            </div>
                                        </div>

                                        {request.message && (
                                            <p className="text-sm text-gray-300 mb-3 italic bg-gray-800/50 p-2 rounded border border-gray-700">"{request.message}"</p>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAcceptRequest(request._id)}
                                                className="flex-1 bg-green-500/20 text-green-300 border border-green-500/50 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition-colors"
                                            >
                                                ✓ Accept
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(request._id)}
                                                className="flex-1 bg-red-500/20 text-red-300 border border-red-500/50 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors"
                                            >
                                                ✗ Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Assigned Roadmaps */}
                <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <div className="glass p-6 rounded-2xl border border-purple-500/30">
                        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <span>🗺️</span> My Assigned Roadmaps ({roadmaps.length})
                        </h2>

                        {roadmaps.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No roadmaps created yet. Click "Create Roadmap" to create one.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {roadmaps.map(roadmap => (
                                    <RoadmapCard
                                        key={roadmap._id}
                                        roadmap={roadmap}
                                        userRole="mentor"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Students Grid */}
                <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    <div className="glass p-6 rounded-2xl border border-purple-500/30">
                        <h2 className="text-xl font-bold mb-4 text-white">Your Students ({students.length})</h2>

                        {students.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">👥</div>
                                <p className="text-purple-300 font-medium">No students assigned yet</p>
                                <p className="text-sm text-gray-400 mt-2">Accept requests to start mentoring</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {students.map(student => (
                                    <div key={student._id} className="glass p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-colors hover:shadow-neon">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                                    {student.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{student.name}</p>
                                                    <p className="text-xs text-purple-300">{student.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Gamification Stats */}
                                        {student.gamification && (
                                            <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                                <div className="text-center">
                                                    <p className="text-xl font-bold text-blue-400">{student.gamification.level}</p>
                                                    <p className="text-xs text-gray-400">Level</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xl font-bold text-purple-400">{student.gamification.xp}</p>
                                                    <p className="text-xs text-gray-400">XP</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xl font-bold text-orange-400">{student.gamification.streak}</p>
                                                    <p className="text-xs text-gray-400">Streak</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowBadgeModal(true);
                                                }}
                                                className="flex-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/50 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-500/30 transition-all"
                                            >
                                                🏅 Award Badge
                                            </button>
                                            <button
                                                onClick={() => navigate(`/chat/${student._id}`, { state: { otherUser: student } })}
                                                className="flex-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 border border-blue-500/50 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition-all"
                                            >
                                                💬 Chat
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreateRoadmapModal
                isOpen={showRoadmapModal}
                onClose={() => setShowRoadmapModal(false)}
                students={students}
                onSuccess={fetchData}
            />

            {/* Badge Award Modal */}
            {showBadgeModal && selectedStudent && (
                <BadgeAwardModal
                    studentId={selectedStudent._id}
                    studentName={selectedStudent.name}
                    onClose={() => setShowBadgeModal(false)}
                    onSuccess={() => {
                        fetchData();
                        setShowBadgeModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default MentorDashboardNew;
