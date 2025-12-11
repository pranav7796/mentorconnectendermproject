import React from 'react';

const AvailabilityBadge = ({ availability = 'available' }) => {
    const config = {
        available: { color: '#10b981', text: 'Available', bg: '#d1fae5' },
        busy: { color: '#f59e0b', text: 'Busy', bg: '#fef3c7' },
        unavailable: { color: '#ef4444', text: 'Unavailable', bg: '#fee2e2' }
    };

    const { color, text, bg } = config[availability] || config.available;

    return (
        <span style={{
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            color,
            backgroundColor: bg
        }}>
            {text}
        </span>
    );
};

export default AvailabilityBadge;
