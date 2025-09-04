import { MOOD_MAPPINGS } from '@/constants/moodKeywords';
import { ChineseAnalysis } from '../types';

/**
 * 本地擴展查詢 - 不依賴外部 API
 */
export function expandQueryLocally(userQuery: string): string[] {
    const cleanQuery = userQuery.toLowerCase().trim();

    for (const [mood, keywords] of Object.entries(MOOD_MAPPINGS)) {
        if (cleanQuery.includes(mood) || keywords.some((kw) => cleanQuery.includes(kw))) {
            return [cleanQuery, mood];
        }
    }

    return [cleanQuery];
}

/**
 * 判斷是否需要 AI 擴展
 */
export function shouldUseAiExpansion(query: string, resultCount: number): boolean {
    // 搜索結果太少
    if (resultCount < 5) return true;

    // 查詢非常短（1-2個字）且不是常見情緒詞
    if (query.length <= 2 && !Object.keys(MOOD_MAPPINGS).some((mood) => query.includes(mood))) {
        return true;
    }

    // 查詢詞是復雜情緒描述
    const complexPattern = /(?:很|非常|超級|極度|有點|感到)(?:難過|沮喪|焦慮|煩悶|無聊|空虛|迷茫)/;
    if (complexPattern.test(query)) {
        return true;
    }

    return false;
}

/**
 * 檢測內容是否為中文
 */
export function detectChineseContent(podcast: any): ChineseAnalysis {
    const title = podcast.title || '';
    const description = podcast.description || '';
    const author = podcast.author || '';
    const language = podcast.language || '';

    let score = 0;

    // 檢查語言標記
    if (['zh', 'zh-cn', 'zh-tw', 'zh-hk'].some((lang) => language.toLowerCase().includes(lang))) {
        score += 50;
    }

    // 檢查中文字符比例
    const allText = `${title} ${description} ${author}`;
    const chineseChars = allText.match(/[\u4e00-\u9fff]/g) || [];
    const chineseRatio = chineseChars.length / allText.length;

    score += chineseRatio * 100;

    return {
        isChinese: score > 3,
        score: score,
    };
}

/**
 * 獲取與查詢詞相關的主題
 */
export function getRelatedThemes(query: string): string[] {
    if (query.includes('動力') || query.includes('激勵') || query.includes('成長')) {
        return ['動力', '成長', '激勵', '目標'];
    }
    if (query.includes('放鬆') || query.includes('壓力') || query.includes('冥想')) {
        return ['放鬆', '療癒', '減壓'];
    }
    if (query.includes('心情') || query.includes('情緒') || query.includes('憂鬱')) {
        return ['心情', '療癒', '感受'];
    }
    if (query.includes('睡眠') || query.includes('睡前') || query.includes('睡覺')) {
        return ['睡眠', '放鬆', '冥想'];
    }

    // 默認熱門主題
    return ['動力', '故事', '音樂', '療癒', '生活'];
}

/**
 * 生成智能建議
 */
export function getSmartSuggestions(query: string): string[] {
    const suggestions = ['嘗試更簡短的關鍵詞'];

    if (query.includes('動力') || query.includes('激勵')) {
        suggestions.push('激勵', '成長', '目標');
    } else if (query.includes('放鬆') || query.includes('壓力')) {
        suggestions.push('冥想', '療癒', '減壓');
    } else {
        suggestions.push('療癒', '故事', '音樂');
    }

    return suggestions;
}
