import React from 'react';

const ProfileProgress = ({ user }) => {
    const completion = user?.profileCompletion || 0;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <span style={styles.label}>Profile Completion</span>
                <span style={styles.percentage}>{completion}%</span>
            </div>
            <div style={styles.progressBar}>
                <div
                    style={{
                        ...styles.progressFill,
                        width: `${completion}%`,
                        backgroundColor: completion === 100 ? '#10b981' : '#3b82f6'
                    }}
                />
            </div>
            {completion < 100 && (
                <p style={styles.hint}>Complete your profile to unlock all features!</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151'
    },
    percentage: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#3b82f6'
    },
    progressBar: {
        width: '100%',
        height: '8px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        transition: 'width 0.3s ease, background-color 0.3s ease'
    },
    hint: {
        fontSize: '12px',
        color: '#6b7280',
        marginTop: '8px',
        marginBottom: 0
    }
};

export default ProfileProgress;
