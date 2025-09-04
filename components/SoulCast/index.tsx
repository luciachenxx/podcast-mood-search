'use client';
import React from 'react';
import { usePodcastSearch } from '@/hooks/usePodcastSearch';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import AppHeader from '@/components/Header/AppHeader';
import SearchBar from '@/components/Header/SearchBar';
import MoodSuggestions from '@/components/MoodSection/MoodSuggestions';
import ResultsContainer from '@/components/ResultsSection/ResultsContainer';
import ScrollToTop from '@/components/UI/ScrollToTop';

const SoulCastContainer: React.FC = () => {
    const {
        searchTerm,
        episodes,
        isLoading,
        error,
        hasSearched,
        totalResults,
        expansionNotice,
        suggestions,
        recommendedKeywords,
        page,
        hasMore,
        isLoadingMore,
        handleSearchTermChange,
        handleMoodClick,
        handleSuggestionClick,
        handleRetry,
        searchPodcasts,
    } = usePodcastSearch();

    const { loaderRef } = useInfiniteScroll({
        hasMore,
        isLoading,
        isLoadingMore,
        onLoadMore: () => searchPodcasts(searchTerm, page + 1, true),
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100">
            <div className="container mx-auto max-w-7xl px-6 py-12">
                <AppHeader />

                <SearchBar value={searchTerm} onChange={handleSearchTermChange} />

                <div className="mx-auto mb-12 max-w-6xl">
                    <MoodSuggestions onMoodClick={handleMoodClick} />
                </div>

                <div className="mx-auto max-w-6xl">
                    <ResultsContainer
                        episodes={episodes}
                        isLoading={isLoading}
                        error={error}
                        hasSearched={hasSearched}
                        totalResults={totalResults}
                        expansionNotice={expansionNotice}
                        suggestions={suggestions}
                        recommendedKeywords={recommendedKeywords}
                        isLoadingMore={isLoadingMore}
                        hasMore={hasMore}
                        loaderRef={loaderRef}
                        searchTerm={searchTerm}
                        onSuggestionClick={handleSuggestionClick}
                        onRetry={handleRetry}
                    />
                </div>

                <ScrollToTop />
            </div>
        </div>
    );
};

export default SoulCastContainer;
