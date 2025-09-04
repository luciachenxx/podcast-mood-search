export interface Episode {
    id: string;
    title: string;
    description: string;
    podcastTitle: string;
    duration: string;
    publishDate: string;
    tags: string[];
    audioUrl: string;
    imageUrl?: string;
    matchReason?: string;
    isChinese?: boolean;
}

export interface SearchState {
    searchTerm: string;
    episodes: Episode[];
    isLoading: boolean;
    error: string | null;
    hasSearched: boolean;
    totalResults: number;
    expansionNotice: string | null;
    suggestions: string[];
    recommendedKeywords: string[];
}

export interface PaginationState {
    page: number;
    hasMore: boolean;
    isLoadingMore: boolean;
}
