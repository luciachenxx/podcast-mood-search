export class InputValidator {
    private static readonly MAX_QUERY_LENGTH = 500;
    private static readonly SUSPICIOUS_PATTERNS = [
        /<script/gi,
        /javascript:/gi,
        /onload/gi,
        /\b(union|select|drop|delete)\b/gi,
    ];

    static validateSearchQuery(query: string) {
        if (!query || query.length > this.MAX_QUERY_LENGTH) {
            return { isValid: false, error: '搜尋內容長度無效' };
        }

        for (const pattern of this.SUSPICIOUS_PATTERNS) {
            if (pattern.test(query)) {
                return { isValid: false, error: '搜尋內容包含不允許的字符' };
            }
        }

        const sanitized = query.replace(/<[^>]*>/g, '').trim();
        return { isValid: true, sanitized };
    }
}
