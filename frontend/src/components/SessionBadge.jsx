import React from 'react';

const SessionBadge = ({ count = 0 }) => (
    <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        backgroundColor: '#eff6ff',
        borderRadius: '6px',
        fontSize: '13px',
        color: '#1e40af'
    }}>
        <span>📚</span>
        <span><strong>{count}</strong> sessions completed</span>
    </div>
);

export default SessionBadge;
