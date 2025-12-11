// Example: How to integrate new components into StudentDashboard.jsx

import { useState, useEffect } from 'react';
import { mentorAPI, roadmapAPI } from '../services/api';
import ProfileProgress from '../components/ProfileProgress';
import StatsCard from '../components/StatsCard';
import MentorFilters from '../components/MentorFilters';
import RatingStars from '../components/RatingStars';
import OnlineStatus from '../components/OnlineStatus';
import FavoriteButton from '../components/FavoriteButton';
import AvailabilityBadge from '../components/AvailabilityBadge';
import SessionBadge from '../components/SessionBadge';
import MentorRequestWidget from '../components/MentorRequestWidget';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import '../animations.css';
import '../App.css';

const EnhancedStudentDashboard = ({ user }) => {
    const [mentors, setMentors] = useState([]);
    const [filteredMentors, setFilteredMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mentors');

    useEffect(() => {
        fetchMentors();
    }, []);

    const fetchMentors = async () => {
        try {
            const res = await mentorAPI.getAllMentors();
            setMentors(res.data.data);
            setFilteredMentors(res.data.data);
        } catch (error) {
            console.error('Error fetching mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = async (filters) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.domain) params.append('domain', filters.domain);
            if (filters.minRating) params.append('minRating', filters.minRating);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);

            const res = await mentorAPI.getAllMentors(`?${params.toString()}`);
            setFilteredMentors(res.data.data);
        } catch (error) {
            console.error('Error filtering mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard page-transition">
            <div className="dashboard-header">
                <h1>Student Dashboard</h1>
                <p>Welcome back, {user.name}!</p>
            </div>

            {/* Profile Progress */}
            <ProfileProgress user={user} />

            {/* Platform Stats */}
            <StatsCard />

            {/* Mentor Requests Widget */}
            <MentorRequestWidget userRole="student" />

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={activeTab === 'mentors' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('mentors')}
                >
                    Find Mentors
                </button>
                <button
                    className={activeTab === 'favorites' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('favorites')}
                >
                    My Favorites
                </button>
            </div>

            {/* Mentor Filters */}
            {activeTab === 'mentors' && (
                <MentorFilters onFilterChange={handleFilterChange} />
            )}

            {/* Mentors Grid */}
            {loading ? (
                <div className="mentors-grid">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : filteredMentors.length === 0 ? (
                <EmptyState
                    icon="🔍"
                    title="No mentors found"
                    description="Try adjusting your filters or search terms"
                    actionText="Clear Filters"
                    onAction={() => handleFilterChange({})}
                />
            ) : (
                <div className="mentors-grid">
                    {filteredMentors.map((mentor) => (
                        <div key={mentor._id} className="mentor-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h3>{mentor.name}</h3>
                                    <OnlineStatus lastActive={mentor.lastActive} />
                                </div>
                                <AvailabilityBadge availability={mentor.availability} />
                            </div>

                            <p className="mentor-domain"><strong>Domain:</strong> {mentor.domain}</p>
                            <p className="mentor-experience"><strong>Experience:</strong> {mentor.experience} years</p>

                            {/* Rating Stars */}
                            <RatingStars
                                rating={mentor.rating}
                                totalRatings={mentor.totalRatings}
                            />

                            {/* Session Badge */}
                            <div style={{ marginTop: '12px' }}>
                                <SessionBadge count={mentor.sessionsCompleted} />
                            </div>

                            <p className="mentor-bio">{mentor.bio}</p>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                <FavoriteButton
                                    mentorId={mentor._id}
                                    initialFavorited={user.favoriteMentors?.includes(mentor._id)}
                                />
                                <button className="button-primary">
                                    Send Request
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnhancedStudentDashboard;
