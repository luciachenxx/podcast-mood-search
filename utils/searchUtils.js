import { MOOD_KEYWORDS } from '../constants/moodKeywords';

export const processSearchTerm = (term) => {
    const searchTags = [];

    // 檢查是否包含心情關鍵字
    Object.entries(MOOD_KEYWORDS).forEach(([mood, tags]) => {
        if (term.toLowerCase().includes(mood)) {
            searchTags.push(...tags);
        }
    });

    // 如果沒有找到心情關鍵字，就用原始搜尋詞
    if (searchTags.length === 0) {
        searchTags.push(term);
    }

    return [...new Set(searchTags)]; // 去除重複
};

export const filterEpisodesByTags = (episodes, searchTags) => {
    return episodes.filter((episode) => {
        const titleMatch = episode.title.toLowerCase().includes(searchTags.join(' ').toLowerCase());
        const descMatch = episode.description
            .toLowerCase()
            .includes(searchTags.join(' ').toLowerCase());
        const tagMatch = searchTags.some((tag) =>
            episode.tags.some((episodeTag) => episodeTag.toLowerCase().includes(tag.toLowerCase()))
        );

        return titleMatch || descMatch || tagMatch;
    });
};
