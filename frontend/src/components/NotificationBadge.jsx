import React from 'react';

const NotificationBadge = ({ count = 0 }) => {
    if (count === 0) return null;

    return (
        <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '700',
            border: '2px solid white'
        }}>
            {count > 9 ? '9+' : count}
        </span>
    );
};

export default NotificationBadge;
