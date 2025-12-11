import React from 'react';

const SkeletonCard = () => (
    <div style={styles.skeleton}>
        <div style={styles.skeletonAvatar} className="skeleton" />
        <div style={styles.skeletonText} className="skeleton" />
        <div style={{ ...styles.skeletonText, width: '60%' }} className="skeleton" />
    </div>
);

const styles = {
    skeleton: {
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '12px'
    },
    skeletonAvatar: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#e5e7eb',
        marginBottom: '12px'
    },
    skeletonText: {
        height: '12px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        marginTop: '8px'
    }
};

export default SkeletonCard;
