import React from 'react';

interface MoodButtonData {
    emoji: string;
    gradient: string;
}

interface MoodButtonProps {
    mood: string;
    data: MoodButtonData;
    onClick: () => void;
}

const MoodButton: React.FC<MoodButtonProps> = ({ mood, data, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`group relative cursor-pointer overflow-hidden bg-gradient-to-br ${data.gradient} rounded-2xl p-4 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95`}
        >
            <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
                <div className="mb-2 transform text-2xl transition-transform duration-300 group-hover:scale-110">
                    {data.emoji}
                </div>
                <div className="text-sm leading-tight font-medium">{mood}</div>
            </div>
        </button>
    );
};

export default MoodButton;
