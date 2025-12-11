import React from 'react';

const EmptyState = ({ icon, title, description, actionText, onAction }) => (
    <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#6b7280'
    }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
            {title}
        </h3>
        <p style={{ fontSize: '14px', marginBottom: '20px' }}>{description}</p>
        {actionText && (
            <button onClick={onAction} style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
            }}>
                {actionText}
            </button>
        )}
    </div>
);

export default EmptyState;
