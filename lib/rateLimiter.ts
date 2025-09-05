interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

class RateLimiter {
    private store: RateLimitStore = {};
    private configs: Record<string, RateLimitConfig>;

    constructor() {
        this.configs = {
            normal: { windowMs: 60 * 1000, maxRequests: 10 }, // 一般搜尋：每分鐘10次
            pagination: { windowMs: 60 * 1000, maxRequests: 25 }, // 分頁請求：每分鐘25次
            burst: { windowMs: 10 * 1000, maxRequests: 5 }, // 短時間突發：10秒內5次
        };
    }

    check(
        identifier: string,
        requestType: 'normal' | 'pagination' | 'burst' = 'normal'
    ): { allowed: boolean; remaining: number; resetTime: number } {
        const config = this.configs[requestType];
        const storeKey = `${identifier}:${requestType}`;
        const now = Date.now();
        const record = this.store[storeKey];

        if (!record || now > record.resetTime) {
            // 重置計數器
            this.store[storeKey] = {
                count: 1,
                resetTime: now + config.windowMs,
            };
            return {
                allowed: true,
                remaining: config.maxRequests - 1,
                resetTime: now + config.windowMs,
            };
        }

        if (record.count >= config.maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: record.resetTime,
            };
        }

        record.count++;
        return {
            allowed: true,
            remaining: config.maxRequests - record.count,
            resetTime: record.resetTime,
        };
    }

    // 檢查所有類型的限制（用於額外安全檢查）
    checkAll(identifier: string): boolean {
        const burstCheck = this.check(identifier, 'burst');
        return burstCheck.allowed;
    }

    // 清理過期記錄
    cleanup() {
        const now = Date.now();
        for (const key in this.store) {
            if (this.store[key].resetTime < now) {
                delete this.store[key];
            }
        }
    }
}

export const rateLimiter = new RateLimiter();

// 定期清理
setInterval(() => rateLimiter.cleanup(), 60 * 1000);
