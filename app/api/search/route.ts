import { NextResponse } from 'next/server';
import { searchCache, aiUsageCounter } from './services/cache';
import { expandQueryWithAI } from './services/ai';
import { searchPodcast, handleNoResults, createNoResultsResponse } from './services/podcast';
import { createAuthHeaders } from '@/utils/auth';
import { expandQueryLocally, shouldUseAiExpansion } from '@/utils/detection';
import { scoreAndSortResults, addMatchReasons } from '@/utils/scoring';
import { SearchResponse } from '@/types';
import { rateLimiter } from '@/lib/rateLimiter';
import { getClientIP } from '@/lib/ipUtils';

/**
 * 主要 API 處理函數
 */
export async function GET(request: Request) {
    try {
        const ip = getClientIP(request as any) || 'unknown';
        const { allowed, remaining, resetTime } = rateLimiter.check(ip);

        if (!allowed) {
            return NextResponse.json(
                {
                    error: 'Too many requests, please try again later.',
                    remaining,
                    resetTime,
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': '10',
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': resetTime.toString(),
                    },
                }
            );
        }

        // 環境檢查
        const apiKey = process.env.PODCAST_API_KEY!;
        const apiSecret = process.env.PODCAST_API_SECRET!;
        const hasOpenAI = !!process.env.OPENAI_API_KEY;

        if (!apiKey || !apiSecret) {
            return NextResponse.json({ error: '缺少 Podcast API 密鑰' }, { status: 500 });
        }

        // 解析查詢參數
        const { searchParams } = new URL(request.url);
        const originalQuery = searchParams.get('q') || 'podcast';
        const preferChinese = searchParams.get('chinese') !== 'false';
        const limit = parseInt(searchParams.get('limit') || '30', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || `${limit}`, 10);
        const forceAI = searchParams.get('ai') === 'true';

        console.log(
            `🔍 搜尋關鍵詞: "${originalQuery}" (優先中文: ${preferChinese}, 頁碼: ${page})`
        );

        // 緩存檢查
        const cacheKey = `${originalQuery}:${preferChinese}:${page}:${pageSize}`;
        const cachedResult = searchCache.get(cacheKey);

        if (cachedResult) {
            console.log('🎯 使用緩存結果:', cacheKey);
            return NextResponse.json(cachedResult);
        }

        // 檢查相似查詢的緩存
        const similarCachedResult = searchCache.getSimilar(originalQuery);
        if (similarCachedResult) {
            console.log('🔄 使用相似查詢緩存:', originalQuery);
            return NextResponse.json({
                ...similarCachedResult,
                fromSimilarCache: true,
                originalQuery,
            });
        }

        // 準備 API 認證頭
        const headers = createAuthHeaders(apiKey, apiSecret);

        // 本地擴展查詢
        const localExpandedQueries = expandQueryLocally(originalQuery);
        console.log('📝 本地擴展查詢:', localExpandedQueries);

        // 執行初始搜索
        const initialQuery = localExpandedQueries[0];
        let initialData;
        try {
            initialData = await searchPodcast(initialQuery, headers);
        } catch (error) {
            return NextResponse.json(
                { error: `搜索失敗: ${(error as Error).message}` },
                { status: 500 }
            );
        }

        // 初始結果
        let allFeeds = initialData.feeds || [];
        console.log(`📊 初始搜尋結果數: ${allFeeds.length}`);

        // AI 擴展相關
        let aiExpandedQueries: string[] = [];
        let usedAI = false;
        const shouldUseAI = forceAI || shouldUseAiExpansion(originalQuery, allFeeds.length);

        // 執行 AI 擴展搜索
        if (hasOpenAI && shouldUseAI) {
            try {
                console.log('🤖 啟用 OpenAI 查詢擴展...');
                aiExpandedQueries = await expandQueryWithAI(originalQuery);
                usedAI = true;
                console.log('✨ OpenAI 建議:', aiExpandedQueries.slice(1));

                // 如果有 AI 建議詞，使用第一個進行搜索
                if (aiExpandedQueries.length > 1) {
                    const aiQuery = aiExpandedQueries[1];
                    console.log('🔍 使用 AI 建議詞搜索:', aiQuery);

                    try {
                        const aiData = await searchPodcast(aiQuery, headers, 30);

                        if (aiData.feeds && aiData.feeds.length > 0) {
                            // 合併並去除重複項
                            const existingIds = new Set(allFeeds.map((feed) => feed.id));
                            const uniqueAiFeeds = aiData.feeds.filter(
                                (feed) => !existingIds.has(feed.id)
                            );

                            allFeeds = [...allFeeds, ...uniqueAiFeeds];
                            console.log(`🔄 合併後結果數: ${allFeeds.length}`);
                        }
                    } catch (error) {
                        console.error('AI 建議詞搜索失敗:', error);
                    }
                }
            } catch (error) {
                console.error('AI 擴展查詢失敗:', error);
            }
        } else {
            console.log(
                hasOpenAI
                    ? '⏩ 跳過 AI 擴展 (結果已足夠)'
                    : '⚠️ 未配置 OpenAI API，無法使用 AI 擴展'
            );
        }

        // 記錄 AI 使用情況
        aiUsageCounter.logUsage(usedAI);

        // 處理無結果情況
        let usedExpansionStrategy = false;

        if (allFeeds.length === 0)
            if (allFeeds.length === 0) {
                // 處理無結果情況
                const { feeds, usedBackupStrategy } = await handleNoResults(
                    originalQuery,
                    aiExpandedQueries,
                    headers,
                    usedAI
                );

                allFeeds = feeds;
                usedExpansionStrategy = usedBackupStrategy;

                // 如果仍然沒有結果，返回建議
                if (allFeeds.length === 0) {
                    const noResultsResponse = createNoResultsResponse(
                        originalQuery,
                        page,
                        pageSize
                    );
                    searchCache.set(cacheKey, noResultsResponse, true);
                    return NextResponse.json(noResultsResponse);
                }
            }

        // 評分和排序結果
        const scoredAndSortedFeeds = scoreAndSortResults(
            allFeeds,
            originalQuery,
            [...localExpandedQueries, ...aiExpandedQueries],
            preferChinese
        );

        // 計算分頁
        const totalResults = scoredAndSortedFeeds.length;
        const offset = (page - 1) * pageSize;
        const paginatedFeeds = scoredAndSortedFeeds.slice(offset, offset + pageSize);

        // 添加匹配原因
        const feedsWithReasons = addMatchReasons(
            paginatedFeeds,
            originalQuery,
            localExpandedQueries,
            aiExpandedQueries,
            usedAI
        );

        // 構建最終回應
        const finalResponse: SearchResponse = {
            feeds: feedsWithReasons,
            pagination: {
                total: totalResults,
                page,
                pageSize,
                totalPages: Math.ceil(totalResults / pageSize),
                hasMore: offset + pageSize < totalResults,
            },
            stats: {
                total: allFeeds.length,
                chinese: paginatedFeeds.filter((feed) => feed.isChinese).length,
                nonChinese: paginatedFeeds.filter((feed) => !feed.isChinese).length,
                usedAI,
                aiUsageRate: aiUsageCounter.getRate(),
                usedExpansionStrategy,
            },
            searchInfo: {
                originalQuery,
                expandedQueries: usedAI ? aiExpandedQueries : localExpandedQueries,
                usedAI,
            },
            // 如果使用了擴展搜索，添加提示
            expansionNotice: usedExpansionStrategy
                ? `未直接找到「${originalQuery}」的結果，但為您推薦了相關內容`
                : null,
            suggestions: [
                ...new Set([
                    ...localExpandedQueries.filter((q) => q !== originalQuery),
                    ...aiExpandedQueries.filter((q) => q !== originalQuery),
                ]),
            ].slice(0, 5),
        };

        // 緩存結果
        searchCache.set(cacheKey, finalResponse, false);

        return NextResponse.json(finalResponse);
    } catch (error) {
        console.error('💥 搜尋錯誤:', error);
        return NextResponse.json(
            { error: '伺服器內部錯誤', details: (error as Error).message },
            { status: 500 }
        );
    }
}
