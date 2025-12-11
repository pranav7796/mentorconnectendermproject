import React from 'react';

const XPBar = ({ currentXP, level }) => {
    const xpInCurrentLevel = currentXP % 100;
    const progress = (xpInCurrentLevel / 100) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                    Level {level}
                </span>
                <span className="text-sm text-gray-500">
                    {xpInCurrentLevel} / 100 XP
                </span>
            </div>

            <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-purple-900/50">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500 via-magenta-500 to-cyan-400 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default XPBar;
