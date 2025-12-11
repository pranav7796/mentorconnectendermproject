import React from 'react';

const LevelCard = ({ level, xp }) => {
    return (
        <div className="glass p-6 rounded-2xl border border-purple-500/30 shadow-neon">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-400 mb-1">Current Level</p>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {level}
                    </h2>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-magenta-500 rounded-full flex items-center justify-center text-3xl shadow-neon animate-pulse-glow">
                    🏆
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Total XP</span>
                    <span className="font-semibold text-purple-400">{xp}</span>
                </div>
            </div>
        </div>
    );
};

export default LevelCard;
