// 緩存服務
import { CacheEntry } from '@/types';

export class SearchCache {
    private cache: Record<string, CacheEntry> = {};
    private readonly DEFAULT_TTL = 1000 * 60 * 60 * 24; // 24小時
    private readonly NO_RESULTS_TTL = 1000 * 60 * 30; // 30分鐘
    private readonly MAX_ENTRIES = 1000; // 最大緩存條目數

    constructor() {
        // 定期清理過期緩存
        setInterval(() => this.cleanExpiredEntries(), 1000 * 60 * 60); // 每小時清理
    }

    set(key: string, data: any, isNoResults = false): void {
        // 檢查緩存大小是否超出限制
        if (Object.keys(this.cache).length >= this.MAX_ENTRIES) {
            this.cleanOldestEntries(100); // 清理最舊的100條緩存
        }

        this.cache[key] = {
            timestamp: Date.now(),
            data,
            ttl: isNoResults ? this.NO_RESULTS_TTL : this.DEFAULT_TTL,
        };
    }

    get(key: string): any | null {
        const entry = this.cache[key];
        if (!entry) return null;

        const ttl = entry.ttl || this.DEFAULT_TTL;
        if (Date.now() - entry.timestamp > ttl) {
            delete this.cache[key];
            return null;
        }

        return entry.data;
    }

    getSimilar(query: string): any | null {
        const normalizedQuery = query.toLowerCase().trim();

        for (const [key, entry] of Object.entries(this.cache)) {
            const ttl = entry.ttl || this.DEFAULT_TTL;
            if (
                (normalizedQuery.includes(key.toLowerCase()) ||
                    key.toLowerCase().includes(normalizedQuery)) &&
                Date.now() - entry.timestamp <= ttl
            ) {
                return entry.data;
            }
        }

        return null;
    }

    private cleanExpiredEntries(): void {
        const now = Date.now();
        for (const [key, entry] of Object.entries(this.cache)) {
            const ttl = entry.ttl || this.DEFAULT_TTL;
            if (now - entry.timestamp > ttl) {
                delete this.cache[key];
            }
        }
    }

    private cleanOldestEntries(count: number): void {
        const entries = Object.entries(this.cache).sort(
            ([, a], [, b]) => a.timestamp - b.timestamp
        );

        entries.slice(0, count).forEach(([key]) => {
            delete this.cache[key];
        });
    }
}

// 導出單例緩存實例
export const searchCache = new SearchCache();

// AI 使用計數器
export const aiUsageCounter = {
    total: 0,
    triggered: 0,
    getRate(): string {
        return this.total > 0 ? ((this.triggered / this.total) * 100).toFixed(1) + '%' : '0%';
    },
    logUsage(used: boolean): void {
        this.total++;
        if (used) this.triggered++;
    },
};

class AIUsageCounter {
    private ipUsage = new Map<string, { count: number; cost: number; lastReset: number }>();

    checkUsageLimit(ip: string) {
        const usage = this.ipUsage.get(ip) || { count: 0, cost: 0, lastReset: Date.now() };
        const oneHour = 60 * 60 * 1000;

        if (Date.now() - usage.lastReset > oneHour) {
            usage.count = 0;
            usage.cost = 0;
            usage.lastReset = Date.now();
        }

        return {
            allowed: usage.count < 20 && usage.cost < 1.0,
            currentUsage: usage.count,
            resetTime: usage.lastReset + oneHour,
        };
    }

    logUsage(ip: string, success: boolean) {
        if (!this.ipUsage.has(ip)) {
            this.ipUsage.set(ip, { count: 0, cost: 0, lastReset: Date.now() });
        }

        const usage = this.ipUsage.get(ip)!;
        if (success) {
            usage.count++;
            usage.cost += 0.01; // 估算成本
        }
    }
}

export const AIUsageCounterCache = new AIUsageCounter();
