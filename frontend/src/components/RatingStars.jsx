import React, { useState } from 'react';

const RatingStars = ({ rating = 0, totalRatings = 0, onRate, editable = false }) => {
    const [hover, setHover] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);

    const handleClick = (value) => {
        if (editable) {
            setSelectedRating(value);
            onRate && onRate(value);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        style={{
                            ...styles.star,
                            color: star <= (hover || selectedRating || rating) ? '#fbbf24' : '#d1d5db',
                            cursor: editable ? 'pointer' : 'default'
                        }}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => editable && setHover(star)}
                        onMouseLeave={() => editable && setHover(0)}
                    >
                        ★
                    </span>
                ))}
            </div>
            {!editable && totalRatings > 0 && (
                <span style={styles.info}>
                    {rating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    stars: {
        display: 'flex',
        gap: '2px'
    },
    star: {
        fontSize: '20px',
        transition: 'color 0.2s'
    },
    info: {
        fontSize: '14px',
        color: '#6b7280'
    }
};

export default RatingStars;
