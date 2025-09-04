import { OpenAI } from 'openai';

// 初始化 OpenAI SDK
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 使用 OpenAI 進行查詢擴展
 */
export async function expandQueryWithAI(userQuery: string): Promise<string[]> {
    try {
        const systemPrompt =
            '你是一個專門解析用戶情緒並提供相關 Podcast 搜索建議的助手。' +
            '根據用戶描述的心情或狀態，提供2-3個最相關的搜索關鍵詞。' +
            '關鍵詞應該是能夠找到適合該情緒的 Podcast 內容。' +
            '直接以逗號分隔的關鍵詞列表回應，不要有多餘的解釋或標點符號。';

        const userPrompt = `用戶心情：${userQuery}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: 50,
            temperature: 0.3,
            presence_penalty: -0.2,
        });

        const aiResponse = response.choices[0]?.message?.content?.trim() || '';

        const aiSuggestions = aiResponse
            .split(/[,，、；;]/)
            .map((term) => term.trim())
            .filter((term) => term.length > 0);

        return [userQuery, ...aiSuggestions];
    } catch (error) {
        console.error('OpenAI 擴展查詢失敗:', error);
        return [userQuery];
    }
}
