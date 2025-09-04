import axios from 'axios';
import { DataFormatter } from './dataFormatter';

export class PodcastApiService {
    private axiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            timeout: 10000,
        });
    }

    async search(term: string, page: number = 1, pageSize: number = 10) {
        try {
            const response = await this.axiosInstance.get('/api/search', {
                params: { q: term, page, pageSize },
            });

            const data = response.data;
            const episodes = data.feeds ? DataFormatter.formatPodcastData(data.feeds) : [];

            return {
                episodes,
                totalResults: data.pagination?.total || data.feeds?.length || 0,
                hasMore: data.pagination?.hasMore || false,
                expansionNotice: data.expansionNotice || null,
                suggestions: data.suggestions || [],
                recommendedKeywords: data.recommendedKeywords || [],
            };
        } catch (error: any) {
            console.error('API Error:', error);

            if (error.response) {
                throw new Error(
                    `API 錯誤 ${error.response.status}: ${error.response.data?.error || '未知錯誤'}`
                );
            } else if (error.code === 'ECONNABORTED') {
                throw new Error('請求超時，請檢查網路連線');
            } else {
                throw new Error('網路連線失敗，請稍後再試');
            }
        }
    }
}

export const podcastApi = new PodcastApiService();
