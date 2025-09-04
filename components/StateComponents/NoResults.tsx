import React from 'react';
import { Search } from 'lucide-react';

interface NoResultsProps {
    searchTerm: string;
    suggestions: string[];
    recommendedKeywords: string[];
    onSuggestionClick: (suggestion: string) => void;
}

const NoResults: React.FC<NoResultsProps> = ({
    suggestions,
    recommendedKeywords,
    onSuggestionClick,
}) => (
    <div className="py-16 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-amber-300">
            <Search className="h-12 w-12 text-amber-500" />
        </div>
        <h3 className="mb-4 text-2xl font-bold text-amber-900">找不到相關的 Podcast</h3>
        <p className="mx-auto mb-8 max-w-md text-lg text-amber-700">
            試試這些相關的主題，或許會有意想不到的好發現！
        </p>

        {/* 建議按鈕 */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
            {[...new Set([...suggestions, ...recommendedKeywords])]
                .slice(0, 6)
                .map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        className="rounded-full bg-amber-100 px-4 py-2 text-amber-800 transition-all hover:bg-amber-200 hover:shadow-md"
                    >
                        {suggestion}
                    </button>
                ))}
        </div>
    </div>
);

export default NoResults;
