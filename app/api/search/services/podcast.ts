import { PodcastFeed, NoResultsResponse } from '@/types';
import { getRelatedThemes, getSmartSuggestions } from '@/utils/detection';

/**
 * 搜尋 Podcast API
 */
export async function searchPodcast(
    query: string,
    headers: Record<string, string>,
    limit = 100
): Promise<{ feeds: PodcastFeed[] }> {
    const apiUrl = `https://api.podcastindex.org/api/1.0/search/byterm?q=${encodeURIComponent(
        query
    )}&max=${limit}`;

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 錯誤: ${response.status} - ${errorText}`);
    }

    return response.json();
}

/**
 * 處理無搜尋結果
 */
export async function handleNoResults(
    originalQuery: string,
    aiExpandedQueries: string[],
    headers: Record<string, string>,
    usedAI: boolean
): Promise<{ feeds: PodcastFeed[]; usedBackupStrategy: boolean }> {
    console.log('⚠️ 初始搜索無結果，啟動擴展搜索策略');

    let allFeeds: PodcastFeed[] = [];
    let usedBackupStrategy = false;

    // 1. 使用 AI 建議詞
    if (usedAI && aiExpandedQueries.length > 1) {
        for (let i = 1; i < aiExpandedQueries.length; i++) {
            if (allFeeds.length >= 10) break;

            const aiQuery = aiExpandedQueries[i];
            console.log(`🔍 嘗試 AI 建議詞: "${aiQuery}"`);

            try {
                const aiData = await searchPodcast(aiQuery, headers, 20);
                if (aiData.feeds && aiData.feeds.length > 0) {
                    allFeeds = [...allFeeds, ...aiData.feeds];
                    usedBackupStrategy = true;
                    console.log(`📈 AI 建議詞 "${aiQuery}" 找到 ${aiData.feeds.length} 個結果`);
                }
            } catch (error) {
                console.error(`AI 建議詞 "${aiQuery}" 搜索出錯:`, error);
            }
        }
    }

    // 2. 拆分查詢詞
    if (allFeeds.length < 5) {
        const queryWords = originalQuery.split(/\s+/).filter((word) => word.length > 1);

        if (queryWords.length > 1) {
            console.log(`🔍 分解查詢詞: ${queryWords.join(', ')}`);

            for (const word of queryWords) {
                if (allFeeds.length >= 10) break;

                try {
                    const wordData = await searchPodcast(word, headers, 15);
                    if (wordData.feeds && wordData.feeds.length > 0) {
                        // 合併並去重
                        const existingIds = new Set(allFeeds.map((feed) => feed.id));
                        const uniqueFeeds = wordData.feeds.filter(
                            (feed) => !existingIds.has(feed.id)
                        );

                        allFeeds = [...allFeeds, ...uniqueFeeds];
                        usedBackupStrategy = true;
                        console.log(`📈 單詞 "${word}" 找到 ${wordData.feeds.length} 個結果`);
                    }
                } catch (error) {
                    console.error(`單詞 "${word}" 搜索出錯:`, error);
                }
            }
        }
    }

    // 3. 使用相關主題
    if (allFeeds.length < 10) {
        // 智能選擇相關主題
        const relatedThemes = getRelatedThemes(originalQuery);
        console.log(`🔍 嘗試相關主題: ${relatedThemes.join(', ')}`);

        for (const theme of relatedThemes) {
            if (allFeeds.length >= 20) break;

            try {
                const themeData = await searchPodcast(theme, headers, 10);
                if (themeData.feeds && themeData.feeds.length > 0) {
                    // 合併並去重
                    const existingIds = new Set(allFeeds.map((feed) => feed.id));
                    const uniqueFeeds = themeData.feeds.filter((feed) => !existingIds.has(feed.id));

                    allFeeds = [...allFeeds, ...uniqueFeeds];
                    usedBackupStrategy = true;
                    console.log(`📈 主題 "${theme}" 找到 ${themeData.feeds.length} 個結果`);
                }
            } catch (error) {
                console.error(`主題 "${theme}" 搜索出錯:`, error);
            }
        }
    }

    if (allFeeds.length > 0) {
        console.log(`✅ 擴展搜索找到了 ${allFeeds.length} 個結果`);
    }

    return { feeds: allFeeds, usedBackupStrategy };
}

/**
 * 創建無結果響應
 */
export function createNoResultsResponse(
    originalQuery: string,
    page: number,
    pageSize: number
): NoResultsResponse {
    return {
        feeds: [],
        message: '未找到相關 Podcast',
        suggestions: getSmartSuggestions(originalQuery),
        recommendedKeywords: ['動力', '激勵', '成長', '放鬆', '療癒', '故事', '心理', '健康'],
        pagination: {
            total: 0,
            page,
            pageSize,
            totalPages: 0,
            hasMore: false,
        },
    };
}
