import React, { useState } from 'react';

const MentorFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        search: '',
        domain: '',
        minRating: '',
        sortBy: 'active'
    });

    const handleChange = (e) => {
        const newFilters = { ...filters, [e.target.name]: e.target.value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div style={styles.container}>
            <input
                type="text"
                name="search"
                placeholder="Search mentors..."
                value={filters.search}
                onChange={handleChange}
                style={styles.input}
            />

            <select name="domain" value={filters.domain} onChange={handleChange} style={styles.select}>
                <option value="">All Domains</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="DevOps">DevOps</option>
                <option value="Machine Learning">Machine Learning</option>
            </select>

            <select name="minRating" value={filters.minRating} onChange={handleChange} style={styles.select}>
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
            </select>

            <select name="sortBy" value={filters.sortBy} onChange={handleChange} style={styles.select}>
                <option value="active">Most Active</option>
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="recent">Recently Joined</option>
            </select>
        </div>
    );
};

const styles = {
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
    },
    input: {
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px',
        outline: 'none'
    },
    select: {
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px',
        backgroundColor: 'white',
        outline: 'none'
    }
};

export default MentorFilters;
