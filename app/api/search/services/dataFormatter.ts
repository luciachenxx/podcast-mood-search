import { Episode } from '@/types/podcast';

export class DataFormatter {
    static formatPodcastData = (apiData: any[]): Episode[] => {
        return apiData.map((item, index) => ({
            id: `${item.id || '0'}-${index}`,
            title: item.title || '未知標題',
            description: this.cleanDescription(item.description),
            podcastTitle: item.author || '未知 Podcast',
            duration: this.formatDuration(item.episodeCount),
            publishDate: this.formatDate(item.lastUpdateTime),
            tags: this.generateTags(item.title, item.description),
            audioUrl: item.link || '',
            imageUrl: item.image,
            matchReason: item.matchReason,
            isChinese: item.isChinese,
        }));
    };

    private static cleanDescription = (description: string): string => {
        if (!description) return '';
        return (
            description
                .replace(/<[^>]*>/g, '')
                .replace(/&[^;]+;/g, ' ')
                .trim()
                .substring(0, 200) + (description.length > 200 ? '...' : '')
        );
    };

    private static formatDuration = (episodeCount: number): string => {
        return episodeCount ? `${episodeCount} 集` : '未知';
    };

    private static formatDate = (timestamp: number): string => {
        if (!timestamp) return '未知';
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '昨天';
        if (diffDays <= 7) return `${diffDays}天前`;
        if (diffDays <= 30) return `${Math.floor(diffDays / 7)}週前`;

        return date.toLocaleDateString('zh-TW');
    };

    private static generateTags = (title: string, description: string): string[] => {
        const content = ((title || '') + ' ' + (description || '')).toLowerCase();
        const tags: string[] = [];

        const keywordMap: Record<string, string[]> = {
            冥想: ['冥想', '放鬆'],
            療癒: ['療癒', '溫暖'],
            睡前: ['睡前', '輕鬆'],
            故事: ['故事', '娛樂'],
            音樂: ['音樂', '娛樂'],
            商業: ['商業', '知識'],
            創業: ['創業', '動力'],
            心理: ['療癒', '成長'],
            健康: ['健康', '知識'],
            運動: ['運動', '動力'],
            旅遊: ['旅遊', '故事'],
            美食: ['美食', '生活'],
            科技: ['科技', '知識'],
            歷史: ['歷史', '知識'],
            文學: ['文學', '故事'],
            學習: ['學習', '知識'],
            教育: ['教育', '知識'],
            新聞: ['新聞', '資訊'],
            訪談: ['訪談', '對話'],
        };

        Object.entries(keywordMap).forEach(([keyword, relatedTags]) => {
            if (content.includes(keyword)) {
                tags.push(...relatedTags);
            }
        });

        if (tags.length === 0) {
            tags.push('其他');
        }

        return [...new Set(tags)].slice(0, 4);
    };
}
