import React from 'react';
import { Sparkles } from 'lucide-react';
import { MOOD_KEYWORDS } from '../../constants/moodKeywords';
import { MOOD_DATA } from '../../constants/tagColors';
import MoodButton from './MoodButton';

interface MoodSuggestionsProps {
    onMoodClick: (mood: string) => void;
}

const MoodSuggestions: React.FC<MoodSuggestionsProps> = ({ onMoodClick }) => {
    const moods = Object.keys(MOOD_KEYWORDS) as Array<keyof typeof MOOD_KEYWORDS>;

    return (
        <div className="mb-10">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-amber-400 to-orange-500">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900">今天想聽什麼心情？</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {moods.map((mood, index) => (
                    <MoodButton
                        key={index}
                        mood={mood}
                        data={MOOD_DATA[mood]}
                        onClick={() => onMoodClick(mood)}
                    />
                ))}
            </div>
        </div>
    );
};

export default MoodSuggestions;
