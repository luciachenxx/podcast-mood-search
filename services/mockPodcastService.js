// services/mockPodcastService.js
import { MOOD_KEYWORDS } from '../constants/moodKeywords.js';

export class MockPodcastService {
    constructor() {
        this.mockData = {
            療癒: [
                {
                    id: '1',
                    title: '深夜談心：今天辛苦了，給自己一個溫暖的擁抱',
                    description:
                        '在這個安靜的夜晚，讓我們一起放慢腳步，用最溫柔的聲音陪伴每一個努力生活的靈魂。今天的你，已經很棒了。',
                    podcastTitle: '療癒夜晚',
                    duration: '28:30',
                    publishDate: '1天前',
                    tags: ['療癒', '溫暖', '睡前', '陪伴'],
                    audioUrl: 'https://example.com/audio1.mp3',
                    imageUrl: '/api/placeholder/60/60',
                },
                {
                    id: '2',
                    title: '音樂療法：用旋律治癒內心的創傷',
                    description:
                        '音樂擁有神奇的治癒力量，能夠觸及我們內心最深處。讓我們一起探索音樂如何成為心靈的良藥。',
                    podcastTitle: '聲音花園',
                    duration: '33:45',
                    publishDate: '2天前',
                    tags: ['療癒', '音樂', '放鬆'],
                    audioUrl: 'https://example.com/audio2.mp3',
                    imageUrl: '/api/placeholder/60/60',
                },
                {
                    id: '7',
                    title: '冥想入門：找回內心的寧靜',
                    description: '透過簡單的冥想練習，學會在忙碌生活中為心靈找到一片淨土。',
                    podcastTitle: '正念生活',
                    duration: '18:20',
                    publishDate: '3天前',
                    tags: ['冥想', '放鬆', '療癒'],
                    audioUrl: 'https://example.com/audio7.mp3',
                    imageUrl: '/api/placeholder/60/60',
                },
            ],
            學習: [
                {
                    id: '3',
                    title: '高效學習法：如何在碎片時間掌握新技能',
                    description:
                        '分享科學有效的學習方法，讓你在忙碌生活中也能持續成長，掌握時間管理的藝術。',
                    podcastTitle: '成長加速器',
                    duration: '42:15',
                    publishDate: '3天前',
                    tags: ['學習', '知識', '技能', '成長'],
                    audioUrl: 'https://example.com/audio3.mp3',
                    imageUrl: '/api/placeholder/60/60',
                },
                {
                    id: '8',
                    title: '語言學習的科學方法',
                    description: '基於認知科學的語言學習策略，讓你更聰明地學外語。',
                    podcastTitle: '語言大師',
                    duration: '35:20',
                    publishDate: '4天前',
                    tags: ['學習', '語言', '知識'],
                    audioUrl: 'https://example.com/audio8.mp3',
                    imageUrl: '/api/placeholder/60/60',
                },
            ],
            放鬆: [
                {
                    id: '4',
                    title: '森林浴冥想：讓大自然的聲音撫慰心靈',
                    description:
                        '沉浸在森林的懷抱中，聆聽鳥語蟲鳴，讓大自然的節奏帶領你進入深度放鬆狀態。',
                    podcastTitle: '自然療癒',
                    duration: '25:15',
                    publishDate: '1天前',
                    tags: ['放鬆', '冥想', '自然', '療癒'],
                    audioUrl: 'https://example.com/audio4.mp3',
                    imageUrl: '/api/placeholder/60/60',
                },
                {
                    id: '9',
                    title: '海浪聲與冥想：深度放鬆的旅程',
                    description: '讓海浪的節奏引導你進入深層的平靜狀態，釋放一天的疲憊。',
                    podcastTitle: '海洋之聲',
                    duration: '45:00',
                    publishDate: '2天前',
                    tags: ['放鬆', '冥想', '自然'],
                    audioUrl: 'https://example.com/audio9.mp3',
                    imageUrl: '/api/placeholder/60/60',
                },
            ],
            動力: [
                {
                    id: '5',
                    title: '成功人士的晨間儀式：如何開始充滿能量的一天',
                    description:
                        '探索成功人士如何利用晨間時光為一天注入滿滿的正能量和動力，建立高效的生活節奏。',
                    podcastTitle: '動力加油站',
                    duration: '35:40',
                    publishDate: '2天前',
                    tags: ['動力', '成功', '習慣', '激勵'],
                    audioUrl: 'https://example.com/audio5.mp3',
                    imageUrl: '/api/placeholder/60/60',
                },
                {
                    id: '10',
                    title: '克服拖延症：重新點燃你的行動力',
                    description: '科學方法幫你戰勝拖延，重新找回執行力和成就感。',
                    podcastTitle: '行動派',
                    duration: '28:45',
                    publishDate: '1天前',
                    tags: ['動力', '習慣', '成長'],
                    audioUrl: 'https://example.com/audio10.mp3',
                    imageUrl: '/api/placeholder/60/60',
                },
            ],
            睡前: [
                {
                    id: '6',
                    title: '雨夜讀詩：讓文字撫慰疲憊的心靈',
                    description:
                        '在這個下雨的夜晚，讓我們一起沉浸在詩的世界裡。每一首詩都是一次心靈的撫摸。',
                    podcastTitle: '詩意時光',
                    duration: '22:30',
                    publishDate: '1天前',
                    tags: ['睡前', '詩歌', '療癒', '文學'],
                    audioUrl: 'https://example.com/audio6.mp3',
                    imageUrl: '/api/placeholder/60/60',
                },
            ],
        };
    }

    async hybridSearch(term) {
        // 模擬 API 延遲
        await new Promise((resolve) => setTimeout(resolve, 800));

        let results = [];

        // 根據心情關鍵字找到對應內容
        Object.entries(MOOD_KEYWORDS).forEach(([mood, tags]) => {
            if (term.toLowerCase().includes(mood)) {
                if (tags.includes('療癒') && this.mockData['療癒']) {
                    results.push(...this.mockData['療癒']);
                }
                if (tags.includes('知識') && this.mockData['學習']) {
                    results.push(...this.mockData['學習']);
                }
                if (tags.includes('放鬆') && this.mockData['放鬆']) {
                    results.push(...this.mockData['放鬆']);
                }
                if (tags.includes('動力') && this.mockData['動力']) {
                    results.push(...this.mockData['動力']);
                }
                if (tags.includes('睡前') && this.mockData['睡前']) {
                    results.push(...this.mockData['睡前']);
                }
            }
        });

        // 如果沒找到心情匹配，嘗試直接搜尋類別
        if (results.length === 0) {
            const searchLower = term.toLowerCase();
            if (searchLower.includes('學習') || searchLower.includes('知識')) {
                results = this.mockData['學習'] || [];
            } else if (searchLower.includes('放鬆') || searchLower.includes('冥想')) {
                results = this.mockData['放鬆'] || [];
            } else if (searchLower.includes('動力') || searchLower.includes('激勵')) {
                results = this.mockData['動力'] || [];
            } else if (searchLower.includes('睡前')) {
                results = this.mockData['睡前'] || [];
            } else {
                // 預設返回療癒類別
                results = this.mockData['療癒'] || [];
            }
        }

        // 移除重複並隨機排序
        const uniqueResults = Array.from(new Set(results.map((r) => r.id))).map((id) =>
            results.find((r) => r.id === id)
        );

        return uniqueResults.sort(() => Math.random() - 0.5).slice(0, 8);
    }
}

// 導出單例
export const mockPodcastService = new MockPodcastService();
