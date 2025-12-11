import React, { useEffect, useState } from 'react';
import { statsAPI } from '../services/api';

const StatsCard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await statsAPI.getOverview();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={styles.loading}>Loading stats...</div>;
    if (!stats) return null;

    return (
        <div style={styles.grid}>
            <div style={styles.card}>
                <div style={styles.number}>{stats.totalMentors}</div>
                <div style={styles.label}>Total Mentors</div>
            </div>
            <div style={styles.card}>
                <div style={styles.number}>{stats.totalStudents}</div>
                <div style={styles.label}>Total Students</div>
            </div>
            <div style={styles.card}>
                <div style={styles.number}>{stats.activeMentors}</div>
                <div style={styles.label}>Active This Week</div>
            </div>
        </div>
    );
};

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
    },
    card: {
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    number: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#3b82f6',
        marginBottom: '8px'
    },
    label: {
        fontSize: '14px',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
        color: '#6b7280'
    }
};

export default StatsCard;
