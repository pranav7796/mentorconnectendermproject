import React from 'react';

const StreakWidget = ({ streak }) => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-magenta-500 to-orange-500 p-6 rounded-2xl shadow-neon">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl animate-bounce">🔥</span>
                    <div>
                        <p className="text-white/90 text-sm font-medium">Daily Streak</p>
                        <h3 className="text-4xl font-bold text-white drop-shadow-lg">{streak}</h3>
                    </div>
                </div>
                <p className="text-white/90 text-xs mt-2">
                    {streak > 0 ? `You're on fire! ${streak} days in a row!` : 'Start your streak today!'}
                </p>
            </div>
        </div>
    );
};

export default StreakWidget;
