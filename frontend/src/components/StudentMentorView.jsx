import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentMentorView = () => {
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMentor();
    }, []);

    const fetchMentor = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/mentors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMentor(data.data[0] || null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (!mentor) {
        return (
            <div style={styles.empty}>
                <div style={styles.emptyIcon}>🔍</div>
                <h3>No Mentor Assigned Yet</h3>
                <p>Send a request to a mentor to get started with your journey!</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Your Mentor</h2>
            <div style={styles.card}>
                <div style={styles.mentorHeader}>
                    <h3>{mentor.name}</h3>
                    {mentor.availability && (
                        <span style={{
                            ...styles.availabilityBadge,
                            backgroundColor: mentor.availability === 'available' ? '#d1fae5' : '#fef3c7',
                            color: mentor.availability === 'available' ? '#065f46' : '#92400e'
                        }}>
                            {mentor.availability}
                        </span>
                    )}
                </div>

                <div style={styles.info}>
                    <div style={styles.infoItem}>
                        <strong>Domain:</strong> {mentor.domain}
                    </div>
                    <div style={styles.infoItem}>
                        <strong>Experience:</strong> {mentor.experience} years
                    </div>
                    {mentor.rating && mentor.rating > 0 && (
                        <div style={styles.infoItem}>
                            <strong>Rating:</strong> {'⭐'.repeat(Math.round(mentor.rating))} ({mentor.rating.toFixed(1)})
                        </div>
                    )}
                </div>

                <p style={styles.bio}>{mentor.bio}</p>

                <div style={styles.actions}>
                    <button style={styles.chatBtn}>💬 Chat</button>
                    <button style={styles.viewBtn}>📋 View Roadmap</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
    },
    header: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#111827'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280'
    },
    empty: {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        color: '#6b7280'
    },
    emptyIcon: {
        fontSize: '64px',
        marginBottom: '16px'
    },
    card: {
        padding: '24px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    mentorHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    availabilityBadge: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize'
    },
    info: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '16px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
    },
    infoItem: {
        fontSize: '14px',
        color: '#374151'
    },
    bio: {
        fontSize: '15px',
        lineHeight: '1.6',
        color: '#4b5563',
        marginBottom: '20px'
    },
    actions: {
        display: 'flex',
        gap: '12px'
    },
    chatBtn: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#3b82f6',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    viewBtn: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    }
};

export default StudentMentorView;
