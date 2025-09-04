import crypto from 'crypto';

/**
 * 生成 Podcast API 認證頭
 */
export function createAuthHeaders(apiKey: string, apiSecret: string): Record<string, string> {
    const authTime = Math.floor(Date.now() / 1000);
    const toHash = apiKey + apiSecret + authTime;
    const hash = crypto.createHash('sha1').update(toHash).digest('hex');

    return {
        'Content-Type': 'application/json',
        'X-Auth-Key': apiKey,
        'X-Auth-Date': authTime.toString(),
        Authorization: hash,
        'User-Agent': 'MoodCast/1.0',
    };
}
