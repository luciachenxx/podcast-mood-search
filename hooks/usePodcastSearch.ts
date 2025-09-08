import { useState, useCallback, useEffect } from 'react';
import { SearchState, PaginationState } from '@/types/podcast';
import { podcastApi } from '@/app/api/search/services/podcastApi';

export const usePodcastSearch = () => {
    const [searchState, setSearchState] = useState<SearchState>({
        searchTerm: '',
        episodes: [],
        isLoading: false,
        error: null,
        hasSearched: false,
        totalResults: 0,
        expansionNotice: null,
        suggestions: [],
        recommendedKeywords: [],
    });

    const [paginationState, setPaginationState] = useState<PaginationState>({
        page: 1,
        hasMore: true,
        isLoadingMore: false,
    });

    const searchPodcasts = useCallback(async (term: string, pageNum: number, append = false) => {
        if (!term) {
            setSearchState((prev) => ({
                ...prev,
                episodes: [],
                hasSearched: false,
                error: null,
            }));
            setPaginationState((prev) => ({ ...prev, hasMore: false, page: 1 }));
            return;
        }

        // 設定載入狀態
        if (append) {
            setPaginationState((prev) => ({ ...prev, isLoadingMore: true }));
        } else {
            setSearchState((prev) => ({
                ...prev,
                isLoading: true,
                hasSearched: true,
                error: null,
            }));
        }

        try {
            const result = await podcastApi.search(term, pageNum);

            if (append) {
                setSearchState((prev) => ({
                    ...prev,
                    episodes: [...prev.episodes, ...result.episodes],
                }));
            } else {
                setSearchState((prev) => ({
                    ...prev,
                    episodes: result.episodes,
                    totalResults: result.totalResults,
                    expansionNotice: result.expansionNotice,
                    suggestions: result.suggestions,
                    recommendedKeywords: result.recommendedKeywords,
                }));
            }

            setPaginationState((prev) => ({
                ...prev,
                page: pageNum, // 更新當前頁數
                hasMore: result.hasMore,
            }));
        } catch (error: any) {
            setSearchState((prev) => ({ ...prev, error: error.message }));
        } finally {
            setSearchState((prev) => ({ ...prev, isLoading: false }));
            setPaginationState((prev) => ({ ...prev, isLoadingMore: false }));
        }
    }, []);

    const handleSearchTermChange = useCallback((newTerm: string) => {
        setSearchState((prev) => ({ ...prev, searchTerm: newTerm }));
        setPaginationState({ page: 1, hasMore: true, isLoadingMore: false });
    }, []);

    const handleMoodClick = useCallback(
        (mood: string) => {
            handleSearchTermChange(mood);
        },
        [handleSearchTermChange]
    );

    const handleSuggestionClick = useCallback(
        (suggestion: string) => {
            handleSearchTermChange(suggestion);
        },
        [handleSearchTermChange]
    );

    const handleRetry = useCallback(() => {
        setPaginationState((prev) => ({ ...prev, page: 1 }));
        searchPodcasts(searchState.searchTerm, 1, false);
    }, [searchState.searchTerm, searchPodcasts]);

    // 搜索詞變化時觸發搜索
    useEffect(() => {
        if (searchState.searchTerm) {
            searchPodcasts(searchState.searchTerm, 1, false);
        }
    }, [searchState.searchTerm, searchPodcasts]);

    return {
        ...searchState,
        ...paginationState,
        handleSearchTermChange,
        handleMoodClick,
        handleSuggestionClick,
        handleRetry,
        searchPodcasts,
    };
};
