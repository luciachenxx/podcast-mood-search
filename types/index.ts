// 定義所有需要的類型，解決 TypeScript 錯誤

export interface CacheEntry {
    timestamp: number;
    data: any;
    ttl?: number;
}

export interface PodcastFeed {
    id: string | number;
    title?: string;
    description?: string;
    author?: string;
    language?: string;
    link?: string;
    image?: string;
    episodeCount?: number;
    lastUpdateTime?: number;
    [key: string]: any; // 允許其他屬性
}

export interface ChineseAnalysis {
    isChinese: boolean;
    score: number;
}

export interface ScoredPodcastFeed extends PodcastFeed {
    isChinese: boolean;
    chineseScore: number;
    relevanceScore: number;
    matchReason?: string;
}

export interface PaginationInfo {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
}

export interface SearchStats {
    total: number;
    chinese: number;
    nonChinese: number;
    usedAI: boolean;
    aiUsageRate: string;
    usedExpansionStrategy: boolean;
}

export interface SearchResponse {
    feeds: ScoredPodcastFeed[];
    pagination: PaginationInfo;
    stats: SearchStats;
    searchInfo: {
        originalQuery: string;
        expandedQueries: string[];
        usedAI: boolean;
    };
    expansionNotice: string | null;
    suggestions: string[];
    message?: string;
    recommendedKeywords?: string[];
    fromSimilarCache?: boolean;
}

export interface NoResultsResponse {
    feeds: [];
    message: string;
    suggestions: string[];
    recommendedKeywords: string[];
    pagination: PaginationInfo;
}
