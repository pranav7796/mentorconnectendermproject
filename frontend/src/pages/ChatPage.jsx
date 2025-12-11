import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import config from '../config';

const ChatPage = () => {
    const { userId } = useParams(); // The other person's ID
    const location = useLocation();
    const navigate = useNavigate();
    const scrollRef = useRef();

    const [user, setUser] = useState(null); // Me
    const [otherUser, setOtherUser] = useState(location.state?.otherUser || null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize Socket and User
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (!token || !storedUser) {
            navigate('/login');
            return;
        }

        setUser(storedUser);

        // Connect Socket - Use environment variable for production
        const socketUrl = config.socketUrl;
        const newSocket = io(socketUrl, {
            transports: ['websocket'],
            query: { userId: storedUser._id }
        });

        setSocket(newSocket);

        // Join my own room to receive messages
        newSocket.emit('join_room', storedUser._id);

        return () => newSocket.close();
    }, [navigate]);

    // Fetch History & Details if needed
    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                // 1. If otherUser not passed via state, try to find them
                if (!otherUser) {
                    // Logic to find user from available lists (Student/Mentor)
                    // For now, simpler to rely on lists. 
                    // As a student, get mentors. As mentor, get students.
                    const res = await axios.get('/api/mentors', { headers });
                    const list = res.data.data; // Array of users
                    const found = list.find(u => u._id === userId);
                    if (found) setOtherUser(found);
                }

                // 2. Fetch Messages
                const msgRes = await axios.get(`/api/chat/${userId}`, { headers });
                setMessages(msgRes.data);

            } catch (error) {
                console.error("Error fetching chat:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchChatData();
    }, [userId, otherUser]);

    // Listen for messages
    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', (message) => {
            // Only add if it belongs to this conversation
            if (message.sender === userId || message.sender === user?._id) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => socket.off('receive_message');
    }, [socket, userId, user]);

    // Scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim() || !socket) return;

        const messageData = {
            senderId: user._id,
            receiverId: userId,
            content: newMessage
        };

        // Emit
        socket.emit('send_message', messageData);

        // Optimistic UI update (optional, but backend emits back usually? No, I implemented backend to NOT emit back to sender in the room logic. 
        // Wait, I only did io.to(receiver). So I MUST manually add it here or use request/response pattern.)
        // I'll manually add it to state for instant feedback.

        setMessages((prev) => [...prev, {
            _id: Date.now(), // Temp ID
            sender: user._id,
            receiver: userId,
            content: newMessage,
            createdAt: new Date().toISOString()
        }]);

        setNewMessage('');
    };

    if (loading) return <div className="text-white p-10">Loading chat...</div>;

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            {/* Header */}
            <div className="glass-dark backdrop-blur-md border-b border-purple-500/30 p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mr-2">
                            ← Back
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-neon">
                            {otherUser?.name?.[0].toUpperCase() || '?'}
                        </div>
                        <div>
                            <h2 className="font-bold text-white">{otherUser?.name || 'User'}</h2>
                            <p className="text-xs text-purple-300">
                                {otherUser?.role === 'mentor' ? 'Mentor' : 'Student'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((msg, idx) => {
                        const isMe = msg.sender === user?._id;
                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${isMe
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-none'
                                    : 'glass border border-purple-500/30 text-gray-100 rounded-bl-none'
                                    }`}>
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="glass-dark border-t border-purple-500/30 p-4">
                <div className="max-w-4xl mx-auto flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-500"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-neon transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
