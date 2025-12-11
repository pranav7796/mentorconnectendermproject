import React, { useState, useEffect } from 'react';
import axios from 'axios';
import XPBar from '../components/gamification/XPBar';
import LevelCard from '../components/gamification/LevelCard';
import StreakWidget from '../components/gamification/StreakWidget';
import BadgeDisplay from '../components/gamification/BadgeDisplay';
import RoadmapCard from '../components/RoadmapCard';
import { useNavigate } from 'react-router-dom';

const StudentDashboardNew = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [mentor, setMentor] = useState(null);
    const [availableMentors, setAvailableMentors] = useState([]);
    const [roadmaps, setRoadmaps] = useState([]);
    const [gamification, setGamification] = useState({
        xp: 0,
        level: 1,
        streak: 0,
        badges: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // 1. Get fresh user data
            const userRes = await axios.get('/api/auth/me', { headers });
            const userData = userRes.data.data;
            setUser(userData);
            setGamification(userData?.gamification || gamification);

            // 2. Get mentors (behavior depends on assignment status)
            const mentorRes = await axios.get('/api/mentors', { headers });

            if (userData.assignedMentor) {
                // If assigned, the API returns the single mentor
                setMentor(mentorRes.data.data[0]);
            } else {
                // If not assigned, the API returns list of all mentors
                setAvailableMentors(mentorRes.data.data);
            }

            // 3. Get roadmaps
            const roadmapsRes = await axios.get('/api/roadmap', { headers });
            setRoadmaps(roadmapsRes.data.data || []);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestMentor = async (mentorId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/requests/send',
                { mentorId, message: "I'd like to connect!" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Request sent successfully! 📨');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send request');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="text-2xl text-purple-300">Loading...</div>
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
                            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}! 👋</h1>
                            <p className="text-sm text-purple-300">Ready to learn today?</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-magenta-500 px-4 py-2 rounded-full text-white shadow-neon">
                                <span className="font-bold">{gamification.xp}</span>
                                <span className="text-sm">XP</span>
                            </div>
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

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats & Progress */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
                            <LevelCard level={gamification.level} xp={gamification.xp} />
                            <StreakWidget streak={gamification.streak} />
                        </div>

                        {/* XP Progress */}
                        <div className="glass p-6 rounded-2xl animate-slideUp border border-purple-500/30" style={{ animationDelay: '0.1s' }}>
                            <h3 className="text-lg font-semibold mb-4 text-purple-300">Your Progress</h3>
                            <XPBar currentXP={gamification.xp} level={gamification.level} />
                        </div>

                        {/* Learning Roadmap - Always show this section */}
                        <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span>🗺️</span> My Learning Roadmap
                            </h3>

                            {!user?.assignedMentor ? (
                                <div className="glass p-8 rounded-2xl border border-purple-500/30 text-center">
                                    <div className="text-5xl mb-3">🔍</div>
                                    <p className="text-gray-300 font-medium mb-2">No Mentor Assigned</p>
                                    <p className="text-sm text-gray-400">Connect with a mentor to get a personalized learning roadmap!</p>
                                </div>
                            ) : roadmaps.length === 0 ? (
                                <div className="glass p-8 rounded-2xl border border-purple-500/30 text-center">
                                    <div className="text-5xl mb-3">📋</div>
                                    <p className="text-gray-300 font-medium mb-2">No Roadmap Yet</p>
                                    <p className="text-sm text-gray-400">Your mentor will create a learning roadmap for you soon!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {roadmaps.map(roadmap => (
                                        <RoadmapCard
                                            key={roadmap._id}
                                            roadmap={roadmap}
                                            userRole="student"
                                            onUpdate={fetchData}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Badges */}
                        <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
                            <BadgeDisplay badges={gamification.badges} />
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-4 animate-slideUp" style={{ animationDelay: '0.4s' }}>
                            <button
                                onClick={() => mentor && navigate(`/chat/${mentor._id}`, { state: { otherUser: mentor } })}
                                className="glass p-6 rounded-2xl hover:scale-105 transition-transform group border border-purple-500/30 hover:border-purple-500/60"
                            >
                                <div className="text-center">
                                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">💬</div>
                                    <p className="text-sm font-semibold text-purple-300">Open Chat</p>
                                </div>
                            </button>

                            <button className="glass p-6 rounded-2xl hover:scale-105 transition-transform group border border-purple-500/30 hover:border-purple-500/60">
                                <div className="text-center">
                                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">💻</div>
                                    <p className="text-sm font-semibold text-purple-300">Code Editor</p>
                                </div>
                            </button>

                            <button className="glass p-6 rounded-2xl hover:scale-105 transition-transform group border border-purple-500/30 hover:border-purple-500/60">
                                <div className="text-center">
                                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📋</div>
                                    <p className="text-sm font-semibold text-purple-300">View Tasks</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Mentor Card */}
                    <div className="space-y-6">
                        {user?.assignedMentor ? (
                            mentor ? (
                                <div className="glass p-6 rounded-2xl border border-purple-500/30 shadow-neon sticky top-24 animate-slideUp" style={{ animationDelay: '0.5s' }}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl text-white font-bold shadow-neon">
                                            {mentor.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{mentor.name}</h3>
                                            <p className="text-sm text-purple-300">{mentor.domain}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <div className={`w-3 h-3 rounded-full ${mentor.availability === 'available' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                                        <span className="text-sm capitalize text-purple-300">{mentor.availability || 'available'}</span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-400">Experience:</span>
                                            <span className="font-semibold text-white">{mentor.experience} years</span>
                                        </div>

                                        {mentor.rating > 0 && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-400">Rating:</span>
                                                <span className="text-yellow-500">{'⭐'.repeat(Math.round(mentor.rating))}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/chat/${mentor._id}`, { state: { otherUser: mentor } })}
                                        className="w-full mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-neon transition-all hover:scale-105"
                                    >
                                        Message Mentor
                                    </button>
                                </div>
                            ) : (
                                <div className="glass p-6 rounded-2xl text-center animate-slideUp border border-purple-500/30">
                                    Loading mentor profile...
                                </div>
                            )
                        ) : (
                            <div className="animate-slideUp" style={{ animationDelay: '0.5s' }}>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span>🔍</span> Find a Mentor
                                </h3>
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {availableMentors.map((m) => (
                                        <div key={m._id} className="glass p-4 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                                        {m.name[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-sm">{m.name}</h4>
                                                        <p className="text-xs text-purple-300">{m.domain}</p>
                                                    </div>
                                                </div>
                                                {m.rating > 0 && (
                                                    <div className="text-xs text-yellow-500 font-bold">
                                                        ⭐ {m.rating}
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{m.bio || 'No bio available'}</p>

                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                <span>{m.experience} yrs exp</span>
                                                <span className={m.availability === 'available' ? 'text-green-400' : 'text-yellow-400'}>
                                                    {m.availability || 'available'}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleRequestMentor(m._id)}
                                                className="w-full py-2 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/50 text-purple-300 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                                            >
                                                Connect
                                            </button>
                                        </div>
                                    ))}
                                    {availableMentors.length === 0 && (
                                        <div className="text-center p-4 text-gray-500 text-sm">
                                            No mentors found. Check back later!
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardNew;
