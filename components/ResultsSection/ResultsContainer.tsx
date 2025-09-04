import React from 'react';
import { Episode } from '../../types/podcast';
import { LoadingSpinner, ErrorState, EmptyState, NoResults } from '../StateComponents';
import PodcastGrid from './PodcastGrid';
import NotificationBanner from '../UI/NotificationBanner';

interface ResultsContainerProps {
    episodes: Episode[];
    isLoading: boolean;
    error: string | null;
    hasSearched: boolean;
    totalResults: number;
    expansionNotice: string | null;
    suggestions: string[];
    recommendedKeywords: string[];
    isLoadingMore: boolean;
    hasMore: boolean;
    loaderRef: React.RefObject<HTMLDivElement>;
    searchTerm: string;
    onSuggestionClick: (suggestion: string) => void;
    onRetry: () => void;
}

const ResultsContainer: React.FC<ResultsContainerProps> = ({
    episodes,
    isLoading,
    error,
    hasSearched,
    totalResults,
    expansionNotice,
    suggestions,
    recommendedKeywords,
    isLoadingMore,
    hasMore,
    loaderRef,
    searchTerm,
    onSuggestionClick,
    onRetry,
}) => {
    // 載入中
    if (isLoading) {
        return <LoadingSpinner />;
    }

    // 錯誤狀態
    if (error) {
        return <ErrorState message={error} onRetry={onRetry} />;
    }

    // 有結果
    if (episodes.length > 0) {
        return (
            <>
                {hasSearched && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="mb-2 text-2xl font-bold text-amber-900">
                                    為你找到
                                    <span className="mx-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-bold text-white">
                                        {totalResults}
                                    </span>
                                    個結果
                                </h2>
                                {searchTerm && (
                                    <p className="text-amber-700">
                                        關於「
                                        <span className="font-semibold text-amber-900">
                                            {searchTerm}
                                        </span>
                                        」
                                    </p>
                                )}
                            </div>
                        </div>

                        {expansionNotice && (
                            <NotificationBanner
                                message={expansionNotice}
                                type="info"
                                className="mt-4"
                            />
                        )}
                    </div>
                )}

                <PodcastGrid
                    episodes={episodes}
                    isLoadingMore={isLoadingMore}
                    hasMore={hasMore}
                    loaderRef={loaderRef}
                />
            </>
        );
    }

    // 無結果但有搜索
    if (hasSearched && searchTerm) {
        return (
            <NoResults
                searchTerm={searchTerm}
                suggestions={suggestions}
                recommendedKeywords={recommendedKeywords}
                onSuggestionClick={onSuggestionClick}
            />
        );
    }

    // 初始狀態
    return <EmptyState />;
};

export default ResultsContainer;
