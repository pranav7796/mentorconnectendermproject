import React from 'react';
import { isOnline, timeAgo } from '../utils/timeAgo';

const OnlineStatus = ({ lastActive }) => {
    const online = isOnline(lastActive);

    return (
        <div style={styles.container}>
            <span style={{
                ...styles.dot,
                backgroundColor: online ? '#10b981' : '#6b7280'
            }} />
            <span style={styles.text}>
                {online ? 'Online' : `Active ${timeAgo(lastActive)}`}
            </span>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    dot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%'
    },
    text: {
        fontSize: '12px',
        color: '#6b7280'
    }
};

export default OnlineStatus;
