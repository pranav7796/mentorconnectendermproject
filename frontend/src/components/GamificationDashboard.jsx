import React from 'react';

const GamificationDashboard = ({ gamification }) => {
    const { xp, level, streak, badges } = gamification || { xp: 0, level: 1, streak: 0, badges: [] };
    const xpForNextLevel = level * 100;
    const progress = ((xp % 100) / 100) * 100;

    return (
        <div style={styles.container}>
            <div style={styles.grid}>
                {/* Level */}
                <div style={styles.card}>
                    <div style={styles.icon}>🏆</div>
                    <div style={styles.label}>Level</div>
                    <div style={styles.value}>{level}</div>
                </div>

                {/* XP */}
                <div style={styles.card}>
                    <div style={styles.icon}>⭐</div>
                    <div style={styles.label}>XP</div>
                    <div style={styles.value}>{xp}</div>
                </div>

                {/* Streak */}
                <div style={styles.card}>
                    <div style={styles.icon}>🔥</div>
                    <div style={styles.label}>Streak</div>
                    <div style={styles.value}>{streak} days</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                    <span>Progress to Level {level + 1}</span>
                    <span>{xp % 100} / 100 XP</span>
                </div>
                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                </div>
            </div>

            {/* Badges */}
            {badges && badges.length > 0 && (
                <div style={styles.badgesSection}>
                    <h4 style={styles.badgesTitle}>Badges Earned</h4>
                    <div style={styles.badges}>
                        {badges.map((badge, idx) => (
                            <div key={idx} style={styles.badge}>
                                <span style={styles.badgeIcon}>{badge.icon}</span>
                                <span style={styles.badgeName}>{badge.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        marginBottom: '20px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '20px'
    },
    card: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    icon: {
        fontSize: '32px',
        marginBottom: '8px'
    },
    label: {
        fontSize: '12px',
        color: '#6b7280',
        textTransform: 'uppercase',
        marginBottom: '4px',
        fontWeight: '600'
    },
    value: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#111827'
    },
    progressSection: {
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    progressHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        marginBottom: '8px',
        color: '#374151',
        fontWeight: '600'
    },
    progressBar: {
        width: '100%',
        height: '12px',
        backgroundColor: '#e5e7eb',
        borderRadius: '6px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
        transition: 'width 0.3s ease'
    },
    badgesSection: {
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: '8px'
    },
    badgesTitle: {
        margin: '0 0 12px 0',
        fontSize: '16px',
        color: '#111827'
    },
    badges: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: '#fef3c7',
        borderRadius: '20px',
        border: '2px solid #fbbf24'
    },
    badgeIcon: {
        fontSize: '20px'
    },
    badgeName: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#92400e'
    }
};

export default GamificationDashboard;
