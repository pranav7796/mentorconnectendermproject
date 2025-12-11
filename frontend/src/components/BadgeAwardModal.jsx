import React, { useState } from 'react';
import { gamificationAPI } from '../services/api';

const BadgeAwardModal = ({ studentId, studentName, onClose, onSuccess }) => {
    const [badgeName, setBadgeName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('🏅');
    const [loading, setLoading] = useState(false);

    const badges = [
        { icon: '🏅', name: 'First Task Complete' },
        { icon: '🎯', name: 'Goal Achiever' },
        { icon: '💪', name: 'Hard Worker' },
        { icon: '🚀', name: 'Fast Learner' },
        { icon: '⭐', name: 'Star Student' },
        { icon: '🔥', name: 'On Fire' },
        { icon: '🎓', name: 'Knowledge Seeker' },
        { icon: '💡', name: 'Creative Thinker' }
    ];

    const handleAward = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await gamificationAPI.awardBadge({
                studentId,
                badgeType: badgeName,
                reason: selectedIcon
            });
            alert(`Badge "${badgeName}" awarded to ${studentName}!`);
            onSuccess && onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to award badge');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 style={styles.title}>Award Badge to {studentName}</h3>

                <div style={styles.badgeGrid}>
                    {badges.map((badge) => (
                        <div
                            key={badge.icon}
                            style={{
                                ...styles.badgeOption,
                                border: selectedIcon === badge.icon ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                                transform: selectedIcon === badge.icon ? 'scale(1.05)' : 'scale(1)'
                            }}
                            onClick={() => {
                                setSelectedIcon(badge.icon);
                                setBadgeName(badge.name);
                            }}
                        >
                            <div style={styles.badgeIconLarge}>{badge.icon}</div>
                            <div style={styles.badgeLabel}>{badge.name}</div>
                        </div>
                    ))}
                </div>

                <div style={styles.actions}>
                    <button onClick={onClose} style={styles.cancelBtn} disabled={loading}>
                        Cancel
                    </button>
                    <button
                        onClick={handleAward}
                        style={{
                            ...styles.awardBtn,
                            opacity: loading ? 0.6 : 1
                        }}
                        disabled={loading || !badgeName}
                    >
                        {loading ? 'Awarding...' : 'Award Badge'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
    },
    title: {
        margin: '0 0 20px 0',
        fontSize: '20px',
        color: '#111827'
    },
    badgeGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        margin: '20px 0'
    },
    badgeOption: {
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: '#f9fafb'
    },
    badgeIconLarge: {
        fontSize: '36px',
        marginBottom: '8px'
    },
    badgeLabel: {
        fontSize: '11px',
        color: '#374151',
        fontWeight: '500'
    },
    actions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        marginTop: '20px'
    },
    cancelBtn: {
        padding: '10px 20px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
    },
    awardBtn: {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#3b82f6',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
    }
};

export default BadgeAwardModal;
