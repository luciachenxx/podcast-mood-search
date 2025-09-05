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

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://soulcast.luciachenxx.com',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
};

export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    });
}

/**
 * 主要 API 處理函數 - 優化分頁版本
 */
export async function GET(request: Request) {
    try {
        const ip = getClientIP(request as any) || 'unknown';
        const { searchParams } = new URL(request.url);

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
                        ...corsHeaders,
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
        const originalQuery = searchParams.get('q') || 'podcast';
        const preferChinese = searchParams.get('chinese') !== 'false';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
        const forceAI = searchParams.get('ai') === 'true';

        console.log(
            `🔍 搜尋關鍵詞: "${originalQuery}" (優先中文: ${preferChinese}, 頁碼: ${page})`
        );

        // 完整結果快取檢查 (所有資料的快取)
        const fullResultsCacheKey = `${originalQuery}:full:${preferChinese}`;
        const fullCachedResults = searchCache.get(fullResultsCacheKey);

        if (fullCachedResults && page > 1) {
            console.log('🎯 使用完整結果快取分頁:', page);

            // 從完整結果中分頁
            const allFeeds = fullCachedResults.allFeeds;
            const totalResults = allFeeds.length;
            const offset = (page - 1) * pageSize;
            const paginatedFeeds = allFeeds.slice(offset, offset + pageSize);

            // 添加匹配原因
            const feedsWithReasons = addMatchReasons(
                paginatedFeeds,
                originalQuery,
                fullCachedResults.localExpandedQueries,
                fullCachedResults.aiExpandedQueries,
                fullCachedResults.usedAI
            );

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
                    total: totalResults,
                    chinese: paginatedFeeds.filter((feed) => feed.isChinese).length,
                    nonChinese: paginatedFeeds.filter((feed) => !feed.isChinese).length,
                    usedAI: fullCachedResults.usedAI,
                    aiUsageRate: aiUsageCounter.getRate(),
                    usedExpansionStrategy: fullCachedResults.usedExpansionStrategy,
                },
                searchInfo: {
                    originalQuery,
                    expandedQueries: fullCachedResults.usedAI
                        ? fullCachedResults.aiExpandedQueries
                        : fullCachedResults.localExpandedQueries,
                    usedAI: fullCachedResults.usedAI,
                },
                expansionNotice: fullCachedResults.expansionNotice,
                suggestions: fullCachedResults.suggestions,
            };

            return NextResponse.json(finalResponse);
        }

        // 分頁快取檢查 (單頁快取)
        const cacheKey = `${originalQuery}:${preferChinese}:${page}:${pageSize}`;
        const cachedResult = searchCache.get(cacheKey);

        if (cachedResult) {
            console.log('🎯 使用分頁快取結果:', cacheKey);
            return NextResponse.json(cachedResult);
        }

        // 相似查詢快取檢查
        const similarCachedResult = searchCache.getSimilar(originalQuery);
        if (similarCachedResult && page === 1) {
            console.log('🔄 使用相似查詢快取:', originalQuery);
            return NextResponse.json({
                ...similarCachedResult,
                fromSimilarCache: true,
                originalQuery,
            });
        }

        // 第一頁或無快取：執行完整搜尋
        const headers = createAuthHeaders(apiKey, apiSecret);
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

        let allFeeds = initialData.feeds || [];
        console.log(`📊 初始搜尋結果數: ${allFeeds.length}`);

        // AI 擴展相關
        let aiExpandedQueries: string[] = [];
        let usedAI = false;
        const shouldUseAI = forceAI || shouldUseAiExpansion(originalQuery, allFeeds.length);

        // 只在第一頁執行 AI 擴展以優化效能
        if (hasOpenAI && shouldUseAI && page === 1) {
            try {
                console.log('🤖 啟用 OpenAI 查詢擴展...');
                aiExpandedQueries = await expandQueryWithAI(originalQuery);
                usedAI = true;
                console.log('✨ OpenAI 建議:', aiExpandedQueries.slice(1));

                if (aiExpandedQueries.length > 1) {
                    const searchTerms = aiExpandedQueries.slice(1); // 搜尋所有建議詞
                    console.log(`🔍 搜索所有 ${searchTerms.length} 個 AI 建議詞:`, searchTerms);

                    const existingIds = new Set(allFeeds.map((feed) => feed.id));
                    let totalNewFeeds = 0;

                    // 並行搜尋以提升效能 (但限制並行數量避免過載)
                    const batchSize = 3; // 每次最多並行 3 個請求
                    for (let i = 0; i < searchTerms.length; i += batchSize) {
                        const batch = searchTerms.slice(i, i + batchSize);

                        const batchPromises = batch.map(async (aiQuery, index) => {
                            try {
                                console.log(
                                    `🔍 [${i + index + 1}/${searchTerms.length}] 搜索: "${aiQuery}"`
                                );
                                const aiData = await searchPodcast(aiQuery, headers, 20);
                                return { aiQuery, feeds: aiData.feeds || [], success: true };
                            } catch (error) {
                                console.error(`❌ AI 建議詞 "${aiQuery}" 搜索失敗:`, error);
                                return { aiQuery, feeds: [], success: false };
                            }
                        });

                        const batchResults = await Promise.all(batchPromises);

                        batchResults.forEach(({ aiQuery, feeds, success }) => {
                            if (success && feeds.length > 0) {
                                const uniqueAiFeeds = feeds.filter((feed) => {
                                    if (existingIds.has(feed.id)) {
                                        return false;
                                    }
                                    existingIds.add(feed.id);
                                    return true;
                                });

                                if (uniqueAiFeeds.length > 0) {
                                    allFeeds = [...allFeeds, ...uniqueAiFeeds];
                                    totalNewFeeds += uniqueAiFeeds.length;
                                    console.log(
                                        `✅ "${aiQuery}" 新增 ${uniqueAiFeeds.length} 個結果`
                                    );
                                }
                            }
                        });
                    }

                    console.log(
                        `🔄 AI 全關鍵詞搜索完成: 新增 ${totalNewFeeds} 個結果，總計 ${allFeeds.length} 個`
                    );
                }
            } catch (error) {
                console.error('AI 擴展查詢失敗:', error);
            }
        } else if (page > 1) {
            console.log('⏩ 非第一頁，跳過 AI 擴展');
        } else {
            console.log(
                hasOpenAI
                    ? '⏩ 跳過 AI 擴展 (結果已足夠)'
                    : '⚠️ 未配置 OpenAI API，無法使用 AI 擴展'
            );
        }

        aiUsageCounter.logUsage(usedAI);

        // 處理無結果情況
        let usedExpansionStrategy = false;
        if (allFeeds.length === 0) {
            const { feeds, usedBackupStrategy } = await handleNoResults(
                originalQuery,
                aiExpandedQueries,
                headers,
                usedAI
            );

            allFeeds = feeds;
            usedExpansionStrategy = usedBackupStrategy;

            if (allFeeds.length === 0) {
                const noResultsResponse = createNoResultsResponse(originalQuery, page, pageSize);
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

        // 如果是第一頁，快取完整結果以供後續分頁使用
        if (page === 1) {
            const fullResultsCache = {
                allFeeds: scoredAndSortedFeeds,
                localExpandedQueries,
                aiExpandedQueries,
                usedAI,
                usedExpansionStrategy,
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

            // 快取完整結果，較長的 TTL
            searchCache.set(fullResultsCacheKey, fullResultsCache, false);
            console.log('💾 快取完整搜索結果:', fullResultsCacheKey);
        }

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

        // 快取單頁結果
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
