import { PodcastFeed, ScoredPodcastFeed } from '../types';
import { detectChineseContent } from './detection';

/**
 * 對結果進行評分和排序
 */
export function scoreAndSortResults(
    feeds: PodcastFeed[],
    originalQuery: string,
    expandedQueries: string[],
    preferChinese: boolean
): ScoredPodcastFeed[] {
    // 評分
    const scoredFeeds = feeds.map((feed) => {
        const chineseAnalysis = detectChineseContent(feed);
        let score = 50; // 基礎分數

        // 與原始查詢匹配度
        const title = (feed.title || '').toLowerCase();
        const desc = (feed.description || '').toLowerCase();

        if (title.includes(originalQuery.toLowerCase())) {
            score += 30;
        } else if (desc.includes(originalQuery.toLowerCase())) {
            score += 15;
        }

        // 與擴展查詢匹配度
        expandedQueries.forEach((query) => {
            if (query !== originalQuery) {
                if (title.includes(query.toLowerCase())) {
                    score += 15;
                } else if (desc.includes(query.toLowerCase())) {
                    score += 10;
                }
            }
        });

        // 中文內容加分
        if (preferChinese && chineseAnalysis.isChinese) {
            score += 20 + chineseAnalysis.score * 0.5;
        } else if (chineseAnalysis.isChinese) {
            score += 10;
        }

        return {
            ...feed,
            isChinese: chineseAnalysis.isChinese,
            chineseScore: chineseAnalysis.score,
            relevanceScore: score,
        };
    });

    // 排序
    const sortedFeeds = scoredFeeds.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // 中文優先處理
    if (preferChinese) {
        const chineseFeeds = sortedFeeds.filter((feed) => feed.isChinese);
        const otherFeeds = sortedFeeds.filter((feed) => !feed.isChinese);
        return [...chineseFeeds, ...otherFeeds];
    }

    return sortedFeeds;
}

/**
 * 添加匹配原因
 */
export function addMatchReasons(
    feeds: ScoredPodcastFeed[],
    originalQuery: string,
    localExpandedQueries: string[],
    aiExpandedQueries: string[],
    usedAI: boolean
): ScoredPodcastFeed[] {
    return feeds.map((feed) => {
        let matchReason = '';
        const title = (feed.title || '').toLowerCase();
        const desc = (feed.description || '').toLowerCase();

        if (title.includes(originalQuery.toLowerCase())) {
            matchReason = `標題包含「${originalQuery}」`;
        } else if (desc.includes(originalQuery.toLowerCase())) {
            matchReason = `內容相關於「${originalQuery}」`;
        } else if (
            localExpandedQueries.length > 1 &&
            title.includes(localExpandedQueries[1].toLowerCase())
        ) {
            matchReason = `與「${localExpandedQueries[1]}」主題相關`;
        } else if (
            usedAI &&
            aiExpandedQueries.length > 1 &&
            title.includes(aiExpandedQueries[1].toLowerCase())
        ) {
            matchReason = `可能適合您的「${aiExpandedQueries[1]}」需求`;
        } else {
            matchReason = feed.isChinese ? '推薦的中文內容' : '可能適合您當前心情';
        }

        return { ...feed, matchReason };
    });
}
