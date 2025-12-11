import React, { useState } from 'react';
import axios from 'axios';

const FavoriteButton = ({ mentorId, initialFavorited = false }) => {
    const [favorited, setFavorited] = useState(initialFavorited);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/mentors/${mentorId}/favorite`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorited(!favorited);
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            style={{
                ...styles.button,
                color: favorited ? '#ef4444' : '#6b7280',
                opacity: loading ? 0.6 : 1
            }}
        >
            {favorited ? '❤️' : '🤍'} {favorited ? 'Favorited' : 'Favorite'}
        </button>
    );
};

const styles = {
    button: {
        padding: '8px 16px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s',
        fontWeight: '500'
    }
};

export default FavoriteButton;
