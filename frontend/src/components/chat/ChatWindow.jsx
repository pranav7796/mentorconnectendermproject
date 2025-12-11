import React, { useState } from 'react';

const ChatWindow = ({ currentUser, otherUser }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! Thanks for accepting my request!",
            senderId: otherUser._id,
            timestamp: new Date(Date.now() - 3600000)
        },
        {
            id: 2,
            text: "Happy to help! What are you working on?",
            senderId: currentUser._id,
            timestamp: new Date(Date.now() - 3000000)
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!newMessage.trim()) return;

        setMessages([...messages, {
            id: Date.now(),
            text: newMessage,
            senderId: currentUser._id,
            timestamp: new Date()
        }]);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="glass p-4 flex items-center gap-3 border-b border-gray-200 bg-white/90">
                <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {otherUser.name[0].toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                </div>

                <div>
                    <p className="font-semibold text-gray-900">{otherUser.name}</p>
                    <p className="text-xs text-gray-500">
                        {isTyping ? <span className="text-blue-600">typing...</span> : 'Online'}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'} animate-slideUp`}
                    >
                        <div className={`max-w-xs lg:max-w-md ${msg.senderId === currentUser._id
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-900'
                            } rounded-2xl px-4 py-2 shadow-sm`}>
                            <p className="text-sm">{msg.text}</p>
                            <div className="flex items-center gap-1 justify-end mt-1">
                                <span className={`text-xs ${msg.senderId === currentUser._id ? 'text-white/70' : 'text-gray-400'
                                    }`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {msg.senderId === currentUser._id && (
                                    <span className="text-xs text-white/70">✓✓</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="glass p-4 border-t border-gray-200 bg-white/90">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
