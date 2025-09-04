interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

class RateLimiter {
    private store: RateLimitStore = {};
    private windowMs: number;
    private maxRequests: number;

    constructor(windowMs = 60 * 1000, maxRequests = 10) {
        // 1分鐘10次
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
    }

    check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
        const now = Date.now();
        const record = this.store[identifier];

        if (!record || now > record.resetTime) {
            // 重置計數器
            this.store[identifier] = {
                count: 1,
                resetTime: now + this.windowMs,
            };
            return {
                allowed: true,
                remaining: this.maxRequests - 1,
                resetTime: now + this.windowMs,
            };
        }

        if (record.count >= this.maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: record.resetTime,
            };
        }

        record.count++;
        return {
            allowed: true,
            remaining: this.maxRequests - record.count,
            resetTime: record.resetTime,
        };
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

export const rateLimiter = new RateLimiter(60 * 1000, 10); // 每分鐘10次

// 定期清理
setInterval(() => rateLimiter.cleanup(), 60 * 1000);
