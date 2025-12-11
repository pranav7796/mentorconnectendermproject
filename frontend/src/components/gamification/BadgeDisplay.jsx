import React from 'react';

const BadgeDisplay = ({ badges = [] }) => {
    if (badges.length === 0) {
        return (
            <div className="glass p-6 rounded-2xl text-center border border-purple-500/30">
                <p className="text-gray-400 text-sm">No badges yet. Keep learning!</p>
            </div>
        );
    }

    return (
        <div className="glass p-6 rounded-2xl border border-purple-500/30">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">Your Badges</h3>
            <div className="grid grid-cols-3 gap-3">
                {badges.map((badge, idx) => (
                    <div
                        key={idx}
                        className="group relative bg-gradient-to-br from-purple-600 to-magenta-600 p-4 rounded-xl shadow-neon hover:scale-110 transition-transform duration-300 cursor-pointer"
                    >
                        <div className="text-center">
                            <div className="text-3xl mb-1">{badge.icon}</div>
                            <p className="text-xs font-semibold text-white">{badge.name}</p>
                        </div>

                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-purple-500/50">
                            Earned {new Date(badge.awardedAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BadgeDisplay;
