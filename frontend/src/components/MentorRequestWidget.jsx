import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MentorRequestWidget = ({ userRole }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, [userRole]);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const endpoint = userRole === 'mentor' ? '/api/requests/pending' : '/api/requests/my-requests';
            const { data } = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespond = async (requestId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/requests/${requestId}/respond`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchRequests(); // Refresh
        } catch (error) {
            console.error('Failed to respond:', error);
        }
    };

    if (loading) return <div style={styles.loading}>Loading requests...</div>;

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>
                {userRole === 'mentor' ? 'Pending Requests' : 'My Requests'}
            </h3>

            {requests.length === 0 ? (
                <p style={styles.empty}>No requests yet</p>
            ) : (
                requests.map(request => (
                    <div key={request._id} style={styles.card}>
                        <div style={styles.header}>
                            <strong>
                                {userRole === 'mentor'
                                    ? request.studentId?.name
                                    : request.mentorId?.name}
                            </strong>
                            <span style={{
                                ...styles.badge,
                                backgroundColor:
                                    request.status === 'accepted' ? '#d1fae5' :
                                        request.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                                color:
                                    request.status === 'accepted' ? '#065f46' :
                                        request.status === 'rejected' ? '#991b1b' : '#92400e'
                            }}>
                                {request.status}
                            </span>
                        </div>

                        {request.message && (
                            <p style={styles.message}>"{request.message}"</p>
                        )}

                        {userRole === 'mentor' && request.status === 'pending' && (
                            <div style={styles.actions}>
                                <button
                                    onClick={() => handleRespond(request._id, 'accepted')}
                                    style={{ ...styles.button, backgroundColor: '#10b981' }}
                                >
                                    ✓ Accept
                                </button>
                                <button
                                    onClick={() => handleRespond(request._id, 'rejected')}
                                    style={{ ...styles.button, backgroundColor: '#ef4444' }}
                                >
                                    ✗ Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    },
    title: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#111827'
    },
    empty: {
        color: '#6b7280',
        textAlign: 'center',
        padding: '20px'
    },
    card: {
        padding: '16px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        marginBottom: '12px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    badge: {
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize'
    },
    message: {
        fontSize: '14px',
        color: '#4b5563',
        fontStyle: 'italic',
        marginBottom: '12px'
    },
    actions: {
        display: 'flex',
        gap: '8px'
    },
    button: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        flex: 1
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
        color: '#6b7280'
    }
};

export default MentorRequestWidget;
