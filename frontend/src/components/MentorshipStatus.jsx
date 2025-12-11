import React from 'react';

const MentorshipStatus = ({ status }) => {
    const config = {
        none: { color: '#6b7280', text: 'No Mentorship', icon: '⏸️', bg: '#f3f4f6' },
        pending: { color: '#f59e0b', text: 'Request Pending', icon: '⏳', bg: '#fef3c7' },
        active: { color: '#10b981', text: 'Active Mentorship', icon: '✅', bg: '#d1fae5' },
        completed: { color: '#3b82f6', text: 'Completed', icon: '🎓', bg: '#dbeafe' }
    };

    const { color, text, icon, bg } = config[status] || config.none;

    return (
        <div style={{
            ...styles.badge,
            backgroundColor: bg,
            color
        }}>
            <span style={styles.icon}>{icon}</span>
            <span style={styles.text}>{text}</span>
        </div>
    );
};

const styles = {
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '20px',
        fontWeight: '600',
        fontSize: '14px'
    },
    icon: {
        fontSize: '16px'
    },
    text: {
        letterSpacing: '0.3px'
    }
};

export default MentorshipStatus;
